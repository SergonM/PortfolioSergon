import type { Locale } from '../i18n/strings';

/** Public contact details. Source: profile.md [IR]. The phone number is never published. */
export const contact = {
  /** Assembled in the browser; without JS the page shows the "at"/"dot" spelling, never a mailto. */
  email: { user: 'sergioag_2005', domain: 'yahoo', tld: 'com' },
  linkedin: 'https://www.linkedin.com/in/sergonm/',
  github: 'https://github.com/SergonM',
  tryhackme: 'https://tryhackme.com/p/xSergonMx',
  repo: 'https://github.com/SergonM/PortfolioSergon',
};

/** The CV PDF is generated at build time from src/data (see src/pages/cv/). */
export const cvFile = (locale: Locale) => `cv/sergio-gonzalez-cv-${locale}.pdf`;
export const cvHref = (locale: Locale) => `${import.meta.env.BASE_URL}${cvFile(locale)}`;
