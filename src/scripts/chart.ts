/** Milestone chart: tapping a point prints its headline in the news column. */
export function initChart() {
  const news = document.querySelector<HTMLElement>('[data-news]');
  if (!news) return;
  const ms = JSON.parse(news.dataset.ms ?? '[]') as { when: string; title: string; body: string; source: string; of: string }[];
  const pts = [...document.querySelectorAll<SVGCircleElement>('[data-pt]')];
  const show = (i: number) => {
    pts.forEach((p, j) => p.classList.toggle('sel', i === j));
    const m = ms[i];
    news.querySelector('.d')!.textContent = `${m.when} · ${m.of}`;
    news.querySelector('h3')!.textContent = m.title;
    news.querySelector('.b')!.textContent = m.body;
    news.querySelector('.s')!.textContent = `${news.dataset.srcLabel}: ${m.source}`;
  };
  pts.forEach((p, i) => {
    p.addEventListener('click', () => show(i));
    p.addEventListener('mouseenter', () => show(i));
    p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); } });
  });
}
