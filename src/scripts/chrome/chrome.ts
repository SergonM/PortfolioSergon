/**
 * Report chrome: running head, numbering-machine folio, reading progress, index sheet,
 * page-turn jumps (View Transitions) and the registration-mark cursor.
 *
 * Performance rules: one passive scroll listener that only schedules a rAF; layout is read
 * once per resize (section offsets are cached); only transform and opacity are animated.
 */
import { pageTurn } from './turn';
import { initReticle } from './reticle';

interface Entry { id: string; folio: string; short: string }
interface Strings {
  page: string; pageOf: string; read: string; here: string; printer: string; unread: string; progressOf: string;
  openIndex: string; cursorOpen: string; cursorExt: string; cursorPress: string; cursorPick: string;
  entries: Entry[];
}
interface Section { id: string; el: HTMLElement; folio: string; short: string; top: number; bottom: number; max: number }

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initChrome() {
  const head = document.querySelector<HTMLElement>('[data-rh]');
  const dialog = document.querySelector<HTMLDialogElement>('[data-rh-dialog]');
  const raw = document.getElementById('rh-strings');
  if (!head || !dialog || !raw) return;
  const S = JSON.parse(raw.textContent!) as Strings;
  const progress = document.querySelector<HTMLElement>('[data-rh-progress] span')!;
  const folioEl = head.querySelector<HTMLElement>('[data-rh-folio]')!;
  const nameEl = head.querySelector<HTMLElement>('[data-rh-name]')!;
  const pageEl = head.querySelector<HTMLElement>('[data-rh-page]')!;
  const totalEl = head.querySelector<HTMLElement>('[data-rh-total]')!;
  const srEl = head.querySelector<HTMLElement>('[data-rh-sr]')!;
  const wheels = [...head.querySelectorAll<HTMLElement>('.wheel .strip')];
  const hero = document.querySelector<HTMLElement>('[data-hero]');

  const sections: Section[] = S.entries
    .map((e) => ({ ...e, el: document.getElementById(e.id) as HTMLElement, top: 0, bottom: 0, max: 0 }))
    .filter((s) => s.el);

  // ---------- geometry, cached ----------
  let vh = innerHeight, docH = 1, heroEnd = 0, pages = 1;
  const measure = () => {
    vh = innerHeight;
    docH = document.documentElement.scrollHeight;
    heroEnd = hero ? hero.getBoundingClientRect().bottom + scrollY : 0;
    pages = Math.max(1, Math.ceil(docH / vh));
    totalEl.textContent = String(pages).padStart(2, '0');
    sections.forEach((s, i) => {
      const r = s.el.getBoundingClientRect();
      s.top = r.top + scrollY;
      const next = sections[i + 1];
      s.bottom = next ? next.el.getBoundingClientRect().top + scrollY : Math.max(s.top + r.height, docH);
    });
    paintIndexPages();
    tick();
  };

  // ---------- per-frame state ----------
  let lastY = scrollY, dirAcc = 0, current = -2, shownUntil = 0, lastPage = -1, ticking = false;
  let forceShow = false;

  const setPage = (p: number) => {
    if (p === lastPage) return;
    lastPage = p;
    const s = String(Math.min(99, p)).padStart(2, '0');
    wheels[0].style.setProperty('--d', s[0]);
    wheels[1].style.setProperty('--d', s[1]);
    const label = S.pageOf.replace('{p}', String(p)).replace('{t}', String(pages));
    pageEl.title = label;
    srEl.textContent = label;
  };

  const setSection = (i: number) => {
    if (i === current) return;
    const first = current === -2;
    current = i;
    const s = sections[i];
    folioEl.textContent = s ? s.folio : '·';
    nameEl.textContent = s ? s.short : '';
    if (!first && !reduced()) { nameEl.classList.remove('swap'); void nameEl.offsetWidth; nameEl.classList.add('swap'); }
    // announce the new chapter: the head drops in for a moment even while scrolling down
    if (!first) shownUntil = performance.now() + 1600;
  };

  const tone = () => {
    // what is printed directly under the running head? read its paper colour
    const x = innerWidth / 2, y = 24;
    const stack = document.elementsFromPoint(x, y);
    let dark = false;
    for (const el of stack) {
      if ((el as HTMLElement).closest?.('[data-rh], [data-rh-progress]')) continue;
      const t = (el as HTMLElement).closest<HTMLElement>('[data-tone]');
      if (t) { dark = t.dataset.tone === 'dark'; break; }
      const bg = getComputedStyle(el).backgroundColor;
      const m = bg.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
      if (!m || (m[4] !== undefined && parseFloat(m[4]) < 0.5)) continue;
      const lum = (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
      dark = lum < 0.45;
      break;
    }
    head.dataset.tone = dark ? 'dark' : 'light';
  };

  let toneFrame = 0;
  function tick() {
    ticking = false;
    const y = scrollY;
    const dy = y - lastY;
    lastY = y;
    dirAcc = Math.sign(dy) === Math.sign(dirAcc) ? dirAcc + dy : dy;

    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, y / Math.max(1, docH - vh)))})`;
    setPage(Math.min(pages, Math.floor((y + vh * 0.5) / vh) + 1));

    const probe = y + vh * 0.35;
    let idx = -1;
    sections.forEach((s, i) => { if (s.top <= probe) idx = i; });
    setSection(idx);
    // reading progress per section: how far the bottom of the viewport has travelled through it
    sections.forEach((s) => {
      const p = (y + vh - s.top) / Math.max(1, s.bottom - s.top);
      if (p > s.max) s.max = Math.min(1, Math.max(0, p));
    });

    const pastHero = y > heroEnd - 60;
    const now = performance.now();
    const show = pastHero && (forceShow || dirAcc < -40 || now < shownUntil || y + vh >= docH - 4);
    const hide = !pastHero || (dirAcc > 60 && now >= shownUntil);
    if (show) head.classList.add('on'); else if (hide) head.classList.remove('on');
    if (now < shownUntil) setTimeout(schedule, shownUntil - now + 20);

    if (++toneFrame % 4 === 0 || Math.abs(dy) > vh * 0.5) tone();
  }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }

  addEventListener('scroll', schedule, { passive: true });
  let rz = 0;
  const onResize = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(measure); };
  addEventListener('resize', onResize);
  new ResizeObserver(onResize).observe(document.body);
  head.addEventListener('focusin', () => { forceShow = true; head.classList.add('on'); });
  head.addEventListener('focusout', () => { forceShow = false; });

  // ---------- index sheet ----------
  const rows = [...dialog.querySelectorAll<HTMLElement>('[data-ix-row]')];
  const ixTotal = dialog.querySelector<HTMLElement>('[data-ix-total]')!;
  function paintIndexPages() {
    rows.forEach((row) => {
      const s = sections.find((x) => x.id === row.dataset.ixRow);
      row.querySelector<HTMLElement>('[data-ix-page]')!.textContent = s ? String(Math.floor(s.top / vh) + 1).padStart(2, '0') : '—';
    });
  }
  function paintIndexState() {
    let readSum = 0, len = 0;
    rows.forEach((row) => {
      const i = sections.findIndex((x) => x.id === row.dataset.ixRow);
      const s = sections[i];
      const st = row.querySelector<HTMLElement>('[data-ix-status]')!;
      const bar = row.querySelector<HTMLElement>('[data-ix-bar]')!;
      if (!s) {
        // not on the page yet: a plain line in the index, not a link
        row.dataset.state = 'printer'; st.textContent = S.printer; bar.style.setProperty('--p', '0');
        const a = row.querySelector('a')!; a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true');
        return;
      }
      const span = s.bottom - s.top;
      readSum += s.max * span; len += span;
      const pct = Math.round(s.max * 100);
      bar.style.setProperty('--p', String(s.max));
      if (i === current) { row.dataset.state = 'here'; st.textContent = `${S.here} · ${pct}%`; }
      else if (s.max >= 0.92) { row.dataset.state = 'read'; st.textContent = `${S.read} ✓`; }
      else { row.dataset.state = pct > 3 ? 'partial' : 'unread'; st.textContent = pct > 3 ? S.progressOf.replace('{n}', String(pct)) : S.unread; }
    });
    ixTotal.textContent = `${Math.round((readSum / Math.max(1, len)) * 100)}%`;
  }

  const opener = head.querySelector<HTMLAnchorElement>('[data-rh-open]')!;
  opener.setAttribute('role', 'button');
  opener.setAttribute('aria-haspopup', 'dialog');
  opener.setAttribute('aria-label', S.openIndex);
  let lastFocus: HTMLElement | null = null;
  let jumping = false;

  const openIndex = () => {
    if (dialog.open) return;
    lastFocus = document.activeElement as HTMLElement;
    paintIndexState();
    dialog.classList.remove('closing');
    window.__lenis?.stop();
    dialog.showModal();
    const here = dialog.querySelector<HTMLElement>('[data-state="here"] a');
    (here ?? dialog.querySelector<HTMLElement>('[data-ix-close]'))?.focus({ preventScroll: true });
  };
  const closeIndex = (instant = false) => {
    if (!dialog.open) return;
    window.__lenis?.start();
    if (instant || reduced()) { dialog.close(); return; }
    dialog.classList.add('closing');
    const sheet = dialog.querySelector('[data-ix-sheet]')!;
    const done = () => { dialog.classList.remove('closing'); dialog.close(); };
    sheet.addEventListener('animationend', done, { once: true });
    setTimeout(() => dialog.open && done(), 600);
  };
  dialog.addEventListener('close', () => {
    window.__lenis?.start();
    if (jumping) { jumping = false; return; } // a page turn moves focus to the destination heading itself
    const back = lastFocus && lastFocus !== document.body ? lastFocus : opener;
    back.focus({ preventScroll: true });
  });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeIndex(); });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeIndex(); });

  opener.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); openIndex(); } });
  dialog.querySelector('[data-ix-close]')!.addEventListener('click', () => closeIndex());
  addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'i' || e.metaKey || e.ctrlKey || e.altKey || dialog.open) return;
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
    openIndex();
  });

  // index entries turn the page to their section; the index sheet itself is the page that turns.
  // All routing happens in the capture phase so the generic smooth-scroll anchor handler never sees these clicks.
  const routeChrome = (a: HTMLAnchorElement): boolean => {
    if (a.matches('[data-rh-open]')) { openIndex(); return true; }
    if (a.matches('[data-ix-cover]')) {
      pageTurn(0, 'back', () => { jumping = true; dialog.close(); })
        .then(() => document.querySelector<HTMLElement>('[data-hero] a, [data-hero] button')?.focus({ preventScroll: true }));
      return true;
    }
    if (a.matches('[data-ix-link]')) {
      const s = sections.find((x) => x.id === a.dataset.ixLink);
      if (s) pageTurn(s.el, s.top >= scrollY ? 'forward' : 'back', () => { jumping = true; dialog.close(); }).then(() => focusSection(s.el));
      return true;
    }
    return false;
  };

  // switching language keeps your place: the other edition opens at the same section
  const lang = dialog.querySelector<HTMLAnchorElement>('[data-ix-lang]')!;
  const langBase = lang.getAttribute('href')!;
  dialog.addEventListener('toggle', () => { const s = sections[current]; lang.href = s ? `${langBase}#${s.id}` : langBase; });

  // in-page links that jump to a whole section (e.g. the Contents list) also turn the page
  const sectionIds = new Set(sections.map((s) => s.id));
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    if (routeChrome(a)) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (a.closest('[data-rh-dialog], [data-no-chrome], .skip')) return;
    const id = a.getAttribute('href')!.slice(1);
    if (!sectionIds.has(id)) return;
    const el = document.getElementById(id)!;
    const delta = el.getBoundingClientRect().top;
    if (Math.abs(delta) < vh * 1.5) return; // short hops keep the smooth scroll
    e.preventDefault();
    e.stopImmediatePropagation();
    pageTurn(el, delta > 0 ? 'forward' : 'back').then(() => focusSection(el));
  }, true);

  function focusSection(el: HTMLElement) {
    const h = el.querySelector<HTMLElement>('h2, h1') ?? el;
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
    history.replaceState(null, '', `#${el.id}`);
  }

  document.fonts?.ready.then(onResize);
  measure();
  tone();

  initReticle({ open: S.cursorOpen, ext: S.cursorExt, press: S.cursorPress, pick: S.cursorPick });
}
