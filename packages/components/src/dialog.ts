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

  return { open, close, destroy: () => cleanup.forEach((remove) => remove()) };
}
