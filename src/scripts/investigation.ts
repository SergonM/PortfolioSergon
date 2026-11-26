/** Featured investigation: the step crossing the middle of the screen sets the figure's state. CSS does the motion. */
export function initInvestigation() {
  const root = document.querySelector<HTMLElement>('[data-inv]');
  if (!root) return;
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
}
