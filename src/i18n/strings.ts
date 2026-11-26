export type Locale = 'en' | 'es';

export const strings = {
  en: {
    htmlTitle: 'Sergio González, Inc. — Annual Report 2026',
    description:
      'The annual report of a company whose product is one engineer, who builds AI and understands compliance, risk and business.',
    company: 'Sergio González, Inc.',
    report: 'Annual Report 2026',
    tagline: 'An engineer who builds AI and understands compliance, risk and business.',
    seal: 'Audited',
    contents: 'Contents',
    inPrep: 'In preparation',
    sections: [
      'Letter to shareholders',
      'Highlights',
      'Segments: AI & ML · Security · Business & Compliance',
      'Featured investigation',
      'Risk factors',
      "Auditor's report",
      'Investor relations',
    ],
    notice:
      'This edition is being typeset. Sections appear here as they clear review.',
    switchLabel: 'Leer en español',
    reportedFrom: 'Reported from Bogotá, 2,640 m above sea level',
    skip: 'Skip to contents',
  },
  es: {
    htmlTitle: 'Sergio González, Inc. — Informe Anual 2026',
    description:
      'El informe anual de una empresa cuyo producto es un ingeniero que construye IA y entiende compliance, riesgo y negocio.',
    company: 'Sergio González, Inc.',
    report: 'Informe Anual 2026',
    tagline: 'Ingeniero que construye IA y entiende compliance, riesgo y negocio.',
    seal: 'Auditado',
    contents: 'Contenido',
    inPrep: 'En preparación',
    sections: [
      'Carta a los accionistas',
      'Cifras destacadas',
      'Segmentos: IA y ML · Seguridad · Negocio y Compliance',
      'Investigación destacada',
      'Factores de riesgo',
      'Informe del auditor',
      'Relación con inversionistas',
    ],
    notice: 'Esta edición está en composición. Las secciones aparecen aquí a medida que pasan revisión.',
    switchLabel: 'Read in English',
    reportedFrom: 'Reportado desde Bogotá, a 2.640 m sobre el nivel del mar',
    skip: 'Saltar al contenido',
  },
} as const;
