import {
  PDFArray, PDFDocument, PDFFont, PDFPage, PDFName, PDFString, StandardFonts, rgb,
  setCharacterSpacing, type RGB,
} from 'pdf-lib';
import type { Cv } from '../data/cv';

/**
 * Builds the one-page CV with pdf-lib's standard fonts (no embedding, WinAnsi text).
 * Single column, real text, so ATS parsers read it top to bottom.
 */

const PAGE_W = 612; // US Letter
const PAGE_H = 792;
const M_X = 58;
const M_TOP = 46;
const M_BOTTOM = 42;
const W = PAGE_W - M_X * 2;

const INK = rgb(0x13 / 255, 0x20 / 255, 0x1a / 255);
const MUTED = rgb(0x4a / 255, 0x56 / 255, 0x50 / 255);
const ACCENT = rgb(0xb2 / 255, 0x3a / 255, 0x2b / 255);

interface Fonts { roman: PDFFont; bold: PDFFont; italic: PDFFont; mono: PDFFont }
interface Run { text: string; font: PDFFont; size: number; color?: RGB; url?: string }

/** Characters WinAnsi can't encode get a plain fallback instead of crashing the build. */
const FALLBACK: Record<string, string> = {
  '≥': '>=', '≤': '<=', '≈': '~', '→': '->', '←': '<-', '−': '-', ' ': ' ', ' ': ' ', ' ': ' ',
};
function safe(text: string, font: PDFFont): string {
  const set = new Set(font.getCharacterSet());
  let out = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (set.has(cp)) out += ch;
    else if (FALLBACK[ch] && [...FALLBACK[ch]].every((c) => set.has(c.codePointAt(0)!))) out += FALLBACK[ch];
    else out += ch.normalize('NFD').replace(/[^\x20-\x7e]/g, '') || '?';
  }
  return out;
}

class Writer {
  page!: PDFPage;
  y = 0;
  pages = 0;
  /** Vertical density: every leading and gap is multiplied by `k`. */
  constructor(private doc: PDFDocument, private f: Fonts, private cv: Cv, readonly k: number) { this.newPage(); }

  newPage() {
    this.page = this.doc.addPage([PAGE_W, PAGE_H]);
    this.pages++;
    const top = PAGE_H - M_TOP + 14;
    this.spaced(this.cv.labels.header.toUpperCase(), M_X, top, this.f.mono, 6.5, MUTED, 0.8);
    if (this.pages > 1) {
      const n = String(this.pages);
      this.page.drawText(n, { x: PAGE_W - M_X - this.f.mono.widthOfTextAtSize(n, 6.5), y: top, size: 6.5, font: this.f.mono, color: MUTED });
    }
    this.y = PAGE_H - M_TOP;
  }

  ensure(h: number) { if (this.y - h < M_BOTTOM) this.newPage(); }

  /** Text with letter spacing, for the small Courier labels. Returns its width. */
  spaced(text: string, x: number, y: number, font: PDFFont, size: number, color: RGB, tracking: number): number {
    const t = safe(text, font);
    this.page.pushOperators(setCharacterSpacing(tracking));
    this.page.drawText(t, { x, y, size, font, color });
    this.page.pushOperators(setCharacterSpacing(0));
    return font.widthOfTextAtSize(t, size) + tracking * t.length;
  }

  link(url: string, x: number, y: number, w: number, h: number) {
    const ctx = this.doc.context;
    const annot = ctx.register(ctx.obj({
      Type: 'Annot', Subtype: 'Link', Rect: [x, y - h * 0.25, x + w, y + h * 0.85], Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) },
    }));
    const annots = this.page.node.lookup(PDFName.of('Annots'));
    if (annots instanceof PDFArray) annots.push(annot);
    else this.page.node.set(PDFName.of('Annots'), ctx.obj([annot]));
  }

  /**
   * Word-wraps mixed-style runs into `width`, starting at `x` (continuation lines at `indent`).
   * Consecutive words of the same style on a line are drawn as one string so text extracts cleanly.
   */
  rich(runs: Run[], opts: { x?: number; indent?: number; width?: number; lead: number }) {
    const x0 = opts.x ?? M_X;
    const ind = opts.indent ?? x0;
    const right = x0 + (opts.width ?? W - (x0 - M_X));
    // Tokens: one word each, `space` = a space follows it.
    type Tok = { word: string; run: Run; space: boolean };
    const toks: Tok[] = [];
    for (const r of runs) {
      for (const p of safe(r.text, r.font).split(/( +)/)) {
        if (p === '') continue;
        if (p.trim() === '') { if (toks.length) toks[toks.length - 1].space = true; continue; }
        toks.push({ word: p, run: r, space: false });
      }
    }
    const sp = (t: Tok) => t.run.font.widthOfTextAtSize(' ', t.run.size);
    const lines: Tok[][] = [];
    let line: Tok[] = [];
    let lx = x0;
    for (const t of toks) {
      const w = t.run.font.widthOfTextAtSize(t.word, t.run.size);
      if (line.length && lx + w > right) { lines.push(line); line = []; lx = ind; }
      line.push(t);
      lx += w + (t.space ? sp(t) : 0);
    }
    if (line.length) lines.push(line);

    lines.forEach((ln, i) => {
      this.ensure(opts.lead * this.k);
      this.y -= opts.lead * this.k;
      let x = i === 0 ? x0 : ind;
      let j = 0;
      while (j < ln.length) {
        // Same-style words on a line go out as one string, so the text extracts cleanly.
        const r = ln[j].run;
        let s = '';
        while (j < ln.length && ln[j].run === r) {
          s += ln[j].word + (ln[j].space && j < ln.length - 1 ? ' ' : '');
          j++;
        }
        const linked = s.trimEnd();
        this.page.drawText(s, { x, y: this.y, size: r.size, font: r.font, color: r.color ?? INK });
        if (r.url) this.link(r.url, x, this.y, r.font.widthOfTextAtSize(linked, r.size), r.size);
        x += r.font.widthOfTextAtSize(s, r.size);
      }
    });
  }

  /** Text on the right edge of the current baseline. */
  right(text: string, font: PDFFont, size: number, color: RGB = MUTED) {
    const t = safe(text, font);
    this.page.drawText(t, { x: PAGE_W - M_X - font.widthOfTextAtSize(t, size), y: this.y, size, font, color });
  }

  section(label: string) {
    this.ensure(40);
    this.y -= 15 * this.k;
    const w = this.spaced(label.toUpperCase(), M_X, this.y, this.f.mono, 7.5, ACCENT, 1.2);
    this.page.drawLine({ start: { x: M_X + w + 6, y: this.y + 2.6 }, end: { x: PAGE_W - M_X, y: this.y + 2.6 }, thickness: 0.4, color: ACCENT });
    this.y -= 2 * this.k;
  }

  gap(h: number) { this.y -= h * this.k; }
}

/** Renders at the loosest density that still fits on one page (two at most if nothing fits). */
export async function buildCvPdf(cv: Cv): Promise<Uint8Array> {
  let last: PDFDocument | undefined;
  for (const k of [1.2, 1.12, 1.06, 1, 0.95, 0.9]) {
    last = await render(cv, k);
    if (last.getPageCount() === 1) break;
  }
  return last!.save();
}

async function render(cv: Cv, k: number): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  const f: Fonts = {
    roman: await doc.embedFont(StandardFonts.TimesRoman),
    bold: await doc.embedFont(StandardFonts.TimesRomanBold),
    italic: await doc.embedFont(StandardFonts.TimesRomanItalic),
    mono: await doc.embedFont(StandardFonts.Courier),
  };
  const w = new Writer(doc, f, cv, k);
  const body = 9.6;
  const lead = 12.2;

  // Header ------------------------------------------------------------------
  w.page.drawLine({ start: { x: M_X, y: w.y + 6 }, end: { x: PAGE_W - M_X, y: w.y + 6 }, thickness: 0.6, color: ACCENT });
  w.rich([{ text: cv.name, font: f.bold, size: 21 }], { lead: 24 });
  w.rich([{ text: cv.positioning, font: f.italic, size: 10.5 }], { lead: 13.5 });
  w.gap(2);
  const sep: Run = { text: '  ·  ', font: f.roman, size: 9, color: MUTED };
  const contactRuns: Run[] = [{ text: cv.location, font: f.roman, size: 9, color: INK }];
  for (const c of cv.contact) contactRuns.push(sep, { text: c.text, font: f.roman, size: 9, color: INK, url: c.url });
  w.rich(contactRuns, { lead: 12 });

  // Experience --------------------------------------------------------------
  w.section(cv.labels.experience);
  for (const r of cv.experience) {
    w.ensure(lead * 3);
    w.rich([
      { text: r.title, font: f.bold, size: 10.2 },
      { text: `  ·  ${r.org}`, font: f.italic, size: 10 },
    ], { lead: lead + 1.5, width: W - 110 });
    w.right(r.when, f.roman, 9);
    for (const b of r.bullets) {
      w.rich([{ text: `•  ${b}`, font: f.roman, size: body }], { x: M_X + 6, indent: M_X + 15.5, width: W - 6, lead });
    }
    w.gap(2.5);
  }

  // Projects ----------------------------------------------------------------
  w.section(cv.labels.projects);
  for (const p of cv.projects) {
    w.ensure(lead * 3);
    // Meta sits on the right of the name when both fit, otherwise on its own line below.
    const fits = f.bold.widthOfTextAtSize(safe(p.name, f.bold), 10) + f.italic.widthOfTextAtSize(safe(p.meta, f.italic), 8.8) + 16 <= W;
    w.rich([{ text: p.name, font: f.bold, size: 10 }], { lead: lead + 1.5 });
    if (fits) w.right(p.meta, f.italic, 8.8);
    else w.rich([{ text: p.meta, font: f.italic, size: 8.8, color: MUTED }], { lead: 11 });
    const runs: Run[] = [{ text: p.text, font: f.roman, size: body }];
    if (p.link) runs.push({ text: ` ${p.link.text}`, font: f.mono, size: 7.4, color: MUTED, url: p.link.url });
    w.rich(runs, { lead });
    w.gap(2.5);
  }

  // Education ---------------------------------------------------------------
  w.section(cv.labels.education);
  for (const e of cv.education) {
    w.ensure(lead * 2);
    const runs: Run[] = [
      { text: e.degree, font: f.bold, size: 10 },
      { text: `, ${e.school}`, font: f.roman, size: body },
    ];
    w.rich(runs, { lead: lead + 1, width: W - 90 });
    w.right(e.when, f.roman, 9);
    if (e.detail) w.rich([{ text: e.detail, font: f.italic, size: 9 }], { lead: 11.2 });
  }

  // Certifications ----------------------------------------------------------
  w.section(cv.labels.certifications);
  for (const c of cv.certifications) {
    w.rich([{ text: c.text, font: f.roman, size: body }], { lead: lead + 0.6, width: W - 60 });
    if (c.when) w.right(c.when, f.roman, 9);
  }

  // Skills ------------------------------------------------------------------
  w.section(cv.labels.skills);
  for (const s of cv.skills) {
    w.rich([
      { text: `${s.group}:`, font: f.bold, size: body },
      { text: ` ${s.items}`, font: f.roman, size: body },
    ], { lead: lead + 0.6, indent: M_X + 10 });
  }

  w.rich([
    { text: `${cv.labels.languages}:`, font: f.bold, size: body },
    { text: ` ${cv.languages}`, font: f.roman, size: body },
  ], { lead: lead + 0.6, indent: M_X + 10 });

  // Footer on the last page.
  const ft = safe(cv.labels.footer, f.mono);
  w.page.drawText(ft, { x: M_X, y: M_BOTTOM - 20, size: 6.5, font: f.mono, color: MUTED });

  // Metadata ----------------------------------------------------------------
  doc.setTitle(cv.meta.title, { showInWindowTitleBar: true });
  doc.setAuthor(cv.name);
  doc.setSubject(cv.meta.subject);
  doc.setKeywords(cv.meta.keywords);
  doc.setLanguage(cv.meta.lang);
  doc.setCreator('Sergio González, Inc. — Annual Report 2026');
  doc.setProducer('pdf-lib');

  return doc;
}
