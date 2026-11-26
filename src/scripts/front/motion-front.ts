/**
 * Choreography for the front of the report: cover, memo, letter and highlights.
 * Loaded with the motion chunk, so it only runs when the reader allows motion.
 * Rule: transform and opacity only; the static HTML is already the final state.
 */
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export function initFrontMotion() {
  opening();
  scrollStory();
  letter();
  highlights();
}

/**
 * Cover: the documents land on the desk, then the cover is printed.
 * Two colour passes arrive off register and slide into place, the ink pass rises
 * out of the plate, the numbering machine rolls, the seal is struck, and finally
 * the UV lamp crosses the cover once to show what it hides.
 */
function opening() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const doc = document.querySelector<HTMLElement>('[data-lift]');
  if (!hero || !doc) return;
  const name = hero.querySelector<HTMLElement>('[data-name]')!;
  const split = SplitText.create(name, { type: 'lines,chars', mask: 'lines', linesClass: 'ln' });
  const regs = gsap.utils.toArray<HTMLElement>('[data-reg]', hero);
  const memo = hero.querySelector<HTMLElement>('[data-memo]');
  const seal = hero.querySelector<HTMLElement>('[data-seal]');
  const crops = hero.querySelectorAll('.crop');
  document.documentElement.classList.remove('motion-pending');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(doc, { yPercent: 8, rotation: -3, opacity: 0, duration: 1.3 })
    .from(crops, { opacity: 0, scale: 1.8, duration: 0.6, ease: 'power3.out', stagger: 0.05 }, 0.3)
    .fromTo(regs,
      { opacity: 0.9, x: (i) => (i ? 16 : -20), y: (i) => (i ? -9 : 11), rotation: (i) => (i ? 0.7 : -0.9) },
      { x: 0, y: 0, rotation: 0, duration: 1.15, ease: 'expo.inOut', stagger: 0.1 }, 0.3)
    .from(split.chars, { yPercent: 115, duration: 1, stagger: { each: 0.026, from: 'start' } }, 1.05)
    .to(regs, { opacity: 0, duration: 0.45, ease: 'power1.out' }, 1.75)
    .add(() => (hero.querySelector('[data-numbox]') as any)?.roll?.(), 0.4)
    .from(memo, { y: 120, rotation: 9, opacity: 0, duration: 1.2 }, 0.75)
    .fromTo(seal, { scale: 2.6, opacity: 0, rotation: -24 }, { scale: 1, opacity: 1, rotation: -14, duration: 0.5, ease: 'back.out(2.6)' }, 1.9)
    .from(doc, { y: 6, duration: 0.25, ease: 'power2.out' }, 1.95)
    .from(hero.querySelector('.how'), { opacity: 0, y: 12, duration: 0.8 }, 2.1)
    .add(() => (hero as any).demo?.(), 2.35);
}

/** Leaving the cover: the cover sinks back, the memo slides faster, like papers on a desk under a moving camera. */
function scrollStory() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 };
  gsap.to('[data-scene]', { yPercent: 18, scale: 0.94, ease: 'none', scrollTrigger: st });
  gsap.to('[data-memo-wrap]', { yPercent: -14, ease: 'none', scrollTrigger: st });
}

/** Letter: the highlighter passes over key phrases as they are read, and the signature writes itself. */
function letter() {
  const root = document.querySelector<HTMLElement>('[data-letter]');
  if (!root) return;
  root.querySelectorAll<HTMLElement>('[data-mark]').forEach((m) => {
    gsap.from(m, {
      '--mark': 0, duration: 0.9, ease: 'power2.inOut',
      scrollTrigger: { trigger: m, start: 'top 72%', once: true },
    });
  });
  const sig = root.querySelector<SVGElement>('[data-sig]');
  const pen = root.querySelector('[data-sig-reveal]');
  if (sig && pen) {
    gsap.from(pen, {
      scaleX: 0, transformOrigin: '0% 50%', duration: 2.4, ease: 'power1.inOut',
      scrollTrigger: { trigger: sig, start: 'top 85%', once: true },
    });
  }
  const pull = root.querySelector('[data-pull]');
  if (pull) {
    const s = SplitText.create(pull, { type: 'words', mask: 'words' });
    gsap.from(s.words, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: pull, start: 'top 80%', once: true } });
  }
}

/**
 * Turns a number's text into a mechanical counter: each digit is a strip of 0–9
 * that spins past zero and lands on its value. Separators stay put.
 * Screen readers keep the original text.
 */
function odometer(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.textContent = '';
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = text;
  const vis = document.createElement('span');
  vis.className = 'odo';
  vis.setAttribute('aria-hidden', 'true');
  const strips: { strip: HTMLElement; d: number }[] = [];
  for (const ch of text) {
    const col = document.createElement('span');
    col.className = 'odo-c';
    col.textContent = ch; // invisible placeholder: keeps width and baseline
    if (/\d/.test(ch)) {
      const strip = document.createElement('span');
      strip.className = 'odo-s';
      strip.innerHTML = Array.from({ length: 20 }, (_, i) => i % 10).join('<br>');
      col.appendChild(strip);
      strips.push({ strip, d: +ch });
    } else col.classList.add('odo-sep');
    vis.appendChild(col);
  }
  el.append(sr, vis);
  return strips;
}

/** Highlights: rules draw, counters roll, each row is ticked as verified, then the audit stamp lands. */
function highlights() {
  const rows = gsap.utils.toArray<HTMLElement>('[data-row]');
  rows.forEach((row) => {
    const num = row.querySelector<HTMLElement>('[data-count]')!;
    const strips = odometer(num);
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
    tl.from(row.querySelector('[data-rule]'), { scaleX: 0, duration: 1.1, ease: 'power3.inOut' })
      .from(row.querySelector('.fig'), { yPercent: 30, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0.05)
      .from(row.querySelector('.txt'), { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.25);
    strips.forEach(({ strip, d }, i) => {
      tl.fromTo(strip, { yPercent: 0 }, { yPercent: -((10 + d) / 20) * 100, duration: 1.3 + i * 0.12, ease: 'power3.out' }, 0.1 + i * 0.06);
    });
    const tick = row.querySelector('[data-tick]');
    if (tick) tl.fromTo(tick, { scale: 1.9, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: -4, duration: 0.4, ease: 'back.out(2.6)' }, 1.2);
  });

  const audit = document.querySelector('[data-audit]');
  const ledger = document.querySelector('[data-ledger]');
  if (audit && rows.length) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: rows[rows.length - 1], start: 'top 80%', once: true } });
    tl.fromTo(audit, { scale: 3, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: -12, duration: 0.5, ease: 'back.out(2.2)' });
    if (ledger) tl.fromTo(ledger, { y: 0 }, { y: 4, duration: 0.06, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 0.18);
  }

  const rect = document.querySelector('[data-reveal-rect]');
  if (rect) {
    gsap.from(rect, { scaleX: 0, transformOrigin: '0 50%', duration: 2.2, ease: 'power2.inOut', scrollTrigger: { trigger: '[data-chart]', start: 'top 75%', once: true } });
    gsap.from('[data-pt]', { scale: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(3)', stagger: 0.16, delay: 0.3, scrollTrigger: { trigger: '[data-chart]', start: 'top 75%', once: true } });
  }
}
