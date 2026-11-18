import { showToast, type ToastOptions } from './toast.js';

export interface UiScopeOptions {
  locale?: string;
  direction?: 'ltr' | 'rtl' | 'auto';
  tokens?: Readonly<Record<`--le-${string}`, string>>;
}

/** Configure inherited language, direction and design tokens on a DOM subtree. */
export function configureUi(root: HTMLElement, options: UiScopeOptions) {
  if (options.locale) root.lang = options.locale;
  if (options.direction) root.dir = options.direction;
  for (const [token, value] of Object.entries(options.tokens ?? {})) root.style.setProperty(token, value);
}

/** Send notifications to a live region owned by this application subtree. */
export function createApp(root: HTMLElement) {
  const region = root.querySelector<HTMLElement>('[data-le-app-notifications]');
  if (!region) throw new Error('App needs a notification region.');
  return { notify: (options: ToastOptions) => showToast(region, options) };
}
