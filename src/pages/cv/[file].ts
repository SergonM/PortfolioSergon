import type { APIRoute, GetStaticPaths } from 'astro';
import type { Locale } from '../../i18n/strings';
import { cvFiles, cvFor } from '../../data/cv';
import { buildCvPdf } from '../../lib/cv-pdf';

/** Builds /cv/sergio-gonzalez-cv-en.pdf and /cv/sergio-gonzalez-cv-es.pdf at build time. */
export const getStaticPaths = (() =>
  (Object.keys(cvFiles) as Locale[]).map((locale) => ({ params: { file: cvFiles[locale] }, props: { locale } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const bytes = await buildCvPdf(cvFor(props.locale as Locale));
  // pdf-lib types the bytes as Uint8Array<ArrayBufferLike>; at runtime it is a plain buffer.
  return new Response(bytes as BodyInit, { headers: { 'Content-Type': 'application/pdf' } });
};
