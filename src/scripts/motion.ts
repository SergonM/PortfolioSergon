/**
 * Page choreography. Loaded only when the reader allows motion.
 * Rule: animate transform and opacity only; every element is readable before this runs.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { segmentsMotion } from './segments-motion';
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
