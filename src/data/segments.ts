import type { Locale } from '../i18n/strings';
import type { SourceId } from './report';

type L = Record<Locale, string>;
const same = (v: string): L => ({ en: v, es: v });

export type SegmentId = 'ai' | 'sec' | 'biz';

export interface Segment { id: SegmentId; code: string; name: L; thesis: L }

export const segments: Segment[] = [
  { id: 'ai', code: 'AI', name: { en: 'AI & ML', es: 'IA y ML' }, thesis: { en: 'Models that are measured before they are trusted.', es: 'Modelos que se miden antes de confiar en ellos.' } },
  { id: 'sec', code: 'SEC', name: { en: 'Security', es: 'Seguridad' }, thesis: { en: 'Integrity you can verify, not just promise.', es: 'Integridad que se puede verificar, no solo prometer.' } },
  { id: 'biz', code: 'BIZ', name: { en: 'Business & Compliance', es: 'Negocio y Compliance' }, thesis: { en: 'Automation that survives an audit.', es: 'Automatización que sobrevive a una auditoría.' } },
];

export interface Case {
  id: string;
  segment: SegmentId;
  title: L;
  context: L;
  kpi: { value: L; label: L };
  stack: string;
  problem: L; decision: L; result: L; learning: L;
  source: SourceId | 'EXP-TESS' | 'PRJ-FC';
  link?: string;
  jnj?: boolean;
}

export const cases: Case[] = [
  // ------------------------------------------------------------------ AI & ML
  {
    id: 'AI-01', segment: 'ai', source: 'PRJ-OPI', link: 'https://github.com/BI-20242/Proyecto-E1',
    title: { en: 'Sorting 4,049 citizen opinions by topic', es: 'Clasificar 4.049 opiniones ciudadanas por tema' },
    context: { en: 'Uniandes · 2024 · team project', es: 'Uniandes · 2024 · proyecto en equipo' },
    kpi: { value: { en: '97/100', es: '97/100' }, label: { en: 'opinions sorted into the right topic', es: 'opiniones clasificadas en el tema correcto' } },
    stack: 'Python · scikit-learn · TF-IDF · Django',
    problem: { en: 'Thousands of opinions about health, education and gender equality had to be sorted by topic. Reading them by hand does not scale.', es: 'Miles de opiniones sobre salud, educación e igualdad de género había que clasificarlas por tema. Leerlas a mano no escala.' },
    decision: { en: 'Clean the data first. Then compare decision trees, k-NN and Random Forest on TF-IDF features, and serve the winner through a Django API built with the team.', es: 'Limpiar primero los datos. Después comparar árboles de decisión, k-NN y Random Forest sobre TF-IDF, y servir el ganador con una API en Django hecha en equipo.' },
    result: { en: 'Random Forest with TF-IDF: 96.8% accuracy and 0.968 macro F1 on 810 opinions the model had never seen.', es: 'Random Forest con TF-IDF: 96,8 % de exactitud y 0,968 de F1 macro en 810 opiniones que el modelo nunca había visto.' },
    learning: { en: 'The comparison mattered more than the model. Choosing the winner on unseen data is what makes the number defensible.', es: 'La comparación importó más que el modelo. Elegir al ganador con datos no vistos es lo que vuelve defendible la cifra.' },
  },
  {
    id: 'AI-02', segment: 'ai', source: 'PRJ-MQ', link: 'https://github.com/AndesLand-ULatin2024/MediQuick',
    title: { en: 'MediQuick: medical reports drafted by AI', es: 'MediQuick: informes médicos redactados por IA' },
    context: { en: 'ULatinhack · 2024 · team of 3', es: 'ULatinhack · 2024 · equipo de 3' },
    kpi: { value: { en: '3rd', es: '3.er' }, label: { en: 'place at ULatinhack 2024', es: 'puesto en ULatinhack 2024' } },
    stack: 'Python · OpenAI API · GPT-3.5 · prompt design',
    problem: { en: 'Writing a report after each consultation takes time a doctor could spend with patients.', es: 'Redactar un informe después de cada consulta le quita a un médico tiempo con sus pacientes.' },
    decision: { en: 'Use GPT-3.5 through the OpenAI API and put the effort where it pays: the prompt that turns a consultation into a draft report.', es: 'Usar GPT-3.5 vía la API de OpenAI y poner el esfuerzo donde rinde: el prompt que convierte una consulta en un borrador de informe.' },
    result: { en: 'Third place at ULatinhack 2024, with a team of three. He designed the prompt.', es: 'Tercer puesto en ULatinhack 2024, con un equipo de tres. Él diseñó el prompt.' },
    learning: { en: 'In a hackathon, a narrow problem solved end to end beats a broad one solved halfway.', es: 'En un hackathon, un problema estrecho resuelto de punta a punta le gana a uno amplio resuelto a medias.' },
  },
  {
    id: 'AI-03', segment: 'ai', source: 'PRJ-FC', link: 'https://github.com/FotografiaComputacional/FCProyecto4',
    title: { en: 'Recovering blurred photos, one measured iteration at a time', es: 'Recuperar fotos borrosas, una iteración medida a la vez' },
    context: { en: 'UPM Madrid · 2025 · course project', es: 'UPM Madrid · 2025 · proyecto de curso' },
    kpi: { value: same('3'), label: { en: 'image techniques built and compared', es: 'técnicas de imagen construidas y comparadas' } },
    stack: 'MATLAB · deconvolution · bilateral filters · interpolation',
    problem: { en: 'Blurred or flat images hide the detail an analysis needs.', es: 'Las imágenes borrosas o planas esconden el detalle que necesita un análisis.' },
    decision: { en: 'Compare Gaussian and bilateral filters for local contrast, recover blurred images with iterative deconvolution, and stitch panoramas with geometric transforms and interpolation.', es: 'Comparar filtros gaussianos y bilaterales para el contraste local, recuperar imágenes borrosas con deconvolución iterativa y armar panorámicas con transformaciones geométricas e interpolación.' },
    result: { en: 'A working pipeline for each technique, with the error measured at every iteration instead of judged by eye.', es: 'Un flujo funcional para cada técnica, con el error medido en cada iteración en vez de juzgado a ojo.' },
    learning: { en: 'Measuring the error at each step tells you when to stop. Looking at the picture does not.', es: 'Medir el error en cada paso te dice cuándo parar. Mirar la foto, no.' },
  },
  // ------------------------------------------------------------------ Security
  {
    id: 'SEC-01', segment: 'sec', source: 'SEC',
    title: { en: 'Digital evidence that can prove nobody touched it', es: 'Evidencia digital que puede probar que nadie la tocó' },
    context: { en: 'Uniandes capstone · with doctoral researchers', es: 'Proyecto de grado, Uniandes · con investigadores doctorales' },
    kpi: { value: same('4'), label: { en: 'integrity controls on every piece of evidence', es: 'controles de integridad sobre cada evidencia' } },
    stack: 'Next.js · NestJS · PostgreSQL · MinIO · cryptographic hashing',
    problem: { en: 'In a bank fraud investigation, digital evidence is only worth something if nobody can claim it was altered.', es: 'En una investigación de fraude bancario, la evidencia digital solo vale si nadie puede alegar que fue alterada.' },
    decision: { en: 'A full-stack system where every file is hashed and timestamped on arrival, access depends on role, and every action is written to an audit log.', es: 'Un sistema full-stack donde cada archivo se hashea y se sella en el tiempo al llegar, el acceso depende del rol y cada acción queda en un registro de auditoría.' },
    result: { en: 'Each piece of evidence carries its own hash, timestamp and access history, so its integrity can be checked at any moment.', es: 'Cada evidencia lleva su propio hash, sello de tiempo e historial de acceso, así que su integridad se puede comprobar en cualquier momento.' },
    learning: { en: 'Security is cheaper in the first database table than in the last sprint.', es: 'La seguridad sale más barata en la primera tabla de la base de datos que en el último sprint.' },
  },
  {
    id: 'SEC-02', segment: 'sec', source: 'SEC', link: 'https://tryhackme.com/p/xSergonMx',
    title: { en: 'From the certificate to the terminal', es: 'Del certificado a la terminal' },
    context: { en: 'Google · TryHackMe · 2024–2025', es: 'Google · TryHackMe · 2024–2025' },
    kpi: { value: same('52 h'), label: { en: 'of hands-on security labs', es: 'de laboratorios prácticos de seguridad' } },
    stack: 'Kali Linux · Wireshark · Burp Suite · Splunk · SIEM/IDS',
    problem: { en: 'A certificate proves you studied. It does not prove you can read a packet capture.', es: 'Un certificado prueba que estudiaste. No prueba que sepas leer una captura de paquetes.' },
    decision: { en: 'Pair the Google Cybersecurity Certificate with TryHackMe Pre Security and Cyber Security 101, working in the tools analysts actually use.', es: 'Sumar al Certificado de Ciberseguridad de Google los cursos Pre Security y Cyber Security 101 de TryHackMe, trabajando con las herramientas que de verdad usan los analistas.' },
    result: { en: '52 hours of labs on top of the certificate. Lab experience, not real-world pentesting: see the risk factors.', es: '52 horas de laboratorio además del certificado. Es experiencia de laboratorio, no pentesting real: ver factores de riesgo.' },
    learning: { en: 'Knowing what normal traffic looks like is most of spotting the abnormal.', es: 'Saber cómo se ve el tráfico normal es casi todo lo que hace falta para notar el anormal.' },
  },
  // ------------------------------------------------------------------ Business & Compliance
  {
    id: 'BIZ-01', segment: 'biz', source: 'EXP-JNJ', jnj: true,
    title: { en: '900 profile updates, almost no waiting', es: '900 actualizaciones de perfil, casi sin espera' },
    context: { en: 'Johnson & Johnson Innovative Medicine · 2026 · intern', es: 'Johnson & Johnson Innovative Medicine · 2026 · practicante' },
    kpi: { value: same('92–97%'), label: { en: 'less processing time', es: 'menos tiempo de procesamiento' } },
    stack: 'Power Automate · Power Apps · SharePoint',
    problem: { en: 'Updating healthcare professionals’ profiles was manual work involving 70 colleagues.', es: 'Actualizar los perfiles de profesionales de la salud era trabajo manual que involucraba a 70 colaboradores.' },
    decision: { en: 'Automate the flow with Power Automate.', es: 'Automatizar el flujo con Power Automate.' },
    result: { en: 'About 900 updates automated; processing time cut by 92 to 97 percent.', es: 'Cerca de 900 actualizaciones automatizadas; tiempo de procesamiento reducido entre 92 y 97 por ciento.' },
    learning: { en: 'In compliance, automation is only welcome if every step stays traceable.', es: 'En compliance, la automatización solo es bienvenida si cada paso sigue siendo trazable.' },
  },
  {
    id: 'BIZ-02', segment: 'biz', source: 'EXP-JNJ', jnj: true,
    title: { en: 'Three AI agents for a compliance team', es: 'Tres agentes de IA para un equipo de compliance' },
    context: { en: 'Johnson & Johnson Innovative Medicine · 2026 · intern', es: 'Johnson & Johnson Innovative Medicine · 2026 · practicante' },
    kpi: { value: same('3'), label: { en: 'AI agents he helped build', es: 'agentes de IA que ayudó a construir' } },
    stack: 'Copilot Studio · SharePoint · GenAI · Power BI',
    problem: { en: 'Compliance teams need fast, reliable answers from internal documentation, and reports from training and deviation data.', es: 'Los equipos de compliance necesitan respuestas rápidas y confiables de su documentación interna, y reportes a partir de datos de capacitaciones y desviaciones.' },
    decision: { en: 'Build agents in Copilot Studio: one answers questions on compliance documentation, one turns training and deviation data into reports and presentations, and one, built with global teams, guides Compliance Officers through changes to approval processes.', es: 'Construir agentes en Copilot Studio: uno responde preguntas sobre documentación de compliance, otro convierte datos de capacitaciones y desviaciones en reportes y presentaciones, y otro, hecho con equipos globales, orienta a los Compliance Officers ante cambios en procesos de aprobación.' },
    result: { en: 'Three agents, a dashboard for minor deviations, and improvements to a deviation reporting app used across Latin America.', es: 'Tres agentes, un tablero de desviaciones menores y mejoras a una app de reporte de desviaciones usada en toda Latinoamérica.' },
    learning: { en: 'An AI agent in a regulated company is judged first by what it refuses to answer.', es: 'A un agente de IA en una empresa regulada se le juzga primero por lo que se niega a responder.' },
  },
  {
    id: 'BIZ-03', segment: 'biz', source: 'EXP-TESS',
    title: { en: 'Websites that take payments without leaking data', es: 'Sitios que cobran sin filtrar datos' },
    context: { en: 'Tess Adviser · Feb–Dec 2024 · web developer', es: 'Tess Adviser · feb–dic 2024 · desarrollador web' },
    kpi: { value: same('11'), label: { en: 'months shipping client sites', es: 'meses entregando sitios a clientes' } },
    stack: 'HTML · CSS · JavaScript · WordPress · Astro',
    problem: { en: 'Each client needed a site that sells, collects leads and measures traffic, without exposing customer data.', es: 'Cada cliente necesitaba un sitio que vendiera, capturara contactos y midiera tráfico, sin exponer datos de sus clientes.' },
    decision: { en: 'Build responsive sites and integrate payment gateways, forms, analytics and external services with privacy and secure configuration in mind.', es: 'Construir sitios responsivos e integrar pasarelas de pago, formularios, analítica y servicios externos pensando en privacidad y configuración segura.' },
    result: { en: 'Sites delivered with multidisciplinary teams, around each client’s goals. No impact figures were recorded, so none are reported.', es: 'Sitios entregados con equipos multidisciplinarios, según los objetivos de cada cliente. No se registraron cifras de impacto, así que no se reporta ninguna.' },
    learning: { en: 'The client cares about the sale. The engineer has to care about the data behind it.', es: 'Al cliente le importa la venta. Al ingeniero le tienen que importar los datos detrás.' },
  },
];

export const segmentStrings = {
  en: {
    kicker: 'Section iii', title: 'Segments',
    lede: 'Three business lines, one engineer. Each case reads left to right: problem, decision, result, learning.',
    steps: ['Problem', 'Decision', 'Result', 'Learning'],
    cases: (n: number) => `${n} ${n === 1 ? 'case' : 'cases'}`,
    repo: 'Repository', profile: 'Profile',
    embargoTitle: 'Filed under embargo',
    embargoBody: 'Two cases from the current internship are waiting for the employer’s review before publication. Respecting that review is, conveniently, the job.',
    embargoStamp: 'Embargoed',
    swipe: 'Swipe',
    scrollHint: 'Keep scrolling',
  },
  es: {
    kicker: 'Sección iii', title: 'Segmentos',
    lede: 'Tres líneas de negocio, un ingeniero. Cada caso se lee de izquierda a derecha: problema, decisión, resultado, aprendizaje.',
    steps: ['Problema', 'Decisión', 'Resultado', 'Aprendizaje'],
    cases: (n: number) => `${n} ${n === 1 ? 'caso' : 'casos'}`,
    repo: 'Repositorio', profile: 'Perfil',
    embargoTitle: 'Archivado bajo embargo',
    embargoBody: 'Dos casos de la práctica actual esperan la revisión del empleador antes de publicarse. Respetar esa revisión es, convenientemente, el trabajo.',
    embargoStamp: 'Embargado',
    swipe: 'Desliza',
    scrollHint: 'Sigue bajando',
  },
} as const;
