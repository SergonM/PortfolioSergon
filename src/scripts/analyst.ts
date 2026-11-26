/** "Ask the analyst": sends the visitor's question to the Worker and types the answer into the transcript. */
type Turn = { role: 'user' | 'model'; text: string };

export function initAnalyst() {
  const root = document.querySelector<HTMLElement>('[data-analyst]');
  if (!root) return;
  const url = root.dataset.analyst!;
  const S = JSON.parse(root.querySelector('[data-analyst-strings]')!.textContent!);
  const list = root.querySelector<HTMLOListElement>('[data-transcript]')!;
  const form = root.querySelector<HTMLFormElement>('[data-ask]')!;
  const input = form.querySelector('input')!;
  const button = form.querySelector('button')!;
  const chips = root.querySelector<HTMLElement>('[data-chips]')!;
  const history: Turn[] = [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false;

  const turn = (cls: string, who: string) => {
    const li = document.createElement('li');
    li.className = `turn ${cls}`;
    const w = document.createElement('p'); w.className = 'who label'; w.textContent = who;
    const said = document.createElement('p'); said.className = 'said';
    li.append(w, said); list.append(li);
    list.scrollTop = list.scrollHeight;
    return said;
  };

  /** Plain text in, source IDs like [PRJ-OPI] become small pills. No HTML from the model is ever trusted. */
  const render = (el: HTMLElement, text: string) => {
    el.replaceChildren();
    for (const part of text.split(/(\[[A-Z]{2,4}(?:-[A-Z]{2,5})?\])/g)) {
      if (!part) continue;
      if (/^\[[A-Z]{2,4}(?:-[A-Z]{2,5})?\]$/.test(part)) {
        const s = document.createElement('span'); s.className = 'src'; s.textContent = part.slice(1, -1); el.append(s);
      } else el.append(document.createTextNode(part));
    }
  };

  const type = (el: HTMLElement, text: string) => new Promise<void>((done) => {
    if (reduced) { render(el, text); return done(); }
    root.classList.add('speaking');
    let i = 0;
    const cursor = document.createElement('span'); cursor.className = 'cursor';
    const tick = () => {
      i = Math.min(text.length, i + 3);
      render(el, text.slice(0, i)); el.append(cursor);
      list.scrollTop = list.scrollHeight;
      if (i < text.length) setTimeout(tick, 14); else { cursor.remove(); render(el, text); root.classList.remove('speaking'); done(); }
    };
    tick();
  });

  const ask = async (q: string) => {
    q = q.trim().slice(0, 500);
    if (!q) { input.placeholder = S.empty; return; }
    if (busy) return;
    busy = true; button.disabled = true; chips.hidden = true; input.value = '';
    render(turn('you', S.you), q);
    history.push({ role: 'user', text: q });
    const out = turn('an', S.analyst);
    const wait = document.createElement('span'); wait.className = 'dots'; wait.textContent = S.thinking; out.append(wait);
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ history: history.slice(-6) }), signal: AbortSignal.timeout(60_000) });
      if (r.status === 429) throw new Error('busy');
      if (!r.ok) throw new Error('down');
      const { answer } = await r.json();
      history.push({ role: 'model', text: answer });
      await type(out, answer);
    } catch (e) {
      history.pop();
      out.classList.add('err');
      out.textContent = (e as Error).message === 'busy' ? S.busy : S.down;
    } finally {
      busy = false; button.disabled = false; input.focus({ preventScroll: true });
    }
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
  chips.querySelectorAll<HTMLButtonElement>('[data-q]').forEach((b) => b.addEventListener('click', () => ask(b.dataset.q!)));
}
