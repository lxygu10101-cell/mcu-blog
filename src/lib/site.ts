export const site = {
  title: 'MCU / NOTES',
  subtitle: '嵌入式开发手记',
  description: '围绕 STM32、C 语言、外设驱动与通信协议，记录嵌入式项目实践与技术笔记。',
  github: 'https://github.com/lxygu10101-cell/mcu-blog',
};

export const navItems = [
  { label: '首页', href: '' },
  { label: '项目', href: 'projects/' },
  { label: '博客', href: 'blog/' },
  { label: '关于', href: 'about/' },
] as const;

export const url = (path = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

export const formatDate = (value: Date) =>
  value.toISOString().slice(0, 10).replaceAll('-', '.');

export const readingMinutes = (body = '') =>
  Math.max(1, Math.ceil(body.trim().length / 450));
