import type { Locale } from '../i18n/strings';
import { contact } from './contact';

/**
 * Section v. Source: profile.md [RISK], Sergio's own list, set in a dry tone.
 * No figure appears here that is not already footnoted elsewhere in the report.
 */
export interface Risk { title: string; body: string; mitigation: string; link?: { href: string; text: string } }

export const risks: Record<Locale, { kicker: string; title: string; lede: string; mit: string; items: Risk[]; closing: string }> = {
  en: {
    kicker: 'Section v',
    title: 'Risk factors',
    lede: 'Every annual report has to list what could go wrong. This one was written by the CEO, who is also the risk.',
    mit: 'Mitigation',
    items: [
      {
        title: 'None of my models has met production yet.',
        body: 'They live in notebooks and university APIs. No monitoring, no retraining, no pager at 3 a.m. Investors should assume MLOps will be learned on the job.',
        mitigation: 'The smallest possible step is already live: the investigation’s simulator runs a trained model in every visitor’s browser.',
      },
      {
        title: 'Every system I have broken into was built to be broken into.',
        body: 'My offensive security comes from labs, not from real engagements. I have lab hours, not pentest reports.',
        mitigation: '52 hours on TryHackMe, and a site that hides a capture-the-flag for you to break. See the auditor’s report.',
      },
      {
        title: 'English is my second language.',
        body: 'Professional B2, not native. Expect the odd preposition in the wrong place, though few made it into this report.',
        mitigation: 'A summer at the University of Pennsylvania on a scholarship, studying in English. This report defaults to English.',
      },
      {
        title: 'No full-time track record.',
        body: 'An internship, eleven months building websites for clients and a lot of university teams of three. Nobody has seen me in month eighteen of anything yet.',
        mitigation: 'Every team project in this report says how big the team was, so you can judge what I did with others.',
      },
      {
        title: 'Little public code of my own.',
        body: 'Most of my repositories are team or course work, and some live on classmates’ accounts.',
        mitigation: 'This report is open source. Every line of it is on GitHub.',
        link: { href: contact.repo, text: 'github.com/SergonM/PortfolioSergon' },
      },
    ],
    closing: 'Forward-looking statements: none. The CEO prefers to report what already happened.',
  },
  es: {
    kicker: 'Sección v',
    title: 'Factores de riesgo',
    lede: 'Todo informe anual tiene que decir qué podría salir mal. Este lo escribió el CEO, que también es el riesgo.',
    mit: 'Mitigación',
    items: [
      {
        title: 'Ninguno de mis modelos ha llegado a producción.',
        body: 'Viven en notebooks y en APIs universitarias. Sin monitoreo, sin reentrenamiento, sin alertas a las 3 a. m. Los inversionistas deben asumir que MLOps se aprende en el trabajo.',
        mitigation: 'El paso más pequeño posible ya está en vivo: el simulador de la investigación corre un modelo entrenado en el navegador de cada visitante.',
      },
      {
        title: 'Todos los sistemas que he vulnerado estaban hechos para eso.',
        body: 'Mi seguridad ofensiva viene de laboratorios, no de encargos reales. Tengo horas de laboratorio, no informes de pentesting.',
        mitigation: '52 horas en TryHackMe, y un sitio que esconde un capture-the-flag para que lo rompas. Ver el informe del auditor.',
      },
      {
        title: 'El inglés es mi segundo idioma.',
        body: 'B2 profesional, no nativo. Puede que alguna preposición quede donde no va, aunque pocas llegaron a este informe.',
        mitigation: 'Un verano en la Universidad de Pensilvania con beca, estudiando en inglés. Este informe sale primero en inglés.',
      },
      {
        title: 'Sin trayectoria de tiempo completo.',
        body: 'Una práctica, once meses haciendo sitios web para clientes y muchos equipos universitarios de tres. Nadie me ha visto todavía en el mes dieciocho de nada.',
        mitigation: 'Cada proyecto en equipo de este informe dice de cuántas personas era el equipo, para que puedas juzgar lo que hice con otros.',
      },
      {
        title: 'Poco código público propio.',
        body: 'La mayoría de mis repositorios son trabajos en equipo o de curso, y algunos viven en las cuentas de mis compañeros.',
        mitigation: 'Este informe es de código abierto. Cada línea está en GitHub.',
        link: { href: contact.repo, text: 'github.com/SergonM/PortfolioSergon' },
      },
    ],
    closing: 'Declaraciones sobre el futuro: ninguna. El CEO prefiere reportar lo que ya pasó.',
  },
};
