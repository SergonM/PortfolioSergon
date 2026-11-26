// Build-time guilloché: hypotrochoid rosettes rendered to SVG path data.
// Generated from formulas so the cover ships as a few KB of static SVG, no JS.
export function rosette(R: number, r: number, d: number, turns: number, steps = 1800): string {
  const k = (R - r) / r;
  let path = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    const x = (R - r) * Math.cos(t) + d * Math.cos(k * t);
    const y = (R - r) * Math.sin(t) - d * Math.sin(k * t);
    path += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return path;
}
