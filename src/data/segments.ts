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
    title: { en: 'Telling health, education and gender apart in 4,049 texts', es: 'Separar salud, educación y género en 4.049 textos' },
    context: { en: 'Uniandes · Sep 2024 · team of 3', es: 'Uniandes · sep 2024 · equipo de 3' },
    kpi: { value: { en: '97/100', es: '97/100' }, label: { en: 'texts land on the right topic', es: 'textos caen en el tema correcto' } },
    stack: 'Python · scikit-learn · TF-IDF · Random Forest · Django',
    problem: { en: 'An organization working on the UN development goals gets citizen opinions and has to send each one to health, education or gender equality. Doing it by hand is slow, and it gets slower every month.', es: 'Una organización que trabaja con los Objetivos de Desarrollo Sostenible recibe opiniones ciudadanas y tiene que mandar cada una a salud, educación o igualdad de género. A mano es lento, y cada mes más.' },
    decision: { en: 'We started with the data: the texts arrived with broken accents (“Ã¡” instead of “á”), so we fixed that before anything else. Then we tried a decision tree, k-NN and Random Forest on TF-IDF, and packed the winner into a scikit-learn pipeline our Django API could load.', es: 'Empezamos por los datos: los textos venían con las tildes rotas (“Ã¡” en vez de “á”), así que eso se arregló primero. Después probamos un árbol de decisión, k-NN y Random Forest sobre TF-IDF, y empacamos al ganador en un pipeline de scikit-learn que nuestra API en Django pudiera cargar.' },
    result: { en: 'Random Forest won: 96.8% accuracy and 0.968 macro F1 on 810 texts it had never seen, ahead of k-NN (94%) and the single tree (92%). Most of its remaining mistakes mix up education and gender.', es: 'Ganó Random Forest: 96,8 % de exactitud y 0,968 de F1 macro en 810 textos que nunca había visto, por encima de k-NN (94 %) y del árbol solo (92 %). La mayoría de los errores que le quedan confunden educación con género.' },
    learning: { en: 'Before comparing models, an “á” had to be an “á”. Since then I check the encoding before I look at the accuracy.', es: 'Antes de comparar modelos, una “á” tenía que ser una “á”. Desde entonces reviso la codificación antes de mirar la exactitud.' },
  },
  {
    id: 'AI-02', segment: 'ai', source: 'PRJ-MQ', link: 'https://github.com/AndesLand-ULatin2024/MediQuick',
    title: { en: 'MediQuick: the patient’s history, summed up for the oncologist', es: 'MediQuick: la historia del paciente, resumida para el oncólogo' },
    context: { en: 'ULatinhack · 2024 · team of 3', es: 'ULatinhack · 2024 · equipo de 3' },
    kpi: { value: { en: '3rd', es: '3.er' }, label: { en: 'place at ULatinhack 2024', es: 'puesto en ULatinhack 2024' } },
    stack: 'Python · Django REST · OpenAI API · GPT-3.5',
    problem: { en: 'Before each consultation, an oncologist has to read the whole history: past visits, treatments, exam results, tumour measurements. That time comes out of the consultation itself.', es: 'Antes de cada consulta, un oncólogo tiene que leer toda la historia: citas anteriores, tratamientos, exámenes, medidas del tumor. Ese tiempo sale de la consulta misma.' },
    decision: { en: 'We built a Django REST backend for patients and appointments, with exam results stored as JSON. One endpoint gathers a patient’s full history and sends it to GPT-3.5 with a prompt I wrote: read it like a lung-cancer oncologist, say where the disease stands and draft a report with the tumour data that matters.', es: 'Armamos un backend en Django REST para pacientes y citas, con los exámenes guardados como JSON. Un endpoint junta toda la historia del paciente y se la manda a GPT-3.5 con un prompt que escribí: léela como un oncólogo de cáncer de pulmón, di cómo va la enfermedad y redacta un informe con los datos del tumor que importan.' },
    result: { en: 'Third place at ULatinhack 2024. A working prototype, not a medical device, and we said so.', es: 'Tercer puesto en ULatinhack 2024. Un prototipo que funciona, no un dispositivo médico, y así lo presentamos.' },
    learning: { en: 'The prompt took an afternoon. The question that stayed with me was who should approve sending a full clinical history to an outside API.', es: 'El prompt salió en una tarde. La pregunta que me quedó fue quién debería aprobar que una historia clínica completa salga hacia una API externa.' },
  },
  {
    id: 'AI-03', segment: 'ai', source: 'PRJ-FC', link: 'https://github.com/FotografiaComputacional/FCProyecto4',
    title: { en: 'Fixing photos by hand, one pixel loop at a time', es: 'Arreglar fotos a mano, un ciclo de píxeles a la vez' },
    context: { en: 'UPM Madrid · 2025 · Computational Photography', es: 'UPM Madrid · 2025 · Fotografía Computacional' },
    kpi: { value: same('300'), label: { en: 'deblurring iterations, each one measured', es: 'iteraciones para quitar el desenfoque, cada una medida' } },
    stack: 'MATLAB · bilateral filters · deconvolution · image stitching',
    problem: { en: 'Blurred, noisy or flat photos hide the detail you need. MATLAB has a function for each of those problems, but calling it doesn’t teach you why it works.', es: 'Las fotos borrosas, con ruido o planas esconden el detalle que necesitas. MATLAB tiene una función para cada problema, pero llamarla no te enseña por qué funciona.' },
    decision: { en: 'I wrote the Gaussian and bilateral filters myself, loop by loop, and checked them against the built-in versions. Then I used a flash photo to clean up a dark no-flash shot, boosted local contrast, and recovered a blurred image with 300 rounds of deconvolution.', es: 'Escribí yo mismo los filtros gaussiano y bilateral, ciclo por ciclo, y los comparé con las versiones de MATLAB. Después usé una foto con flash para limpiar una sin flash, mejoré el contraste local y recuperé una imagen borrosa con 300 rondas de deconvolución.' },
    result: { en: 'Hand-written filters that match the built-ins, a usable no-flash photo, and a deblurred image with its error tracked at every iteration.', es: 'Filtros escritos a mano que coinciden con los de MATLAB, una foto sin flash que ya se puede usar y una imagen recuperada con su error medido en cada iteración.' },
    learning: { en: 'Writing a filter by hand is slow, and that’s the point. Now I know what each parameter does to the picture.', es: 'Escribir un filtro a mano es lento, y de eso se trata. Ahora sé qué le hace cada parámetro a la imagen.' },
  },
  // ------------------------------------------------------------------ Security
  {
    id: 'SEC-01', segment: 'sec', source: 'SEC',
    title: { en: 'Evidence that can prove nobody touched it', es: 'Evidencia que puede probar que nadie la tocó' },
    context: { en: 'Uniandes capstone · with doctoral researchers', es: 'Proyecto de grado, Uniandes · con investigadores doctorales' },
    kpi: { value: same('4'), label: { en: 'integrity controls on every file', es: 'controles de integridad en cada archivo' } },
    stack: 'Next.js · NestJS · PostgreSQL · MinIO · cryptographic hashing',
    problem: { en: 'When a bank investigates fraud, the digital evidence only counts if nobody can claim it was changed along the way.', es: 'Cuando un banco investiga un fraude, la evidencia digital solo cuenta si nadie puede alegar que la cambiaron en el camino.' },
    decision: { en: 'With a classmate and doctoral researchers, we’re building a full-stack system where every file is hashed and timestamped the moment it arrives, access depends on your role, and every action goes into an audit log.', es: 'Con un compañero e investigadores doctorales estamos construyendo un sistema full-stack donde cada archivo se hashea y se sella con la hora apenas llega, el acceso depende del rol y cada acción queda en un registro de auditoría.' },
    result: { en: 'Each piece of evidence carries its own fingerprint, timestamp and access history, so anyone can check at any moment that it hasn’t changed.', es: 'Cada evidencia lleva su propia huella, su sello de tiempo y su historial de acceso, así que cualquiera puede comprobar en cualquier momento que no ha cambiado.' },
    learning: { en: 'Integrity is much easier to design into the first table than to add once everything else works.', es: 'La integridad es mucho más fácil de diseñar desde la primera tabla que de agregar cuando todo lo demás ya funciona.' },
  },
  {
    id: 'SEC-02', segment: 'sec', source: 'SEC', link: 'https://tryhackme.com/p/xSergonMx',
    title: { en: 'Learning security with my hands on the keyboard', es: 'Aprender seguridad con las manos en el teclado' },
    context: { en: 'Google · TryHackMe · 2024–2025', es: 'Google · TryHackMe · 2024–2025' },
    kpi: { value: same('52 h'), label: { en: 'of hands-on labs', es: 'de laboratorios prácticos' } },
    stack: 'Kali Linux · Wireshark · Burp Suite · Splunk · SIEM/IDS',
    problem: { en: 'A certificate shows I studied security. It doesn’t show I can read a packet capture or spot something odd in a log.', es: 'Un certificado muestra que estudié seguridad. No muestra que sepa leer una captura de paquetes o notar algo raro en un log.' },
    decision: { en: 'After the Google Cybersecurity Certificate I moved to TryHackMe, Pre Security and Cyber Security 101, working in the tools analysts actually use.', es: 'Después del Certificado de Ciberseguridad de Google me pasé a TryHackMe, Pre Security y Cyber Security 101, trabajando con las herramientas que de verdad usan los analistas.' },
    result: { en: '52 hours of labs on top of the certificate. It’s lab experience, not real-world pentesting, and the risk factors say so.', es: '52 horas de laboratorio además del certificado. Es experiencia de laboratorio, no pentesting real, y los factores de riesgo lo dicen.' },
    learning: { en: 'You can’t spot strange traffic until you know what normal traffic looks like.', es: 'No puedes notar tráfico raro hasta que sabes cómo se ve el normal.' },
  },
  // ------------------------------------------------------------------ Business & Compliance
  {
    id: 'BIZ-01', segment: 'biz', source: 'EXP-JNJ', jnj: true,
    title: { en: '900 profile updates that no longer wait in a queue', es: '900 actualizaciones de perfil que ya no hacen fila' },
    context: { en: 'Johnson & Johnson Innovative Medicine · 2026 · intern', es: 'Johnson & Johnson Innovative Medicine · 2026 · practicante' },
    kpi: { value: same('92–97%'), label: { en: 'less processing time', es: 'menos tiempo de procesamiento' } },
    stack: 'Power Automate · Power Apps · SharePoint',
    problem: { en: 'Updating healthcare professionals’ profiles was manual work that involved 70 colleagues.', es: 'Actualizar los perfiles de profesionales de la salud era trabajo manual que involucraba a 70 colaboradores.' },
    decision: { en: 'I automated the flow in Power Automate.', es: 'Automaticé el flujo en Power Automate.' },
    result: { en: 'About 900 updates automated, and processing time down by 92 to 97 percent.', es: 'Cerca de 900 actualizaciones automatizadas y el tiempo de procesamiento entre 92 y 97 por ciento más bajo.' },
    learning: { en: 'In compliance, automation is welcome only if you can still trace every step.', es: 'En compliance, la automatización solo es bienvenida si todavía puedes rastrear cada paso.' },
  },
  {
    id: 'BIZ-02', segment: 'biz', source: 'EXP-JNJ', jnj: true,
    title: { en: 'Three AI agents for a compliance team', es: 'Tres agentes de IA para un equipo de compliance' },
    context: { en: 'Johnson & Johnson Innovative Medicine · 2026 · intern', es: 'Johnson & Johnson Innovative Medicine · 2026 · practicante' },
    kpi: { value: same('3'), label: { en: 'AI agents I helped build', es: 'agentes de IA que ayudé a construir' } },
    stack: 'Copilot Studio · SharePoint · GenAI · Power BI',
    problem: { en: 'Compliance teams need quick, reliable answers from their own documentation, and reports out of training and deviation data.', es: 'Los equipos de compliance necesitan respuestas rápidas y confiables de su propia documentación, y reportes a partir de datos de capacitaciones y desviaciones.' },
    decision: { en: 'Agents in Copilot Studio: one answers questions about compliance documentation, one turns training and deviation data into reports and presentations, and one, built with global teams, guides Compliance Officers when approval processes change.', es: 'Agentes en Copilot Studio: uno responde preguntas sobre la documentación de compliance, otro convierte datos de capacitaciones y desviaciones en reportes y presentaciones, y otro, hecho con equipos globales, orienta a los Compliance Officers cuando cambian los procesos de aprobación.' },
    result: { en: 'Three agents, a dashboard for minor deviations, and improvements to a deviation reporting app used across Latin America.', es: 'Tres agentes, un tablero de desviaciones menores y mejoras a una app de reporte de desviaciones que se usa en toda Latinoamérica.' },
    learning: { en: 'In a regulated company, an AI agent earns trust by saying “I don’t know” when it should.', es: 'En una empresa regulada, un agente de IA se gana la confianza diciendo “no sé” cuando toca.' },
  },
  {
    id: 'BIZ-03', segment: 'biz', source: 'EXP-TESS',
    title: { en: 'Websites that sell without exposing anyone’s data', es: 'Sitios que venden sin exponer los datos de nadie' },
    context: { en: 'Tess Adviser · Feb–Dec 2024 · web developer', es: 'Tess Adviser · feb–dic 2024 · desarrollador web' },
    kpi: { value: same('11'), label: { en: 'months building client sites', es: 'meses construyendo sitios para clientes' } },
    stack: 'HTML · CSS · JavaScript · WordPress · Astro',
    problem: { en: 'Every client wanted the same three things: a site that sells, captures leads and shows them their traffic. None of it could leak their customers’ data.', es: 'Todos los clientes querían lo mismo: un sitio que venda, capture contactos y les muestre su tráfico. Nada de eso podía filtrar los datos de sus clientes.' },
    decision: { en: 'I built responsive sites and connected payment gateways, forms, analytics and outside services, setting each one up with privacy in mind.', es: 'Construí sitios responsivos y conecté pasarelas de pago, formularios, analítica y servicios externos, configurando cada uno pensando en la privacidad.' },
    result: { en: 'Sites delivered around each client’s goals, together with multidisciplinary teams. We didn’t measure impact, so I won’t make up a number.', es: 'Sitios entregados según los objetivos de cada cliente, junto a equipos multidisciplinarios. No medimos impacto, así que no me voy a inventar una cifra.' },
    learning: { en: 'Clients ask about the sale. Nobody asks about the data behind it, so the developer has to.', es: 'Los clientes preguntan por la venta. Nadie pregunta por los datos detrás, así que le toca al desarrollador.' },
  },
];

export const segmentStrings = {
  en: {
    kicker: 'Section iii', title: 'Segments',
    lede: 'Three lines of business, one engineer. Each case reads left to right: the problem, what I decided, what happened and what I took from it.',
    steps: ['Problem', 'Decision', 'Result', 'What I took from it'],
    cases: (n: number) => `${n} ${n === 1 ? 'case' : 'cases'}`,
    repo: 'Repository', profile: 'Profile',
    embargoTitle: 'Filed under embargo',
    embargoBody: 'Two cases from my current internship are waiting for my employer’s review before they go public. Respecting that review is, conveniently, the job.',
    embargoStamp: 'Embargoed',
    swipe: 'Swipe',
    scrollHint: 'Keep scrolling',
  },
  es: {
    kicker: 'Sección iii', title: 'Segmentos',
    lede: 'Tres líneas de negocio, un ingeniero. Cada caso se lee de izquierda a derecha: el problema, lo que decidí, lo que pasó y lo que me llevé.',
    steps: ['Problema', 'Decisión', 'Resultado', 'Lo que me llevé'],
    cases: (n: number) => `${n} ${n === 1 ? 'caso' : 'casos'}`,
    repo: 'Repositorio', profile: 'Perfil',
    embargoTitle: 'Archivado bajo embargo',
    embargoBody: 'Dos casos de mi práctica actual esperan la revisión de mi empleador antes de hacerse públicos. Respetar esa revisión es, convenientemente, el trabajo.',
    embargoStamp: 'Embargado',
    swipe: 'Desliza',
    scrollHint: 'Sigue bajando',
  },
} as const;
