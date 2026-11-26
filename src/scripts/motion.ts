/**
 * Page choreography. Loaded only when the reader allows motion.
 * Rule: animate transform and opacity only; every element is readable before this runs.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initFrontMotion } from './front/motion-front';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initMotion() {
  // ---------- smooth scroll ----------
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
  window.__lenis = lenis; // the report chrome (scripts/chrome) jumps and pauses through this instance
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]:not([data-seg-nav] a)').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href')!);
      if (target) { e.preventDefault(); lenis.scrollTo(target as HTMLElement, { offset: -16, duration: 1.4 }); }
    }));

  initFrontMotion();
  document.documentElement.classList.remove('motion-pending');
  typesetHeadings();
  reveals();
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
