import { defineConfig } from 'astro/config';

// Fully pre-rendered files; Cloudflare Workers serves dist/ as static assets.
export default defineConfig({
  site: 'https://joshua-mahony.com',
  output: 'static',
  trailingSlash: 'always',
});
