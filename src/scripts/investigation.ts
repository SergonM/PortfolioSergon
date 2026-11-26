/**
 * Featured investigation: the step crossing the middle of the screen sets the figure's state; CSS does the motion.
 * Also: the cold-open counter, and the business memo's reveal. Without JS everything is already in place.
 */
export function initInvestigation() {
  const root = document.querySelector<HTMLElement>('[data-inv]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (root) {
    const stage = root.querySelector<HTMLElement>('[data-stage]')!;
    const steps = [...root.querySelectorAll<HTMLElement>('[data-inv-step]')];
    const activate = (step: HTMLElement) => {
      steps.forEach((s) => s.classList.toggle('is-on', s === step));
      stage.dataset.state = step.dataset.invStep!;
    };
    activate(steps[0]);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && activate(e.target as HTMLElement)),
      { rootMargin: '-48% 0px -48% 0px' },
    );
    steps.forEach((s) => io.observe(s));

    // cold open: the number of underweight babies counts up once, the first time it is seen
    const cn = root.querySelector<HTMLElement>('[data-count]');
    if (cn && !reduce) {
      const target = Number(cn.dataset.count);
      const nf = new Intl.NumberFormat(document.documentElement.lang === 'es' ? 'es-CO' : 'en-US');
      const co = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        co.disconnect();
        const t0 = performance.now(), dur = 1600;
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          cn.textContent = nf.format(Math.round(target * (1 - Math.pow(1 - t, 4))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, { threshold: 0.6 });
      co.observe(cn);
    }
  }

  // the memo: each block plays its entrance once
  const anims = document.querySelectorAll<HTMLElement>('[data-brief] [data-brief-anim]');
  if (!anims.length) return;
  if (reduce) { anims.forEach((a) => a.classList.add('is-in')); return; }
  const bo = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    bo.unobserve(e.target);
  }), { rootMargin: '0px 0px -18% 0px' });
  anims.forEach((a) => bo.observe(a));
}
