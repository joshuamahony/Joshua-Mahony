# Joshua Mahony — Astro Portfolio & Article CMS

**Branch: `feature/articles-cms` (staging only).** Production `main` and the live Cloudflare Worker are untouched.

## Local development
```bash
npm install
npm run dev
npm run build
```
Visit `http://localhost:4321/`, `/commentary/` and `/admin/`.

The existing homepage is preserved verbatim in `site-source/index.html`, including the embedded JM favicon/logo and professional headshot. `src/pages/index.astro` inserts the latest four published articles into its original commentary section.

The archive and article pages reuse the embedded homepage CSS plus its exact header and footer. Markdown files in `src/content/articles/` are transformed into standalone SEO-friendly URLs. No article HTML page needs to be created manually.

## Publishing workflow
Decap CMS resides at `public/admin/` and writes Markdown to `src/content/articles/`. Dates, categories, headlines, excerpts, and inline images are edited through the CMS. Every commit triggers a Cloudflare build once Git deployment is connected.

**GitHub OAuth is not yet operational.** Set up a secure OAuth bridge (e.g. an appropriately secured Cloudflare Worker) and set `backend.base_url` in `public/admin/config.yml`. Never commit OAuth secrets. Keep publishing to the development branch until production launch.

## Cloudflare test deployment
Create a **new** Cloudflare Worker linked to the development branch (do not overwrite the current Worker). Settings:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build output: `dist/` (static assets configured in `wrangler.jsonc`)
- Connect a preview workers.dev URL first, not the production custom domain.

The site contains no authored articles yet, so the homepage and archive show an empty state. Publish a genuine sample article to test the new workflow.

See `CMS-SETUP.md` for remaining authentication and launch tasks.
