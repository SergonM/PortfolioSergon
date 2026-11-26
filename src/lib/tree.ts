/**
 * The "what if" tree, shared by the build (first render, readable without JS) and the browser.
 * walk() follows one scenario down the tree and returns every question asked, with the
 * group's rate before and after it: that ledger is the explanation of the prediction.
 */
export interface Col { feature: string; kind: 'ordinal' | 'onehot'; value?: number }
export interface TreeNode { leaf: boolean; rate: number; n?: number; col?: number; thr?: number; left?: number; right?: number }
export interface TreeModel { columns: Col[]; nodes: TreeNode[]; base_rate?: number }

export interface Turn { key: string; from: number; to: number }
export interface Walk { nodes: number[]; turns: Turn[]; leaf: TreeNode; asked: string[] }

export function walk(model: TreeModel, pick: Record<string, number>): Walk {
  const x = model.columns.map((c) => (c.kind === 'ordinal' ? pick[c.feature] : pick[c.feature] === c.value ? 1 : 0));
  const nodes = [0];
  const turns: Turn[] = [];
  let i = 0;
  while (!model.nodes[i].leaf) {
    const n = model.nodes[i];
    const key = model.columns[n.col!].feature;
    const next = x[n.col!] <= n.thr! ? n.left! : n.right!;
    const to = model.nodes[next].rate;
    // consecutive questions about the same thing read as one line in the ledger
    const last = turns[turns.length - 1];
    if (last && last.key === key) last.to = to;
    else turns.push({ key, from: n.rate, to });
    nodes.push(next);
    i = next;
  }
  return { nodes, turns, leaf: model.nodes[i], asked: [...new Set(turns.map((t) => t.key))] };
}

/** Node positions for the small tree drawing: leaves spread evenly in order, parents centred over children. */
export function layout(model: TreeModel, w: number, h: number, pad = 10) {
  const pos: { x: number; y: number; d: number }[] = [];
  let leafNo = 0;
  const leaves = model.nodes.filter((n) => n.leaf).length;
  const depthOf: number[] = [];
  const visit = (i: number, d: number): number => {
    depthOf[i] = d;
    const n = model.nodes[i];
    let x: number;
    if (n.leaf) x = pad + (leafNo++ + 0.5) * ((w - 2 * pad) / leaves);
    else x = (visit(n.left!, d + 1) + visit(n.right!, d + 1)) / 2;
    pos[i] = { x, y: 0, d };
    return x;
  };
  visit(0, 0);
  const maxD = Math.max(...depthOf);
  pos.forEach((p) => (p.y = pad + (p.d / maxD) * (h - 2 * pad)));
  return pos;
}

/** Rate (0–1) as "per 100" with one decimal, in the page's locale. */
export const per100 = (r: number, locale: string) =>
  (r * 100).toLocaleString(locale === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
