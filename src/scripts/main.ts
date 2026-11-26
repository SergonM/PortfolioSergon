import { initHero } from './hero';
import { initChart } from './chart';

const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) initHero(hero);
initChart();

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // GSAP, ScrollTrigger, SplitText and Lenis load as a separate chunk, after first paint.
  import('./motion').then((m) => m.initMotion());
}
