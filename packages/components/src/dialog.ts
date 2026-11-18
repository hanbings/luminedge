import { listen } from '@luminedge/tools';

export interface DialogOptions {
  openTriggers?: Iterable<HTMLElement>;
  closeTriggers?: Iterable<HTMLElement>;
}

export interface DialogController {
  open(): void;
  close(): void;
  destroy(): void;
}

/** Wire triggers to a native dialog. The browser manages modal focus and Escape. */
export function createDialog(dialog: HTMLDialogElement, options: DialogOptions = {}): DialogController {
  const defaultDrawerDismiss = dialog.classList.contains('le-drawer') && !dialog.hasAttribute('closedby');
  if (defaultDrawerDismiss) dialog.setAttribute('closedby', 'any');
  const open = () => {
    if (!dialog.open) dialog.showModal();
  };
  const close = () => {
    if (dialog.open) dialog.close();
  };
  const cleanup = [
    ...Array.from(options.openTriggers ?? [], (trigger) => listen(trigger, 'click', open)),
    ...Array.from(options.closeTriggers ?? [], (trigger) => listen(trigger, 'click', close)),
  ];

  if (defaultDrawerDismiss) cleanup.push(() => {
    if (dialog.getAttribute('closedby') === 'any') dialog.removeAttribute('closedby');
  });
  if (typeof dialog.closedBy !== 'string' && dialog.getAttribute('closedby') === 'any') {
    let pressedOnBackdrop = false;
    const onBackdrop = (event: MouseEvent) => {
      if (event.target !== dialog) return false;
      const { left, right, top, bottom } = dialog.getBoundingClientRect();
      return event.clientX < left || event.clientX >= right || event.clientY < top || event.clientY >= bottom;
    };
    cleanup.push(
      listen(dialog, 'pointerdown', (event) => { pressedOnBackdrop = onBackdrop(event as PointerEvent); }),
      listen(dialog, 'click', (event) => {
        if (pressedOnBackdrop && onBackdrop(event as MouseEvent) && dialog.matches(':modal') && dialog.getAttribute('closedby') === 'any') {
          if (typeof dialog.requestClose === 'function') dialog.requestClose();
          else if (dialog.dispatchEvent(new Event('cancel', { cancelable: true }))) close();
        }
        pressedOnBackdrop = false;
      }),
    );
  }
  return { open, close, destroy: () => cleanup.forEach((remove) => remove()) };
}
