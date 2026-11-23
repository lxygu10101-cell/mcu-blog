import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import obsidian from '../scripts/remark-obsidian.mjs';

test('Obsidian links respect Pages base and leave code alone', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: '[[timer-basics|定时器]] ![[板子.png]] ==重点==' },
          { type: 'inlineCode', value: '[[literal]]' },
        ],
      },
    ],
  };

  obsidian({ base: '/mcu-blog/' })(tree);
  const children = tree.children[0].children;
  assert.equal(children.find((c) => c.type === 'link').url, '/mcu-blog/blog/timer-basics/');
  assert.equal(children.find((c) => c.type === 'image').url, '/mcu-blog/media/%E6%9D%BF%E5%AD%90.png');
  assert.equal(children.at(-1).value, '[[literal]]');
});

test('toolbox routes, modules and links are completely removed from src', async () => {
  const srcRoot = path.resolve('src');
  const files = [];

  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        assert.notEqual(entry.name, 'tools', 'src/pages/tools directory must not exist');
        await walk(full);
      } else {
        assert.notEqual(entry.name, 'tools.mjs', 'src/lib/tools.mjs must not exist');
        files.push(full);
      }
    }
  }

  await walk(srcRoot);

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    assert.doesNotMatch(content, /\/tools\/|['"]tools\/['"]|工具箱/, `Unexpected toolbox reference in ${path.relative(srcRoot, file)}`);
  }
});
