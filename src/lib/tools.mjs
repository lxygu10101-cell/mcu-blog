export function convertBase(input, radix) {
  if (![2,8,10,16].includes(Number(radix))) throw Error('请选择有效的进制。');
  let text = input.trim().replaceAll('_','');
  if (!text || text.length > 260) throw Error('请输入数字（最多 256 位）。');
  const negative = text.startsWith('-');
  text = text.replace(/^[+-]/,'');
  const prefixes = {2:/^0b/i,8:/^0o/i,10:/^(?!)$/,16:/^0x/i};
  text = text.replace(prefixes[radix], '');
  const patterns = {2:/^[01]+$/,8:/^[0-7]+$/,10:/^\d+$/,16:/^[\da-f]+$/i};
  if (!patterns[radix].test(text)) throw Error('数字与所选进制不匹配。');
  let value = 0n;
  for(const char of text.toLowerCase()) value=value*BigInt(radix)+BigInt(parseInt(char,16));
  if(negative)value=-value;
  return {binary:value.toString(2),octal:value.toString(8),decimal:value.toString(10),hex:value.toString(16).toUpperCase()};
}
export function timer(clockMHz, psc, arr) {
  if(!Number.isFinite(clockMHz)||clockMHz<=0||clockMHz>10000)throw Error('请输入有效的定时器时钟，单位 MHz。');
  if(!Number.isInteger(psc)||psc<0||psc>65535)throw Error('PSC 必须为 0 至 65535 的整数。');
  if(!Number.isInteger(arr)||arr<1||arr>4294967295)throw Error('ARR 必须为 1 至 4294967295 的整数；请核对硬件位宽。');
  const frequency=clockMHz*1e6/((psc+1)*(arr+1));
  return {frequency,periodMs:1000/frequency};
}
export function crc16Modbus(input) {
  const text=input.trim();
  if(!text || !/^(?:[\da-f]{2})(?:[\s,]+[\da-f]{2})*$/i.test(text))throw Error('请输入以空格或逗号分隔的十六进制字节，例如 01 03 00 00 00 0A。');
  const bytes=text.split(/[\s,]+/).map(v=>parseInt(v,16));
  if(bytes.length>4096)throw Error('最多支持 4096 字节。');
  let crc=0xffff;
  for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc&1)?(crc>>>1)^0xa001:crc>>>1;}
  const hex=value=>value.toString(16).toUpperCase().padStart(2,'0');
  return {value:crc,hex:crc.toString(16).toUpperCase().padStart(4,'0'),wire:`${hex(crc&255)} ${hex(crc>>>8)}`,count:bytes.length};
}
