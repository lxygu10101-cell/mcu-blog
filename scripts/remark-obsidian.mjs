export const noteSlug = (value) => value.trim().replace(/\.md$/i, '').split(/[\\/]/).pop().toLowerCase().replace(/\s+/g, '-');

export default function obsidian({ base = '/' } = {}) {
  const root = base.replace(/\/$/, '');
  return (tree) => {
    const walk = (node) => {
      if (!node.children || node.type === 'code' || node.type === 'inlineCode' || node.type === 'link') return;
      node.children = node.children.flatMap((child) => {
        if (child.type === 'image' && /^(\.\.\/)+media\//.test(child.url)) child.url = `${root}/media/${child.url.split('/media/')[1]}`;
        if (child.type !== 'text') { walk(child); return [child]; }
        const parts = []; let from = 0;
        const pattern = /(!?)\[\[([^\]]+)\]\]|==([^=\n]+)==/g;
        for (const match of child.value.matchAll(pattern)) {
          if (match.index > from) parts.push({ type: 'text', value: child.value.slice(from, match.index) });
          if (match[3]) parts.push({ type: 'html', value: '<mark>' }, { type: 'text', value: match[3] }, { type: 'html', value: '</mark>' });
          else {
            const [target, alias] = match[2].split('|');
            const [file, heading] = target.split('#');
            if (match[1]) {
              if (/\.(png|jpe?g|webp|gif|svg)$/i.test(file)) parts.push({ type: 'image', url: `${root}/media/${encodeURIComponent(file.split(/[\\/]/).pop())}`, alt: alias || file });
              else parts.push({ type: 'text', value: `[附件：${target}，请改用标准 Markdown 或 HTML 视频标签]` });
            } else {
              const anchor = heading ? `#${encodeURIComponent(heading.toLowerCase().replace(/\s+/g, '-'))}` : '';
              parts.push({ type: 'link', url: file ? `${root}/blog/${encodeURIComponent(noteSlug(file))}/${anchor}` : anchor, children: [{ type: 'text', value: alias || heading || file }] });
            }
          }
          from = match.index + match[0].length;
        }
        if (from < child.value.length) parts.push({ type: 'text', value: child.value.slice(from) });
        return parts.length ? parts : [child];
      });
    };
    walk(tree);
  };
}
