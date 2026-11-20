import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { execFileSync } from 'node:child_process';

/**
 * Sitemap generated at build time, including every article currently in the CMS.
 *
 * Google recommends <lastmod> only when it reflects the last substantive
 * modification of the actual page. For each article we use the most recent
 * Git commit that touched its Markdown source file. If the history cannot
 * be verified, omit <lastmod> rather than claiming the build date.
 */
const repository = 'joshuamahony/Joshua-Mahony';
const branch = 'feature/articles-cms';

function gitLastModified(path: string): string | undefined {
  try {
    // A shallow checkout may only know the deployment commit, not the
    // article's real latest change. Never use that as a lastmod date.
    const isShallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      encoding: 'utf8', timeout: 3000,
    }).trim() === 'true';
    if (isShallow) return undefined;
    const date = execFileSync('git', ['log', '-1', '--format=%cI', '--', path], {
      encoding: 'utf8', timeout: 3000,
    }).trim();
    return date && !Number.isNaN(Date.parse(date)) ? date.slice(0, 10) : undefined;
  } catch {
    return undefined;
  }
}

async function githubLastModified(path: string): Promise<string | undefined> {
  try {
    const endpoint = new URL(`https://api.github.com/repos/${repository}/commits`);
    endpoint.searchParams.set('path', path);
    endpoint.searchParams.set('sha', branch);
    endpoint.searchParams.set('per_page', '1');
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'joshua-mahony-sitemap-build',
      },
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) return undefined;
    const commits = await response.json() as Array<{
      commit?: { committer?: { date?: string }; author?: { date?: string } };
    }>;
    const date = commits[0]?.commit?.committer?.date ?? commits[0]?.commit?.author?.date;
    return date && !Number.isNaN(Date.parse(date)) ? date.slice(0, 10) : undefined;
  } catch {
    return undefined;
  }
}

const escapeXml = (text: string) => text.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char] || char);

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const origin = 'https://joshua-mahony.com';
  const urls: Array<{ path: string; lastmod?: string }> = [
    { path: '/' },
    { path: '/commentary/' },
  ];

  // Article filenames are the permanent URL identifiers in this Astro site.
  // GitHub's latest commit touching each file is independent of deploy time.
  const articleUrls = await Promise.all(articles.map(async ({ id }) => {
    const path = `src/content/articles/${id}.md`;
    const lastmod = gitLastModified(path) ?? await githubLastModified(path);
    return { path: `/commentary/${encodeURIComponent(id)}/`, lastmod };
  }));
  urls.push(...articleUrls);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ path, lastmod }) =>
  `  <url><loc>${escapeXml(origin + path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
).join('\n')}
</urlset>`;
  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
