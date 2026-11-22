export const site = {
  title: 'MCU / NOTES',
  description: '记录嵌入式开发中的想法、实验与实现。STM32、C 语言与硬件项目的个人技术博客。',
  github: 'https://github.com/lxygu10101-cell/mcu-blog',
};
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const date = (value: Date) => value.toISOString().slice(0, 10).replaceAll('-', '.');
