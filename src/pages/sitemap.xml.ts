import type { APIRoute } from 'astro';

// Two editions of one report. Each URL lists its translation so search engines pair them.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const today = new Date().toISOString().slice(0, 10);
  const urls = ['', 'investigation/'].map((slug) => {
    const en = new URL(`${base}${slug}`, site).href;
    const es = new URL(`${base}es/${slug}`, site).href;
    const alt = `<xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="es" href="${es}"/><xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>`;
    return [en, es].map((loc) => `<url><loc>${loc}</loc><lastmod>${today}</lastmod>${alt}</url>`).join('');
  }).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
