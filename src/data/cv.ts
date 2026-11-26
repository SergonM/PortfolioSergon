import type { Locale } from '../i18n/strings';
import { JNJ_PUBLIC } from './disclosure';
import { kpis, formatNumber } from './report';
import { cases } from './segments';

/**
 * Structured content for the downloadable CV (src/pages/cv/[file].ts).
 * Every fact comes from profile.md, report.ts or segments.ts. Nothing here is new.
 * Items marked `jnj` render only when JNJ_PUBLIC is true (see disclosure.ts).
 */

export interface CvLink { text: string; url: string }

export interface CvRole {
  title: string;
  org: string;
  place?: string;
  when: string;
  bullets: string[];
  jnj?: boolean;
}

export interface CvProject {
  name: string;
  /** Short context: where, when, team. */
  meta: string;
  text: string;
  link?: CvLink;
}

export interface CvEducation { degree: string; school: string; when: string; detail?: string }
export interface CvLine { text: string; when?: string }
export interface CvSkillGroup { group: string; items: string; jnj?: boolean }

export interface Cv {
  name: string;
  positioning: string;
  location: string;
  contact: CvLink[];
  labels: {
    header: string;
    experience: string;
    projects: string;
    education: string;
    certifications: string;
    skills: string;
    languages: string;
    footer: string;
  };
  experience: CvRole[];
  projects: CvProject[];
  education: CvEducation[];
  certifications: CvLine[];
  skills: CvSkillGroup[];
  languages: string;
  meta: { title: string; subject: string; keywords: string[]; lang: string };
}

const SITE = 'sergonm.github.io/PortfolioSergon';

const contact: CvLink[] = [
  { text: 'sergioag_2005@yahoo.com', url: 'mailto:sergioag_2005@yahoo.com' },
  { text: 'linkedin.com/in/sergonm', url: 'https://www.linkedin.com/in/sergonm' },
  { text: 'github.com/SergonM', url: 'https://github.com/SergonM' },
  { text: SITE, url: `https://${SITE}/` },
];

const caseLink = (id: string): CvLink | undefined => {
  const url = cases.find((c) => c.id === id)?.link;
  return url ? { text: url.replace(/^https?:\/\//, ''), url } : undefined;
};

// Figures reused from report.ts so the CV and the site can't drift apart.
const gpa = (l: Locale) => formatNumber(kpis.find((k) => k.source === 'EDU' && k.decimals === 2)?.value ?? 4.21, 2, l);

const data: Record<Locale, Cv> = {
  en: {
    name: 'Sergio Andrés González Mateus',
    positioning: 'Engineer who builds AI and understands compliance, risk and business. Seeking roles in AI & ML, Security, and Business & Compliance.',
    location: 'Bogotá, Colombia',
    contact,
    labels: {
      header: 'Sergio González, Inc. · Annual Report 2026 · CV',
      experience: 'Experience',
      projects: 'Selected projects',
      education: 'Education',
      certifications: 'Certifications & training',
      skills: 'Skills & languages',
      languages: 'Languages',
      footer: `Every figure here is sourced in the full report at ${SITE}`,
    },
    experience: [
      {
        jnj: true,
        title: 'Health Care Compliance LAN Intern',
        org: 'Johnson & Johnson Innovative Medicine',
        when: 'Jan 2026 – present',
        bullets: [
          'Automated about 900 healthcare-professional profile updates with Power Automate, cutting processing time by 92–97% for the 70 colleagues involved.',
          'Contributed to 3 AI agents (Copilot Studio, SharePoint, generative AI): documentation Q&A, analytics reports from training and deviation data, and guidance for Compliance Officers on approval-process changes.',
          'Improved a deviation reporting app used across Latin America and built a dashboard for minor deviations.',
        ],
      },
      {
        title: 'Web Developer',
        org: 'Tess Adviser',
        when: 'Feb 2024 – Dec 2024',
        bullets: [
          'Built responsive websites with HTML, CSS, JavaScript, WordPress and Astro.',
          'Integrated payment gateways, forms, analytics and external services, with attention to data privacy and secure configuration.',
          'Worked with multidisciplinary teams around each client’s goals.',
        ],
      },
    ],
    projects: [
      {
        name: 'Forensic evidence system for Colombian banking',
        meta: 'Uniandes capstone · with a classmate and doctoral researchers',
        text: 'Full-stack system (Next.js, NestJS, PostgreSQL, MinIO) where every file is cryptographically hashed and timestamped on arrival, access is role-based and every action goes into an audit log.',
      },
      {
        name: 'Opinion classifier',
        meta: 'Uniandes · 2024 · team of 3',
        text: 'Sorted 4,049 citizen opinions into health, education and gender equality. Random Forest + TF-IDF reached 96.8% accuracy and 0.968 macro F1 on 810 held-out opinions; served through a Django API.',
        link: caseLink('AI-01'),
      },
      {
        name: 'Neonatal health data warehouse (DANE)',
        meta: 'Uniandes · 2024 · team of 3',
        text: 'Engineered 1M+ DANE birth records (2017, 2018, 2021, 2022) into a star schema with per-dimension ETL and three Power BI dashboards; two-proportion Z tests linked higher maternal education to lower low-birth-weight prevalence.',
      },
      {
        name: 'MediQuick, 3rd place at ULatinhack 2024',
        meta: 'Hackathon · 2024 · team of 3',
        text: 'Django REST backend whose endpoint sends a patient’s history to GPT-3.5 (OpenAI API) with a prompt I designed, returning a summary of disease status for the oncologist.',
        link: caseLink('AI-02'),
      },
      {
        name: 'Knowledge graph from scientific papers',
        meta: 'Universidad Politécnica de Madrid · 2025 · team of 3',
        text: 'Turned 11 research PDFs into a graph of papers, authors, institutions and projects: Grobid extraction, NER, OpenAlex/OpenAIRE enrichment, embedding similarity, RDF export, a Streamlit app and Docker.',
        link: caseLink('AI-04'),
      },
    ],
    education: [
      { degree: 'B.Sc. Systems and Computing Engineering', school: 'Universidad de los Andes, Bogotá', when: '2022 – 2026', detail: `GPA ${gpa('en')}/5.00` },
      { degree: 'Exchange semester', school: 'Universidad Politécnica de Madrid, Spain', when: 'Feb – Jun 2025', detail: 'Data Warehouse Architecture, Computer Networks, Information Theory and Coding' },
      { degree: 'IAPS Summer A program', school: 'University of Pennsylvania, USA', when: 'Summer 2025', detail: 'Banco Santander scholarship; Leadership & Team Building, Innovation & Technology' },
    ],
    certifications: [
      { text: 'Google Cybersecurity Certificate (Coursera)', when: '2024' },
      { text: 'TryHackMe Pre Security + Cyber Security 101 (52 h of labs)', when: '2025' },
      { text: 'Cloud Architecture Bootcamp, intermediate level, Talento Tech (159 h)', when: '2024' },
    ],
    skills: [
      { group: 'AI/ML & data', items: 'Python, scikit-learn, SQL, Power BI, Qlik, Tableau, OpenAI API' },
      { group: 'Security (labs)', items: 'Kali Linux, Wireshark, Burp Suite, Splunk' },
      { group: 'Build', items: 'TypeScript, Astro, Next.js, NestJS, Django, PostgreSQL, Docker, Linux, AWS' },
      { jnj: true, group: 'Business & compliance', items: 'Microsoft Power Platform (Power Apps, Power Automate), Copilot Studio, SharePoint' },
    ],
    languages: 'Spanish (native) · English (professional, B2)',
    meta: {
      title: 'Sergio Andrés González Mateus — CV',
      subject: 'Curriculum vitae: AI & ML, Security, Business & Compliance',
      keywords: ['Sergio González Mateus', 'CV', 'AI', 'machine learning', 'cybersecurity', 'compliance', 'data', 'Bogotá'],
      lang: 'en-US',
    },
  },
  es: {
    name: 'Sergio Andrés González Mateus',
    positioning: 'Ingeniero que construye IA y entiende de compliance, riesgo y negocio. Busco roles en IA y ML, Seguridad, y Negocio y Compliance.',
    location: 'Bogotá, Colombia',
    contact,
    labels: {
      header: 'Sergio González, Inc. · Informe Anual 2026 · HV',
      experience: 'Experiencia',
      projects: 'Proyectos destacados',
      education: 'Educación',
      certifications: 'Certificaciones y formación',
      skills: 'Habilidades e idiomas',
      languages: 'Idiomas',
      footer: `Cada cifra tiene su fuente en el informe completo: ${SITE}`,
    },
    experience: [
      {
        jnj: true,
        title: 'Practicante de Health Care Compliance LAN',
        org: 'Johnson & Johnson Innovative Medicine',
        when: 'ene 2026 – actual',
        bullets: [
          'Automaticé cerca de 900 actualizaciones de perfiles de profesionales de la salud con Power Automate y reduje el tiempo de procesamiento entre 92 y 97 % para los 70 colaboradores involucrados.',
          'Participé en 3 agentes de IA (Copilot Studio, SharePoint, IA generativa): consultas sobre documentación, reportes a partir de datos de capacitaciones y desviaciones, y orientación a Compliance Officers cuando cambian los procesos de aprobación.',
          'Mejoré una app de reporte de desviaciones que se usa en toda Latinoamérica y construí un tablero de desviaciones menores.',
        ],
      },
      {
        title: 'Desarrollador web',
        org: 'Tess Adviser',
        when: 'feb 2024 – dic 2024',
        bullets: [
          'Construí sitios web responsivos con HTML, CSS, JavaScript, WordPress y Astro.',
          'Integré pasarelas de pago, formularios, analítica y servicios externos, cuidando la privacidad de los datos y la configuración segura.',
          'Trabajé con equipos multidisciplinarios alrededor de los objetivos de cada cliente.',
        ],
      },
    ],
    projects: [
      {
        name: 'Sistema de evidencia forense para la banca colombiana',
        meta: 'Proyecto de grado, Uniandes · con un compañero e investigadores doctorales',
        text: 'Sistema full-stack (Next.js, NestJS, PostgreSQL, MinIO) donde cada archivo se hashea criptográficamente y se sella con la hora al llegar, el acceso depende del rol y cada acción queda en un registro de auditoría.',
      },
      {
        name: 'Clasificador de opiniones',
        meta: 'Uniandes · 2024 · equipo de 3',
        text: 'Clasificamos 4.049 opiniones ciudadanas en salud, educación e igualdad de género. Random Forest + TF-IDF logró 96,8 % de exactitud y 0,968 de F1 macro en 810 opiniones de prueba; servido con una API en Django.',
        link: caseLink('AI-01'),
      },
      {
        name: 'Bodega de datos de salud neonatal (DANE)',
        meta: 'Uniandes · 2024 · equipo de 3',
        text: 'Llevamos más de 1 millón de registros de nacimientos del DANE (2017, 2018, 2021, 2022) a un modelo estrella con ETL por dimensión y tres tableros en Power BI; con pruebas Z de dos proporciones asociamos mayor educación materna con menor prevalencia de bajo peso al nacer.',
      },
      {
        name: 'MediQuick, tercer puesto en ULatinhack 2024',
        meta: 'Hackatón · 2024 · equipo de 3',
        text: 'Backend en Django REST con un endpoint que envía la historia del paciente a GPT-3.5 (API de OpenAI) con un prompt que diseñé, y devuelve al oncólogo un resumen del estado de la enfermedad.',
        link: caseLink('AI-02'),
      },
      {
        name: 'Grafo de conocimiento a partir de artículos científicos',
        meta: 'Universidad Politécnica de Madrid · 2025 · equipo de 3',
        text: 'Convertimos 11 PDFs de investigación en un grafo de artículos, autores, instituciones y proyectos: extracción con Grobid, NER, enriquecimiento con OpenAlex/OpenAIRE, similitud por embeddings, exportación a RDF, una app en Streamlit y Docker.',
        link: caseLink('AI-04'),
      },
    ],
    education: [
      { degree: 'Ingeniería de Sistemas y Computación', school: 'Universidad de los Andes, Bogotá', when: '2022 – 2026', detail: `Promedio ${gpa('es')}/5,00` },
      { degree: 'Semestre de intercambio', school: 'Universidad Politécnica de Madrid, España', when: 'feb – jun 2025', detail: 'Arquitectura de Data Warehouse, Redes de Computadores, Teoría de la Información y Codificación' },
      { degree: 'Programa IAPS Summer A', school: 'University of Pennsylvania, Estados Unidos', when: 'verano 2025', detail: 'Beca Banco Santander; Liderazgo y trabajo en equipo, Innovación y tecnología' },
    ],
    certifications: [
      { text: 'Certificado de Ciberseguridad de Google (Coursera)', when: '2024' },
      { text: 'TryHackMe Pre Security + Cyber Security 101 (52 h de laboratorios)', when: '2025' },
      { text: 'Bootcamp de Arquitectura en la Nube, nivel intermedio, Talento Tech (159 h)', when: '2024' },
    ],
    skills: [
      { group: 'IA/ML y datos', items: 'Python, scikit-learn, SQL, Power BI, Qlik, Tableau, API de OpenAI' },
      { group: 'Seguridad (laboratorios)', items: 'Kali Linux, Wireshark, Burp Suite, Splunk' },
      { group: 'Desarrollo', items: 'TypeScript, Astro, Next.js, NestJS, Django, PostgreSQL, Docker, Linux, AWS' },
      { jnj: true, group: 'Negocio y compliance', items: 'Microsoft Power Platform (Power Apps, Power Automate), Copilot Studio, SharePoint' },
    ],
    languages: 'Español (nativo) · Inglés (profesional, B2)',
    meta: {
      title: 'Sergio Andrés González Mateus — Hoja de vida',
      subject: 'Hoja de vida: IA y ML, Seguridad, Negocio y Compliance',
      keywords: ['Sergio González Mateus', 'hoja de vida', 'CV', 'IA', 'machine learning', 'ciberseguridad', 'compliance', 'datos', 'Bogotá'],
      lang: 'es-CO',
    },
  },
};

/** The CV for one locale, with J&J content removed unless JNJ_PUBLIC is true. */
export function cvFor(locale: Locale): Cv {
  const cv = data[locale];
  if (JNJ_PUBLIC) return cv;
  return {
    ...cv,
    experience: cv.experience.filter((r) => !r.jnj),
    skills: cv.skills.filter((s) => !s.jnj),
  };
}

export const cvFiles: Record<Locale, string> = {
  en: 'sergio-gonzalez-cv-en.pdf',
  es: 'sergio-gonzalez-cv-es.pdf',
};
