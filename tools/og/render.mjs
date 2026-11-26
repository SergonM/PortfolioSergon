// Renders the Open Graph covers (1200×630) and the touch icon from tools/og/cover.html.
// Not part of the site build: run it with Playwright when the cover design changes, then commit the PNGs.
//   node tools/og/render.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const font = (p) => readFileSync(resolve(root, 'node_modules/@fontsource', p)).toString('base64');
const gloock = font('gloock/files/gloock-latin-400-normal.woff2');
const mono = font('dm-mono/files/dm-mono-latin-400-normal.woff2');
const mono5 = font('dm-mono/files/dm-mono-latin-500-normal.woff2');

function rosette(R, r, d, turns, steps = 1800) {
  const k = (R - r) / r; let p = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    p += `${i ? 'L' : 'M'}${((R - r) * Math.cos(t) + d * Math.cos(k * t)).toFixed(1)} ${((R - r) * Math.sin(t) - d * Math.sin(k * t)).toFixed(1)}`;
  }
  return p;
}

const copy = {
  en: { report: 'Annual Report 2026', form: 'Annual Report<br>Form AR-26', seal: 'Audited ✓', by: 'by the reader', kicker: 'Annual Report 2026 · Portfolio', claim: 'An engineer who builds AI and understands compliance, risk and business.', memo: 'Executive summary', l1: 'Subject trained a model that gets citizen opinions right', l2: 'Recommended action:', foot: 'Bogotá · EN / ES', stamp: 'Confidential' },
  es: { report: 'Informe Anual 2026', form: 'Informe Anual<br>Formulario IA-26', seal: 'Auditado ✓', by: 'por quien lee', kicker: 'Informe Anual 2026 · Portafolio', claim: 'Ingeniero que construye IA y entiende compliance, riesgo y negocio.', memo: 'Resumen ejecutivo', l1: 'El sujeto entrenó un modelo que acierta con las opiniones ciudadanas', l2: 'Acción recomendada:', foot: 'Bogotá · ES / EN', stamp: 'Confidencial' },
};

const tpl = readFileSync(resolve(here, 'cover.html'), 'utf8');
const browser = await chromium.launch();
for (const [locale, c] of Object.entries(copy)) {
  let html = tpl
    .replaceAll('{{GLOOCK}}', gloock).replaceAll('{{MONO}}', mono).replaceAll('{{MONO5}}', mono5)
    .replaceAll('{{OUTER}}', rosette(80, 22, 48, 11)).replaceAll('{{INNER}}', rosette(60, 17, 30, 17));
  for (const [k, v] of Object.entries(c)) html = html.replaceAll(`{{${k}}}`, v);
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(root, `public/og/cover-${locale}.jpg`), type: 'jpeg', quality: 88 });
  if (locale === 'en') {
    await page.setViewportSize({ width: 180, height: 180 });
    await page.evaluate(() => document.body.classList.add('icon'));
    await page.screenshot({ path: resolve(root, 'public/apple-touch-icon.png') });
  }
  await page.close();
}
await browser.close();
