/**
 * Build-time exhibits: one bespoke SVG plate per case, rendered to a string.
 * Every element that moves carries a class (x-draw, x-drawy, x-pop, x-fade, x-rise, x-out)
 * and a delay (--d). The drawn state is the default, so the plates read fully without JS
 * and with reduced motion; the page only hides them once it knows it can animate them.
 * Only transform and opacity ever change.
 *
 * Honesty rule: figures come from the case text. Anything drawn for shape only
 * (layouts, packet rows, the Monserrate pixels) is labelled illustrative on the plate itself.
 */
import { createHash } from 'node:crypto';
import type { Locale } from '../i18n/strings';

const W = 400;
const H = 440;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f = (n: number) => +n.toFixed(1);
const d = (s: number) => `--d:${s.toFixed(2)}s`;

/** A straight line that draws itself from (x1,y1) to (x2,y2): a rotated rect scaled on X. */
function edge(x1: number, y1: number, x2: number, y2: number, delay: number, cls = '', w = 1.2): string {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return `<g transform="translate(${f(x1)} ${f(y1)}) rotate(${f(a)})"><rect class="x-draw ${cls}" x="0" y="${f(-w / 2)}" width="${f(len)}" height="${w}" style="${d(delay)}"/></g>`;
}
/** Dashed version of edge(). */
function dash(x1: number, y1: number, x2: number, y2: number, delay: number, cls = ''): string {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return `<g transform="translate(${f(x1)} ${f(y1)}) rotate(${f(a)})"><line class="x-draw dash ${cls}" x1="0" y1="0" x2="${f(len)}" y2="0" style="${d(delay)}"/></g>`;
}
const text = (x: number, y: number, s: string, cls = 'lb', extra = '') => `<text x="${f(x)}" y="${f(y)}" class="${cls}" ${extra}>${esc(s)}</text>`;

/** Deterministic PRNG so the layout is identical on every build. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

type T = Record<Locale, string>;
const t = (en: string, es: string): T => ({ en, es });

// ------------------------------------------------------------------ AI-01
function ai01(l: Locale): string {
  const S = {
    s1: t('1 · FIX THE TEXT FIRST', '1 · PRIMERO, ARREGLAR EL TEXTO'),
    s2: t('2 · SAME 810 UNSEEN TEXTS. OUT OF EVERY 100:', '2 · LOS MISMOS 810 TEXTOS NUEVOS. DE CADA 100:'),
    m: [t('SINGLE TREE', 'UN SOLO ÁRBOL'), t('K-NN', 'K-NN'), t('RANDOM FOREST', 'RANDOM FOREST')],
    right: t('right topic', 'tema correcto'),
    wrong: t('wrong topic', 'tema equivocado'),
    foot: t('Most of the last 3 mix up education and gender.', 'Los 3 que fallan: casi siempre educación vs. género.'),
  };
  const scores = [92, 94, 97];
  let o = '';
  o += text(16, 34, S.s1[l]);
  o += `<text x="20" y="96" class="big x-fade" style="${d(0)}">Ã¡</text>`;
  o += edge(14, 82, 104, 82, 0.35, 'red', 2.4);
  o += edge(132, 82, 236, 82, 0.6, '', 1.2);
  o += `<path class="x-pop" d="M236 76 L246 82 L236 88 Z" style="${d(0.9)}"/>`;
  o += `<text x="262" y="96" class="big ochre x-pop" style="${d(1)}">á</text>`;
  o += edge(16, 124, 384, 124, 0.2, 'soft', 0.6);
  o += text(16, 150, S.s2[l]);
  const gx = [16, 148, 280];
  scores.forEach((score, g) => {
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(i / 10), c = i % 10;
      const bad = i >= score;
      o += `<circle class="x-pop ${bad ? 'bad' : g === 2 ? 'ochref' : 'dot'}" cx="${gx[g] + 5 + c * 10.4}" cy="${172 + r * 10.4}" r="3.4" style="${d(1.1 + g * 0.35 + i * 0.004)}"><title>${bad ? S.wrong[l] : S.right[l]}</title></circle>`;
    }
    o += `<text x="${gx[g]}" y="318" class="num x-rise${g === 2 ? ' ochre' : ''}" style="${d(1.4 + g * 0.35)}">${score}</text>`;
    o += text(gx[g], 338, S.m[g][l], g === 2 ? 'lb ochre' : 'lb');
  });
  o += edge(16, 366, 384, 366, 2.3, 'soft', 0.6);
  o += `<circle class="bad x-pop" cx="22" cy="393" r="3.4" style="${d(2.4)}"/>`;
  o += text(34, 397, S.foot[l], 'tx x-fade', `style="${d(2.5)}"`);
  return o;
}

// ------------------------------------------------------------------ AI-02
function ai02(l: Locale): string {
  const S = {
    recs: [t('VISITS', 'CITAS'), t('TREATMENTS', 'TRATAMIENTOS'), t('EXAMS', 'EXÁMENES'), t('TUMOUR', 'TUMOR')],
    inside: t('INSIDE THE HOSPITAL', 'DENTRO DEL HOSPITAL'),
    outside: t('OUTSIDE API', 'API EXTERNA'),
    q: t('WHO SIGNS THIS OFF?', '¿QUIÉN LO APRUEBA?'),
    prompt: t('“read it like a lung-cancer oncologist”', '“léela como un oncólogo de pulmón”'),
    report: t('DRAFT REPORT', 'BORRADOR'),
  };
  let o = '';
  const xs = [12, 108, 204, 300];
  xs.forEach((x, i) => {
    o += `<g class="x-pop" style="${d(i * 0.12)}"><rect class="box" x="${x}" y="22" width="88" height="34"/>${text(x + 44, 43, S.recs[i][l], 'mini mid')}</g>`;
    o += edge(x + 44, 56, x + 44, 92, 0.5 + i * 0.06);
  });
  o += edge(56, 92, 344, 92, 0.75);
  o += edge(200, 92, 200, 124, 0.95);
  o += `<g class="x-pop" style="${d(1.05)}"><rect class="box solid" x="100" y="124" width="200" height="44"/>${text(200, 144, 'DJANGO REST', 'lb mid inv')}${text(200, 159, '/summary', 'lb mid inv')}</g>`;
  o += text(12, 206, S.inside[l], 'lb soft');
  o += text(12, 232, S.outside[l], 'lb soft');
  o += dash(0, 216, 400, 216, 1.3, 'red');
  o += edge(200, 168, 200, 200, 1.4);
  o += `<g class="x-pop" style="${d(1.65)}"><circle class="seal" cx="200" cy="216" r="15"/>${text(200, 222, '?', 'q mid')}</g>`;
  o += text(224, 206, S.q[l], 'lb red x-fade', `style="${d(1.8)}"`);
  o += edge(200, 231, 200, 260, 1.9);
  o += `<g class="x-pop" style="${d(2.05)}"><rect class="box" x="70" y="260" width="260" height="44"/>${text(200, 280, 'GPT-3.5', 'lb mid')}${text(200, 295, S.prompt[l], 'mini mid')}</g>`;
  o += edge(200, 304, 200, 330, 2.25);
  o += `<g class="x-rise" style="${d(2.35)}"><path class="paper" d="M136 330 H250 L264 344 V430 H136 Z"/>${text(148, 352, S.report[l], 'lb ink')}</g>`;
  [0, 1, 2, 3, 4].forEach((k) => (o += `<rect class="x-draw inkf" x="148" y="${366 + k * 12}" width="${[76, 64, 80, 52, 70][k]}" height="3" style="${d(2.55 + k * 0.08)}"/>`));
  return o;
}

// ------------------------------------------------------------------ AI-03  (Monserrate, pixel by pixel)
function ai03(l: Locale): string {
  const S = {
    it: t('ITERATION', 'ITERACIÓN'),
    steps: [t('FILTERS WRITTEN LOOP BY LOOP', 'FILTROS ESCRITOS CICLO POR CICLO'), t('FLASH PHOTO CLEANS THE NO-FLASH ONE', 'LA FOTO CON FLASH LIMPIA LA SIN FLASH'), t('300 ROUNDS OF DECONVOLUTION', '300 RONDAS DE DECONVOLUCIÓN')],
    note: t('Schematic: Monserrate in 280 pixels, not the project’s photo.', 'Esquema: Monserrate en 280 píxeles, no la foto del proyecto.'),
  };
  const cols = 20, rows = 14, cs = 18, ox = 20, oy = 52;
  const heights = [1, 2, 2, 3, 3, 4, 5, 6, 8, 10, 11, 11, 9, 8, 7, 7, 8, 8, 7, 5];
  const sharp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  const church = new Set(['10,11', '11,11', '10,12', '11,12', '11,13']);
  for (let c = 0; c < cols; c++) for (let r = 0; r < heights[c]; r++) sharp[rows - 1 - r][c] = 1;
  church.forEach((k) => { const [c, r] = k.split(',').map(Number); sharp[rows - 1 - r][c] = 1; });
  const blur = (g: number[][]) => g.map((row, r) => row.map((_, c) => {
    let s = 0, n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const v = g[r + dr]?.[c + dc]; if (v !== undefined) { s += v; n++; } }
    return s / n;
  }));
  const soft = blur(blur(blur(sharp)));
  let o = '';
  o += text(16, 34, S.it[l]);
  o += `<text x="384" y="34" class="lb end ochre" data-iter="300">300 / 300</text>`;
  o += `<rect class="frame" x="${ox - 4}" y="${oy - 4}" width="${cols * cs + 8}" height="${rows * cs + 8}"/>`;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = ox + c * cs, y = oy + r * cs, delay = 0.2 + c * 0.07 + (rows - r) * 0.01;
    if (soft[r][c] > 0.04) o += `<rect class="x-out px" x="${x}" y="${y}" width="${cs}" height="${cs}" fill-opacity="${soft[r][c].toFixed(2)}" style="${d(delay)}"/>`;
    if (sharp[r][c]) {
      const r2 = rows - 1 - r;
      o += `<rect class="x-fade px${church.has(`${c},${r2}`) ? ' ochref' : ''}" x="${x + 1}" y="${y + 1}" width="${cs - 2}" height="${cs - 2}" style="${d(delay + 0.05)}"/>`;
    }
  }
  o += `<rect class="x-scan scan" x="${ox}" y="${oy - 4}" width="2" height="${rows * cs + 8}" style="${d(0.2)}"/>`;
  S.steps.forEach((s, i) => {
    const y = 344 + i * 24;
    o += `<g class="x-rise" style="${d(1.6 + i * 0.2)}">${text(16, y, `0${i + 1}`, 'lb ochre')}${text(44, y, s[l], 'lb')}</g>`;
  });
  o += text(16, 428, S.note[l], 'mini soft');
  return o;
}

// ------------------------------------------------------------------ AI-04  (knowledge graph)
function ai04(l: Locale): string {
  const S = {
    papers: t('11 PAPERS', '11 ARTÍCULOS'), authors: t('AUTHORS', 'AUTORES'), inst: t('INSTITUTIONS', 'INSTITUCIONES'),
    proj: t('PROJECTS THAT PAID', 'PROYECTOS QUE PAGARON'), sim: t('SIMILAR TOPIC', 'TEMA PARECIDO'),
    note: t('Only the paper count is real; the rest is illustrative.', 'Solo el número de artículos es real; lo demás es ilustrativo.'),
  };
  const R = rng(1104);
  const cx = 200, cy = 196;
  const papers = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2 - Math.PI / 2 + (R() - 0.5) * 0.25;
    const r = 108 + (R() - 0.5) * 26;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.92, a };
  });
  const inst = [0, 1, 2, 3].map((i) => { const a = (i / 4) * Math.PI * 2 + 0.4; return { x: cx + Math.cos(a) * 46, y: cy + Math.sin(a) * 42 }; });
  const proj = [0, 1, 2].map((i) => { const a = (i / 3) * Math.PI * 2 + 1.1; return { x: cx + Math.cos(a) * 160, y: cy + Math.sin(a) * 150 }; });
  let edges = '', nodes = '';
  // paper → institution
  papers.forEach((p, i) => {
    const q = inst[i % 4];
    edges += edge(p.x, p.y, q.x, q.y, 0.7 + i * 0.05, 'soft', 0.8);
  });
  // paper → project (who paid), only some papers
  [0, 3, 5, 8, 9].forEach((i, k) => {
    const p = papers[i];
    const q = proj.reduce((b, c) => (Math.hypot(c.x - p.x, c.y - p.y) < Math.hypot(b.x - p.x, b.y - p.y) ? c : b));
    edges += edge(p.x, p.y, q.x, q.y, 1.2 + k * 0.08, 'ochref', 1.1);
  });
  // paper → authors (outward)
  papers.forEach((p, i) => {
    const n = 1 + (i % 3 === 0 ? 2 : 1);
    for (let k = 0; k < n; k++) {
      const a = p.a + (k - (n - 1) / 2) * 0.32;
      const ax = p.x + Math.cos(a) * 34, ay = p.y + Math.sin(a) * 30;
      edges += edge(p.x, p.y, ax, ay, 1 + i * 0.04, '', 0.8);
      nodes += `<circle class="x-pop" cx="${f(ax)}" cy="${f(ay)}" r="3.6" style="${d(1.3 + i * 0.04)}"/>`;
    }
  });
  // shared authors: the "with whom"
  [[1, 2], [4, 5], [6, 7]].forEach(([a, b], k) => (edges += edge(papers[a].x, papers[a].y, papers[b].x, papers[b].y, 1.5 + k * 0.1, '', 0.8)));
  // embedding similarity
  [[0, 6], [2, 9], [3, 8], [1, 10]].forEach(([a, b], k) => (edges += dash(papers[a].x, papers[a].y, papers[b].x, papers[b].y, 1.9 + k * 0.12, 'ochre')));
  inst.forEach((q, i) => (nodes += `<g transform="rotate(45 ${f(q.x)} ${f(q.y)})"><rect class="x-pop inst" x="${f(q.x - 6)}" y="${f(q.y - 6)}" width="12" height="12" style="${d(0.55 + i * 0.06)}"/></g>`));
  proj.forEach((q, i) => (nodes += `<path class="x-pop ochref" d="M${f(q.x)} ${f(q.y - 8)} L${f(q.x + 8)} ${f(q.y + 6)} L${f(q.x - 8)} ${f(q.y + 6)} Z" style="${d(1.1 + i * 0.08)}"/>`));
  papers.forEach((p, i) => (nodes += `<rect class="x-pop paperf" x="${f(p.x - 7)}" y="${f(p.y - 9)}" width="14" height="18" style="${d(i * 0.05)}"/>`));
  let o = edges + nodes;
  const ly = 388;
  o += `<rect class="paperf" x="16" y="${ly - 10}" width="8" height="11"/>` + text(30, ly, S.papers[l], 'lb');
  o += `<circle cx="150" cy="${ly - 4}" r="3.6"/>` + text(160, ly, S.authors[l], 'lb');
  o += `<rect class="inst" x="250" y="${ly - 9}" width="9" height="9" transform="rotate(45 254.5 ${ly - 4.5})"/>` + text(266, ly, S.inst[l], 'lb');
  o += `<path class="ochref" d="M20 ${ly + 12} L26 ${ly + 22} L14 ${ly + 22} Z"/>` + text(30, ly + 22, S.proj[l], 'lb');
  o += `<line class="dash ochre" x1="250" y1="${ly + 18}" x2="276" y2="${ly + 18}"/>` + text(282, ly + 22, S.sim[l], 'lb');
  o += text(16, 432, S.note[l], 'mini soft');
  return o;
}

// ------------------------------------------------------------------ SEC-01  (chain of custody)
function sec01(l: Locale): string {
  const hash = createHash('sha256').update('SEC-01').digest('hex');
  const S = {
    file: t('A FILE ARRIVES', 'LLEGA UN ARCHIVO'), fileD: t('evidence, as received', 'la evidencia, tal como llega'),
    c: [
      [t('FINGERPRINT', 'HUELLA'), `sha256 ${hash.slice(0, 8)} ${hash.slice(8, 16)} ${hash.slice(16, 24)}…`],
      [t('TIMESTAMP', 'SELLO DE TIEMPO'), t('sealed the moment it lands', 'sellado apenas llega')],
      [t('ROLE CHECK', 'CONTROL POR ROL'), t('who may open it depends on the role', 'quién la abre depende del rol')],
      [t('AUDIT LOG', 'REGISTRO DE AUDITORÍA'), t('every read, export and edit is written down', 'cada lectura, exportación y edición, anotada')],
    ] as const,
    verify: t('VERIFY ANY DAY: FINGERPRINT NOW = FINGERPRINT ON ARRIVAL', 'VERIFICA CUALQUIER DÍA: HUELLA HOY = HUELLA AL LLEGAR'),
    note: t('Hash shown is the real SHA-256 of the text “SEC-01”.', 'El hash es el SHA-256 real del texto “SEC-01”.'),
  };
  let o = '';
  const x = 34, y0 = 40, step = 68;
  o += `<g class="x-pop" style="${d(0)}"><path class="paper" d="M${x - 12} ${y0 - 18} H${x + 6} L${x + 12} ${y0 - 12} V${y0 + 16} H${x - 12} Z"/></g>`;
  o += text(x + 34, y0 - 2, S.file[l], 'lb');
  o += text(x + 34, y0 + 14, S.fileD[l], 'tx soft');
  for (let i = 0; i < 4; i++) {
    const y = y0 + step * (i + 1);
    const delay = 0.35 + i * 0.42;
    o += edge(x, y - step + 20, x, y - 16, delay, '', 1.2);
    o += `<g class="x-pop" style="${d(delay + 0.25)}"><circle class="seal" cx="${x}" cy="${y}" r="15"/>${text(x, y + 4, `0${i + 1}`, 'lb mid red')}</g>`;
    const [name, detail] = S.c[i];
    o += text(x + 34, y - 2, (name as T)[l], 'lb x-fade', `style="${d(delay + 0.3)}"`);
    const det = typeof detail === 'string' ? detail : (detail as T)[l];
    o += `<text x="${x + 34}" y="${y + 14}" class="tx soft x-fade" style="${d(delay + 0.35)}"${i === 0 ? ` data-scramble="${esc(det)}"` : ''}>${esc(det)}</text>`;
  }
  const vy = y0 + step * 5 + 4;
  o += edge(16, vy - 22, 384, vy - 22, 2.2, 'soft', 0.6);
  o += `<g class="x-pop" style="${d(2.5)}"><circle class="okf" cx="28" cy="${vy}" r="11"/><path class="tick" d="M22 ${vy} l4 4 l8 -8"/></g>`;
  o += `<foreignObject x="48" y="${vy - 12}" width="336" height="34"><p xmlns="http://www.w3.org/1999/xhtml" class="fo lb x-fade" style="${d(2.6)}">${esc(S.verify[l])}</p></foreignObject>`;
  o += text(16, 432, S.note[l], 'mini soft');
  return o;
}

// ------------------------------------------------------------------ SEC-02  (packet capture + 52 hours)
function sec02(l: Locale): string {
  const S = {
    head: t('NO.  SOURCE → DESTINATION        PROTO  INFO', 'NO.  ORIGEN → DESTINO              PROTO  INFO'),
    flag: t('one host, four ports in a row: someone is knocking', 'un host, cuatro puertos seguidos: alguien está tocando'),
    hours: t('52 HOURS OF LABS · ONE MARK = ONE HOUR', '52 HORAS DE LABORATORIO · UNA MARCA = UNA HORA'),
    note: t('Illustrative capture with documentation-only IP addresses.', 'Captura ilustrativa; IPs reservadas para documentación.'),
  };
  const rows: [string, string, string, string, boolean][] = [
    ['192.0.2.14', '198.51.100.53', 'DNS', 'query A example.com', false],
    ['198.51.100.53', '192.0.2.14', 'DNS', 'response A', false],
    ['192.0.2.14', '198.51.100.80', 'TCP', 'SYN  → 443', false],
    ['198.51.100.80', '192.0.2.14', 'TCP', 'SYN, ACK', false],
    ['192.0.2.14', '198.51.100.80', 'TLS', 'Client Hello', false],
    ['203.0.113.7', '192.0.2.14', 'TCP', 'SYN  → 21', true],
    ['203.0.113.7', '192.0.2.14', 'TCP', 'SYN  → 22', true],
    ['203.0.113.7', '192.0.2.14', 'TCP', 'SYN  → 23', true],
    ['203.0.113.7', '192.0.2.14', 'TCP', 'SYN  → 25', true],
    ['192.0.2.14', '198.51.100.80', 'TLS', 'Application Data', false],
  ];
  let o = text(16, 30, S.head[l], 'mini soft pre');
  o += edge(16, 38, 384, 38, 0, 'soft', 0.6);
  rows.forEach(([src, dst, proto, info, bad], i) => {
    const y = 58 + i * 21;
    o += `<g class="x-rise${bad ? ' red' : ''}" style="${d(0.15 + i * 0.09)}">${text(16, y, String(i + 1).padStart(2, '0'), 'mini pre')}${text(40, y, `${src} → ${dst}`, 'mini pre')}${text(250, y, proto, 'mini pre')}${text(290, y, info, 'mini pre')}</g>`;
  });
  const by = 58 + 5 * 21 - 15, bh = 4 * 21 + 2;
  o += `<rect class="x-fade flagbox" x="10" y="${by}" width="380" height="${bh}" style="${d(1.3)}"/>`;
  o += text(16, 274, S.flag[l], 'tx red x-fade', `style="${d(1.45)}"`);
  o += edge(16, 292, 384, 292, 1.5, 'soft', 0.6);
  o += text(16, 316, S.hours[l], 'lb');
  for (let i = 0; i < 52; i++) {
    const r = Math.floor(i / 26), c = i % 26;
    o += `<rect class="x-drawy ochref" x="${16 + c * 14.1}" y="${330 + r * 34}" width="5" height="24" style="${d(1.6 + i * 0.022)}"/>`;
  }
  o += text(16, 432, S.note[l], 'mini soft');
  return o;
}

// ------------------------------------------------------------------ BIZ-03  (Tess: 11 months, privacy at every join)
function biz03(l: Locale): string {
  const S = {
    months: l === 'es' ? ['F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] : ['F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    yr: t('2024 · 11 MONTHS', '2024 · 11 MESES'),
    svc: [t('PAYMENTS', 'PAGOS'), t('FORMS', 'FORMULARIOS'), t('ANALYTICS', 'ANALÍTICA'), t('OUTSIDE SERVICES', 'OTROS SERVICIOS')],
    cta: t('BUY', 'COMPRAR'),
    lock: t('EVERY JOIN SET UP WITH PRIVACY IN MIND', 'CADA CONEXIÓN, PENSADA PARA LA PRIVACIDAD'),
    nom: t('IMPACT: NOT MEASURED, SO NOT CLAIMED', 'IMPACTO: NO SE MIDIÓ, ASÍ QUE NO SE AFIRMA'),
  };
  let o = text(16, 30, S.yr[l]);
  S.months.forEach((m, i) => {
    const x = 16 + i * 33.5;
    o += `<rect class="frame" x="${x}" y="42" width="31" height="20"/>`;
    o += `<rect class="x-draw ochref" x="${x}" y="42" width="31" height="20" style="${d(0.1 + i * 0.07)}"/>`;
    o += text(x + 15.5, 56, m, 'lb mid inv');
  });
  // browser
  const bx = 152, by = 128, bw = 96, bh = 150;
  o += `<g class="x-pop" style="${d(0.9)}"><rect class="box" x="${bx}" y="${by}" width="${bw}" height="${bh}"/><line class="ln" x1="${bx}" y1="${by + 16}" x2="${bx + bw}" y2="${by + 16}"/>`;
  [0, 1, 2].forEach((k) => (o += `<circle cx="${bx + 10 + k * 9}" cy="${by + 8}" r="2.4"/>`));
  o += `<rect class="fill2" x="${bx + 12}" y="${by + 28}" width="${bw - 24}" height="46"/><rect class="inkf2" x="${bx + 12}" y="${by + 84}" width="56" height="5"/><rect class="inkf2" x="${bx + 12}" y="${by + 96}" width="70" height="5"/>`;
  o += `<rect class="redf" x="${bx + 12}" y="${by + 114}" width="64" height="22"/>${text(bx + 44, by + 129, S.cta[l], 'mini mid inv')}</g>`;
  const svc = [
    { x: 12, y: 100, ax: bx, ay: by + 40 }, { x: 12, y: 286, ax: bx, ay: by + 120 },
    { x: 276, y: 100, ax: bx + bw, ay: by + 40 }, { x: 276, y: 286, ax: bx + bw, ay: by + 120 },
  ];
  svc.forEach((s, i) => {
    const w = 112, h = 30;
    const cxs = s.x < 200 ? s.x + w : s.x;
    const cys = s.y + h / 2;
    const delay = 1.2 + i * 0.15;
    o += edge(cxs, cys, s.ax, s.ay, delay, '', 1);
    o += `<g class="x-pop" style="${d(delay - 0.15)}"><rect class="box" x="${s.x}" y="${s.y}" width="${w}" height="${h}"/>${text(s.x + w / 2, s.y + 19, S.svc[i][l], 'mini mid')}</g>`;
    const mx = (cxs + s.ax) / 2, my = (cys + s.ay) / 2;
    o += `<g class="x-pop" style="${d(delay + 0.5)}"><rect class="lockb" x="${f(mx - 6)}" y="${f(my - 3)}" width="12" height="10"/><path class="lockl" d="M${f(mx - 3.5)} ${f(my - 3)} v-3 a3.5 3.5 0 0 1 7 0 v3"/></g>`;
  });
  o += edge(16, 340, 384, 340, 2, 'soft', 0.6);
  o += `<g class="x-pop" style="${d(2.1)}"><rect class="lockb" x="16" y="358" width="12" height="10"/><path class="lockl" d="M18.5 358 v-3 a3.5 3.5 0 0 1 7 0 v3"/></g>`;
  o += text(38, 368, S.lock[l], 'lb x-fade', `style="${d(2.2)}"`);
  o += text(38, 394, S.nom[l], 'lb red x-fade', `style="${d(2.35)}"`);
  return o;
}

// ------------------------------------------------------------------ BIZ-01 / BIZ-02 (render only when J&J is public)
function biz01(l: Locale): string {
  const S = {
    ppl: t('70 COLLEAGUES DID THIS BY HAND', '70 COLABORADORES LO HACÍAN A MANO'),
    time: t('TIME PER UPDATE', 'TIEMPO POR ACTUALIZACIÓN'),
    before: t('BEFORE', 'ANTES'), after: t('AFTER', 'DESPUÉS'),
    upd: t('~900 UPDATES AUTOMATED', '~900 ACTUALIZACIONES AUTOMATIZADAS'),
  };
  let o = text(16, 30, S.ppl[l]);
  for (let i = 0; i < 70; i++) {
    const r = Math.floor(i / 14), c = i % 14;
    const x = 22 + c * 26.5, y = 52 + r * 30;
    o += `<g class="x-pop" style="${d(i * 0.012)}"><circle cx="${x}" cy="${y}" r="4.5"/><rect x="${x - 6}" y="${y + 6}" width="12" height="9" rx="4"/></g>`;
  }
  o += edge(16, 216, 384, 216, 1, 'soft', 0.6);
  o += text(16, 244, S.time[l]);
  o += text(16, 278, S.before[l], 'lb soft');
  o += `<rect class="x-draw inkf" x="100" y="266" width="284" height="16" style="${d(1.2)}"/>`;
  o += text(16, 312, S.after[l], 'lb soft');
  o += `<rect class="x-draw ochref" x="100" y="300" width="${f(284 * 0.08)}" height="16" style="${d(1.6)}"/>`;
  o += `<rect class="x-draw ochref" x="100" y="300" width="${f(284 * 0.03)}" height="16" style="${d(1.6)}" fill-opacity="1"/>`;
  o += text(140, 313, '−92 to −97%', 'lb ochre x-fade', `style="${d(1.9)}"`);
  o += edge(16, 346, 384, 346, 2, 'soft', 0.6);
  o += `<text x="16" y="392" class="num x-rise" style="${d(2.1)}">~900</text>`;
  o += text(16, 414, S.upd[l], 'lb');
  return o;
}
function biz02(l: Locale): string {
  const S = {
    in: [t('COMPLIANCE DOCUMENTS', 'DOCUMENTOS DE COMPLIANCE'), t('TRAINING + DEVIATION DATA', 'CAPACITACIONES + DESVIACIONES'), t('APPROVAL PROCESS CHANGES', 'CAMBIOS EN APROBACIONES')],
    out: [t('ANSWERS', 'RESPUESTAS'), t('REPORTS & DECKS', 'REPORTES Y PRESENTACIONES'), t('GUIDANCE', 'ORIENTACIÓN')],
    idk: t('AND “I DON’T KNOW” WHEN IT SHOULD', 'Y “NO SÉ” CUANDO TOCA'),
  };
  let o = '';
  [0, 1, 2].forEach((i) => {
    const y = 40 + i * 120;
    o += `<g class="x-pop" style="${d(i * 0.3)}"><rect class="box" x="16" y="${y}" width="368" height="30"/>${text(28, y + 19, S.in[i][l], 'mini')}</g>`;
    o += edge(200, y + 30, 200, y + 52, 0.2 + i * 0.3);
    o += `<g class="x-pop" style="${d(0.35 + i * 0.3)}"><circle class="seal" cx="200" cy="${y + 66}" r="14"/>${text(200, y + 70, `A${i + 1}`, 'lb mid red')}</g>`;
    o += edge(214, y + 66, 270, y + 66, 0.5 + i * 0.3);
    o += text(278, y + 70, S.out[i][l], 'mini x-fade', `style="${d(0.6 + i * 0.3)}"`);
  });
  o += text(16, 420, S.idk[l], 'lb ochre x-fade', `style="${d(1.4)}"`);
  return o;
}

const renderers: Record<string, (l: Locale) => string> = {
  'AI-01': ai01, 'AI-02': ai02, 'AI-03': ai03, 'AI-04': ai04, 'SEC-01': sec01, 'SEC-02': sec02, 'BIZ-01': biz01, 'BIZ-02': biz02, 'BIZ-03': biz03,
};

export function exhibitSvg(id: string, locale: Locale, label: string): string | null {
  const r = renderers[id];
  if (!r) return null;
  return `<svg class="ex" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" focusable="false">${r(locale)}</svg>`;
}
