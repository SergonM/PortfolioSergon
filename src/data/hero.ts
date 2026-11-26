import type { Locale } from '../i18n/strings';

/** A memo line. Text between [[ ]] is redacted until the reader declassifies it. */
export interface MemoLine { text: Record<Locale, string>; jnj?: boolean }

export const memo: MemoLine[] = [
  { jnj: true, text: { en: 'Subject built [[AI agents for the compliance team]] of a global pharmaceutical company.', es: 'El sujeto construyó [[agentes de IA para el equipo de compliance]] de una farmacéutica global.' } },
  { jnj: true, text: { en: 'Subject cut the time of a 900-update process by [[92 to 97 percent]].', es: 'El sujeto redujo el tiempo de un proceso de 900 actualizaciones entre [[92 y 97 por ciento]].' } },
  { text: { en: 'Subject trained a model that sorts citizen opinions correctly [[97 times out of 100]].', es: 'El sujeto entrenó un modelo que clasifica bien opiniones ciudadanas [[97 de cada 100 veces]].' } },
  { text: { en: 'Subject turned [[over a million birth records]] into answers about underweight newborns.', es: 'El sujeto convirtió [[más de un millón de nacimientos]] en respuestas sobre el bajo peso al nacer.' } },
  { text: { en: 'Subject is building [[a forensic evidence system for banks]], where every file can prove it was never altered.', es: 'El sujeto construye [[un sistema de evidencia forense para bancos]], donde cada archivo puede probar que nadie lo alteró.' } },
  { text: { en: 'Recommended action: [[schedule an interview]].', es: 'Acción recomendada: [[agendar una entrevista]].' } },
];

export const hero = {
  en: {
    deskLabel: 'Sergio González, Inc. · Annual Report 2026',
    claim: 'An engineer who builds AI and understands compliance, risk and business.',
    sealTop: 'Audited', sealBottom: 'by the reader',
    memoKicker: 'Executive summary',
    memoFile: 'File SGM-2026-0001',
    memoSubject: 'Subject: S. González',
    stampBefore: 'Confidential', stampAfter: 'Cleared for hire',
    howCover: 'Move the UV lamp over the cover to verify it.',
    howCoverTouch: 'Scroll to sweep the UV lamp, or hold it.',
    howMemo: 'Tap the black bars to declassify.',
    declassifyAll: 'Declassify all',
    holdLamp: 'Hold the lamp', releaseLamp: 'Release the lamp',
    progress: '{n} of {t} declassified',
    uvTitle: 'Verified. Every figure in this report carries a footnote.',
    uvGpa: 'university average, Uniandes',
    uvOpinions: 'opinions his model sorts right',
    uvRecords: 'birth records turned into answers',
    uvHack: 'hackathon, AI that drafts medical reports',
    uvNote: 'Auditor’s note: flag 1 of 3 starts in the page source.',
  },
  es: {
    deskLabel: 'Sergio González, Inc. · Informe Anual 2026',
    claim: 'Ingeniero que construye IA y entiende compliance, riesgo y negocio.',
    sealTop: 'Auditado', sealBottom: 'por quien lee',
    memoKicker: 'Resumen ejecutivo',
    memoFile: 'Expediente SGM-2026-0001',
    memoSubject: 'Sujeto: S. González',
    stampBefore: 'Confidencial', stampAfter: 'Apto para contratar',
    howCover: 'Pasa la lámpara UV sobre la portada para verificarla.',
    howCoverTouch: 'Haz scroll para pasar la lámpara UV, o sostenla.',
    howMemo: 'Toca las franjas negras para desclasificar.',
    declassifyAll: 'Desclasificar todo',
    holdLamp: 'Sostener la lámpara', releaseLamp: 'Soltar la lámpara',
    progress: '{n} de {t} desclasificadas',
    uvTitle: 'Verificado. Cada cifra de este informe lleva su nota al pie.',
    uvGpa: 'promedio universitario, Uniandes',
    uvOpinions: 'opiniones que su modelo clasifica bien',
    uvRecords: 'nacimientos convertidos en respuestas',
    uvHack: 'hackathon, IA que redacta informes médicos',
    uvNote: 'Nota del auditor: la bandera 1 de 3 empieza en el código fuente.',
  },
} as const;
