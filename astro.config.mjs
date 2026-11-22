import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import obsidian from './scripts/remark-obsidian.mjs';

const repository = process.env.GITHUB_REPOSITORY || 'lxygu10101-cell/mcu-blog';
const [owner, name] = repository.split('/');
const base = process.env.SITE_BASE ?? (name === `${owner}.github.io` ? '/' : `/${name}/`);
export default defineConfig({
  site: process.env.SITE_URL || `https://${owner}.github.io`,
  base,
  output: 'static',
  trailingSlash: 'always',
  markdown: { processor: unified({ remarkPlugins: [[obsidian, { base }]] }), shikiConfig: { theme: 'github-dark' } },
  devToolbar: { enabled: false },
});
