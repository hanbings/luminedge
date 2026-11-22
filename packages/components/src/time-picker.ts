import { listen } from '@luminedge/tools';
import { createMenu } from './menu.js';

function revealSelection(select: HTMLSelectElement) {
  const selected = select.selectedOptions[0];
  if (!selected) return;
  const option = selected.getBoundingClientRect();
  const top = select.getBoundingClientRect().top + select.clientTop;
  select.scrollTop += option.top + option.height / 2 - (top + select.clientHeight / 2);
}

/** Choose a time to the minute while retaining a native field for validation and submission. */
export function createTimePicker(root: HTMLDetailsElement, input: HTMLInputElement) {
  const summary = root.querySelector<HTMLElement>('summary');
  const value = summary?.querySelector<HTMLElement>('[data-le-time-value]');
  const hours = root.querySelector<HTMLSelectElement>('select[data-le-time-hour]');
  const minutes = root.querySelector<HTMLSelectElement>('select[data-le-time-minute]');
  const confirm = root.querySelector<HTMLButtonElement>('button[data-le-time-confirm]');
  const clear = root.querySelector<HTMLButtonElement>('button[data-le-time-clear]');
  const error = root.querySelector<HTMLElement>('[data-le-time-error]');
  if (input.type !== 'time' || !summary || !value || !hours || !minutes || !confirm || !error) {
    throw new Error('Time picker needs a native time field, a summary, two selects, a confirm button, and an error message.');
  }

  const menu = createMenu(root);
  const original = {
    pickerHidden: root.hidden,
    pickerOpen: root.open,
    inputHidden: input.hidden,
    clearHidden: clear?.hidden ?? false,
  };
  const placeholder = value.textContent.trim();
  const editable = () => input.type === 'time' && !input.readOnly && !input.matches(':disabled');
  let destroyed = false;

  const showError = (message: string) => {
    error.hidden = message === '';
    error.textContent = message;
  };

  const stageTime = () => {
    const [hour, minute] = input.value.split(':');
    hours.value = hour || '00';
    minutes.value = minute || '00';
  };

  const revealTime = () => {
    revealSelection(hours);
    revealSelection(minutes);
  };

  const refresh = () => {
    if (destroyed) return;
    const enhanced = editable();
    if (!enhanced) menu.close();
    root.hidden = !enhanced;
    input.hidden = enhanced || original.inputHidden;
    if (clear) clear.hidden = input.required || original.clearHidden;
    value.textContent = input.value || placeholder;
    stageTime();
    if (root.open) revealTime();
    showError('');
  };

  const commit = (next: string) => {
    if (!editable()) return;
    const previous = input.value;
    input.value = next;
    if (!input.validity.valid) {
      const message = input.validationMessage;
      input.value = previous;
      showError(message);
      return;
    }
    root.open = false;
    summary.focus();
    refresh();
    if (input.value !== previous) {
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const cleanup = [
    listen(summary, 'click', () => {
      if (!root.open) stageTime();
    }),
    listen(root, 'toggle', () => {
      if (root.open) revealTime();
      else {
        stageTime();
        showError('');
      }
    }),
    listen(input, 'input', refresh),
    listen(input, 'change', refresh),
    listen(input, 'invalid', (event) => {
      if (root.hidden || !editable()) return;
      event.preventDefault();
      if (!root.open) stageTime();
      menu.open();
      showError(input.validationMessage);
      summary.focus();
    }),
    listen(confirm, 'click', () => {
      if (hours.value && minutes.value) commit(`${hours.value}:${minutes.value}`);
    }),
    ...[hours, minutes].flatMap((select) => ['input', 'change'].map((type) => listen(select, type, (event) => {
      event.stopPropagation();
      showError('');
    }))),
  ];

  if (clear) cleanup.push(listen(clear, 'click', () => {
    if (!input.required) commit('');
  }));
  if (input.form) cleanup.push(listen(input.form, 'reset', (event) => setTimeout(() => {
    if (!event.defaultPrevented) refresh();
  }, 0)));

  const Observer = input.ownerDocument.defaultView?.MutationObserver;
  const observer = Observer ? new Observer(() => {
    const keepError = root.open && !error.hidden && editable() && !input.validity.valid;
    refresh();
    if (keepError) showError(input.validationMessage);
  }) : undefined;
  observer?.observe(input, { attributeFilter: ['disabled', 'readonly', 'required', 'min', 'max', 'step', 'type', 'value'] });
  for (let fieldset = input.closest('fieldset'); fieldset; fieldset = fieldset.parentElement?.closest('fieldset') ?? null) {
    observer?.observe(fieldset, { attributeFilter: ['disabled'] });
  }
  refresh();

  return {
    refresh,
    destroy() {
      destroyed = true;
      cleanup.forEach((remove) => remove());
      observer?.disconnect();
      menu.destroy();
      root.open = original.pickerOpen;
      root.hidden = original.pickerHidden;
      input.hidden = original.inputHidden;
      if (clear) clear.hidden = original.clearHidden;
    },
  };
}
