import type { Locale } from './strings';

/**
 * The report's "chrome": running head, folio counter, index sheet and reading cursor.
 * Sections are listed in reading order. An entry whose id is not on the page yet shows
 * as "at the printer" in the index, so new sections light up as soon as they ship.
 */
export interface ChromeEntry { id: string; folio: string; title: Record<Locale, string>; short: Record<Locale, string> }

export const chromeEntries: ChromeEntry[] = [
  { id: 'contents', folio: '·', title: { en: 'Contents', es: 'Contenido' }, short: { en: 'Contents', es: 'Contenido' } },
  { id: 'letter', folio: 'i', title: { en: 'Letter to shareholders', es: 'Carta a los accionistas' }, short: { en: 'Letter', es: 'Carta' } },
  { id: 'highlights', folio: 'ii', title: { en: 'Highlights', es: 'Cifras destacadas' }, short: { en: 'Highlights', es: 'Cifras' } },
  { id: 'segments', folio: 'iii', title: { en: 'Segments: AI & ML · Security · Business & Compliance', es: 'Segmentos: IA y ML · Seguridad · Negocio y Compliance' }, short: { en: 'Segments', es: 'Segmentos' } },
  { id: 'investigation', folio: 'iv', title: { en: 'Featured investigation', es: 'Investigación destacada' }, short: { en: 'Investigation', es: 'Investigación' } },
  { id: 'simulator', folio: 'iv·b', title: { en: 'What if…? The model, live', es: '¿Y si…? El modelo, en vivo' }, short: { en: 'What if…?', es: '¿Y si…?' } },
  { id: 'brief', folio: 'iv·c', title: { en: 'What an EPS or the Ministry could do with this', es: 'Qué haría una EPS o MinSalud con esto' }, short: { en: 'The brief', es: 'El cierre' } },
  { id: 'risk-factors', folio: 'v', title: { en: 'Risk factors', es: 'Factores de riesgo' }, short: { en: 'Risk factors', es: 'Riesgos' } },
  { id: 'auditor', folio: 'vi', title: { en: "Auditor's report", es: 'Informe del auditor' }, short: { en: 'Auditor', es: 'Auditor' } },
  { id: 'investor-relations', folio: 'vii', title: { en: 'Investor relations', es: 'Relación con inversionistas' }, short: { en: 'Investors', es: 'Inversionistas' } },
];

export const chrome = {
  en: {
    head: 'Sergio González, Inc. · Annual Report 2026',
    headShort: 'SGM · AR 26',
    page: 'p.',
    pageOf: 'Page {p} of {t}',
    index: 'Index',
    cv: 'CV',
    openIndex: 'Open the index',
    close: 'Close',
    indexTitle: 'Index',
    indexLede: 'Every section of this report, the page it starts on, and how much of it you have read. Pick one and the report turns to it.',
    read: 'Read',
    here: 'You are here',
    printer: 'At the printer',
    unread: 'Not yet read',
    progressOf: '{n}% read',
    cover: 'Back to the cover',
    otherLang: 'Leer en español',
    shortcut: 'Press I anywhere to open this index.',
    readSoFar: 'Read so far',
    cursorOpen: 'Open',
    cursorExt: 'Visit',
    cursorPress: 'Press',
    cursorPick: 'Pick',
  },
  es: {
    head: 'Sergio González, Inc. · Informe Anual 2026',
    headShort: 'SGM · IA 26',
    page: 'p.',
    pageOf: 'Página {p} de {t}',
    index: 'Índice',
    cv: 'CV',
    openIndex: 'Abrir el índice',
    close: 'Cerrar',
    indexTitle: 'Índice',
    indexLede: 'Cada sección del informe, la página donde empieza y cuánto llevas leído. Elige una y el informe pasa la página hasta allí.',
    read: 'Leído',
    here: 'Estás aquí',
    printer: 'En imprenta',
    unread: 'Sin leer',
    progressOf: '{n}% leído',
    cover: 'Volver a la portada',
    otherLang: 'Read in English',
    shortcut: 'Pulsa I en cualquier momento para abrir este índice.',
    readSoFar: 'Leído hasta ahora',
    cursorOpen: 'Abrir',
    cursorExt: 'Visitar',
    cursorPress: 'Pulsar',
    cursorPick: 'Elegir',
  },
} as const;
