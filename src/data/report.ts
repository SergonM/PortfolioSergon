import type { Locale } from '../i18n/strings';

/** Footnote sources. IDs match the sections of profile.md. */
export type SourceId = 'EDU' | 'EXP-JNJ' | 'PRJ-NEO' | 'PRJ-OPI' | 'PRJ-MQ' | 'SEC';

export const sourceNames: Record<Locale, Record<SourceId, string>> = {
  en: {
    EDU: 'Universidad de los Andes transcript; UPM exchange 2025; UPenn IAPS 2025 (Banco Santander scholarship).',
    'EXP-JNJ': 'Johnson & Johnson Innovative Medicine, Health Care Compliance LAN internship, 2026. Public description only.',
    'PRJ-NEO': 'Neonatal health project, Uniandes. DANE birth records 2017–2022.',
    'PRJ-OPI': 'Opinion classification project, Uniandes 2024. Test set of 810 opinions.',
    'PRJ-MQ': 'ULatinhack 2024 results. Team of 3.',
    SEC: 'Coursera (Google Cybersecurity, 2024); TryHackMe (2025); Talento Tech Cloud Architecture Bootcamp (2024).',
  },
  es: {
    EDU: 'Historia académica de la Universidad de los Andes; intercambio UPM 2025; UPenn IAPS 2025 (beca Banco Santander).',
    'EXP-JNJ': 'Johnson & Johnson Innovative Medicine, práctica en Health Care Compliance LAN, 2026. Solo descripción pública.',
    'PRJ-NEO': 'Proyecto de salud neonatal, Uniandes. Registros de nacimientos del DANE 2017–2022.',
    'PRJ-OPI': 'Proyecto de clasificación de opiniones, Uniandes 2024. Conjunto de prueba de 810 opiniones.',
    'PRJ-MQ': 'Resultados de ULatinhack 2024. Equipo de 3.',
    SEC: 'Coursera (Google Cybersecurity, 2024); TryHackMe (2025); Bootcamp de Arquitectura en la Nube de Talento Tech (2024).',
  },
};

export interface Paragraph { text: string; jnj?: boolean }

/** Letter to shareholders. [n:ID] marks a footnote that cites a source ID. */
export const letter: Record<Locale, { kicker: string; title: string; salutation: string; body: Paragraph[]; sign: string[] }> = {
  en: {
    kicker: 'Section i',
    title: 'Letter to shareholders',
    salutation: 'Dear shareholders,',
    body: [
      { text: 'This company has one product, one employee and a GPA of 4.21 out of 5.00.[n:EDU] This report explains what that product did, what it can do for you, and, under risk factors, what it still cannot.' },
      { jnj: true, text: 'This year the product went to work. As a Health Care Compliance intern at Johnson & Johnson Innovative Medicine, it automated about 900 profile updates for healthcare professionals and cut processing time by 92 to 97 percent for the 70 colleagues involved.[n:EXP-JNJ] It also contributed to three AI agents and improved a deviation reporting app used across Latin America.' },
      { text: 'Before that, it studied in three countries: Colombia, Spain and the United States.[n:EDU] It engineered more than a million DANE birth records into a data warehouse to ask why some newborns in Colombia weigh too little,[n:PRJ-NEO] and it trained a classifier that sorts citizen opinions with 96.8 percent accuracy.[n:PRJ-OPI]' },
      { text: 'Its capstone, a forensic evidence system for Colombian banking, is where the three segments of this company meet: software that has to be correct, secure and defensible in front of an auditor.' },
      { text: 'We do not report figures we cannot source. Every number in this document carries a footnote, and the auditor’s report at the end invites you to test our controls yourself.' },
    ],
    sign: ['Sergio Andrés González Mateus', 'Founder, CEO and sole employee', 'Bogotá, 2,640 m above sea level'],
  },
  es: {
    kicker: 'Sección i',
    title: 'Carta a los accionistas',
    salutation: 'Señores accionistas:',
    body: [
      { text: 'Esta empresa tiene un producto, un empleado y un promedio de 4,21 sobre 5,00.[n:EDU] Este informe explica qué hizo ese producto, qué puede hacer por ustedes y, en los factores de riesgo, qué todavía no sabe hacer.' },
      { jnj: true, text: 'Este año el producto salió a trabajar. Como practicante de Health Care Compliance en Johnson & Johnson Innovative Medicine, automatizó cerca de 900 actualizaciones de perfiles de profesionales de la salud y redujo el tiempo de procesamiento entre 92 y 97 por ciento para los 70 colaboradores involucrados.[n:EXP-JNJ] También participó en tres agentes de IA y mejoró una app de reporte de desviaciones que se usa en toda Latinoamérica.' },
      { text: 'Antes de eso estudió en tres países: Colombia, España y Estados Unidos.[n:EDU] Convirtió más de un millón de registros de nacimientos del DANE en un data warehouse para preguntar por qué algunos recién nacidos en Colombia pesan demasiado poco,[n:PRJ-NEO] y entrenó un clasificador que ordena opiniones ciudadanas con 96,8 por ciento de exactitud.[n:PRJ-OPI]' },
      { text: 'Su proyecto de grado, un sistema de evidencia forense para la banca colombiana, es donde se cruzan los tres segmentos de esta empresa: software que tiene que ser correcto, seguro y defendible frente a un auditor.' },
      { text: 'No reportamos cifras que no podamos respaldar. Cada número de este documento lleva su nota al pie, y el informe del auditor, al final, los invita a poner a prueba nuestros controles.' },
    ],
    sign: ['Sergio Andrés González Mateus', 'Fundador, CEO y único empleado', 'Bogotá, a 2.640 m sobre el nivel del mar'],
  },
};

export interface Kpi {
  label: Record<Locale, string>;
  /** Final value used for the count-up. The rendered HTML always shows the final text. */
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: Record<Locale, string> | string;
  note?: Record<Locale, string>;
  source: SourceId;
  jnj?: boolean;
}

export const kpis: Kpi[] = [
  { jnj: true, label: { en: 'Processing time cut', es: 'Reducción del tiempo de proceso' }, value: 97, prefix: '92–', suffix: '%', note: { en: 'Profile-update workflow, Power Automate', es: 'Flujo de actualización de perfiles, Power Automate' }, source: 'EXP-JNJ' },
  { jnj: true, label: { en: 'Profile updates automated', es: 'Actualizaciones de perfiles automatizadas' }, value: 900, prefix: '~', source: 'EXP-JNJ' },
  { jnj: true, label: { en: 'Colleagues involved', es: 'Colaboradores involucrados' }, value: 70, source: 'EXP-JNJ' },
  { jnj: true, label: { en: 'AI agents contributed to', es: 'Agentes de IA en los que participó' }, value: 3, source: 'EXP-JNJ' },
  { label: { en: 'DANE birth records engineered', es: 'Registros de nacimientos del DANE procesados' }, value: 1, suffix: { en: 'M+', es: 'M+' }, note: { en: '2017–2022', es: '2017–2022' }, source: 'PRJ-NEO' },
  { label: { en: 'Classifier accuracy', es: 'Exactitud del clasificador' }, value: 96.8, decimals: 1, suffix: '%', note: { en: 'Macro F1 0.968 on 810 held-out opinions', es: 'F1 macro 0,968 en 810 opiniones de prueba' }, source: 'PRJ-OPI' },
  { label: { en: 'ULatinhack 2024 finish', es: 'Puesto en ULatinhack 2024' }, value: 3, suffix: { en: 'rd', es: '.º' }, note: { en: 'MediQuick, team of 3', es: 'MediQuick, equipo de 3' }, source: 'PRJ-MQ' },
  { label: { en: 'Cumulative GPA', es: 'Promedio acumulado' }, value: 4.21, decimals: 2, suffix: ' / 5.00', source: 'EDU' },
  { label: { en: 'Countries studied in', es: 'Países donde ha estudiado' }, value: 3, note: { en: 'Colombia, Spain, United States', es: 'Colombia, España, Estados Unidos' }, source: 'EDU' },
  { label: { en: 'Training hours, cloud and security', es: 'Horas de formación, nube y seguridad' }, value: 204, suffix: ' h', note: { en: '159 h cloud architecture + 45 h TryHackMe Cyber Security 101', es: '159 h de arquitectura en la nube + 45 h de TryHackMe Cyber Security 101' }, source: 'SEC' },
];

export function formatNumber(n: number, decimals: number, locale: Locale): string {
  return n.toLocaleString(locale === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function suffixFor(k: Kpi, locale: Locale): string {
  if (!k.suffix) return '';
  if (typeof k.suffix === 'string') return locale === 'es' ? k.suffix.replace('5.00', '5,00') : k.suffix;
  return k.suffix[locale];
}
