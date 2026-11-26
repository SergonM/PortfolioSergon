/**
 * The hidden audit (section vi). Paper 1 is checked here by its SHA-256; papers 2 and 3 are sent
 * to the Worker, which holds them. Found papers are remembered in this browser only.
 */
type Msg = { ok: string; again: string; wrong: string; down: string; busy: string; empty: string; all: string };
type S = { msg: Msg; signed1: string; signErr: string; hallEmpty: string; hallClosed: string };
type Entry = { name: string; at: string };

const STORE = 'sgm-audit-papers';

function load(): string[] {
  try { const v = JSON.parse(localStorage.getItem(STORE) ?? '[]'); return Array.isArray(v) ? v.slice(0, 3).map(String) : []; } catch { return []; }
}
function save(papers: string[]) {
  try { localStorage.setItem(STORE, JSON.stringify(papers)); } catch { /* private mode: keep it in memory */ }
}

async function sha256(s: string): Promise<string> {
  const d = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
  return [...d].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function initAuditor() {
  const root = document.querySelector<HTMLElement>('[data-auditor]');
  if (!root || !window.crypto?.subtle) return;
  const S: S = JSON.parse(root.querySelector('[data-auditor-strings]')!.textContent || '{}');
  const server = root.dataset.auditor || '';
  const f1 = root.dataset.f1 || '';
  const verifyForm = root.querySelector<HTMLFormElement>('[data-verify]')!;
  const signForm = root.querySelector<HTMLFormElement>('[data-sign]')!;
  const msg = root.querySelector<HTMLElement>('[data-msg]')!;
  const hall = root.querySelector<HTMLOListElement>('[data-hall]')!;
  const seals = [...root.querySelectorAll<HTMLElement>('[data-seal]')];

  // papers[n-1] holds paper n once found
  const papers: string[] = load();
  const say = (t: string) => { msg.textContent = t; };
  const fill = (t: string, n: number) => t.replace('{n}', String(n));

  const paint = (stamp = 0) => {
    seals.forEach((el, i) => {
      const found = Boolean(papers[i]);
      el.classList.toggle('found', found);
      if (stamp === i + 1) { el.classList.remove('stamp'); void el.offsetWidth; el.classList.add('stamp'); }
      el.querySelector('[data-seal-state]')!.textContent = found ? '✓' : '—';
    });
    signForm.hidden = !(server && papers.filter(Boolean).length === 3);
  };

  const post = async (path: string, body: unknown) => {
    const r = await fetch(server + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    return { status: r.status, data: await r.json().catch(() => ({})) };
  };

  const renderHall = (list: Entry[]) => {
    hall.replaceChildren();
    if (!list.length) {
      const li = document.createElement('li'); li.className = 'empty'; li.textContent = server ? S.hallEmpty : S.hallClosed; hall.append(li); return;
    }
    for (const e of list) {
      const li = document.createElement('li');
      const n = document.createElement('span'); n.textContent = e.name; // textContent: names are never parsed as HTML
      const t = document.createElement('time'); t.dateTime = e.at; t.textContent = e.at;
      li.append(n, t); hall.append(li);
    }
  };

  const loadHall = async () => {
    if (!server) return;
    try {
      const r = await fetch(`${server}/audit/hall`);
      const d = await r.json();
      if (d.open === false) { renderHall([]); hall.firstElementChild!.textContent = S.hallClosed; return; }
      renderHall(Array.isArray(d.hall) ? d.hall : []);
    } catch { /* leave the printed line */ }
  };

  verifyForm.hidden = false;
  paint();

  verifyForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const input = verifyForm.elements.namedItem('flag') as HTMLInputElement;
    const guess = input.value.trim();
    if (!guess) { say(S.msg.empty); return; }
    let n = 0;
    if ((await sha256(guess)) === f1) n = 1;
    else if (server) {
      try {
        const { status, data } = await post('/audit/verify', { flag: guess });
        if (status === 429) { say(S.msg.busy); return; }
        if (status !== 200) { say(S.msg.down); return; }
        n = Number(data.flag) || 0;
      } catch { say(S.msg.down); return; }
    } else { say(S.msg.down); return; }
    if (!n) { say(S.msg.wrong); return; }
    const already = papers[n - 1] === guess;
    papers[n - 1] = guess; save(papers);
    input.value = '';
    paint(already ? 0 : n);
    say(papers.filter(Boolean).length === 3 && server ? S.msg.all : fill(already ? S.msg.again : S.msg.ok, n));
  });

  signForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const name = (signForm.elements.namedItem('name') as HTMLInputElement).value.trim();
    try {
      const { status, data } = await post('/audit/sign', { name, flags: papers });
      if (status === 429) { say(S.msg.busy); return; }
      if (status !== 200) { say(S.signErr); return; }
      say(fill(S.signed1, data.rank));
      signForm.hidden = true;
      renderHall(data.hall ?? []);
    } catch { say(S.msg.down); }
  });

  // The hall of fame loads only when the section comes near, so the Worker is not called on every visit.
  new IntersectionObserver((entries, io) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); loadHall(); }
  }, { rootMargin: '400px 0px' }).observe(root);
}
