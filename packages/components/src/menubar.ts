import { listen } from '@luminedge/tools';
import { createMenu } from './menu.js';

/** Add arrow navigation to a group of native disclosure menus. */
export function createMenubar(root: HTMLElement) {
  const menus = Array.from(root.querySelectorAll<HTMLDetailsElement>('details[data-le-menubar-menu]'));
  const summaries = menus.map((menu) => menu.querySelector('summary')!);
  const controllers = menus.map((menu) => createMenu(menu));
  const remove = listen(root, 'keydown', (event) => {
    const active = root.ownerDocument.activeElement;
    const index = menus.findIndex((menu) => menu.contains(active));
    if (index < 0) return;
    const { key } = event as KeyboardEvent;
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const direction = getComputedStyle(root).direction === 'rtl' ? -1 : 1;
      const offset = key === 'ArrowRight' ? direction : -direction;
      const next = (index + offset + menus.length) % menus.length;
      const wasOpen = menus[index].open && index !== next;
      if (wasOpen) {
        menus[index].open = false;
        menus[next].open = true;
      }
      summaries[next].focus();
      event.preventDefault();
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      menus[index].open = true;
      const items = Array.from(menus[index].querySelectorAll<HTMLElement>('button:not(:disabled), a[href]'));
      if (!items.length) return;
      const position = items.findIndex((item) => item === active);
      const next = key === 'ArrowDown' ? (position + 1) % items.length
        : position < 0 ? items.length - 1 : (position + items.length - 1) % items.length;
      items[next].focus();
      event.preventDefault();
    }
  });
  return { destroy() { remove(); controllers.forEach((controller) => controller.destroy()); } };
}
