import { type Locale, type projects } from './content';

type Preview = { src: string; width: number; height: number };
const juliyaPreviews: Record<Locale, Preview> = {
  en: { src: '/assets/juliya-live-en.png', width: 1160, height: 626 },
  ko: { src: '/assets/juliya-live-ko.png', width: 1160, height: 625 },
  ja: { src: '/assets/juliya-live-ja.png', width: 1160, height: 626 },
  'zh-CN': { src: '/assets/juliya-live-zh-cn.png', width: 1160, height: 626 },
};

export const projectImage = (project: typeof projects[number], locale: Locale) => {
  if (project.id === 'juliya') return juliyaPreviews[locale];
  return { src: project.image, width: project.width, height: project.height };
};
