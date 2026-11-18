import { listen } from '@luminedge/tools';

/** Open a native popover at the context point, or at the trigger for keyboard users. */
export function createContextMenu(trigger: HTMLElement, menu: HTMLElement) {
  if (!menu.hasAttribute('popover')) throw new Error('Context menu expects a popover.');
  const items = () => Array.from(menu.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]'))
    .filter((item) => !item.closest('[hidden]'));
  const open = (x: number, y: number) => {
    if (!menu.matches(':popover-open')) menu.showPopover();
    const window = menu.ownerDocument.defaultView;
    if (window) {
      menu.style.setProperty('--le-menu-x', Math.max(4, Math.min(x, window.innerWidth - menu.offsetWidth - 4)) + 'px');
      menu.style.setProperty('--le-menu-y', Math.max(4, Math.min(y, window.innerHeight - menu.offsetHeight - 4)) + 'px');
    }
    items()[0]?.focus();
  };
  const openFromKeyboard = () => {
    const bounds = trigger.getBoundingClientRect();
    open(bounds.left, bounds.bottom);
  };
  const close = () => {
    if (menu.matches(':popover-open')) menu.hidePopover();
    trigger.focus();
  };
  const cleanup = [
    listen(trigger, 'contextmenu', (event) => {
      event.preventDefault();
      const mouse = event as MouseEvent;
      if (mouse.clientX || mouse.clientY) open(mouse.clientX, mouse.clientY);
      else openFromKeyboard();
    }),
    listen(trigger, 'keydown', (event) => {
      const { key, shiftKey } = event as KeyboardEvent;
      if (key === 'ContextMenu' || (key === 'F10' && shiftKey)) {
        event.preventDefault();
        openFromKeyboard();
      }
    }),
    listen(menu, 'keydown', (event) => {
      const { key } = event as KeyboardEvent;
      if (key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      const controls = items();
      if (!controls.length || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;
      event.preventDefault();
      const index = controls.findIndex((item) => item === menu.ownerDocument.activeElement);
      const next = key === 'Home' ? 0 : key === 'End' ? controls.length - 1
        : (index + (key === 'ArrowUp' ? -1 : 1) + controls.length) % controls.length;
      controls[next].focus();
    }),
    listen(menu, 'click', (event) => {
      const control = (event.target as Element | null)?.closest('button, a[href]');
      if (control && menu.contains(control)) close();
    }),
  ];
  return { open: openFromKeyboard, close, destroy: () => cleanup.forEach((remove) => remove()) };
}

/** Keep a preview available while its trigger or content has focus or hover. */
export function createHoverCard(trigger: HTMLElement, card: HTMLElement) {
  const host = card.parentElement;
  if (!host?.contains(trigger)) throw new Error('Hover card and trigger must share a container.');
  let hovering = false;
  let focused = false;
  let dismissed = false;
  const update = () => { card.hidden = dismissed || (!hovering && !focused); };
  update();
  const cleanup = [
    listen(host, 'mouseenter', () => { hovering = true; dismissed = false; update(); }),
    listen(host, 'mouseleave', () => { hovering = false; update(); }),
    listen(host, 'focusin', (event) => {
      if (!host.contains((event as FocusEvent).relatedTarget as Node | null)) dismissed = false;
      focused = true;
      update();
    }),
    listen(host, 'focusout', (event) => { focused = host.contains((event as FocusEvent).relatedTarget as Node | null); update(); }),
    listen(host, 'keydown', (event) => {
      if ((event as KeyboardEvent).key === 'Escape' && !card.hidden) {
        event.preventDefault();
        if (card.contains(host.ownerDocument.activeElement)) trigger.focus();
        dismissed = true;
        update();
      }
    }),
  ];
  return { destroy() { cleanup.forEach((remove) => remove()); card.hidden = true; } };
}
