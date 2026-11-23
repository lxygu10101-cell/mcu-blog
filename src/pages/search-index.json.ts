import { getCollection } from 'astro:content';
import { url } from '../lib/site';

export async function GET() {
  const rows = [];

  for (const collection of ['blog', 'projects'] as const) {
    const entries = await getCollection(collection, ({ data }) => !data.draft);
    for (const entry of entries) {
      rows.push({
        title: entry.data.title,
        description: entry.data.description,
        tags: entry.data.tags,
        type: collection === 'blog' ? '博客' : '项目',
        href: url(`${collection}/${entry.id}/`),
        text: (entry.body || '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/[#*`>\[\]]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
      });
    }
  }

  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
