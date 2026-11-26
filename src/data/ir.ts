import type { Locale } from '../i18n/strings';

/** Section vii copy. Facts from profile.md [ID], [EDU] and [IR]. */
export const ir: Record<Locale, {
  kicker: string; title: string; lede: string; cv: string; cvMeta: string; cvOther: string; cvOtherLink: string;
  email: string; factsTitle: string; facts: [string, string][];
}> = {
  en: {
    kicker: 'Section vii',
    title: 'Investor relations',
    lede: 'Interviews, questions and offers go here. The CV is one page and says nothing this report doesn’t.',
    cv: 'Download the CV',
    cvMeta: 'PDF · English · built from this report’s data',
    cvOther: 'Spanish CV',
    cvOtherLink: 'Hoja de vida en español (PDF)',
    email: 'Email',
    factsTitle: 'Shareholder information',
    facts: [
      ['Ticker', 'SGM'],
      ['Seeking', 'AI & ML · Security · Business & Compliance'],
      ['Headquarters', 'Bogotá, Colombia · 2,640 m'],
      ['Listed', '2022, Universidad de los Andes'],
      ['Languages', 'Spanish (native) · English (professional)'],
      ['Dividend policy', 'Everything is reinvested in learning'],
    ],
  },
  es: {
    kicker: 'Sección vii',
    title: 'Relación con inversionistas',
    lede: 'Entrevistas, preguntas y ofertas, por aquí. La hoja de vida es de una página y no dice nada que este informe no diga.',
    cv: 'Descargar la hoja de vida',
    cvMeta: 'PDF · español · hecha con los datos de este informe',
    cvOther: 'CV en inglés',
    cvOtherLink: 'CV in English (PDF)',
    email: 'Correo',
    factsTitle: 'Información para accionistas',
    facts: [
      ['Símbolo', 'SGM'],
      ['Busca', 'IA y ML · Seguridad · Negocio y Compliance'],
      ['Sede', 'Bogotá, Colombia · 2.640 m'],
      ['En bolsa desde', '2022, Universidad de los Andes'],
      ['Idiomas', 'Español (nativo) · inglés (profesional)'],
      ['Política de dividendos', 'Todo se reinvierte en aprender'],
    ],
  },
};
