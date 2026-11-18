import { listen } from '@luminedge/tools';

export interface SplitterOptions {
  value?: number;
  min?: number;
  max?: number;
  vertical?: boolean;
}

/** Resize two panes with a pointer or the keyboard. */
export function createSplitter(root: HTMLElement, options: SplitterOptions = {}) {
  const handle = root.querySelector<HTMLElement>('[data-le-split-handle]');
  if (!handle) throw new Error('Splitter needs a handle.');
  const { min = 15, max = 85, vertical = false } = options;
  if (![min, max].every(Number.isFinite) || min < 0 || max > 100 || min >= max) {
    throw new Error('Invalid splitter limits.');
  }

  handle.tabIndex = 0;
  handle.setAttribute('role', 'separator');
  handle.setAttribute('aria-orientation', vertical ? 'horizontal' : 'vertical');
  handle.setAttribute('aria-valuemin', String(min));
  handle.setAttribute('aria-valuemax', String(max));
  root.classList.toggle('le-splitter--vertical', vertical);
  let value: number;
  let dragging: number | undefined;

  const setValue = (next: number) => {
    if (!Number.isFinite(next)) return;
    value = Math.max(min, Math.min(max, next));
    root.style.setProperty('--le-split', value + 'fr');
    root.style.setProperty('--le-split-rest', (100 - value) + 'fr');
    handle.setAttribute('aria-valuenow', String(value));
  };
  setValue(Number.isFinite(options.value) ? options.value! : 50);
  const rtl = () => getComputedStyle(root).direction === 'rtl';
  const resize = (pointer: PointerEvent) => {
    if (dragging !== pointer.pointerId) return;
    const bounds = root.getBoundingClientRect();
    if (vertical && bounds.height) setValue((pointer.clientY - bounds.top) / bounds.height * 100);
    if (!vertical && bounds.width) {
      const fraction = (pointer.clientX - bounds.left) / bounds.width;
      setValue((rtl() ? 1 - fraction : fraction) * 100);
    }
  };
  const cleanup = [
    listen(handle, 'pointerdown', (event) => {
      const pointer = event as PointerEvent;
      if (pointer.button !== 0 || dragging !== undefined) return;
      dragging = pointer.pointerId;
      handle.setPointerCapture(pointer.pointerId);
    }),
    listen(handle, 'pointermove', (event) => resize(event as PointerEvent)),
    listen(handle, 'lostpointercapture', () => { dragging = undefined; }),
    listen(handle, 'keydown', (event) => {
      const { key } = event as KeyboardEvent;
      const before = vertical ? 'ArrowUp' : rtl() ? 'ArrowRight' : 'ArrowLeft';
      const after = vertical ? 'ArrowDown' : rtl() ? 'ArrowLeft' : 'ArrowRight';
      if (key === before) setValue(value - 5);
      else if (key === after) setValue(value + 5);
      else if (key === 'Home') setValue(min);
      else if (key === 'End') setValue(max);
      else return;
      event.preventDefault();
    }),
  ];
  return { setValue, getValue: () => value, destroy: () => cleanup.forEach((remove) => remove()) };
}
