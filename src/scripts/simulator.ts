/**
 * "What if…?" simulator: walks the trained tree in the browser with the visitor's choices. No network calls.
 * After every change it rewrites the ledger (each question the tree asked and how the group's rate moved)
 * and relights the path in the small drawing of the whole tree.
 */
import { walk, per100, type TreeModel } from '../lib/tree';

interface Payload extends TreeModel {
  locale: string;
  features: { key: string; labels: string[] }[];
  labels: Record<string, string>;
  t: { start: string; end: string; per: string; births: string; none: string };
}

export function initSimulator() {
  const root = document.querySelector<HTMLElement>('[data-sim]');
  if (!root) return;
  const m = JSON.parse(root.querySelector('[data-sim-model]')!.textContent!) as Payload;
  const form = root.querySelector<HTMLFormElement>('[data-sim-form]')!;
  const out = root.querySelector<HTMLElement>('[data-sim-n]')!;
  const peek = root.querySelector<HTMLElement>('[data-sim-peek]');
  const dots = [...root.querySelectorAll<HTMLElement>('[data-sim-dots] i')];
  const births = root.querySelector<HTMLElement>('[data-sim-births]')!;
  const trail = root.querySelector<HTMLOListElement>('[data-sim-trail]')!;
  const verdict = root.querySelector<HTMLElement>('[data-sim-verdict]')!;
  const tree = root.querySelector<SVGSVGElement>('[data-sim-tree]')!;
  const mini = tree.closest('figure')!;
  const edges = [...tree.querySelectorAll<SVGLineElement>('[data-c]')];
  const nodes = [...tree.querySelectorAll<SVGGElement>('[data-n]')];
  const loc = m.locale === 'es' ? 'es-CO' : 'en-US';
  const fmt = new Intl.NumberFormat(loc);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const d1 = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n * 100).toLocaleString(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  const el = (tag: string, cls = '', text = '') => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  };
  let shown = Number(out.textContent);

  const run = (animate = true) => {
    const data = new FormData(form);
    const pick: Record<string, number> = {};
    m.features.forEach((f) => (pick[f.key] = Number(data.get(f.key) ?? 0)));
    const w = walk(m, pick);
    const target = Math.round(w.leaf.rate * 100);
    const answer = (key: string) => m.features.find((f) => f.key === key)!.labels[pick[key]];

    dots.forEach((d, k) => d.classList.toggle('on', k < target));
    if (peek) peek.textContent = String(target);
    births.textContent = fmt.format(w.leaf.n ?? 0);

    // ledger
    const max = Math.max(...w.turns.flatMap((t) => [t.from, t.to])) * 1.08;
    const row = (k: number, q: Node[], rate: number, dl: string, dlCls: string, cls = '') => {
      const li = el('li', cls);
      li.style.setProperty('--k', String(k));
      const qs = el('span', 'q'); qs.append(...q);
      const bar = el('span', 'bar'); const fill = el('i'); fill.style.setProperty('--s', (rate / max).toFixed(3)); bar.append(fill);
      li.append(qs, bar, el('span', 'v', per100(rate, m.locale)), el('span', `dl ${dlCls}`.trim(), dl));
      return li;
    };
    const rows = [row(0, [document.createTextNode(m.t.start)], w.turns[0].from, '', '', 't0')];
    w.turns.forEach((t, k) => {
      rows.push(row(k + 1, [document.createTextNode(`${m.labels[t.key]}: `), el('b', '', answer(t.key))], t.to, d1(t.to - t.from), t.to >= t.from ? 'up' : 'down'));
    });
    const end = row(w.turns.length + 1, [document.createTextNode(`= ${fmt.format(w.leaf.n ?? 0)} ${m.t.births}`)], w.leaf.rate, m.t.per, '', 'tn');
    end.querySelector('.bar')!.remove();
    rows.push(end);
    trail.replaceChildren(...rows);

    const mover = w.turns.reduce((a, b) => (Math.abs(b.to - b.from) > Math.abs(a.to - a.from) ? b : a));
    const skipped = m.features.map((f) => f.key).filter((k) => !w.asked.includes(k)).map((k) => m.labels[k]).join(', ') || m.t.none;
    const [s1, s2] = verdict.querySelectorAll('b');
    s1.textContent = m.labels[mover.key];
    s1.nextSibling!.textContent = ` (${d1(mover.to - mover.from)})`;
    s2.textContent = skipped;

    // tree
    const on = new Set(w.nodes);
    edges.forEach((e) => e.classList.toggle('on', on.has(Number(e.dataset.c))));
    nodes.forEach((n) => n.classList.toggle('on', on.has(Number(n.dataset.n))));

    // replay the entrance animations (CSS keyframes, transform/opacity only)
    if (animate && !reduce) {
      for (const t of [trail, mini]) { t.classList.remove('play'); void t.getBoundingClientRect(); t.classList.add('play'); }
    }

    // count the big number toward its new value
    const from = shown, start = performance.now(), dur = reduce ? 0 : 450;
    const step = (now: number) => {
      const t = dur ? Math.min(1, (now - start) / dur) : 1;
      out.textContent = String(Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    shown = target;
  };

  form.addEventListener('change', () => run());
  form.addEventListener('reset', () => setTimeout(() => run()));
  run(false);

  // first sight of the ledger plays it once
  if (!reduce) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      run();
    }, { threshold: 0.35 });
    io.observe(trail);
  }
}
