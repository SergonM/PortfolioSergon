import type { Locale } from '../i18n/strings';

/**
 * Section vi, the auditor's report: a short opinion, the STRIDE threat model of the site and its
 * Worker (folded away), and the hidden audit for the curious. Every control listed here exists in
 * the code: CSP in astro.config.mjs, limits in worker/src/index.ts, the CTF in worker/src/audit.ts.
 */

export interface StrideRow { letter: string; name: string; threat: string; control: string; residual: string }

export const auditor: Record<Locale, {
  kicker: string; title: string; opinionLabel: string; opinion: string[]; verdict: string; signed: string;
  strideSummary: string; strideHead: [string, string, string]; stride: StrideRow[]; limitation: string;
  ctfKicker: string; ctfTitle: string; ctfLede: string; seals: [string, string, string];
  inputLabel: string; placeholder: string; verify: string; noscript: string;
  msg: { ok: string; again: string; wrong: string; down: string; busy: string; empty: string; all: string };
  signLabel: string; signPlaceholder: string; sign: string; signed1: string; signErr: string;
  hallTitle: string; hallEmpty: string; hallClosed: string;
}> = {
  en: {
    kicker: 'Section vi · Auditor’s report',
    title: 'Independent auditor’s report',
    opinionLabel: 'Opinion',
    opinion: [
      'We examined this site and the one small server behind it against the six classic threats (STRIDE).',
      'In our opinion, it keeps its only secret where it belongs, runs no code it did not build, and says plainly what it cannot protect.',
    ],
    verdict: 'Unqualified, subject to your own audit.',
    signed: 'The auditor of record is the reader.',
    strideSummary: 'Key audit matters: the threat model, in six lines',
    strideHead: ['Threat', 'Control', 'What is left'],
    stride: [
      { letter: 'S', name: 'Spoofing', threat: 'Another website uses the analyst, and its free quota.', control: 'The Worker answers only to this site’s address. The Gemini key is a Worker secret, never in the page or the repository.', residual: 'A script can fake its origin. The per-visitor limit caps the damage.' },
      { letter: 'T', name: 'Tampering', threat: 'Someone injects code into the page.', control: 'No third-party scripts or fonts. A content security policy runs only the scripts this site built, each pinned by its hash. Deploys come only from reviewed pull requests.', residual: 'Inline style attributes are allowed, because the animated drawings need them. Styles cannot run code.' },
      { letter: 'R', name: 'Repudiation', threat: 'A change nobody can account for.', control: 'Every change is a merged pull request with a public build log. Hall of fame entries are dated.', residual: 'Not every commit is cryptographically signed yet.' },
      { letter: 'I', name: 'Information disclosure', threat: 'The key, an employer’s confidential detail or a patient’s record leaks.', control: 'The key lives only in Cloudflare. The analyst reads only this report’s public facts. The investigation ships totals, never a single birth record. Work for employers is described by its impact only.', residual: 'What you type into the analyst goes to Google Gemini to write the answer.' },
      { letter: 'D', name: 'Denial of service', threat: 'Bots burn the free tier and the analyst goes quiet.', control: '8 questions per minute per visitor, 500 characters per question, 6 turns of memory, a cap on answer length.', residual: 'If the daily quota runs out, the analyst says so and the report still reads in full.' },
      { letter: 'E', name: 'Elevation of privilege', threat: 'A prompt injection turns the analyst into something else.', control: 'A fixed brief: answer only about Sergio, only from the facts, citing them. The model has no tools, no database and nothing to escalate to.', residual: 'It can still be wrong. The footnotes win.' },
    ],
    limitation: 'Limitation of scope: GitHub Pages cannot send security headers, so the policy travels in a meta tag, and framing rules and HSTS stay with GitHub. Accepted: nothing on this page is worth clickjacking.',
    ctfKicker: 'Invitation to audit',
    ctfTitle: 'Three working papers are hidden in this site.',
    ctfLede: 'Each one is harder than the last. The first starts in the page source. Find all three and sign the hall of fame.',
    seals: ['In the source', 'In the envelope', 'In the vault'],
    inputLabel: 'Submit a working paper',
    placeholder: 'SGM{…}',
    verify: 'Verify',
    noscript: 'Verifying papers needs JavaScript. The rest of the report does not.',
    msg: {
      ok: 'Paper {n} of 3 verified.',
      again: 'Paper {n} was already on file.',
      wrong: 'Not one of ours. Keep auditing.',
      down: 'The auditor’s server is out. Paper 1 still checks here; try the others later.',
      busy: 'Too many submissions at once. Wait a minute.',
      empty: 'Paste a paper first. They look like SGM{…}.',
      all: 'All three on file. Sign the hall of fame.',
    },
    signLabel: 'Sign as',
    signPlaceholder: 'Your name or handle',
    sign: 'Sign',
    signed1: 'Signed. You are auditor no. {n}.',
    signErr: 'The hall of fame did not take it. Letters, numbers, spaces, . _ - only, 24 at most.',
    hallTitle: 'Auditors of record',
    hallEmpty: 'No signatures yet. The first line is yours.',
    hallClosed: 'The hall of fame opens with the server.',
  },
  es: {
    kicker: 'Sección vi · Informe del auditor',
    title: 'Informe del auditor independiente',
    opinionLabel: 'Opinión',
    opinion: [
      'Examinamos este sitio y el único servidor pequeño que lo acompaña frente a las seis amenazas clásicas (STRIDE).',
      'En nuestra opinión, guarda su único secreto donde corresponde, no ejecuta código que no haya construido y dice con claridad lo que no puede proteger.',
    ],
    verdict: 'Sin salvedades, sujeto a tu propia auditoría.',
    signed: 'El auditor oficial es quien lee.',
    strideSummary: 'Asuntos clave de auditoría: el modelo de amenazas, en seis líneas',
    strideHead: ['Amenaza', 'Control', 'Lo que queda'],
    stride: [
      { letter: 'S', name: 'Suplantación', threat: 'Otro sitio usa al analista, y su cuota gratuita.', control: 'El Worker solo responde a la dirección de este sitio. La clave de Gemini es un secreto del Worker, nunca está en la página ni en el repositorio.', residual: 'Un script puede falsear su origen. El límite por visitante acota el daño.' },
      { letter: 'T', name: 'Manipulación', threat: 'Alguien inyecta código en la página.', control: 'Ni scripts ni fuentes de terceros. Una política de seguridad de contenido solo ejecuta los scripts que este sitio construyó, cada uno fijado por su hash. Solo se despliega desde pull requests revisados.', residual: 'Se permiten atributos de estilo en línea, porque los dibujos animados los necesitan. Un estilo no ejecuta código.' },
      { letter: 'R', name: 'Repudio', threat: 'Un cambio del que nadie responde.', control: 'Cada cambio es un pull request fusionado con su registro de build público. Las entradas del salón de la fama llevan fecha.', residual: 'Todavía no todos los commits están firmados criptográficamente.' },
      { letter: 'I', name: 'Divulgación de información', threat: 'Se filtra la clave, un dato confidencial de un empleador o el registro de una paciente.', control: 'La clave vive solo en Cloudflare. El analista lee solo los datos públicos de este informe. La investigación publica totales, nunca un nacimiento individual. El trabajo para empleadores se describe solo por su impacto.', residual: 'Lo que escribes al analista va a Google Gemini para redactar la respuesta.' },
      { letter: 'D', name: 'Denegación de servicio', threat: 'Unos bots gastan la cuota gratuita y el analista se queda callado.', control: '8 preguntas por minuto por visitante, 500 caracteres por pregunta, 6 turnos de memoria y un tope al largo de la respuesta.', residual: 'Si se acaba la cuota del día, el analista lo dice y el informe se sigue leyendo completo.' },
      { letter: 'E', name: 'Elevación de privilegios', threat: 'Una inyección de prompt convierte al analista en otra cosa.', control: 'Un encargo fijo: responder solo sobre Sergio, solo con los datos y citándolos. El modelo no tiene herramientas, ni base de datos, ni a dónde escalar.', residual: 'Aun así puede equivocarse. Mandan las notas al pie.' },
    ],
    limitation: 'Limitación del alcance: GitHub Pages no permite enviar cabeceras de seguridad, así que la política viaja en una etiqueta meta, y las reglas de enmarcado y HSTS quedan en manos de GitHub. Aceptado: nada en esta página vale un clickjacking.',
    ctfKicker: 'Invitación a auditar',
    ctfTitle: 'En este sitio hay tres papeles de trabajo escondidos.',
    ctfLede: 'Cada uno es más difícil que el anterior. El primero empieza en el código fuente. Encuentra los tres y firma el salón de la fama.',
    seals: ['En el código', 'En el sobre', 'En la bóveda'],
    inputLabel: 'Entrega un papel de trabajo',
    placeholder: 'SGM{…}',
    verify: 'Verificar',
    noscript: 'Verificar papeles necesita JavaScript. El resto del informe, no.',
    msg: {
      ok: 'Papel {n} de 3 verificado.',
      again: 'El papel {n} ya estaba archivado.',
      wrong: 'No es de los nuestros. Sigue auditando.',
      down: 'El servidor del auditor no responde. El papel 1 se verifica aquí; los otros, más tarde.',
      busy: 'Demasiadas entregas a la vez. Espera un minuto.',
      empty: 'Pega un papel primero. Se ven así: SGM{…}.',
      all: 'Los tres archivados. Firma el salón de la fama.',
    },
    signLabel: 'Firmar como',
    signPlaceholder: 'Tu nombre o alias',
    sign: 'Firmar',
    signed1: 'Firmado. Eres el auditor n.º {n}.',
    signErr: 'El salón de la fama no lo aceptó. Solo letras, números, espacios y . _ -, máximo 24.',
    hallTitle: 'Auditores oficiales',
    hallEmpty: 'Todavía no hay firmas. La primera línea es tuya.',
    hallClosed: 'El salón de la fama abre con el servidor.',
  },
};
