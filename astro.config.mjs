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
  build: { inlineStylesheets: 'always' },
});
