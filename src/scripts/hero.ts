/**
 * Hero interactions, vanilla and transform-only:
 *  - the cover tilts in 3D and its holographic strip shifts with the pointer;
 *  - a UV lamp (pointer, finger, or scroll on touch screens) reveals the fluorescent layer;
 *  - the memo's black bars are tapped away to declassify the executive summary.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initHero(root: HTMLElement) {
  const scene = root.querySelector<HTMLElement>('[data-scene]')!;
  const doc = root.querySelector<HTMLElement>('[data-doc]')!;
  const lens = root.querySelector<HTMLElement>('[data-lens]')!;
  const uv = root.querySelector<HTMLElement>('[data-uv]')!;
  const foil = root.querySelector<HTMLElement>('[data-foil]')!;
  const sheen = root.querySelector<HTMLElement>('[data-sheen]')!;
  root.querySelectorAll<HTMLElement>('[data-js-only]').forEach((el) => (el.hidden = false));
  if (finePointer) doc.classList.add('pointer');

  buildNumbox(root.querySelector<HTMLElement>('[data-numbox]')!);
  initMemo(root.querySelector<HTMLElement>('[data-memo]')!);

  // ---------- tilt + lamp ----------
  let tx = 0.62, ty = 0.34, cx = tx, cy = ty;
  // Mouse: the lamp shows while the pointer is over the cover.
  // Touch: it lights up while the page scrolls, or while the reader holds it, so it never parks on the name.
  let lampVisible = false;
  let pointerInside = false;
  let holding = false;
  let running = false;
  let demo: { t0: number; dur: number } | null = null;
  let w = doc.offsetWidth, h = doc.offsetHeight, half = lens.offsetWidth / 2;
  new ResizeObserver(() => { w = doc.offsetWidth; h = doc.offsetHeight; half = lens.offsetWidth / 2; }).observe(doc);

  const fromEvent = (e: PointerEvent) => {
    const r = doc.getBoundingClientRect();
    tx = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    ty = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
  };
  if (finePointer) {
    scene.addEventListener('pointerenter', () => { pointerInside = true; demo = null; lampVisible = true; });
    scene.addEventListener('pointerleave', () => { pointerInside = false; lampVisible = false; tx = 0.5; ty = 0.5; });
    scene.addEventListener('pointermove', (e) => { demo = null; lampVisible = true; fromEvent(e); });
  } else {
    // Touch: the lamp sweeps with scroll; "hold the lamp" lets the finger drive it.
    let off = 0;
    const onScroll = (show: boolean) => {
      if (holding || demo) return;
      const r = doc.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight - r.top) / (innerHeight + r.height), 0), 1);
      tx = 0.5 + 0.36 * Math.sin(p * Math.PI * 3);
      ty = 0.12 + 0.8 * p;
      if (!show) return;
      lampVisible = true;
      clearTimeout(off);
      off = window.setTimeout(() => { if (!holding && !demo) lampVisible = false; }, 1100);
    };
    addEventListener('scroll', () => onScroll(true), { passive: true });
    onScroll(false);
    doc.addEventListener('pointerdown', (e) => { if (holding) fromEvent(e); });
    doc.addEventListener('pointermove', (e) => { if (holding) fromEvent(e); });
    const hold = root.querySelector<HTMLButtonElement>('[data-hold]');
    hold?.setAttribute('aria-pressed', 'false');
    hold?.addEventListener('click', () => {
      holding = !holding;
      demo = null;
      lampVisible = holding;
      if (holding) { tx = 0.5; ty = 0.35; }
      doc.style.touchAction = holding ? 'none' : '';
      hold.setAttribute('aria-pressed', String(holding));
      hold.textContent = holding ? hold.dataset.holdOff! : hold.dataset.holdOn!;
    });
  }

  // A one-off demonstration: the lamp crosses the cover through the hidden figures,
  // so the reader learns there is something to find before being asked to look.
  const stops = [[0.06, 0.05], [0.24, 0.25], [0.66, 0.34], [0.27, 0.44], [0.64, 0.67], [0.42, 0.88], [0.5, 1.05]];
  const along = (t: number) => {
    const seg = Math.min(Math.floor(t * (stops.length - 1)), stops.length - 2);
    const u = t * (stops.length - 1) - seg;
    const p0 = stops[Math.max(seg - 1, 0)], p1 = stops[seg], p2 = stops[seg + 1], p3 = stops[Math.min(seg + 2, stops.length - 1)];
    const cr = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
  };
  (root as any).demo = () => {
    if (reduce || pointerInside || holding) return;
    demo = { t0: performance.now(), dur: 4200 };
    [tx, ty] = along(0); cx = tx; cy = ty;
  };

  let gx = 0, gy = 0;
  // Optional gyroscope on Android-class devices (no permission prompt needed there).
  if (!finePointer && !reduce && 'DeviceOrientationEvent' in window && typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
    addEventListener('deviceorientation', (e) => {
      if (e.gamma == null || e.beta == null) return;
      gx = Math.max(-1, Math.min(1, e.gamma / 25));
      gy = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    }, { passive: true });
  }
  let lampAlpha = 0;
  function frame(now: number) {
    if (!running) return;
    if (demo) {
      const p = (now - demo.t0) / demo.dur;
      if (p >= 1) { demo = null; lampVisible = pointerInside || holding; }
      else {
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        [tx, ty] = along(e);
        lampVisible = p < 0.93;
      }
    }
    const k = reduce ? 1 : demo ? 0.35 : 0.14;
    cx += (tx - cx) * k; cy += (ty - cy) * k;
    lampAlpha += ((lampVisible ? 1 : 0) - lampAlpha) * (reduce ? 1 : 0.16);
    const tiltX = finePointer ? cx - 0.5 : gx * 0.5;
    const tiltY = finePointer ? cy - 0.5 : gy * 0.5;
    if (!reduce) {
      doc.style.transform = `rotateX(${(-tiltY * 12).toFixed(2)}deg) rotateY(${(tiltX * 16).toFixed(2)}deg)`;
      foil.style.transform = `translate3d(${(tiltX * -60).toFixed(1)}%, ${(tiltY * -40).toFixed(1)}%, 0)`;
      sheen.style.transform = `translate3d(${(tiltX * 70).toFixed(1)}%, ${(tiltY * 70).toFixed(1)}%, 0)`;
    }
    const lx = cx * w, ly = cy * h;
    lens.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`;
    lens.style.opacity = lampAlpha.toFixed(3);
    uv.style.transform = `translate3d(${(half - lx).toFixed(1)}px, ${(half - ly).toFixed(1)}px, 0)`;
    requestAnimationFrame(frame);
  }
  // Only animate while the hero is on screen.
  new IntersectionObserver(([e]) => {
    const was = running; running = e.isIntersecting;
    if (running && !was) requestAnimationFrame(frame);
  }).observe(root);
}

function buildNumbox(box: HTMLElement) {
  const target = '0001';
  box.textContent = 'Nº ';
  const cols = [...target].map((d) => {
    const col = document.createElement('span'); col.className = 'col';
    const strip = document.createElement('span');
    strip.innerHTML = Array.from({ length: 21 }, (_, i) => i % 10).join('<br>');
    col.appendChild(strip); box.appendChild(col);
    strip.style.transform = `translateY(-${(10 + +d) * 1.2}em)`;
    return { strip, d: +d };
  });
  (box as any).roll = () => {
    if (reduce) return;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      let live = false;
      cols.forEach((c, i) => {
        const p = Math.min(Math.max((now - t0 - 300 - i * 140) / 1100, 0), 1);
        if (p < 1) live = true;
        c.strip.style.transform = `translateY(-${(ease(p) * (10 + c.d) * 1.2).toFixed(3)}em)`;
      });
      if (live) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
}

function initMemo(memo: HTMLElement) {
  const bars = [...memo.querySelectorAll<HTMLElement>('[data-r]')];
  const count = memo.querySelector<HTMLElement>('[data-count]')!;
  const total = bars.length;
  const template = memo.dataset.progress ?? '{n} / {t}';
  const update = () => {
    const n = bars.filter((b) => b.classList.contains('open')).length;
    count.textContent = template.replace('{n}', String(n)).replace('{t}', String(total));
    memo.classList.toggle('done', n === total);
  };
  const open = (b: HTMLElement) => { b.classList.add('open'); b.removeAttribute('role'); b.removeAttribute('tabindex'); update(); };
  bars.forEach((b) => {
    b.setAttribute('role', 'button');
    b.setAttribute('tabindex', '0');
    b.addEventListener('click', () => open(b));
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(b); } });
  });
  memo.querySelector('[data-declassify]')?.addEventListener('click', () =>
    bars.forEach((b, i) => setTimeout(() => open(b), reduce ? 0 : i * 170)));
  update();
}
