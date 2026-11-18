import { listen } from '@luminedge/tools';

export type TokenChange = 'added' | 'removed' | 'duplicate';
export interface TokenInputOptions {
  name?: string;
  values?: readonly string[];
  removeLabel?: (value: string) => string;
  message?: (change: TokenChange, value: string) => string;
}

/** Build a simple list of removable text tokens from a native text input. */
export function createTokenInput(root: HTMLElement, options: TokenInputOptions = {}) {
  const editor = root.querySelector<HTMLInputElement>('[data-le-token-editor]');
  const list = root.querySelector<HTMLElement>('[data-le-token-list]');
  const addButton = root.querySelector<HTMLButtonElement>('[data-le-token-add]');
  const status = root.querySelector<HTMLElement>('[data-le-token-status]');
  if (!editor || !list || !addButton) throw new Error('Token input needs an editor, list, and add button.');
  const initial = [...new Set((options.values ?? []).map((value) => value.trim()).filter(Boolean))];
  let values = [...initial];
  let destroyed = false;
  const isDisabled = () => editor.matches(':disabled');
  const updateButton = () => {
    // A disabled fieldset already disables its descendants without setting their own attributes.
    const disabled = editor.disabled;
    addButton.disabled = disabled || !editor.value.trim();
    list.querySelectorAll<HTMLButtonElement>('[data-le-token-remove]').forEach((button) => { button.disabled = disabled; });
    list.querySelectorAll<HTMLInputElement>('[data-le-token-value]').forEach((input) => { input.disabled = disabled; });
  };
  const announce = (change: TokenChange, value: string) => {
    if (status) status.textContent = options.message?.(change, value) ?? (change === 'added' ? `Added ${value}` : change === 'removed' ? `Removed ${value}` : `${value} is already added`);
  };
  const render = () => {
    const items = values.map((value, index) => {
      const item = root.ownerDocument.createElement('li');
      item.className = 'le-token';
      const text = root.ownerDocument.createElement('span');
      text.textContent = value;
      const remove = root.ownerDocument.createElement('button');
      remove.type = 'button';
      remove.className = 'le-token-remove';
      remove.dataset.leTokenRemove = String(index);
      remove.setAttribute('aria-label', options.removeLabel?.(value) ?? `Remove ${value}`);
      remove.textContent = '×';
      item.append(text, remove);
      if (options.name) {
        const hidden = root.ownerDocument.createElement('input');
        hidden.type = 'hidden';
        hidden.dataset.leTokenValue = '';
        hidden.name = options.name;
        hidden.value = value;
        item.append(hidden);
      }
      return item;
    });
    list.replaceChildren(...items);
    updateButton();
  };
  const notify = () => root.dispatchEvent(new CustomEvent('le:tokenschange', { bubbles: true, detail: { values: [...values] } }));
  const add = (raw: string) => {
    const value = raw.trim();
    if (destroyed || isDisabled() || !value) return false;
    if (values.includes(value)) { announce('duplicate', value); return false; }
    values.push(value);
    render();
    announce('added', value);
    notify();
    return true;
  };
  const remove = (value: string) => {
    const index = values.indexOf(value);
    if (destroyed || isDisabled() || index < 0) return false;
    values.splice(index, 1);
    render();
    announce('removed', value);
    notify();
    return true;
  };
  const submit = () => {
    if (add(editor.value)) editor.value = '';
    updateButton();
    editor.focus();
  };
  const cleanup = [
    listen(editor, 'input', updateButton),
    listen(editor, 'keydown', (event) => {
      const keyboard = event as KeyboardEvent;
      if (keyboard.key === 'Enter' && !keyboard.isComposing && editor.value.trim()) {
        keyboard.preventDefault();
        submit();
      }
    }),
    listen(addButton, 'click', submit),
    listen(list, 'click', (event) => {
      const target = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-le-token-remove]');
      if (!target || !list.contains(target)) return;
      const value = values[Number(target.dataset.leTokenRemove)];
      if (value !== undefined && remove(value)) editor.focus();
    }),
  ];
  if (editor.form) cleanup.push(listen(editor.form, 'reset', () => queueMicrotask(() => {
    if (destroyed) return;
    values = [...initial];
    render();
    if (status) status.textContent = '';
    updateButton();
  })));
  const Observer = editor.ownerDocument.defaultView?.MutationObserver;
  const observer = Observer ? new Observer(updateButton) : undefined;
  observer?.observe(editor, { attributes: true, attributeFilter: ['disabled'] });
  addButton.type = 'button';
  addButton.hidden = false;
  render();
  updateButton();

  return {
    getValues: () => [...values],
    add,
    remove,
    refresh: updateButton,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cleanup.forEach((removeListener) => removeListener());
      observer?.disconnect();
      addButton.hidden = true;
      list.querySelectorAll<HTMLButtonElement>('[data-le-token-remove]').forEach((button) => { button.disabled = true; });
    },
  };
}
