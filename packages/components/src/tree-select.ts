import { listen } from '@luminedge/tools';

/** Select an option in a native disclosure, with optional branches and form value. */
export function createSelect(root: HTMLDetailsElement) {
  const summary = root.querySelector('summary');
  const label = summary?.querySelector<HTMLElement>('[data-le-select-value]');
  const input = root.querySelector<HTMLInputElement>('input[type="hidden"]');
  const choices = Array.from(root.querySelectorAll<HTMLButtonElement>('button[data-le-select-option]'));
  if (!summary || !label || !choices.length) throw new Error('Select needs a summary, value label, and choices.');
  let value = input?.value ?? '';
  const select = (button: HTMLButtonElement) => {
    if (button.disabled) return;
    value = button.dataset.leSelectOption ?? '';
    const text = button.textContent?.trim() ?? '';
    label.textContent = text;
    if (input) input.value = value;
    choices.forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
    root.open = false;
    summary.focus();
    root.dispatchEvent(new CustomEvent('le:selectchange', { bubbles: true, detail: { value, label: text } }));
  };
  for (const choice of choices) choice.setAttribute('aria-pressed', String(choice.dataset.leSelectOption === value));
  const cleanup = choices.map((choice) => listen(choice, 'click', () => select(choice)));
  cleanup.push(listen(root, 'keydown', (event) => {
    const { key } = event as KeyboardEvent;
    if (key === 'Escape' && root.open) {
      event.preventDefault();
      root.open = false;
      summary.focus();
      return;
    }
    const active = root.ownerDocument.activeElement;
    const isTrigger = active === summary;
    if ((!isTrigger && !choices.some((choice) => choice === active)) ||
        !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;
    root.open = true;
    const visible = choices.filter((choice) => !choice.disabled && choice.getClientRects().length);
    if (!visible.length) return;
    event.preventDefault();
    const index = visible.findIndex((choice) => choice === active);
    const target = key === 'Home' ? 0 : key === 'End' ? visible.length - 1
      : key === 'ArrowDown' ? (index + 1) % visible.length
      : index < 0 ? visible.length - 1 : (index + visible.length - 1) % visible.length;
    visible[target].focus();
  }));
  return { getValue: () => value, destroy: () => cleanup.forEach((remove) => remove()) };
}

export { createSelect as createTreeSelect };
