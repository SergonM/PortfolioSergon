# Sergio González, Inc. — Annual Report 2026

Portfolio site built as the annual report of a company whose product is one engineer.

- **Stack:** Astro + TypeScript + hand-written CSS. GSAP arrives in Phase 3.
- **Visual direction:** "Serie 0001", security-print paper (guilloché, micro-text, serial numbers, seal).
- **Languages:** English at `/`, Spanish at `/es/`.
- **Hosting:** GitHub Pages, built and deployed by GitHub Actions. Zero cost.

## How it deploys

Every push to `main` runs `.github/workflows/deploy.yml`: install, build, publish to Pages.
Pull requests run the build only, so a broken change shows up as a red check before merge.

The workflow detects the repo name. A repo named `sergonm.github.io` publishes at the root;
any other name publishes at `https://sergonm.github.io/<repo>/`.

## One-time setup (from the phone)

1. Repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Optional, to serve at `https://sergonm.github.io/`: Settings → General → rename the repo to `sergonm.github.io`.

## Local development (optional)

```
npm ci
npm run dev
```
