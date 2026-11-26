"""
Aggregates for the featured investigation's charts and the business brief.

Input : the same DANE births file(s) as train.py (nacYYYY.csv), passed as paths.
Output: src/data/bpn-aggregates.json. Only counts and rates over large groups leave this script:
        no row, no municipality, nothing that could point to one birth.

What it computes
  bands       births per DANE weight band (PESO_NAC 1–8)
  departments rate under 2,500 g by the mother's department of residence (CODPTORE)
  area        rate by area of residence, with and without Bogotá
  twins       share of births and share of underweight babies that are multiple births
  visits      rate by number of prenatal check-ups
  gains       the trained tree's held-out "capture curve": watch the riskiest x% of births,
              reach y% of underweight babies. Rebuilt with train.py's exact split and seed.

Usage : python ml/aggregates.py path/to/nac2022.csv
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

sys.path.insert(0, str(Path(__file__).resolve().parent))
import train as T  # noqa: E402

DEPTS = {
    5: 'Antioquia', 8: 'Atlántico', 11: 'Bogotá', 13: 'Bolívar', 15: 'Boyacá', 17: 'Caldas', 18: 'Caquetá',
    19: 'Cauca', 20: 'Cesar', 23: 'Córdoba', 25: 'Cundinamarca', 27: 'Chocó', 41: 'Huila', 44: 'La Guajira',
    47: 'Magdalena', 50: 'Meta', 52: 'Nariño', 54: 'Norte de Santander', 63: 'Quindío', 66: 'Risaralda',
    68: 'Santander', 70: 'Sucre', 73: 'Tolima', 76: 'Valle del Cauca', 81: 'Arauca', 85: 'Casanare',
    86: 'Putumayo', 88: 'San Andrés', 91: 'Amazonas', 94: 'Guainía', 95: 'Guaviare', 97: 'Vaupés', 99: 'Vichada',
}
MIN_GROUP = 500  # no published group is smaller than this


def r4(x: float) -> float:
    return round(float(x), 4)


def n100(x: int) -> int:
    return int(round(int(x), -2))


def main(paths: list[str]) -> None:
    raw = T.load(paths)
    extra = pd.concat([
        pd.read_csv(p, sep=None, engine='python', encoding='latin-1', dtype=str,
                    usecols=lambda c: c.strip().upper() in ('CODPTORE', 'PESO_NAC'))
        .rename(columns=lambda c: c.strip().upper()).apply(pd.to_numeric, errors='coerce')
        for p in paths
    ], ignore_index=True)
    raw['CODPTORE'] = extra['CODPTORE']

    d = raw[raw[T.TARGET].between(1, 8)].copy()
    d['lbw'] = d[T.TARGET].between(1, 4)
    total, cases = len(d), int(d['lbw'].sum())
    out: dict = {'source': 'DANE, Estadísticas Vitales (nacimientos)', 'births': n100(total), 'cases': cases,
                 'rate': r4(d['lbw'].mean())}

    out['bands'] = [int(d[T.TARGET].eq(b).sum()) for b in range(1, 9)]

    deps = []
    for code, g in d.groupby('CODPTORE'):
        if int(code) in DEPTS and len(g) >= MIN_GROUP:
            deps.append({'code': int(code), 'name': DEPTS[int(code)], 'births': n100(len(g)), 'rate': r4(g['lbw'].mean()),
                         'share_births': r4(len(g) / total), 'share_cases': r4(g['lbw'].sum() / cases)})
    out['departments'] = sorted(deps, key=lambda x: -x['rate'])

    area_names = {1: 'town', 2: 'village', 3: 'rural'}
    nb = d[d['CODPTORE'] != 11]
    out['area'] = {
        'all': {area_names[k]: r4(v) for k, v in d.groupby('AREA_RES')['lbw'].mean().items() if k in area_names},
        'without_bogota': {area_names[k]: r4(v) for k, v in nb.groupby('AREA_RES')['lbw'].mean().items() if k in area_names},
    }

    twins = d['MUL_PARTO'].between(2, 4)
    out['twins'] = {'share_births': r4(twins.mean()), 'share_cases': r4(d.loc[twins, 'lbw'].sum() / cases),
                    'rate': r4(d.loc[twins, 'lbw'].mean())}

    vb = pd.cut(d['NUMCONSUL'], bins=[0, 1, 4, 7, 99], right=False, labels=False)
    out['visits'] = [r4(d.loc[vb == k, 'lbw'].mean()) for k in range(4)]

    # held-out capture curve, same split and tree as train.py
    y = raw[T.TARGET].between(1, 4).astype(int).where(raw[T.TARGET].between(1, 8))
    X, _ = T.encode(raw)
    ok = ~np.isnan(X).any(axis=1) & y.notna().to_numpy()
    X, y = X[ok], y[ok].to_numpy()
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=T.SEED, stratify=y)
    tree = DecisionTreeClassifier(max_depth=T.MAX_DEPTH, min_samples_leaf=T.MIN_LEAF, random_state=T.SEED).fit(X_tr, y_tr)
    p, leaf = tree.predict_proba(X_te)[:, 1], tree.apply(X_te)
    L = (pd.DataFrame({'leaf': leaf, 'y': y_te, 'p': p}).groupby('leaf')
         .agg(n=('y', 'size'), c=('y', 'sum'), p=('p', 'first')).sort_values('p', ascending=False))
    L['x'] = L['n'].cumsum() / L['n'].sum()
    L['y'] = L['c'].cumsum() / L['c'].sum()
    out['gains'] = [[0.0, 0.0]] + [[r4(a), r4(b)] for a, b in zip(L['x'], L['y'])]

    dest = Path(__file__).resolve().parents[1] / 'src' / 'data' / 'bpn-aggregates.json'
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f'wrote {dest}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    main(sys.argv[1:])
