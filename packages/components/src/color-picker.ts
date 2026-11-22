import { listen } from '@luminedge/tools';
import { createMenu } from './menu.js';

interface Hsv {
  hue: number;
  saturation: number;
  brightness: number;
}

function parseHex(value: string) {
  const match = /^#?([a-f\d]{6})$/i.exec(value.trim());
  return match ? `#${match[1].toLowerCase()}` : null;
}

function toHsv(hex: string, hue = 0): Hsv {
  const red = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const green = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const brightness = Math.max(red, green, blue);
  const chroma = brightness - Math.min(red, green, blue);
  if (chroma === 0) return { hue, saturation: 0, brightness };

  if (brightness === red) hue = (green - blue) / chroma;
  else if (brightness === green) hue = (blue - red) / chroma + 2;
  else hue = (red - green) / chroma + 4;
  return { hue: (hue * 60 + 360) % 360, saturation: chroma / brightness, brightness };
}

function toHex({ hue, saturation, brightness }: Hsv) {
  const chroma = brightness * saturation;
  const channel = (offset: number) => {
    // A trapezoid shifted by a third of the hue wheel for each RGB channel.
    const phase = (offset + hue / 60) % 6;
    const strength = Math.max(0, Math.min(phase, 4 - phase, 1));
    return Math.round((brightness - chroma * strength) * 255).toString(16).padStart(2, '0');
  };
  return `#${channel(5)}${channel(3)}${channel(1)}`;
}

/** Edit an opaque sRGB color while retaining a native color field for form submission. */
export function createColorPicker(root: HTMLDetailsElement, input: HTMLInputElement) {
  const summary = root.querySelector<HTMLElement>('summary');
  const value = summary?.querySelector<HTMLElement>('[data-le-color-value]');
  const plane = root.querySelector<HTMLElement>('[data-le-color-plane]');
  const hue = root.querySelector<HTMLInputElement>('input[data-le-color-hue]');
  const hex = root.querySelector<HTMLInputElement>('input[data-le-color-hex]');
  const error = root.querySelector<HTMLElement>('[data-le-color-error]');
  const confirm = root.querySelector<HTMLButtonElement>('button[data-le-color-confirm]');
  if (input.type !== 'color' || !summary || !value || !plane || hue?.type !== 'range' || hex?.type !== 'text' || !error || !confirm) {
    throw new Error('Color picker needs a native color field, a summary, a color plane, hue and hex controls, an error message, and a confirm button.');
  }

  const menu = createMenu(root);
  const original = { hidden: root.hidden, open: root.open, inputHidden: input.hidden };
  const properties = ['value', 'preview', 'hue', 'x', 'y'].map((key) => {
    const name = `--le-color-picker-${key}`;
    return { name, value: root.style.getPropertyValue(name), priority: root.style.getPropertyPriority(name) };
  });
  const invalidHex = error.dataset.invalid || 'Enter a six-digit hexadecimal color.';
  let color = toHsv('#000000');
  let pointer: number | undefined;
  let destroyed = false;

  const editable = () => {
    const space = input.getAttribute('colorspace');
    return input.type === 'color' && !input.matches(':disabled') && !input.hasAttribute('alpha')
      && (space === null || space.toLowerCase() === 'limited-srgb');
  };

  const showError = (message = '') => {
    error.hidden = message === '';
    error.textContent = message;
    if (message) hex.setAttribute('aria-invalid', 'true');
    else hex.removeAttribute('aria-invalid');
  };

  const paint = (next: string) => {
    root.style.setProperty('--le-color-picker-preview', next);
    root.style.setProperty('--le-color-picker-hue', String(color.hue));
    root.style.setProperty('--le-color-picker-x', `${color.saturation * 100}%`);
    root.style.setProperty('--le-color-picker-y', `${(1 - color.brightness) * 100}%`);
  };

  const endDrag = () => {
    if (pointer !== undefined && plane.hasPointerCapture(pointer)) plane.releasePointerCapture(pointer);
    pointer = undefined;
  };

  const stage = (next: string) => {
    endDrag();
    color = toHsv(next);
    hue.value = String(color.hue);
    hex.value = next.toUpperCase();
    paint(next);
    showError();
  };

  const refresh = () => {
    if (destroyed) return;
    const next = parseHex(input.value);
    const enhanced = next !== null && editable();
    if (!enhanced && root.open) menu.close();
    root.hidden = !enhanced;
    input.hidden = enhanced || original.inputHidden;
    if (!enhanced) return;
    root.style.setProperty('--le-color-picker-value', next);
    value.textContent = next.toUpperCase();
    stage(next);
  };

  const commit = () => {
    if (!root.open || root.hidden || !editable()) return;
    const next = parseHex(hex.value);
    if (!next) {
      showError(invalidHex);
      hex.focus();
      return;
    }
    const previous = input.value;
    input.value = next;
    if (!input.validity.valid) {
      const message = input.validationMessage;
      input.value = previous;
      showError(message);
      hex.focus();
      return;
    }
    menu.close();
    summary.focus();
    refresh();
    if (input.value !== previous) {
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const updateFromControls = () => {
    const next = toHex(color);
    hex.value = next.toUpperCase();
    paint(next);
    showError();
  };

  const updateFromPointer = (event: PointerEvent) => {
    const rect = plane.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    color.saturation = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    color.brightness = Math.max(0, Math.min(1, (rect.bottom - event.clientY) / rect.height));
    updateFromControls();
  };

  const cleanup = [
    listen(summary, 'click', () => {
      if (!root.open) refresh();
    }),
    listen(root, 'toggle', () => {
      if (!root.open) refresh();
    }),
    listen(input, 'click', (event) => {
      if (event.defaultPrevented || root.hidden || !editable()) return;
      if (!root.open) refresh();
      if (root.hidden) return;
      event.preventDefault();
      menu.open();
      summary.focus();
    }),
    listen(input, 'input', refresh),
    listen(input, 'change', refresh),
    listen(input, 'invalid', (event) => {
      if (root.hidden || !editable()) return;
      event.preventDefault();
      if (!root.open) refresh();
      menu.open();
      showError(input.validationMessage);
      hex.focus();
    }),
    listen(hex, 'input', (event) => {
      event.stopPropagation();
      showError();
      const next = parseHex(hex.value);
      if (!next) return;
      color = toHsv(next, color.hue);
      hue.value = String(color.hue);
      paint(next);
    }),
    listen(hex, 'change', (event) => event.stopPropagation()),
    listen(hex, 'keydown', (event) => {
      const key = event as KeyboardEvent;
      if (key.key !== 'Enter' || key.isComposing) return;
      key.preventDefault();
      commit();
    }),
    listen(hue, 'input', (event) => {
      event.stopPropagation();
      color.hue = hue.valueAsNumber;
      updateFromControls();
    }),
    listen(hue, 'change', (event) => event.stopPropagation()),
    listen(plane, 'pointerdown', (event) => {
      const press = event as PointerEvent;
      if (!press.isPrimary || press.button !== 0 || pointer !== undefined) return;
      pointer = press.pointerId;
      plane.setPointerCapture(pointer);
      updateFromPointer(press);
    }),
    listen(plane, 'pointermove', (event) => {
      const move = event as PointerEvent;
      if (move.pointerId === pointer) updateFromPointer(move);
    }),
    listen(plane, 'pointerup', (event) => {
      const release = event as PointerEvent;
      if (release.pointerId !== pointer) return;
      updateFromPointer(release);
      endDrag();
    }),
    listen(plane, 'lostpointercapture', (event) => {
      if ((event as PointerEvent).pointerId === pointer) pointer = undefined;
    }),
    listen(confirm, 'click', commit),
  ];

  if (input.form) cleanup.push(listen(input.form, 'reset', (event) => setTimeout(() => {
    if (!event.defaultPrevented) refresh();
  }, 0)));

  const Observer = input.ownerDocument.defaultView?.MutationObserver;
  const observer = Observer ? new Observer(refresh) : undefined;
  observer?.observe(input, { attributeFilter: ['alpha', 'colorspace', 'disabled', 'type', 'value'] });
  for (let fieldset = input.closest('fieldset'); fieldset; fieldset = fieldset.parentElement?.closest('fieldset') ?? null) {
    observer?.observe(fieldset, { attributeFilter: ['disabled'] });
  }
  refresh();

  return {
    refresh,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      endDrag();
      cleanup.forEach((remove) => remove());
      observer?.disconnect();
      menu.destroy();
      root.open = original.open;
      root.hidden = original.hidden;
      input.hidden = original.inputHidden;
      properties.forEach(({ name, value: previous, priority }) => root.style.setProperty(name, previous, priority));
    },
  };
}
