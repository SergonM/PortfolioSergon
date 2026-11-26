/**
 * Segments, the part that runs on every device.
 * - Native swipe (phones, reduced motion, no GSAP) drives the progress bar and the index.
 * - Exhibit plates draw themselves when they come into view (CSS transitions on transform/opacity,
 *   triggered by adding .on). An IntersectionObserver sees through the GSAP transform, so the same
 *   code serves the pinned desktop rail and the swiped phone rail.
 * - KPI figures count up and the SHA-256 line decodes, only when motion is allowed.
 */
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initSegments() {
  const root = document.querySelector<HTMLElement>('[data-segments]');
  if (!root) return;
  const rail = root.querySelector<HTMLElement>('[data-rail]')!;
  const fill = root.querySelector<HTMLElement>('[data-progress]')!;
  const navItems = [...root.querySelectorAll<HTMLElement>('[data-nav]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];

  const setActive = (id: string | undefined) => navItems.forEach((li) => li.classList.toggle('on', li.dataset.nav === id));
  (root as any).setActive = setActive;

  const onScroll = () => {
    if (document.documentElement.classList.contains('h-pinned')) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const p = max > 0 ? rail.scrollLeft / max : 0;
    fill.style.transform = `scaleX(${p.toFixed(4)})`;
    const mid = rail.scrollLeft + rail.clientWidth / 2;
    const current = panels.filter((el) => el.offsetLeft <= mid).pop() ?? panels[0];
    setActive(current?.dataset.seg);
  };
  rail.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  root.querySelectorAll<HTMLAnchorElement>('[data-seg-nav] a').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = root.querySelector<HTMLElement>(a.getAttribute('href')!);
      if (!target) return;
      e.preventDefault();
      if (document.documentElement.classList.contains('h-pinned')) {
        root.dispatchEvent(new CustomEvent('seg:goto', { detail: target }));
      } else {
        rail.scrollTo({ left: target.offsetLeft - (rail.clientWidth - target.offsetWidth) / 2, behavior: 'smooth' });
        rail.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }));

  initExhibits(root);
}

function initExhibits(root: HTMLElement) {
  const plates = [...root.querySelectorAll<HTMLElement>('[data-plate]')];
  const kpis = [...root.querySelectorAll<HTMLElement>('[data-count]')];
  if (!('IntersectionObserver' in window)) { plates.forEach((p) => p.classList.add('on')); return; }

  // A plate starts drawing once its left edge passes 70% of the screen (it is mid-unfold by then).
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      el.classList.add('on');
      if (!reduce()) {
        el.querySelectorAll<SVGTextElement>('[data-iter]').forEach((t) => countText(t, +t.dataset.iter!, 1.9, (v) => `${String(v).padStart(3, '0')} / ${t.dataset.iter}`, 0.2));
        el.querySelectorAll<SVGTextElement>('[data-scramble]').forEach(scramble);
      }
    });
  }, { rootMargin: '0px -30% 0px 0px', threshold: 0.01 });
  plates.forEach((p) => io.observe(p));

  if (reduce()) return;
  const kio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      kio.unobserve(el);
      const fmt = new Intl.NumberFormat(el.dataset.locale === 'es' ? 'es-CO' : 'en-US');
      countText(el, +el.dataset.count!, 1.4, (v) => fmt.format(v) + (el.dataset.rest ?? ''), 0.15);
    });
  }, { rootMargin: '0px -25% 0px 0px', threshold: 0.5 });
  kpis.forEach((k) => {
    // Park the figure at zero only once we know we will animate it; the HTML already carries the real value.
    k.textContent = '0' + (k.dataset.rest ?? '');
    kio.observe(k);
  });
}

/** Count a text node up from 0 with an ease-out curve. Text changes only, no layout properties. */
function countText(el: Element, to: number, dur: number, fmt: (v: number) => string, delay = 0) {
  const t0 = performance.now() + delay * 1000;
  const tick = (now: number) => {
    const p = Math.min(1, Math.max(0, (now - t0) / (dur * 1000)));
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(to * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = fmt(0);
  requestAnimationFrame(tick);
}

/** The fingerprint line resolves from noise to the real hash, left to right. */
function scramble(el: Element) {
  const target = (el as HTMLElement).dataset.scramble!;
  const hex = '0123456789abcdef';
  const start = performance.now() + 700;
  const dur = 1100;
  const tick = (now: number) => {
    const p = Math.min(1, Math.max(0, (now - start) / dur));
    const fixed = Math.floor(p * target.length);
    let s = '';
    for (let i = 0; i < target.length; i++) {
      const ch = target[i];
      s += i < fixed || !/[0-9a-f]/.test(ch) || i < 7 ? ch : hex[(Math.random() * 16) | 0];
    }
    el.textContent = s;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
