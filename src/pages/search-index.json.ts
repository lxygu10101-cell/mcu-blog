import { getCollection } from 'astro:content';
import { url } from '../lib/site';
export async function GET(){
  const rows=[];
  for(const collection of ['blog','projects'] as const){
    for(const entry of await getCollection(collection,({data})=>!data.draft))rows.push({title:entry.data.title,description:entry.data.description,tags:entry.data.tags,type:collection==='blog'?'开发手记':'项目作品集',href:url(`${collection}/${entry.id}/`),text:(entry.body||'').replace(/<[^>]*>/g,' ').replace(/[#*`>\[\]]/g,' ')});
  }
  return new Response(JSON.stringify(rows),{headers:{'Content-Type':'application/json; charset=utf-8'}});
}
