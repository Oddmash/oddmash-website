import { Toast } from '@oddmash/ui/toast';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

let root: Root | undefined;
let timeout: number | undefined;
const labels: Record<string,string> = {en:'Dismiss notification',ko:'알림 닫기',ja:'通知を閉じる','zh-CN':'关闭通知'};
export const notifyCopy = (title: string, failed = false) => {
  const host = document.querySelector<HTMLElement>('#copy-toast');
  if (!host) return;
  root ??= createRoot(host);
  if (timeout !== undefined) window.clearTimeout(timeout);
  const render = (open: boolean) => root?.render(createElement('div', { className: 'om-toast-viewport' }, createElement(Toast, {
    open, title, tone: failed ? 'danger' : 'neutral',
    dismissLabel: labels[document.documentElement.lang] ?? labels.en,
    onDismiss: () => { if (timeout !== undefined) window.clearTimeout(timeout); render(false); },
  })));
  render(true);
  if (!failed) timeout = window.setTimeout(() => render(false), 4000);
};
