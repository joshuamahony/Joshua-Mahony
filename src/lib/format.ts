import { getCollection } from 'astro:content';

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);

export const getPublishedArticles = async () =>
  (await getCollection('articles')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
}
