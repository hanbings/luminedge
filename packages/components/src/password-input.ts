import { listen } from '@luminedge/tools';

export interface PasswordInputOptions {
  /** Accessible name for the visibility toggle; its pressed state reports visibility. */
  toggleLabel?: string;
  showText?: string;
  hideText?: string;
}

/** Add a visibility toggle to a native password input. */
export function createPasswordInput(input: HTMLInputElement, toggle: HTMLButtonElement, options: PasswordInputOptions = {}) {
  if (input.type !== 'password' && input.type !== 'text') throw new Error('Password input needs a password or text input.');
  const originalType = input.type;
  const originalText = toggle.textContent;
  const originalHidden = toggle.hidden;
  const originalDisabled = toggle.disabled;
  const attributes = ['type', 'aria-label', 'aria-pressed', 'aria-controls'] as const;
  const originalAttributes = attributes.map((name) => toggle.getAttribute(name));
  let destroyed = false;

  const refresh = () => {
    if (destroyed) return;
    const visible = input.type === 'text';
    toggle.textContent = visible ? options.hideText ?? 'Hide' : options.showText ?? 'Show';
    toggle.setAttribute('aria-label', options.toggleLabel ?? 'Show password');
    toggle.setAttribute('aria-pressed', String(visible));
    if (input.id) toggle.setAttribute('aria-controls', input.id);
    toggle.disabled = originalDisabled || input.disabled;
  };
  const setVisible = (visible: boolean) => {
    if (destroyed || input.matches(':disabled')) return;
    input.type = visible ? 'text' : 'password';
    refresh();
  };
  toggle.type = 'button';
  toggle.hidden = false;
  const cleanup = [listen(toggle, 'click', () => setVisible(input.type !== 'text'))];
  const Observer = input.ownerDocument.defaultView?.MutationObserver;
  const observer = Observer ? new Observer(refresh) : undefined;
  observer?.observe(input, { attributes: true, attributeFilter: ['disabled', 'type'] });
  refresh();

  return {
    refresh,
    setVisible,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cleanup.forEach((remove) => remove());
      observer?.disconnect();
      input.type = originalType;
      toggle.textContent = originalText;
      toggle.hidden = originalHidden;
      toggle.disabled = originalDisabled;
      attributes.forEach((name, index) => {
        const value = originalAttributes[index];
        if (value === null) toggle.removeAttribute(name);
        else toggle.setAttribute(name, value);
      });
    },
  };
}
