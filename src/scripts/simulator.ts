/** "What if…?" simulator: walks the trained tree in the browser with the visitor's choices. No network calls. */
interface Col { feature: string; kind: 'ordinal' | 'onehot'; value?: number }
interface Node { leaf: boolean; rate: number; n?: number; col?: number; thr?: number; left?: number; right?: number }
interface Model { columns: Col[]; nodes: Node[]; features: { key: string; kind: string; labels: string[] }[]; labels: Record<string, string>; base: number; locale: string }

export function initSimulator() {
  const root = document.querySelector<HTMLElement>('[data-sim]');
  if (!root) return;
  const model = JSON.parse(root.querySelector('[data-sim-model]')!.textContent!) as Model;
  const form = root.querySelector<HTMLFormElement>('[data-sim-form]')!;
  const out = root.querySelector<HTMLElement>('[data-sim-n]')!;
  const peek = root.querySelector<HTMLElement>('[data-sim-peek]');
  const dots = [...root.querySelectorAll<HTMLElement>('[data-sim-dots] i')];
  const births = root.querySelector<HTMLElement>('[data-sim-births]')!;
  const path = root.querySelector<HTMLOListElement>('[data-sim-path]')!;
  const fmt = new Intl.NumberFormat(model.locale === 'es' ? 'es-CO' : 'en-US');
  let shown = Number(out.textContent);

  const run = () => {
    const data = new FormData(form);
    const pick: Record<string, number> = {};
    model.features.forEach((f) => (pick[f.key] = Number(data.get(f.key) ?? 0)));
    const x = model.columns.map((c) => (c.kind === 'ordinal' ? pick[c.feature] : pick[c.feature] === c.value ? 1 : 0));

    const seen: string[] = [];
    let i = 0;
    while (!model.nodes[i].leaf) {
      const n = model.nodes[i];
      const key = model.columns[n.col!].feature;
      if (!seen.includes(key)) seen.push(key);
      i = x[n.col!] <= n.thr! ? n.left! : n.right!;
    }
    const leaf = model.nodes[i];
    const target = Math.round(leaf.rate * 100);

    dots.forEach((d, k) => d.classList.toggle('on', k < target));
    if (peek) peek.textContent = String(target);
    births.textContent = fmt.format(leaf.n ?? 0);
    path.replaceChildren(...seen.map((key) => {
      const li = document.createElement('li');
      const f = model.features.find((ff) => ff.key === key)!;
      li.textContent = `${model.labels[key]}: ${f.labels[pick[key]]}`;
      return li;
    }));

    // count the big number toward its new value
    const from = shown, start = performance.now(), dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
    const step = (now: number) => {
      const t = dur ? Math.min(1, (now - start) / dur) : 1;
      out.textContent = String(Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    shown = target;
  };

  form.addEventListener('change', run);
  form.addEventListener('reset', () => setTimeout(run));
  run();
}
