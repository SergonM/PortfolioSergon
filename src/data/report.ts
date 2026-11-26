import type { Locale } from '../i18n/strings';

/** Footnote sources. IDs match the sections of profile.md. */
export type SourceId = 'EDU' | 'EXP-JNJ' | 'EXP-TESS' | 'PRJ-NEO' | 'PRJ-OPI' | 'PRJ-MQ' | 'SEC';

export const sourceNames: Record<Locale, Record<SourceId, string>> = {
  en: {
    EDU: 'Universidad de los Andes transcript; UPM exchange 2025; UPenn IAPS 2025 (Banco Santander scholarship).',
    'EXP-JNJ': 'Johnson & Johnson Innovative Medicine, Health Care Compliance LAN internship, 2026. Public description only.',
    'PRJ-NEO': 'Neonatal health project, Uniandes, Nov 2024; team of 3. DANE birth records for 2017, 2018, 2021 and 2022.',
    'PRJ-OPI': 'Opinion classification project, Uniandes 2024. Test set of 810 opinions.',
    'PRJ-MQ': 'ULatinhack 2024 results. Team of 3.',
    SEC: 'Coursera (Google Cybersecurity, 2024); TryHackMe (2025); Talento Tech Cloud Architecture Bootcamp (2024).',
    'EXP-TESS': 'Tess Adviser, web developer, Feb–Dec 2024.',
  },
  es: {
    EDU: 'Historia académica de la Universidad de los Andes; intercambio UPM 2025; UPenn IAPS 2025 (beca Banco Santander).',
    'EXP-JNJ': 'Johnson & Johnson Innovative Medicine, práctica en Health Care Compliance LAN, 2026. Solo descripción pública.',
    'PRJ-NEO': 'Proyecto de salud neonatal, Uniandes, nov 2024; equipo de 3. Registros de nacimientos del DANE de 2017, 2018, 2021 y 2022.',
    'PRJ-OPI': 'Proyecto de clasificación de opiniones, Uniandes 2024. Conjunto de prueba de 810 opiniones.',
    'PRJ-MQ': 'Resultados de ULatinhack 2024. Equipo de 3.',
    SEC: 'Coursera (Google Cybersecurity, 2024); TryHackMe (2025); Bootcamp de Arquitectura en la Nube de Talento Tech (2024).',
    'EXP-TESS': 'Tess Adviser, desarrollador web, feb–dic 2024.',
  },
};

export interface Paragraph { text: string; jnj?: boolean }

/** Letter to shareholders. [n:ID] marks a footnote; ==text== is passed over with the highlighter. */
export const letter: Record<Locale, { kicker: string; title: string; salutation: string; body: Paragraph[]; sign: string[]; ps: string; pull: string; letterhead: string[]; sigLabel: string }> = {
  en: {
    kicker: 'Section i',
    title: 'Letter to shareholders',
    salutation: 'Dear shareholders,',
    body: [
      { text: 'This company has ==one product, one employee== and a 4.21 average out of 5.[n:EDU] The employee is me. This report covers what I have built so far, what I could build for you, and, in the risk factors, what I can’t do yet.' },
      { jnj: true, text: 'This year I went to work for real. As a Health Care Compliance intern at Johnson & Johnson Innovative Medicine I automated about 900 profile updates for healthcare professionals, and the 70 colleagues who used to do them by hand now spend 92 to 97 percent less time on each one.[n:EXP-JNJ] I also helped build three AI agents and improved a deviation reporting app used across Latin America.' },
      { text: 'I have studied in three countries: Colombia, Spain and the United States.[n:EDU] Along the way, always in teams of three, I turned more than a million DANE birth records into a data warehouse to understand why some babies in Colombia are born underweight,[n:PRJ-NEO] and trained a model that puts citizen opinions in the right topic ==97 times out of 100==.[n:PRJ-OPI]' },
      { text: 'My capstone, ==a forensic evidence system== for Colombian banking, is where everything I care about meets: software that has to work, has to be secure, and has to hold up when an auditor starts asking questions.' },
      { text: 'One rule for this report: ==no number I can’t back up==. Each one has a footnote, and the auditor’s report at the end invites you to try to break the site yourself.' },
    ],
    sign: ['Sergio Andrés González Mateus', 'Founder, CEO and sole employee', 'Bogotá, 2,640 m above sea level'],
    ps: 'P.S. Under ultraviolet light the cover says more. Try it.',
    pull: 'No number I can’t back up.',
    letterhead: ['From the desk of the CEO', 'Sergio González, Inc.', 'Bogotá, Colombia', 'Re: Annual Report 2026'],
    sigLabel: 'Signature of Sergio González',
  },
  es: {
    kicker: 'Sección i',
    title: 'Carta a los accionistas',
    salutation: 'Señores accionistas:',
    body: [
      { text: 'Esta empresa tiene ==un producto, un empleado== y un promedio de 4,21 sobre 5.[n:EDU] El empleado soy yo. Este informe cuenta lo que he construido hasta ahora, lo que podría construir para ustedes y, en los factores de riesgo, lo que todavía no sé hacer.' },
      { jnj: true, text: 'Este año empecé a trabajar en serio. Como practicante de Health Care Compliance en Johnson & Johnson Innovative Medicine automaticé cerca de 900 actualizaciones de perfiles de profesionales de la salud, y los 70 colegas que antes las hacían a mano ahora gastan entre 92 y 97 por ciento menos tiempo en cada una.[n:EXP-JNJ] También ayudé a construir tres agentes de IA y mejoré una app de reporte de desviaciones que se usa en toda Latinoamérica.' },
      { text: 'He estudiado en tres países: Colombia, España y Estados Unidos.[n:EDU] En el camino, siempre en equipos de tres, convertí más de un millón de registros de nacimientos del DANE en un data warehouse para entender por qué algunos bebés en Colombia nacen con bajo peso,[n:PRJ-NEO] y entrené un modelo que pone las opiniones ciudadanas en el tema correcto ==97 de cada 100 veces==.[n:PRJ-OPI]' },
      { text: 'Mi proyecto de grado, ==un sistema de evidencia forense== para la banca colombiana, es donde se junta todo lo que me importa: software que tiene que funcionar, tiene que ser seguro y tiene que aguantar cuando un auditor empieza a hacer preguntas.' },
      { text: 'Una regla para este informe: ==ninguna cifra sin respaldo==. Cada una tiene su nota al pie, y el informe del auditor, al final, los invita a intentar romper el sitio ustedes mismos.' },
    ],
    sign: ['Sergio Andrés González Mateus', 'Fundador, CEO y único empleado', 'Bogotá, a 2.640 m sobre el nivel del mar'],
    ps: 'P.D. Bajo luz ultravioleta, la portada dice más. Pruébenlo.',
    pull: 'Ninguna cifra sin respaldo.',
    letterhead: ['Del escritorio del CEO', 'Sergio González, Inc.', 'Bogotá, Colombia', 'Ref.: Informe Anual 2026'],
    sigLabel: 'Firma de Sergio González',
  },
};

export interface Kpi {
  /** Big figure; counts up from 0 to `value`. The HTML always ships the final text. */
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: Record<Locale, string>;
  /** Plain-language line a recruiter understands in one read. */
  label: Record<Locale, string>;
  /** Technical detail, small print. */
  note?: Record<Locale, string>;
  source: SourceId;
  jnj?: boolean;
}

const same = (v: string) => ({ en: v, es: v });

export const kpis: Kpi[] = [
  { jnj: true, value: 97, prefix: '92–', suffix: same('%'), label: { en: 'less time to update a healthcare professional’s profile', es: 'menos tiempo para actualizar el perfil de un profesional de la salud' }, note: { en: '~900 updates automated with Power Automate; 70 colleagues involved', es: '~900 actualizaciones automatizadas con Power Automate; 70 colaboradores involucrados' }, source: 'EXP-JNJ' },
  { jnj: true, value: 3, label: { en: 'AI agents he helped build for a compliance team', es: 'agentes de IA que ayudó a construir para un equipo de compliance' }, note: { en: 'Copilot Studio, SharePoint, generative AI', es: 'Copilot Studio, SharePoint, IA generativa' }, source: 'EXP-JNJ' },
  { value: 97, suffix: { en: ' of 100', es: ' de 100' }, label: { en: 'citizen opinions his model puts in the right topic', es: 'opiniones ciudadanas que su modelo pone en el tema correcto' }, note: { en: '96.8% accuracy, macro F1 0.968, on 810 held-out opinions; Random Forest + TF-IDF', es: '96,8 % de exactitud y F1 macro de 0,968 en 810 opiniones de prueba; Random Forest + TF-IDF' }, source: 'PRJ-OPI' },
  { value: 1, prefix: '', suffix: same('M+'), label: { en: 'birth records he dug through to understand why some babies are born underweight', es: 'registros de nacimientos que revisó para entender por qué algunos bebés nacen con bajo peso' }, note: { en: 'DANE 2017, 2018, 2021 and 2022; ETL, data warehouse, Power BI; team of 3', es: 'DANE 2017, 2018, 2021 y 2022; ETL, data warehouse, Power BI; equipo de 3' }, source: 'PRJ-NEO' },
  { value: 3, suffix: { en: 'rd', es: '.er' }, label: { en: 'place at ULatinhack 2024, with an AI that sums up a patient’s history for the doctor', es: 'puesto en ULatinhack 2024, con una IA que le resume al médico la historia del paciente' }, note: { en: 'MediQuick; team of 3; Django REST + GPT-3.5 via the OpenAI API', es: 'MediQuick; equipo de 3; Django REST + GPT-3.5 vía la API de OpenAI' }, source: 'PRJ-MQ' },
  { value: 4.21, decimals: 2, suffix: { en: ' / 5', es: ' / 5' }, label: { en: 'university average in Systems and Computing Engineering', es: 'promedio en Ingeniería de Sistemas y Computación' }, note: { en: 'Universidad de los Andes', es: 'Universidad de los Andes' }, source: 'EDU' },
  { value: 3, label: { en: 'countries he has studied in', es: 'países donde ha estudiado' }, note: { en: 'Colombia, Spain (UPM), United States (UPenn, Banco Santander scholarship)', es: 'Colombia, España (UPM), Estados Unidos (UPenn, beca Banco Santander)' }, source: 'EDU' },
  { value: 204, suffix: same(' h'), label: { en: 'of hands-on cloud and security training', es: 'de formación práctica en nube y seguridad' }, note: { en: '159 h cloud architecture bootcamp + 45 h TryHackMe Cyber Security 101', es: '159 h de bootcamp de arquitectura en la nube + 45 h de TryHackMe Cyber Security 101' }, source: 'SEC' },
];

export interface Milestone { when: Record<Locale, string>; year: number; title: Record<Locale, string>; body: Record<Locale, string>; source: SourceId | 'EXP-TESS'; jnj?: boolean }

export const milestones: Milestone[] = [
  { year: 2022, when: same('2022'), title: { en: 'Enters Systems Engineering at Uniandes', es: 'Entra a Ingeniería de Sistemas en Uniandes' }, body: { en: 'Today his average is 4.21 out of 5.', es: 'Hoy su promedio es 4,21 sobre 5.' }, source: 'EDU' },
  { year: 2024, when: { en: 'Feb 2024', es: 'Feb 2024' }, title: { en: 'First job: web developer at Tess Adviser', es: 'Primer trabajo: desarrollador web en Tess Adviser' }, body: { en: 'Client sites with payments, forms and analytics, configured with privacy in mind.', es: 'Sitios para clientes con pagos, formularios y analítica, configurados pensando en la privacidad.' }, source: 'EXP-TESS' },
  { year: 2024, when: same('2024'), title: { en: 'Google Cybersecurity Certificate', es: 'Certificado de Ciberseguridad de Google' }, body: { en: 'The moment security stops being a hobby.', es: 'El momento en que la seguridad deja de ser un pasatiempo.' }, source: 'SEC' },
  { year: 2024, when: same('2024'), title: { en: '3rd place at ULatinhack', es: 'Tercer puesto en ULatinhack' }, body: { en: 'Three of us build MediQuick in a weekend: it reads a patient’s exams and gives the oncologist a one-page summary.', es: 'Entre tres armamos MediQuick en un fin de semana: lee los exámenes de un paciente y le entrega al oncólogo un resumen de una página.' }, source: 'PRJ-MQ' },
  { year: 2024, when: same('2024'), title: { en: 'A model that gets 97 of 100 opinions right', es: 'Un modelo que acierta 97 de cada 100 opiniones' }, body: { en: 'With two classmates, sorts 4,049 citizen opinions into health, education or gender equality.', es: 'Con dos compañeros, clasifica 4.049 opiniones ciudadanas en salud, educación o igualdad de género.' }, source: 'PRJ-OPI' },
  { year: 2024, when: { en: 'Nov 2024', es: 'Nov 2024' }, title: { en: 'Four years of births in one warehouse', es: 'Cuatro años de nacimientos en una bodega' }, body: { en: 'With two classmates, finds that a mother’s schooling and where she lives change the odds of low birth weight.', es: 'Con dos compañeros encuentra que los estudios de la madre y dónde vive cambian el riesgo de bajo peso al nacer.' }, source: 'PRJ-NEO' },
  { year: 2024, when: same('2024'), title: { en: '159 hours of cloud architecture', es: '159 horas de arquitectura en la nube' }, body: { en: 'Talento Tech bootcamp, intermediate level.', es: 'Bootcamp de Talento Tech, nivel intermedio.' }, source: 'SEC' },
  { year: 2025, when: { en: 'Feb 2025', es: 'Feb 2025' }, title: { en: 'Exchange at Universidad Politécnica de Madrid', es: 'Intercambio en la Universidad Politécnica de Madrid' }, body: { en: 'Networks, computational photography, data warehouses and, with two classmates, a knowledge graph built from scientific papers.', es: 'Redes, fotografía computacional, data warehouses y, con dos compañeros, un grafo de conocimiento hecho a partir de artículos científicos.' }, source: 'EDU' },
  { year: 2025, when: { en: 'Summer 2025', es: 'Verano 2025' }, title: { en: 'UPenn, on a Banco Santander scholarship', es: 'UPenn, con beca del Banco Santander' }, body: { en: 'Professional English, leadership and innovation. Third country he studies in.', es: 'Inglés profesional, liderazgo e innovación. Tercer país en el que estudia.' }, source: 'EDU' },
  { year: 2025, when: same('2025'), title: { en: '52 hours of security labs on TryHackMe', es: '52 horas de laboratorios de seguridad en TryHackMe' }, body: { en: 'Pre Security and Cyber Security 101.', es: 'Pre Security y Cyber Security 101.' }, source: 'SEC' },
  { jnj: true, year: 2026, when: { en: 'Jan 2026', es: 'Ene 2026' }, title: { en: 'Joins Johnson & Johnson Innovative Medicine', es: 'Entra a Johnson & Johnson Innovative Medicine' }, body: { en: 'Health Care Compliance intern for Latin America: automation and AI agents.', es: 'Practicante de Health Care Compliance para Latinoamérica: automatización y agentes de IA.' }, source: 'EXP-JNJ' },
];

export function formatNumber(n: number, decimals: number, locale: Locale): string {
  return n.toLocaleString(locale === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function suffixFor(k: Kpi, locale: Locale): string {
  return k.suffix ? k.suffix[locale] : '';
}
