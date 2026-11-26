/**
 * Page choreography. Loaded only when the reader allows motion.
 * Rule: animate transform and opacity only; every element is readable before this runs.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initMotion() {
  // ---------- smooth scroll ----------
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]:not([data-seg-nav] a)').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href')!);
      if (target) { e.preventDefault(); lenis.scrollTo(target as HTMLElement, { offset: -16, duration: 1.4 }); }
    }));

  opening();
  document.documentElement.classList.remove('motion-pending');
  scrollStory();
  typesetHeadings();
  reveals();
  highlights();
  segmentsMotion(lenis);
}

/** Segments: on wide screens the rail is pinned and scrolls sideways; each spread settles onto the desk as it arrives. */
function segmentsMotion(lenis: Lenis) {
  const root = document.querySelector<HTMLElement>('[data-segments]');
  if (!root) return;
  const pin = root.querySelector<HTMLElement>('[data-pin]')!;
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const fill = root.querySelector<HTMLElement>('[data-progress]')!;
  const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', root);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 901px)', () => {
    document.documentElement.classList.add('h-pinned');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const horizontal = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(fill, { scaleX: self.progress });
          const mid = self.progress * dist() + innerWidth / 2;
          const current = panels.filter((el) => el.offsetLeft <= mid).pop() ?? panels[0];
          (root as any).setActive?.(current?.dataset.seg);
        },
      },
    });
    const onGoto = (e: Event) => {
      const el = (e as CustomEvent<HTMLElement>).detail;
      const st = horizontal.scrollTrigger!;
      const x = Math.min(dist(), Math.max(0, el.offsetLeft - (innerWidth - el.offsetWidth) / 2));
      lenis.scrollTo(st.start + (dist() ? x / dist() : 0) * (st.end - st.start), { duration: 1.6 });
    };
    root.addEventListener('seg:goto', onGoto);

    panels.forEach((panel) => {
      const ca = { containerAnimation: horizontal, trigger: panel };
      gsap.fromTo(panel, { rotation: 2.5, yPercent: 6, opacity: 0.35 }, {
        rotation: 0, yPercent: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { ...ca, start: 'left 95%', end: 'left 45%', scrub: true },
      });
      const kpi = panel.querySelector('[data-kpi] .v');
      if (kpi) gsap.from(kpi, { scale: 0.55, opacity: 0, duration: 0.7, ease: 'back.out(2)', scrollTrigger: { ...ca, start: 'left 62%', toggleActions: 'play none none reverse' } });
      const bars = panel.querySelectorAll('[data-bar]');
      if (bars.length) gsap.from(bars, { scaleX: 0, duration: 0.9, ease: 'power3.inOut', stagger: 0.18, scrollTrigger: { ...ca, start: 'left 60%', toggleActions: 'play none none reverse' } });
      const stamp = panel.querySelector('[data-stamp]');
      if (stamp) gsap.from(stamp, { scale: 2.6, opacity: 0, duration: 0.5, ease: 'back.out(2.4)', scrollTrigger: { ...ca, start: 'left 55%', toggleActions: 'play none none reverse' } });
      const code = panel.querySelector('.d-code');
      if (code) gsap.from(code, { xPercent: 30, ease: 'none', scrollTrigger: { ...ca, start: 'left right', end: 'right left', scrub: true } });
    });

    return () => {
      document.documentElement.classList.remove('h-pinned');
      root.removeEventListener('seg:goto', onGoto);
    };
  });
}

/** Cover: the documents drop onto the desk, the name is typeset, the numbering machine rolls, the seal hits. */
function opening() {
  const doc = document.querySelector<HTMLElement>('[data-lift]');
  if (!doc) return;
  const name = document.querySelector<HTMLElement>('[data-name]')!;
  const split = SplitText.create(name, { type: 'lines,chars', mask: 'lines', linesClass: 'ln' });
  const memo = document.querySelector<HTMLElement>('[data-memo]');
  const seal = document.querySelector<HTMLElement>('[data-seal]');
  document.documentElement.classList.remove('motion-pending');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(doc, { yPercent: 8, rotation: -3, opacity: 0, duration: 1.3 })
    .from(split.chars, { yPercent: 115, duration: 1.1, stagger: { each: 0.028, from: 'start' } }, 0.25)
    .add(() => (document.querySelector('[data-numbox]') as any)?.roll?.(), 0.2)
    .from(memo, { y: 120, rotation: 9, opacity: 0, duration: 1.2 }, 0.55)
    .fromTo(seal, { scale: 2.6, opacity: 0, rotation: -24 }, { scale: 1, opacity: 1, rotation: -14, duration: 0.5, ease: 'back.out(2.6)' }, 1.45)
    .from('[data-hero] .how', { opacity: 0, y: 12, duration: 0.8 }, 1.6);
}

/** Leaving the cover: the cover sinks back, the memo slides faster, like papers on a desk under a moving camera. */
function scrollStory() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
  gsap.to('[data-scene]', { yPercent: 18, scale: 0.94, ease: 'none', scrollTrigger: st });
  gsap.to('[data-memo-wrap]', { yPercent: -14, ease: 'none', scrollTrigger: st });
}

/** Headlines set like movable type: letters drop into the line in a scrambled order, then settle. */
function typesetHeadings() {
  gsap.utils.toArray<HTMLElement>('[data-typeset]').forEach((el) => {
    const s = SplitText.create(el, { type: 'chars,words', mask: 'chars' });
    gsap.from(s.chars, {
      yPercent: -110, rotation: () => gsap.utils.random(-25, 25), duration: 0.7, ease: 'back.out(1.6)',
      stagger: { each: 0.035, from: 'random' },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

function reveals() {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.from(els, { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09 }),
  });
}

/** Highlights: rules draw, figures count up, the audit stamp lands, the chart draws itself. */
function highlights() {
  const rows = gsap.utils.toArray<HTMLElement>('[data-row]');
  rows.forEach((row) => {
    const rule = row.querySelector('[data-rule]');
    const num = row.querySelector<HTMLElement>('[data-count]')!;
    const target = parseFloat(num.dataset.count!);
    const dec = parseInt(num.dataset.decimals ?? '0', 10);
    const fmt = new Intl.NumberFormat(num.dataset.locale === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
    tl.from(rule, { scaleX: 0, duration: 1.1, ease: 'power3.inOut' })
      .from(row.querySelector('.fig'), { yPercent: 40, opacity: 0, duration: 0.8, ease: 'expo.out' }, 0.1)
      .from(row.querySelector('.txt'), { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.25);
    if (target >= 10) {
      const o = { v: 0 };
      tl.to(o, { v: target, duration: 1.6, ease: 'power2.out', onUpdate: () => { num.textContent = fmt.format(o.v); } }, 0.1);
    }
  });
  const audit = document.querySelector('[data-audit]');
  if (audit && rows.length) {
    gsap.fromTo(audit, { scale: 3, opacity: 0, rotation: -30 }, {
      scale: 1, opacity: 1, rotation: -12, duration: 0.55, ease: 'back.out(2.2)',
      scrollTrigger: { trigger: rows[rows.length - 1], start: 'top 80%', once: true },
    });
  }
  const rect = document.querySelector('[data-reveal-rect]');
  if (rect) {
    gsap.from(rect, { scaleX: 0, transformOrigin: '0 50%', duration: 2.2, ease: 'power2.inOut', scrollTrigger: { trigger: '[data-chart]', start: 'top 75%', once: true } });
    gsap.from('[data-pt]', { scale: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(3)', stagger: 0.16, delay: 0.3, scrollTrigger: { trigger: '[data-chart]', start: 'top 75%', once: true } });
  }
}
