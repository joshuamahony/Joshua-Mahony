import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Generated automatically at build time whenever GitHub CMS content changes.
 * Includes the homepage, article index and all published market commentary.
 */
export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const origin = 'https://joshua-mahony.com';
  const pages = ['/', '/commentary/', ...articles.map(({ id }) => `/commentary/${encodeURIComponent(id)}/`)];
  const xmlEscape = (text: string) => text.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[char] || char);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((path) => `  <url><loc>${xmlEscape(origin + path)}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
