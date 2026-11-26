import type { Locale } from '../i18n/strings';

type L = Record<Locale, string>;

/** Plate captions (shown) and accessible descriptions (read by screen readers in place of the drawing). */
export const exhibits: Record<string, { caption: L; alt: L }> = {
  'AI-01': {
    caption: { en: 'Clean the accents, then let three models race on the same 810 texts.', es: 'Limpiar las tildes y poner a competir tres modelos con los mismos 810 textos.' },
    alt: { en: 'First the broken “Ã¡” becomes “á”. Then three grids of 100 dots: a single decision tree gets 92 right, k-NN 94 and Random Forest 97; the misses are marked in red.', es: 'Primero la “Ã¡” rota se vuelve “á”. Luego tres grillas de 100 puntos: un árbol de decisión acierta 92, k-NN 94 y Random Forest 97; los errores van en rojo.' },
  },
  'AI-02': {
    caption: { en: 'Four kinds of record, one endpoint, and the line the data crosses.', es: 'Cuatro tipos de registro, un endpoint y la línea que cruzan los datos.' },
    alt: { en: 'Visits, treatments, exams and tumour data merge into a Django REST endpoint, cross from the hospital to an outside API marked with a question of who approves it, reach GPT-3.5 and come back as a draft report.', es: 'Citas, tratamientos, exámenes y datos del tumor se unen en un endpoint de Django REST, cruzan del hospital a una API externa marcada con la pregunta de quién lo aprueba, llegan a GPT-3.5 y vuelven como un borrador de informe.' },
  },
  'AI-03': {
    caption: { en: 'Iteration by iteration, a blurred picture comes back into focus.', es: 'Iteración tras iteración, una imagen borrosa vuelve a enfocarse.' },
    alt: { en: 'A pixel drawing of Monserrate, Bogotá, goes from blurred to sharp as a counter runs to 300 iterations. A schematic, not the project’s photo.', es: 'Un dibujo en píxeles de Monserrate, en Bogotá, pasa de borroso a nítido mientras un contador llega a 300 iteraciones. Es un esquema, no la foto del proyecto.' },
  },
  'AI-04': {
    caption: { en: 'Eleven papers, and everything that connects them.', es: 'Once artículos y todo lo que los conecta.' },
    alt: { en: 'A network with 11 papers linked to their authors, institutions and the projects that funded them, with dashed lines between papers on similar topics. Only the paper count is real; the layout is illustrative.', es: 'Una red con 11 artículos unidos a sus autores, instituciones y los proyectos que los financiaron, con líneas punteadas entre artículos de temas parecidos. Solo el número de artículos es real; la disposición es ilustrativa.' },
  },
  'SEC-01': {
    caption: { en: 'Four controls between a file arriving and a court trusting it.', es: 'Cuatro controles entre que llega un archivo y un juez confía en él.' },
    alt: { en: 'A file arrives and passes four controls in order: a SHA-256 fingerprint, a timestamp, a role check and an audit log. At the end, the fingerprint can be checked against the one taken on arrival.', es: 'Llega un archivo y pasa cuatro controles en orden: una huella SHA-256, un sello de tiempo, un control por rol y un registro de auditoría. Al final, la huella se puede comparar con la que se tomó al llegar.' },
  },
  'SEC-02': {
    caption: { en: 'Normal traffic first, so the odd rows stand out.', es: 'Primero el tráfico normal, para que las filas raras se noten.' },
    alt: { en: 'An illustrative packet capture where four rows from one host probe four ports in a row and are flagged in red, above 52 marks, one per hour of hands-on labs.', es: 'Una captura de paquetes ilustrativa donde cuatro filas de un mismo host prueban cuatro puertos seguidos y quedan marcadas en rojo, sobre 52 marcas, una por cada hora de laboratorio.' },
  },
  'BIZ-01': {
    caption: { en: 'Seventy people, one flow, a fraction of the time.', es: 'Setenta personas, un flujo, una fracción del tiempo.' },
    alt: { en: 'Seventy figures for the colleagues who updated profiles by hand, then a bar for the time per update before and a bar 92 to 97 percent shorter after, and about 900 updates automated.', es: 'Setenta figuras por los colaboradores que actualizaban perfiles a mano, luego una barra con el tiempo por actualización antes y otra entre 92 y 97 por ciento más corta después, y cerca de 900 actualizaciones automatizadas.' },
  },
  'BIZ-02': {
    caption: { en: 'Three agents, three kinds of question.', es: 'Tres agentes, tres tipos de pregunta.' },
    alt: { en: 'Three lanes: compliance documents feed an agent that answers, training and deviation data feed one that builds reports, and approval process changes feed one that gives guidance.', es: 'Tres carriles: los documentos de compliance alimentan un agente que responde, los datos de capacitaciones y desviaciones uno que arma reportes, y los cambios en aprobaciones uno que orienta.' },
  },
  'BIZ-03': {
    caption: { en: 'Eleven months of sites, and a lock at every join.', es: 'Once meses de sitios y un candado en cada conexión.' },
    alt: { en: 'February to December 2024 fill in one by one. A website connects to payments, forms, analytics and outside services, each link marked with a lock. Impact was not measured, so none is claimed.', es: 'De febrero a diciembre de 2024 se llenan uno a uno. Un sitio web se conecta a pagos, formularios, analítica y servicios externos, cada enlace con un candado. El impacto no se midió, así que no se afirma.' },
  },
};

export const exhibitStrings = {
  en: { exhibit: 'Exhibit', fold: 'Gatefold', index: 'In this segment' },
  es: { exhibit: 'Anexo', fold: 'Desplegable', index: 'En este segmento' },
} as const;
