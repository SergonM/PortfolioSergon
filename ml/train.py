"""
Train the "what if" low-birth-weight tree for the portfolio's featured investigation.

Input : DANE Estadísticas Vitales births microdata (nacYYYY.csv inside the DANE zip), passed as paths.
        The raw files are never committed: DANE does not allow redistributing them.
Output: src/data/bpn-tree.json, a shallow decision tree whose leaves hold rounded rates
        over at least MIN_LEAF births, plus honest held-out metrics.

Usage : python ml/train.py path/to/nac2022.csv [more files...]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score, brier_score_loss
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

MAX_DEPTH = 5
MIN_LEAF = 2000          # no leaf describes fewer than this many births
SEED = 20241115          # date of the project report

# ---------- features a visitor can set; all are known before the birth ----------
# Gestational weeks (T_GES) are left out on purpose: they explain most of low birth weight
# but are not something a mother or a policy can "choose", and they would hide everything else.
FEATURES = [
    {'key': 'age', 'col': 'EDAD_MADRE', 'kind': 'ordinal',
     'map': {1: 0, 2: 0, 3: 1, 4: 2, 5: 2, 6: 3, 7: 4, 8: 4, 9: 4},
     'labels': {'en': ['Under 20', '20–24', '25–34', '35–39', '40 or older'],
                'es': ['Menos de 20', '20–24', '25–34', '35–39', '40 o más']}},
    {'key': 'edu', 'col': 'NIV_EDUM', 'kind': 'ordinal',
     'map': {13: 0, 1: 0, 2: 0, 3: 1, 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 4, 10: 4, 11: 4, 12: 4},
     'labels': {'en': ['None or primary', 'Some secondary', 'High school', 'Technical', 'University'],
                'es': ['Ninguno o primaria', 'Secundaria incompleta', 'Bachillerato', 'Técnico o tecnológico', 'Universitario']}},
    {'key': 'visits', 'col': 'NUMCONSUL', 'kind': 'ordinal', 'bins': [0, 1, 4, 7, 99],
     'labels': {'en': ['None', '1–3', '4–6', '7 or more'], 'es': ['Ninguno', '1–3', '4–6', '7 o más']}},
    {'key': 'insurance', 'col': 'SEG_SOCIAL', 'kind': 'nominal',
     'map': {1: 0, 2: 1, 3: 2, 4: 2, 5: 3},
     'labels': {'en': ['Contributory (employed)', 'Subsidised', 'Special regime', 'Uninsured'],
                'es': ['Contributivo', 'Subsidiado', 'Régimen especial', 'Sin afiliación']}},
    {'key': 'area', 'col': 'AREANAC', 'kind': 'nominal', 'map': {1: 0, 2: 1, 3: 2},
     'labels': {'en': ['Town or city', 'Village', 'Rural'], 'es': ['Cabecera municipal', 'Centro poblado', 'Rural disperso']}},
    {'key': 'multiple', 'col': 'MUL_PARTO', 'kind': 'ordinal', 'map': {1: 0, 2: 1, 3: 1, 4: 1},
     'labels': {'en': ['One baby', 'Twins or more'], 'es': ['Un bebé', 'Gemelos o más']}},
    {'key': 'children', 'col': 'N_HIJOSV', 'kind': 'ordinal', 'bins': [1, 2, 3, 5, 99],
     'labels': {'en': ['First child', 'Second', 'Third or fourth', 'Fifth or later'],
                'es': ['Primer hijo', 'Segundo', 'Tercero o cuarto', 'Quinto o más']}},
]
TARGET = 'PESO_NAC'   # bands 1–4 are under 2,500 g; 9 is "no information"


def load(paths: list[str]) -> pd.DataFrame:
    cols = [f['col'] for f in FEATURES] + [TARGET]
    frames = []
    for p in paths:
        df = pd.read_csv(p, sep=None, engine='python', encoding='latin-1', dtype=str, usecols=lambda c: c.strip().upper() in cols)
        df.columns = [c.strip().upper() for c in df.columns]
        frames.append(df.apply(pd.to_numeric, errors='coerce'))
        print(f'{p}: {len(df):,} rows')
    return pd.concat(frames, ignore_index=True)


def encode(df: pd.DataFrame) -> tuple[np.ndarray, list[dict]]:
    """Ordinal features become one integer column; nominal ones become one 0/1 column per category."""
    cols, names = [], []
    for f in FEATURES:
        raw = df[f['col']]
        code = pd.cut(raw, bins=f['bins'], right=False, labels=False) if 'bins' in f else raw.map(f['map'])
        f['_code'] = code
        if f['kind'] == 'ordinal':
            cols.append(code); names.append({'feature': f['key'], 'kind': 'ordinal'})
        else:
            for k in range(len(f['labels']['en'])):
                cols.append((code == k).astype(float).where(code.notna())); names.append({'feature': f['key'], 'kind': 'onehot', 'value': k})
    return np.column_stack(cols), names


def main(paths: list[str]) -> None:
    df = load(paths)
    y = df[TARGET].between(1, 4).astype(int).where(df[TARGET].between(1, 8))
    X, names = encode(df)
    ok = ~np.isnan(X).any(axis=1) & y.notna().to_numpy()
    X, y = X[ok], y[ok].to_numpy()
    print(f'usable births: {len(y):,} of {len(df):,}; low birth weight rate {y.mean():.4f}')

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=SEED, stratify=y)
    tree = DecisionTreeClassifier(max_depth=MAX_DEPTH, min_samples_leaf=MIN_LEAF, random_state=SEED)
    tree.fit(X_tr, y_tr)
    p_te = tree.predict_proba(X_te)[:, 1]
    auc = roc_auc_score(y_te, p_te)
    brier = brier_score_loss(y_te, p_te)
    base_brier = brier_score_loss(y_te, np.full_like(p_te, y_tr.mean()))
    # how much riskier the top fifth of predicted risk is than the bottom fifth
    q20, q80 = np.quantile(p_te, [0.2, 0.8])
    top, bottom = y_te[p_te >= q80].mean(), y_te[p_te <= q20].mean()
    print(f'held-out AUC {auc:.3f}; Brier {brier:.5f} vs {base_brier:.5f} for the base rate; top fifth {top:.4f} vs bottom fifth {bottom:.4f}')

    t = tree.tree_
    nodes = []
    for i in range(t.node_count):
        n_all = int(t.n_node_samples[i])
        rate = float(t.value[i][0][1] / t.value[i][0].sum())
        if t.children_left[i] == -1:
            nodes.append({'leaf': True, 'rate': round(rate, 4), 'n': int(round(n_all, -2))})
        else:
            nodes.append({'leaf': False, 'col': int(t.feature[i]), 'thr': round(float(t.threshold[i]), 3),
                          'left': int(t.children_left[i]), 'right': int(t.children_right[i]), 'rate': round(rate, 4)})

    years = sorted({''.join(ch for ch in Path(p).stem if ch.isdigit())[-4:] for p in paths})
    out = {
        'source': 'DANE, Estadísticas Vitales (nacimientos)', 'years': years,
        'target': 'Birth weight under 2,500 g (PESO_NAC bands 1–4)',
        'excluded': ['T_GES (gestational weeks)'],
        'params': {'max_depth': MAX_DEPTH, 'min_samples_leaf': MIN_LEAF, 'test_size': 0.2, 'seed': SEED},
        'births': int(round(len(y), -3)), 'base_rate': round(float(y.mean()), 4),
        'metrics': {'auc': round(auc, 3), 'brier': round(brier, 5), 'brier_base': round(base_brier, 5),
                    'top_fifth_rate': round(float(top), 4), 'bottom_fifth_rate': round(float(bottom), 4)},
        'features': [{'key': f['key'], 'kind': f['kind'], 'labels': f['labels']} for f in FEATURES],
        'columns': names, 'nodes': nodes,
    }
    dest = Path(__file__).resolve().parents[1] / 'src' / 'data' / 'bpn-tree.json'
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f'wrote {dest} ({len(nodes)} nodes)')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
