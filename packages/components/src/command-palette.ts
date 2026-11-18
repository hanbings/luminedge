import { listen } from '@luminedge/tools';
import { createCombobox } from './combobox.js';
import { createDialog, type DialogController, type DialogOptions } from './dialog.js';

export interface CommandPaletteOptions extends DialogOptions {
  /** Optional key to bind with Ctrl or Meta, for example "k". */
  shortcut?: string;
}

/** Open a filterable command list as a native modal dialog. */
export function createCommandPalette(dialog: HTMLDialogElement, options: CommandPaletteOptions = {}): DialogController {
  const root = dialog.querySelector<HTMLElement>('[data-le-command-list]');
  const input = root?.querySelector<HTMLInputElement>('[data-le-combobox-input]');
  if (!root || !input) throw new Error('Command palette needs a command list with an input.');
  const combobox = createCombobox(root, { inline: true });
  const controller = createDialog(dialog, { closeTriggers: options.closeTriggers });
  const open = () => {
    if (dialog.open) return;
    combobox.setQuery('');
    controller.open();
    input.focus();
  };
  const cleanup = [
    ...Array.from(options.openTriggers ?? [], (trigger) => listen(trigger, 'click', open)),
    listen(root, 'le:optionselect', controller.close),
  ];
  const shortcut = options.shortcut?.toLowerCase();
  if (shortcut) {
    cleanup.push(listen(dialog.ownerDocument, 'keydown', (event) => {
      const key = event as KeyboardEvent;
      if (key.defaultPrevented || key.isComposing || key.repeat || key.altKey || key.shiftKey) return;
      if ((key.ctrlKey || key.metaKey) && key.key.toLowerCase() === shortcut) {
        event.preventDefault();
        open();
      }
    }));
  }
  return {
    open,
    close: controller.close,
    destroy() {
      cleanup.forEach((remove) => remove());
      controller.destroy();
      combobox.destroy();
    },
  };
}
