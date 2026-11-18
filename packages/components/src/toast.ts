import { listen } from '@luminedge/tools';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';
export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  /** Milliseconds before dismissal; omit or set to 0 to keep the message until closed. */
  duration?: number;
  closeLabel?: string;
}
export interface ToastController { dismiss(): void; }

/** Append a message to an existing live region; text is never interpreted as HTML. */
export function showToast(region: HTMLElement, options: ToastOptions): ToastController {
  const duration = options.duration ?? 0;
  if (!Number.isFinite(duration) || duration < 0) throw new Error('Toast duration must be a non-negative number.');
  const document = region.ownerDocument;
  const toast = document.createElement('div');
  toast.className = `le-toast${options.variant && options.variant !== 'info' ? ` le-toast--${options.variant}` : ''}`;
  const message = document.createElement('span');
  message.textContent = options.message;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'le-toast-close';
  close.setAttribute('aria-label', options.closeLabel ?? '关闭通知');
  close.textContent = '×';
  toast.append(message, close);
  const previousFocus = document.activeElement as HTMLElement | null;
  region.append(toast);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let dismissed = false;
  let hovering = false;
  let focused = false;
  const clearTimer = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined; };
  const schedule = () => {
    clearTimer();
    if (!dismissed && duration > 0 && !hovering && !focused) timer = setTimeout(dismiss, duration);
  };
  const cleanup: Array<() => void> = [];
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    clearTimer();
    const hadFocus = toast.contains(document.activeElement);
    cleanup.forEach((remove) => remove());
    toast.remove();
    if (hadFocus && previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus();
  };
  cleanup.push(
    listen(close, 'click', dismiss),
    listen(toast, 'mouseenter', () => { hovering = true; schedule(); }),
    listen(toast, 'mouseleave', () => { hovering = false; schedule(); }),
    listen(toast, 'focusin', () => { focused = true; schedule(); }),
    listen(toast, 'focusout', (event) => {
      focused = toast.contains((event as FocusEvent).relatedTarget as Node | null);
      schedule();
    }),
  );
  schedule();
  return { dismiss };
}
