// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages: if the repo is named "<user>.github.io" the site lives at the root;
// otherwise it lives under "/<repo>/". The deploy workflow passes these values in.
const site = process.env.SITE_URL ?? 'https://sergonm.github.io';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  build: { inlineStylesheets: 'auto' },
  // Content Security Policy, emitted as a <meta> tag (GitHub Pages cannot send headers).
  // Astro hashes every script and stylesheet it renders, so nothing else can run.
  // style-src-attr stays open: the drawings and GSAP need inline style attributes, and styles cannot run code.
  // connect-src allows the analyst's Cloudflare Worker (any workers.dev name, so renaming the subdomain is safe).
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.workers.dev",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "manifest-src 'self'",
        'upgrade-insecure-requests',
      ],
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
      scriptDirective: { resources: ["'self'"] },
    },
  },
});
