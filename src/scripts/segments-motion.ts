/**
 * Segments choreography (loaded with the rest of the motion chunk, only when motion is allowed).
 * Wide screens: the rail is pinned and scrolls sideways. Each spread settles onto the desk,
 * then the exhibit plate hinged to its outer edge swings open like a gatefold.
 * Transform and opacity only.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function segmentsMotion(lenis: Lenis) {
  const root = document.querySelector<HTMLElement>('[data-segments]');
  if (!root) return;
  const pin = root.querySelector<HTMLElement>('[data-pin]')!;
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const fill = root.querySelector<HTMLElement>('[data-progress]')!;
  const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', root);

  // Divider codes: split into letters once (works for both layouts).
  root.querySelectorAll<HTMLElement>('[data-dcode]').forEach((el) => {
    el.innerHTML = [...(el.textContent ?? '')].map((c) => `<span class="ch">${c}</span>`).join('');
  });

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
      const sheet = panel.querySelector<HTMLElement>('[data-spread]') ?? panel;

      // the page arrives slightly askew and settles flat
      gsap.fromTo(sheet, { rotation: 2.2, yPercent: 5, opacity: 0.35 }, {
        rotation: 0, yPercent: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { ...ca, start: 'left 95%', end: 'left 45%', scrub: true },
      });

      // gatefold: the plate swings open on its hinge as it enters
      const plate = panel.querySelector<HTMLElement>('[data-plate]');
      if (plate) {
        const leaf = plate.querySelector('[data-plate-in]');
        const shade = plate.querySelector('[data-shade]');
        const st = { containerAnimation: horizontal, trigger: plate, start: 'left 102%', end: 'left 48%', scrub: 0.4 };
        gsap.fromTo(leaf, { rotationY: -168 }, { rotationY: 0, ease: 'power1.inOut', scrollTrigger: st });
        gsap.fromTo(shade, { opacity: 0.7 }, { opacity: 0, ease: 'power1.in', scrollTrigger: st });
      }

      const kpi = panel.querySelector('[data-kpi] .v');
      if (kpi) gsap.from(kpi, { scale: 0.55, opacity: 0, duration: 0.7, ease: 'back.out(2)', scrollTrigger: { ...ca, start: 'left 85%', toggleActions: 'play none none reverse' } });
      const bars = panel.querySelectorAll('[data-bar]');
      if (bars.length) {
        const tl = gsap.timeline({ scrollTrigger: { ...ca, start: 'left 80%', toggleActions: 'play none none reverse' } });
        tl.from(bars, { scaleX: 0, duration: 0.9, ease: 'power3.inOut', stagger: 0.18 })
          .from(panel.querySelectorAll('[data-step] > p, [data-step] > .st'), { y: 14, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07 }, 0.15);
      }
      const redact = panel.querySelectorAll('[data-redact]');
      if (redact.length) gsap.from(redact, { scaleX: 0, duration: 0.45, ease: 'power2.inOut', stagger: 0.08, scrollTrigger: { ...ca, start: 'left 70%', toggleActions: 'play none none reverse' } });
      const stamp = panel.querySelector('[data-stamp]');
      if (stamp) gsap.from(stamp, { scale: 2.6, opacity: 0, rotation: -30, duration: 0.5, ease: 'back.out(2.4)', delay: 0.5, scrollTrigger: { ...ca, start: 'left 60%', toggleActions: 'play none none reverse' } });

      if (panel.hasAttribute('data-divider')) {
        const ros = panel.querySelector('.d-ros');
        if (ros) gsap.fromTo(ros, { rotation: -40 }, { rotation: 50, ease: 'none', scrollTrigger: { ...ca, start: 'left right', end: 'right left', scrub: true } });
        const chars = panel.querySelectorAll('[data-dcode] .ch');
        gsap.from(chars, { yPercent: 105, rotation: (i) => (i % 2 ? 12 : -12), opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, scrollTrigger: { ...ca, start: 'left 75%', toggleActions: 'play none none reverse' } });
        gsap.from(panel.querySelectorAll('[data-dline]'), { x: -24, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, scrollTrigger: { ...ca, start: 'left 60%', toggleActions: 'play none none reverse' } });
      }
    });

    return () => {
      document.documentElement.classList.remove('h-pinned');
      root.removeEventListener('seg:goto', onGoto);
    };
  });

  // Phones: native swipe. Divider letters still set themselves when the page comes into view.
  mm.add('(max-width: 900px)', () => {
    root.querySelectorAll<HTMLElement>('[data-divider]').forEach((panel) => {
      gsap.from(panel.querySelectorAll('[data-dcode] .ch'), { yPercent: 105, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: panel, start: 'top 80%', once: true } });
    });
  });
}
