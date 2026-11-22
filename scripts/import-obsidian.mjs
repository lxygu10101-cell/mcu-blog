import { readFile, writeFile, mkdir, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { noteSlug } from './remark-obsidian.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = name => {const index=args.indexOf(name);return index<0?null:args[index+1];};
const inside = (root,file) => {const relative=path.relative(root,file);return !relative.startsWith('..')&&!path.isAbsolute(relative);};
async function exists(file){try{return await readFile(file);}catch(error){if(error.code==='ENOENT')return null;throw error;}}
try {
  if(!args[0]||args[0].startsWith('--'))throw Error('用法：npm run import:note -- "笔记.md" --vault "笔记库目录" --slug article-name');
  const source=await realpath(path.resolve(args[0]));
  const vault=await realpath(path.resolve(option('--vault') || path.dirname(source)));
  if(!inside(vault,source)||!source.toLowerCase().endsWith('.md'))throw Error('请选择笔记库内的一篇 Markdown 文件。');
  const slug=option('--slug')||noteSlug(path.basename(source));
  if(!/^[\p{L}\p{N}_-]+$/u.test(slug)||slug.startsWith('_'))throw Error('文章标识只允许文字、数字、连字符和下划线，且不能以下划线开头。');
  const destination=path.join(project,'src/content/blog',`${slug}.md`);
  if(await exists(destination))throw Error(`文章已存在，未覆盖：${slug}.md`);
  const original=await readFile(source,'utf8');
  const body=original.replace(/^\uFEFF?/,'').replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/,'');
  const refs=[...body.matchAll(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]|!\[[^\]]*\]\(([^)]+)\)/g)].map(match=>match[1]||match[2]).filter(ref=>!/^https?:\/\//i.test(ref));
  const all=[];
  async function index(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.isSymbolicLink()||['.obsidian','.git','node_modules'].includes(entry.name))continue;const file=path.join(dir,entry.name);if(entry.isDirectory())await index(file);else if(/\.(png|jpe?g|webp|gif|svg|mp4|webm)$/i.test(entry.name))all.push(file);}}
  if(refs.length)await index(vault);
  const media=[];let rewritten=body;
  for(const ref of new Set(refs)){
    const decoded=decodeURIComponent(ref.replace(/^<|>$/g,''));
    if(!/\.(png|jpe?g|webp|gif|svg|mp4|webm)$/i.test(decoded))throw Error(`不支持的嵌入附件：${decoded}。请改用标准链接。`);
    const direct=[path.resolve(path.dirname(source),decoded),path.resolve(vault,decoded)].filter(file=>inside(vault,file));
    let matches=all.filter(file=>direct.includes(file));
    if(!matches.length)matches=all.filter(file=>path.basename(file)===path.basename(decoded));
    matches=[...new Set(matches)];
    if(matches.length!==1)throw Error(`附件缺失或名称不唯一：${decoded}`);
    const file=await realpath(matches[0]);if(!inside(vault,file))throw Error('附件不能位于笔记库之外。');
    const filename=path.basename(file);const bytes=await readFile(file);const output=path.join(project,'public/media',filename);const prior=await exists(output);
    if(prior&&!prior.equals(bytes))throw Error(`网站已有不同内容的同名附件：${filename}，请重命名后导入。`);
    if(media.some(item=>item.output===output&&!item.bytes.equals(bytes)))throw Error(`导入附件重名：${filename}`);
    media.push({output,bytes});
    rewritten=rewritten.replaceAll(`](${ref})`, `](../../media/${encodeURIComponent(filename)})`);
  }
  const frontmatter=`---\ntitle: ${JSON.stringify(path.basename(source,'.md'))}\ndescription: "请填写文章摘要"\ndate: ${new Date().toISOString().slice(0,10)}\ncategory: 开发笔记\ntags: [Obsidian]\ndraft: true\n---\n\n`;
  await mkdir(path.dirname(destination),{recursive:true});await mkdir(path.join(project,'public/media'),{recursive:true});
  for(const item of media)await writeFile(item.output,item.bytes,{flag:'wx'}).catch(error=>{if(error.code!=='EEXIST')throw error;});
  await writeFile(destination,frontmatter+rewritten,{flag:'wx'});
  console.log(`已导入草稿 ${slug}.md 与 ${media.length} 个引用附件。请检查标题、摘要、链接和内容；确认后将 draft 改为 false。原有属性已替换为新的草稿属性。`);
} catch(error) {console.error(`导入停止：${error.message}`);process.exitCode=1;}
