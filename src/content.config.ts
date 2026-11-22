import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const common = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
};
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({ ...common, category: z.string().default('开发笔记') }),
});
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({ ...common, cover: z.string(), status: z.string().default('示例项目'), featured: z.boolean().default(false), video: z.string().optional(), repository: z.string().url().optional() }),
});
export const collections = { blog, projects };
