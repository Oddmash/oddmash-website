import { ToastProvider, useToast, type ToastController } from '@oddmash/ui/toast-provider';
import { createElement, useLayoutEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

let root: Root | undefined;
let controller: ToastController | undefined;
const labels: Record<string,string> = {en:'Dismiss notification',ko:'알림 닫기',ja:'通知を閉じる','zh-CN':'关闭通知'};

const Bridge = () => {
  const value = useToast();
  useLayoutEffect(() => {
    controller = value;
    return () => { if (controller === value) controller = undefined; };
  }, [value]);
  return null;
};

export const notifyCopy = (title: string, failed = false) => {
  const host = document.querySelector<HTMLElement>('#copy-toast');
  if (!host) return;
  if (!root) {
    root = createRoot(host);
    flushSync(() => root?.render(createElement(ToastProvider, {
      dismissLabel: labels[document.documentElement.lang] ?? labels.en,
    }, createElement(Bridge))));
  }
  controller?.showToast({ title, tone: failed ? 'error' : 'success', duration: failed ? null : 4000 });
};
