import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const originalPath = fileURLToPath(new URL('../../site-source/index.html', import.meta.url));
export const original = readFileSync(originalPath, 'utf8');
export const originalCSS = original.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
export const faviconTags = [...original.matchAll(/<link rel="(?:icon|apple-touch-icon)"[^>]*>/g)].map(m => m[0]).join('\n');
export const headerHtml = (original.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] ?? '').replace(/href="#/g, 'href="/#');
export const footerHtml = (original.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? '').replace(/href="#top"/g, 'href="/#top"');
