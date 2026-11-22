import test from 'node:test';
import assert from 'node:assert/strict';
import { convertBase, timer, crc16Modbus } from '../src/lib/tools.mjs';
import obsidian from '../scripts/remark-obsidian.mjs';
test('base conversion preserves large integers and signs',()=>{
  assert.equal(convertBase('FFFFFFFFFFFFFFFF',16).decimal,'18446744073709551615');
  assert.equal(convertBase('-0b1010',2).hex,'-A');
  assert.equal(convertBase('0',10).binary,'0');
  assert.throws(()=>convertBase('102',2));assert.throws(()=>convertBase('',10));
});
test('timer respects the plus-one divisors and hardware bounds',()=>{
  assert.deepEqual(timer(72,71,999),{frequency:1000,periodMs:1});
  assert.equal(timer(1,0,1).frequency,500000);
  assert.throws(()=>timer(72,-1,999));assert.throws(()=>timer(72,1.5,999));assert.throws(()=>timer(72,0,4294967296));
});
test('CRC known vectors and wire byte order',()=>{
  assert.equal(crc16Modbus('31 32 33 34 35 36 37 38 39').hex,'4B37');
  assert.equal(crc16Modbus('01 03 00 00 00 0A').wire,'C5 CD');
  assert.throws(()=>crc16Modbus('1 03'));assert.throws(()=>crc16Modbus('GG'));assert.throws(()=>crc16Modbus(''));
});
test('Obsidian links respect Pages base and leave code alone',()=>{
  const tree={type:'root',children:[{type:'paragraph',children:[{type:'text',value:'[[timer-basics|定时器]] ![[板子.png]] ==重点=='},{type:'inlineCode',value:'[[literal]]'}]}]};
  obsidian({base:'/mcu-blog/'})(tree);
  const children=tree.children[0].children;
  assert.equal(children.find(c=>c.type==='link').url,'/mcu-blog/blog/timer-basics/');
  assert.equal(children.find(c=>c.type==='image').url,'/mcu-blog/media/%E6%9D%BF%E5%AD%90.png');
  assert.equal(children.at(-1).value,'[[literal]]');
});
