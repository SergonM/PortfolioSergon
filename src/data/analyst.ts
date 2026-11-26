import type { Locale } from '../i18n/strings';

/** Public URL of the Cloudflare Worker (worker/). Empty until it is deployed: the section stays hidden. */
export const ANALYST_URL = 'https://sgm-analyst.sergon20052005.workers.dev';

export const analyst: Record<Locale, {
  kicker: string; title: string; lede: string; operator: string; opening: string; you: string; analyst: string;
  suggestions: string[]; placeholder: string; send: string; thinking: string; busy: string; down: string; empty: string;
  fineprint: string; again: string;
}> = {
  en: {
    kicker: 'Section vii · Questions from the floor',
    title: 'Ask the analyst',
    lede: 'Questions from the floor. The analyst has read every page of this report and nothing else, so if it isn’t here, it will tell you.',
    operator: 'Operator', you: 'You', analyst: 'Analyst',
    opening: 'Good afternoon, and welcome to the Sergio González, Inc. Q&A. Our analyst answers only from this report’s footnotes. The floor is open.',
    suggestions: ['What has he actually built with AI?', 'Is he ready for a security role?', 'What can’t he do yet?', 'Why should we interview him?'],
    placeholder: 'Ask about his projects, skills or fit for a role…',
    send: 'Ask', thinking: 'checking the footnotes', again: 'Ask another',
    busy: 'Too many questions at once. Give the analyst a minute and try again.',
    down: 'The analyst stepped out of the room. Everything it knows is in the report above, and LinkedIn is open.',
    empty: 'Type a question first.',
    fineprint: 'Answers are written by Google Gemini from this site’s public facts only, and can still be wrong: the footnotes win. Your question is sent to Gemini to write the answer, so leave personal data out. Nothing is stored by this site.',
  },
  es: {
    kicker: 'Sección vii · Preguntas del público',
    title: 'Pregúntale al analista',
    lede: 'Preguntas desde el público. El analista leyó cada página de este informe y nada más, así que si algo no está aquí, te lo va a decir.',
    operator: 'Operador', you: 'Tú', analyst: 'Analista',
    opening: 'Buenas tardes y bienvenidos a la sesión de preguntas de Sergio González, Inc. Nuestro analista solo responde con las notas al pie de este informe. Se abre el micrófono.',
    suggestions: ['¿Qué ha construido de verdad con IA?', '¿Está listo para un rol de seguridad?', '¿Qué todavía no sabe hacer?', '¿Por qué deberíamos entrevistarlo?'],
    placeholder: 'Pregunta por sus proyectos, habilidades o encaje en un rol…',
    send: 'Preguntar', thinking: 'revisando las notas al pie', again: 'Otra pregunta',
    busy: 'Demasiadas preguntas a la vez. Dale un minuto al analista y vuelve a intentar.',
    down: 'El analista salió de la sala. Todo lo que sabe está en el informe de arriba, y LinkedIn está abierto.',
    empty: 'Escribe una pregunta primero.',
    fineprint: 'Las respuestas las escribe Google Gemini solo con los datos públicos de este sitio, y aun así puede equivocarse: mandan las notas al pie. Tu pregunta se envía a Gemini para escribir la respuesta, así que no incluyas datos personales. Este sitio no guarda nada.',
  },
};
