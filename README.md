# Isah Philip — Automation & Integration

Static Astro portfolio with TypeScript, shared CSS tokens, Markdown Content Collections, original system diagrams, self-hosted fonts, and optimized local images.

## Local setup

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/portfolio/`. Production verification:

```sh
npm run build
npm test
npm run preview -- --port 4321 --ignore-lock
```

Local tests use installed Google Chrome. On a machine without Chrome, install Playwright Chromium and remove the local `channel: 'chrome'` option in `playwright.config.ts`. CI already uses Chromium:

```sh
npx playwright install --with-deps chromium
```

## Profile and contact details

Edit `src/config.ts`. It contains the public name, email, LinkedIn, draft bio, tools, domain, and base path. The GitHub Pages production address is `https://isahphilip.github.io/portfolio/`.

## Add or edit a project

Create one Markdown file in `src/content/projects/` and add its local images to `src/assets/`. Copy the frontmatter from an existing project. `cover` resolves relative to the Markdown file; the same content entry drives the homepage selector, Works card, and case-study route. `order` controls ordering, `featured` controls the homepage, and `draft: true` excludes an entry from all published routes.

Use these level-two headings for a case study: The problem, Existing workflow, System design, Implementation, Testing, Results. Add inline images with relative Markdown paths. Astro optimizes local images at build time.

## Assets and demo content

All three projects are clearly labeled demonstrations with synthetic data, proposed implementation steps, and acceptance-test plans. Replace them with verified work before presenting them as client engagements. No outcomes, metrics, or testimonials are claimed.

The biography and service descriptions are original draft copy for review. No personal photography or résumé was supplied. The initials graphic is intentional. A résumé link appears only after a real file is placed in `public/` and configured in `src/config.ts`.

Original cover source SVGs and exported PNGs are in `src/assets/`. Run `node scripts/create-covers.mjs` to regenerate them and the social image. Replace the covers with actual screenshots when available, update `coverAlt`, and preserve meaningful alternative text.

## Static deployment

GitHub Pages is configured to deploy from Actions. `.github/workflows/deploy.yml` installs from the lockfile, checks TypeScript, builds static HTML to `dist/`, runs Playwright at 390px, 768px, and 1440px, and deploys that same verified output. Pull requests run verification without deployment. A push to `main` deploys after verification succeeds. No third-party deployment token is required; GitHub uses its short-lived workflow identity.

For a different host, upload `dist/` after `npm run build`, configure the custom 404 as `404.html`, and set `site.url` and `site.base` in `src/config.ts`. For a root-domain deployment use an empty base. Keep trailing slash routing enabled. No runtime server, environment secrets, or database is required.

Reference inspection notes are in `docs/reference-review.md`. Playwright reports are written to `playwright-report/` and retained as CI artifacts.
