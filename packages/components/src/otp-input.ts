import { listen } from '@luminedge/tools';

function digits(value: string) {
  return value.normalize('NFKC').replace(/[^0-9]/g, '');
}

/** Treat each marked text input as a single digit of the same verification code. */
export function createOtpInput(root: HTMLElement) {
  const cells = Array.from(root.querySelectorAll<HTMLInputElement>('input[data-le-otp-cell]'));
  const output = root.querySelector<HTMLInputElement>('input[data-le-otp-value]');
  if (!cells.length || cells.some((cell) => cell.type !== 'text') || (output && output.type !== 'hidden')) {
    throw new Error('OTP input needs text fields and an optional hidden value field.');
  }

  const editable = (cell: HTMLInputElement) => !cell.readOnly && !cell.matches(':disabled');
  const getValue = () => cells.map((cell) => digits(cell.value).slice(0, 1)).join('');
  let lastValue = getValue();
  let destroyed = false;

  const refresh = () => {
    if (destroyed) return;
    const value = getValue();
    const complete = value.length === cells.length;
    if (output) output.value = complete ? value : '';
    if (value === lastValue) return;
    lastValue = value;
    root.dispatchEvent(new CustomEvent('le:otpchange', { bubbles: true, detail: { value, complete } }));
  };

  const insert = (index: number, value: string) => {
    const start = value.length >= cells.length ? 0 : index;
    let next = start;
    const end = Math.min(start + value.length, cells.length);
    while (next < end && editable(cells[next])) {
      cells[next].value = value[next - start];
      next++;
    }
    if (next > start) {
      const focus = cells[next] && editable(cells[next]) ? cells[next] : cells[next - 1];
      focus.focus();
    }
    refresh();
  };

  const erasePrevious = (index: number, event: Event) => {
    const previous = cells[index - 1];
    if (cells[index].value || !editable(cells[index]) || !previous || !editable(previous)) return;
    event.preventDefault();
    previous.value = '';
    previous.focus();
    refresh();
  };

  const updateCell = (index: number, text: string) => {
    const cell = cells[index];
    if (!editable(cell)) return;
    const value = digits(text);
    if (value) {
      insert(index, value);
      return;
    }
    cell.value = '';
    refresh();
  };

  const cleanup = cells.flatMap((cell, index) => [
    listen(cell, 'focus', () => cell.select()),
    listen(cell, 'input', (event) => {
      const input = event as InputEvent;
      if (!input.isComposing) updateCell(index, input.data ?? cell.value);
    }),
    listen(cell, 'compositionend', (event) => {
      const { data } = event as CompositionEvent;
      if (data) updateCell(index, data);
    }),
    listen(cell, 'paste', (event) => {
      const text = (event as ClipboardEvent).clipboardData?.getData('text/plain');
      if (text === undefined || !editable(cell)) return;
      event.preventDefault();
      const value = digits(text);
      if (value) insert(index, value);
    }),
    listen(cell, 'keydown', (event) => {
      const key = event as KeyboardEvent;
      if (key.key === 'Backspace' && !key.isComposing && !key.altKey && !key.ctrlKey && !key.metaKey) {
        erasePrevious(index, key);
      }
    }),
    listen(cell, 'beforeinput', (event) => {
      const input = event as InputEvent;
      if (input.inputType === 'deleteContentBackward' && !input.isComposing && input.cancelable) {
        erasePrevious(index, input);
      }
    }),
  ]);

  const form = cells[0].form;
  if (form) cleanup.push(listen(form, 'reset', (event) => queueMicrotask(() => {
    if (!event.defaultPrevented) refresh();
  })));
  refresh();
  return {
    getValue,
    refresh,
    destroy() {
      destroyed = true;
      cleanup.forEach((remove) => remove());
    },
  };
}
