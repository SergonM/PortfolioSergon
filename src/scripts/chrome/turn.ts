/**
 * "Turn the page": a jump to another section is shown as the current page lifting off its
 * spine and turning away, with the destination lying underneath. Built on the View
 * Transitions API, so the browser snapshots both states and we only animate two layers
 * with transform and opacity. Browsers without it, and readers who ask for reduced
 * motion, get an instant jump.
 */
declare global {
  interface Window { __lenis?: { scrollTo: (t: number | HTMLElement, o?: Record<string, unknown>) => void; stop: () => void; start: () => void } }
}

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function jump(target: HTMLElement | number) {
  const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY;
  const top = Math.max(0, Math.round(y));
  if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
}

let busy = false;

export async function pageTurn(target: HTMLElement | number, dir: 'forward' | 'back', before?: () => void): Promise<void> {
  const doc = document.documentElement;
  if (busy || reduced() || !('startViewTransition' in document)) {
    before?.();
    jump(target);
    return;
  }
  busy = true;
  doc.dataset.turn = dir;
  try {
    // Rendering is paused inside this callback, so it must stay synchronous (no rAF waits).
    // Lenis' immediate scroll emits its scroll event right away, which updates ScrollTrigger,
    // and the running head reads the new position on its own scroll listener.
    const vt = document.startViewTransition(() => {
      before?.();
      jump(target);
      window.dispatchEvent(new Event('scroll'));
    });
    await vt.finished;
  } catch {
    jump(target);
  } finally {
    delete doc.dataset.turn;
    busy = false;
  }
}
