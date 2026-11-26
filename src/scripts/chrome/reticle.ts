/**
 * Registration-mark cursor. Printers line up plates with a crosshair target; this report
 * uses one as its pointer. Over something you can act on, the mark rotates and locks on,
 * and a two-word label says what will happen. Mouse and trackpad only; touch devices and
 * reduced motion keep the system cursor. The cover keeps its own UV lamp.
 */
interface Labels { open: string; ext: string; press: string; pick: string }

const SKIP = '[data-hero], [data-no-chrome], input[type="text"], input[type="search"], input[type="email"], textarea, select, iframe, [contenteditable="true"]';
const ACTION = 'a[href], button, [role="button"], label, summary, input[type="radio"], input[type="checkbox"], [data-cursor]';

export function initReticle(L: Labels) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Two layers moved together: the mark inverts whatever it sits on (difference blend),
  // the label is a solid seal-red tag so it stays legible on paper and on the dark spreads.
  const el = document.createElement('div');
  el.className = 'reticle';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="reticle-mark"><svg viewBox="-20 -20 40 40" width="40" height="40"><circle r="7.5"/><path d="M-17 0H-3M3 0H17M0 -17V-3M0 3V17"/></svg></span>';
  const tag = document.createElement('div');
  tag.className = 'reticle reticle-tag';
  tag.setAttribute('aria-hidden', 'true');
  tag.innerHTML = '<span class="reticle-label"><span></span></span>';
  document.body.append(el, tag);
  const label = tag.querySelector<HTMLElement>('.reticle-label span')!;
  const both = (fn: (n: HTMLElement) => void) => { fn(el); fn(tag); };
  const doc = document.documentElement;

  let x = -100, y = -100, cx = -100, cy = -100, raf = 0, visible = false, state = '';

  const loop = () => {
    cx += (x - cx) * 0.38;
    cy += (y - cy) * 0.38;
    const t = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    el.style.transform = t;
    tag.style.transform = t;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(loop) : 0;
  };

  const setState = (next: string, text = '') => {
    if (next === state && label.textContent === text) return;
    state = next;
    both((n) => { n.dataset.state = next; });
    label.textContent = text;
  };

  const classify = (t: Element | null) => {
    if (!t || t.closest(SKIP)) return null;
    const a = t.closest<HTMLElement>(ACTION);
    if (!a) return { s: 'idle', l: '' };
    const custom = a.closest<HTMLElement>('[data-cursor]')?.dataset.cursor;
    if (custom) return { s: 'lock', l: custom };
    if (a.matches('a[href]')) {
      const href = (a as HTMLAnchorElement).href;
      const ext = !!href && new URL(href, location.href).origin !== location.origin;
      return { s: 'lock', l: ext ? `${L.ext} ↗` : L.open };
    }
    if (a.matches('label, input[type="radio"], input[type="checkbox"]')) return { s: 'lock', l: L.pick };
    return { s: 'lock', l: L.press };
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    const c = classify(e.target as Element);
    if (!c) { if (visible) { visible = false; doc.classList.remove('reticle-on'); both((n) => n.classList.remove('show')); } return; }
    if (!visible) {
      visible = true; cx = x; cy = y;
      doc.classList.add('reticle-on'); both((n) => n.classList.add('show'));
    }
    setState(c.s, c.l);
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  const hide = () => { visible = false; doc.classList.remove('reticle-on'); both((n) => n.classList.remove('show')); };
  document.documentElement.addEventListener('pointerleave', hide);
  addEventListener('pointerdown', () => el.classList.add('down'), { passive: true });
  addEventListener('pointerup', () => el.classList.remove('down'), { passive: true });
  // keyboard users get the system focus ring, never the reticle
  addEventListener('keydown', (e) => { if (e.key === 'Tab') hide(); });
}
