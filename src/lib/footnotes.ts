import type { SourceId } from '../data/report';

export interface Segment { kind: 'text' | 'note'; text?: string; n?: number; id?: SourceId }

/** Turns "[n:ID]" markers into numbered footnotes, reusing a number for a repeated source. */
export function footnoter() {
  const order: SourceId[] = [];
  return {
    parse(text: string): Segment[] {
      const out: Segment[] = [];
      const re = /\[n:([A-Z-]+)\]/g;
      let last = 0;
      for (const m of text.matchAll(re)) {
        if (m.index! > last) out.push({ kind: 'text', text: text.slice(last, m.index) });
        const id = m[1] as SourceId;
        if (!order.includes(id)) order.push(id);
        out.push({ kind: 'note', n: order.indexOf(id) + 1, id });
        last = m.index! + m[0].length;
      }
      if (last < text.length) out.push({ kind: 'text', text: text.slice(last) });
      return out;
    },
    get notes() { return order.map((id, i) => ({ n: i + 1, id })); },
  };
}
