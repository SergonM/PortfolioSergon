/** Segments rail without pinning (phones, reduced motion, no GSAP): native swipe drives the progress bar and the index. */
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
}
