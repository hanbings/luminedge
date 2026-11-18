import { listen } from '@luminedge/tools';

/** Add styled step buttons to a native number input. */
export function createNumberInput(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>('input[data-le-number-value]');
  const controls = root.querySelector<HTMLElement>('[data-le-number-controls]');
  const increment = root.querySelector<HTMLButtonElement>('button[data-le-number-increment]');
  const decrement = root.querySelector<HTMLButtonElement>('button[data-le-number-decrement]');
  if (input?.type !== 'number' || !controls || !increment || !decrement) {
    throw new Error('Number input needs a native number field and two step buttons.');
  }

  const originalHidden = controls.hidden;
  const originalIncrementDisabled = increment.disabled;
  const originalDecrementDisabled = decrement.disabled;
  const canStep = () => input.type === 'number' && input.step !== 'any';
  const isLocked = () => input.readOnly || input.matches(':disabled');
  const refresh = () => {
    controls.hidden = !canStep();
    const locked = isLocked();
    increment.disabled = originalIncrementDisabled || locked;
    decrement.disabled = originalDecrementDisabled || locked;
  };

  const step = (direction: 1 | -1) => {
    if (!canStep() || isLocked()) return;
    const previous = input.value;
    if (direction === 1) input.stepUp();
    else input.stepDown();
    if (input.value === previous) return;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const cleanup = [
    listen(increment, 'click', () => step(1)),
    listen(decrement, 'click', () => step(-1)),
  ];
  const Observer = input.ownerDocument.defaultView?.MutationObserver;
  const observer = Observer ? new Observer(refresh) : undefined;
  observer?.observe(input, { attributes: true, attributeFilter: ['disabled', 'readonly', 'step', 'type'] });
  refresh();

  return {
    destroy() {
      cleanup.forEach((remove) => remove());
      observer?.disconnect();
      controls.hidden = originalHidden;
      increment.disabled = originalIncrementDisabled;
      decrement.disabled = originalDecrementDisabled;
    },
  };
}
