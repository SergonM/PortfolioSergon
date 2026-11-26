import type { Locale } from '../i18n/strings';

/**
 * Section iv: the neonatal investigation, told as a scrolling story.
 * Every figure comes from the project report (Uniandes, Business Intelligence 2024-2, 15 Nov 2024)
 * or the DANE data dictionary. Raw DANE microdata never ships with the site.
 */
type L = Record<Locale, string>;

export type InvState = 'line' | 'years' | 'schema' | 'z4' | 'z32' | 'end';

export interface InvStep { state: InvState; kicker: L; title: L; body: L; note?: L }

export const inv = {
  kicker: { en: 'Section iv · Featured investigation', es: 'Sección iv · Investigación destacada' },
  title: { en: 'Why are some babies born under 2,500 grams?', es: '¿Por qué algunos bebés nacen con menos de 2.500 gramos?' },
  byline: { en: 'Uniandes · Business Intelligence · Nov 2024 · team of 3', es: 'Uniandes · Inteligencia de Negocios · nov 2024 · equipo de 3' },
  lede: {
    en: 'Low birth weight is one of the earliest warning signs a newborn can carry. With two classmates, I went through four years of Colombian birth records to see who is most exposed and why.',
    es: 'El bajo peso al nacer es una de las primeras señales de alerta que puede traer un recién nacido. Con dos compañeros revisé cuatro años de registros de nacimientos en Colombia para ver quién está más expuesto y por qué.',
  },
  source: {
    en: 'Source: DANE, Estadísticas Vitales (births), 2017, 2018, 2021 and 2022. Analysis: project report “Análisis de factores que impactan la salud neonatal en Colombia”, Uniandes, 2024.',
    es: 'Fuente: DANE, Estadísticas Vitales (nacimientos), 2017, 2018, 2021 y 2022. Análisis: informe del proyecto “Análisis de factores que impactan la salud neonatal en Colombia”, Uniandes, 2024.',
  },
} as const;

export const steps: InvStep[] = [
  {
    state: 'line',
    kicker: { en: '01 · The line', es: '01 · La línea' },
    title: { en: 'Under 2,500 grams, a baby starts behind.', es: 'Por debajo de 2.500 gramos, un bebé arranca en desventaja.' },
    body: {
      en: 'That is the medical definition of low birth weight, and one of the strongest early signals of illness or death around birth. DANE records every birth in weight bands, from under 1,000 grams to over 4,000. Most Colombian babies land between 2,500 and 3,499.',
      es: 'Esa es la definición médica de bajo peso al nacer, y una de las señales tempranas más fuertes de enfermedad o muerte alrededor del parto. El DANE registra cada nacimiento por rangos de peso, desde menos de 1.000 gramos hasta más de 4.000. La mayoría de bebés en Colombia cae entre 2.500 y 3.499.',
    },
  },
  {
    state: 'years',
    kicker: { en: '02 · The data', es: '02 · Los datos' },
    title: { en: 'Four years of births, more than a million records.', es: 'Cuatro años de nacimientos, más de un millón de registros.' },
    body: {
      en: 'We used DANE’s birth records for 2017, 2018, 2021 and 2022. Each one says how much the baby weighed, how many weeks the pregnancy lasted, the mother’s age and schooling, how many prenatal check-ups she had, her health insurance and where she lives.',
      es: 'Usamos los registros de nacimientos del DANE de 2017, 2018, 2021 y 2022. Cada uno dice cuánto pesó el bebé, cuántas semanas duró el embarazo, la edad y los estudios de la madre, cuántos controles prenatales tuvo, su afiliación a salud y dónde vive.',
    },
    note: { en: '2019 and 2020 were not part of the study.', es: '2019 y 2020 no hicieron parte del estudio.' },
  },
  {
    state: 'schema',
    kicker: { en: '03 · The warehouse', es: '03 · La bodega' },
    title: { en: 'One number in the middle, everything that could explain it around it.', es: 'Un número en el centro y, alrededor, todo lo que podría explicarlo.' },
    body: {
      en: 'We built a data warehouse with a star design: the birth weight sits in the centre, and six tables around it describe the baby, the pregnancy, the date, the place, the mother and the parents. Before loading anything, the ETL dropped impossible values and filled gaps, and three Power BI dashboards sat on top.',
      es: 'Construimos una bodega de datos con diseño en estrella: el peso al nacer queda en el centro y seis tablas alrededor describen al bebé, el embarazo, la fecha, el lugar, la madre y los padres. Antes de cargar nada, el ETL quitó valores imposibles y llenó vacíos, y encima pusimos tres tableros en Power BI.',
    },
  },
  {
    state: 'z4',
    kicker: { en: '04 · First test', es: '04 · Primera prueba' },
    title: { en: 'Mothers with more schooling had fewer underweight babies.', es: 'Las madres con más estudios tuvieron menos bebés con bajo peso.' },
    body: {
      en: 'Could that be luck? If the mother’s education made no difference, a gap this big would show up about 5 times in 100,000. So we ruled out chance.',
      es: '¿Pudo ser suerte? Si los estudios de la madre no importaran, una diferencia así aparecería unas 5 veces de cada 100.000. Así que descartamos el azar.',
    },
    note: { en: 'Two-proportion Z test, low vs high maternal education: Z = 4.04, p = 5.4 × 10⁻⁵.', es: 'Prueba Z de dos proporciones, educación materna baja vs alta: Z = 4,04, p = 5,4 × 10⁻⁵.' },
  },
  {
    state: 'z32',
    kicker: { en: '05 · Second test', es: '05 · Segunda prueba' },
    title: { en: 'Where the mother lives mattered far more.', es: 'Dónde vive la madre pesó muchísimo más.' },
    body: {
      en: 'Comparing city and countryside, the result landed so far from chance that the curve had to shrink to fit it on the page. The probability that it was luck starts with 222 zeros after the decimal point.',
      es: 'Al comparar ciudad y campo, el resultado quedó tan lejos del azar que la curva tuvo que encogerse para que cupiera en la página. La probabilidad de que fuera suerte empieza con 222 ceros después de la coma.',
    },
    note: { en: 'Urban vs rural: Z = 31.86, p = 8.7 × 10⁻²²³. With this many records even small gaps become significant, so the size of the gap is a separate question.', es: 'Urbano vs rural: Z = 31,86, p = 8,7 × 10⁻²²³. Con tantos registros hasta una diferencia pequeña sale significativa; qué tan grande es, es otra pregunta.' },
  },
  {
    state: 'end',
    kicker: { en: '06 · What it means', es: '06 · Qué significa' },
    title: { en: 'Two levers outside the hospital: school and distance.', es: 'Dos palancas fuera del hospital: el colegio y la distancia.' },
    body: {
      en: 'Teenage mothers and older mothers also had more underweight babies than young adults. The report closes with two recommendations: invest in mothers’ education and bring prenatal care closer to rural areas. What the records can’t show is just as important: nutrition and the mother’s illnesses are not in the data.',
      es: 'Las madres adolescentes y las de más edad también tuvieron más bebés con bajo peso que las adultas jóvenes. El informe cierra con dos recomendaciones: invertir en la educación de las madres y acercar el control prenatal a las zonas rurales. Lo que los registros no muestran importa igual: la nutrición y las enfermedades de la madre no están en los datos.',
    },
  },
];

/** Figure labels. */
export const fig = {
  en: {
    grams: 'grams', low: 'Low birth weight', ok: 'Expected range', line: '2,500 g',
    bands: ['<1,000', '1,500', '2,000', '2,500', '3,000', '3,500', '4,000+'],
    outOfStudy: 'not in study', records: 'records',
    centre: 'Birth weight', dims: ['Newborn', 'Pregnancy', 'Date', 'Place', 'Mother', 'Parents'],
    chance: 'What chance looks like', bar: 'usual bar', edu: 'Mother’s schooling', area: 'City or countryside',
    zeros: 'p = 0.', zerosTail: '869…',
    sig: 'Not chance', sigA: 'Mother’s schooling', sigB: 'City or countryside', blind: 'Not in the data: nutrition, illness',
  },
  es: {
    grams: 'gramos', low: 'Bajo peso al nacer', ok: 'Rango esperado', line: '2.500 g',
    bands: ['<1.000', '1.500', '2.000', '2.500', '3.000', '3.500', '4.000+'],
    outOfStudy: 'fuera del estudio', records: 'registros',
    centre: 'Peso al nacer', dims: ['Recién nacido', 'Embarazo', 'Fecha', 'Lugar', 'Madre', 'Padres'],
    chance: 'Así se ve el azar', bar: 'umbral usual', edu: 'Estudios de la madre', area: 'Ciudad o campo',
    zeros: 'p = 0,', zerosTail: '869…',
    sig: 'No es azar', sigA: 'Estudios de la madre', sigB: 'Ciudad o campo', blind: 'Fuera de los datos: nutrición, enfermedades',
  },
} as const;
