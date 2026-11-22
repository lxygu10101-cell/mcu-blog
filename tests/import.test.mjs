import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

test('import selects one note, copies referenced media and protects existing content',async()=>{
  const prefix=path.join(os.tmpdir(),'mcu-blog-test-');
  const temp=await mkdtemp(prefix);
  try{
    const project=path.join(temp,'project'),vault=path.join(temp,'vault');
    await mkdir(path.join(project,'scripts'),{recursive:true});await mkdir(path.join(vault,'attachments'),{recursive:true});
    for(const name of ['import-obsidian.mjs','remark-obsidian.mjs'])await copyFile(path.resolve('scripts',name),path.join(project,'scripts',name));
    await writeFile(path.join(vault,'chosen.md'),'---\ntitle: Original\ndraft: false\n---\n# Selected\n![[board.svg]]\n');
    await writeFile(path.join(vault,'private.md'),'This unrelated note must not be imported.');
    await writeFile(path.join(vault,'attachments/board.svg'),'<svg xmlns="http://www.w3.org/2000/svg"/>');
    const run=()=>execFileSync(process.execPath,[path.join(project,'scripts/import-obsidian.mjs'),path.join(vault,'chosen.md'),'--vault',vault,'--slug','imported'],{encoding:'utf8',stdio:'pipe'});
    run();
    const draft=await readFile(path.join(project,'src/content/blog/imported.md'),'utf8');
    assert.match(draft,/draft: true/);assert.doesNotMatch(draft,/draft: false/);
    assert.deepEqual(await readdir(path.join(project,'src/content/blog')),['imported.md']);
    assert.equal(await readFile(path.join(project,'public/media/board.svg'),'utf8'),'<svg xmlns="http://www.w3.org/2000/svg"/>');
    assert.throws(run);assert.equal(await readFile(path.join(project,'src/content/blog/imported.md'),'utf8'),draft);
  }finally{if(!path.resolve(temp).startsWith(path.resolve(prefix)))throw Error('Unexpected temporary path');await rm(temp,{recursive:true,force:true});}
});
