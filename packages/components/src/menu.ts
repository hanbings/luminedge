import { listen } from '@luminedge/tools';

export interface MenuController {
  open(): void;
  close(): void;
  destroy(): void;
}

/** Enhance a native details menu with outside-click and Escape dismissal. */
export function createMenu(root: HTMLDetailsElement): MenuController {
  const summary = root.querySelector<HTMLElement>('summary');
  if (!summary) throw new Error('Menu requires a summary element.');
  const hide = (restoreFocus: boolean) => {
    root.open = false;
    if (restoreFocus) summary.focus();
  };
  const cleanup = [
    listen(root, 'keydown', (event) => {
      if ((event as KeyboardEvent).key === 'Escape' && root.open) {
        event.preventDefault();
        hide(true);
      }
    }),
    listen(root, 'click', (event) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-le-menu-close]');
      if (target && root.contains(target)) hide(true);
    }),
    listen(root.ownerDocument, 'pointerdown', (event) => {
      if (root.open && !root.contains(event.target as Node | null)) hide(false);
    }),
  ];
  return {
    open: () => { root.open = true; },
    close: () => hide(root.contains(root.ownerDocument.activeElement)),
    destroy: () => cleanup.forEach((remove) => remove()),
  };
}
