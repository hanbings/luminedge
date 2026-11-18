import { listen } from '@luminedge/tools';

type TextField = HTMLInputElement | HTMLTextAreaElement;

export interface ComboboxOptions {
  /** Keep results visible, for example inside a command dialog. */
  inline?: boolean;
  /** Supply a substring to match. A null query closes the popup. */
  query?: (input: TextField) => string | null;
  /** Apply a selection to the edit field. Defaults to replacing its value. */
  apply?: (input: TextField, selection: ComboboxSelection) => void;
}

export interface ComboboxSelection {
  value: string;
  label: string;
}

export interface ComboboxController {
  setQuery(query: string): void;
  destroy(): void;
}

/** Add filterable suggestions to an editable input. */
export function createCombobox(root: HTMLElement, options: ComboboxOptions = {}): ComboboxController {
  const input = root.querySelector<TextField>('[data-le-combobox-input]');
  const popup = root.querySelector<HTMLElement>('[data-le-combobox-popup]');
  const list = popup?.querySelector<HTMLElement>('[data-le-combobox-list]');
  const empty = popup?.querySelector<HTMLElement>('[data-le-combobox-empty]');
  if (!input || !popup || !list?.id) throw new Error('Combobox needs an input, a popup, and a list with an id.');

  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-le-option]'));
  const document = root.ownerDocument;
  const normalize = (value: string) => value.normalize('NFKC').toLowerCase();
  const entries = items.map((item, index) => {
    const label = item.textContent?.trim() ?? '';
    if (!item.id) item.id = `${list.id}-option-${index + 1}`;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
    return {
      item,
      label,
      value: item.dataset.leOption ?? label,
      search: normalize(`${label} ${item.dataset.leKeywords ?? ''}`),
    };
  });

  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', list.id);
  list.setAttribute('role', 'listbox');
  let expanded = false;
  let visible: typeof entries = [];
  let active = -1;

  const highlight = (index: number) => {
    if (active >= 0) visible[active].item.setAttribute('aria-selected', 'false');
    active = index;
    const entry = visible[active];
    if (entry) {
      entry.item.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', entry.item.id);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };

  const refresh = (query: string) => {
    highlight(-1);
    const terms = normalize(query).trim().split(/\s+/);
    visible = entries.filter(({ item, search }) => {
      item.hidden = !terms.every((term) => search.includes(term));
      return !item.hidden && item.getAttribute('aria-disabled') !== 'true';
    });
    if (empty) empty.hidden = entries.some(({ item }) => !item.hidden);
  };

  const show = (open: boolean) => {
    const query = open ? (options.query ? options.query(input) : input.value) : null;
    expanded = query !== null;
    popup.hidden = !expanded;
    input.setAttribute('aria-expanded', String(expanded));
    if (query !== null) refresh(query);
    else highlight(-1);
  };
  show(options.inline ?? false);

  const select = (entry: typeof entries[number]) => {
    const detail: ComboboxSelection = { value: entry.value, label: entry.label };
    if (options.apply) options.apply(input, detail);
    else input.value = entry.label;
    show(options.inline ?? false);
    root.dispatchEvent(new CustomEvent('le:optionselect', { bubbles: true, detail }));
  };

  const cleanup = [
    listen(input, 'focus', () => show(true)),
    listen(input, 'click', () => { if (options.query || !expanded) show(true); }),
    listen(input, 'input', (event) => { if (!(event as InputEvent).isComposing) show(true); }),
    listen(input, 'compositionend', () => show(true)),
    listen(input, 'keyup', (event) => {
      if (options.query && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes((event as KeyboardEvent).key)) show(true);
    }),
    listen(input, 'keydown', (event) => {
      const keyboard = event as KeyboardEvent;
      if (keyboard.isComposing) return;
      if (keyboard.key === 'Escape' && expanded && !options.inline) {
        event.preventDefault();
        show(false);
      } else if (keyboard.key === 'Enter' && expanded && active >= 0) {
        event.preventDefault();
        select(visible[active]);
      } else if (keyboard.key === 'ArrowDown' || keyboard.key === 'ArrowUp') {
        if (!expanded) show(true);
        if (!visible.length) return;
        event.preventDefault();
        const next = keyboard.key === 'ArrowDown'
          ? (active + 1) % visible.length
          : active < 0 ? visible.length - 1 : (active + visible.length - 1) % visible.length;
        highlight(next);
        visible[next].item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }),
    // Keep focus on the edit field when an option is clicked with a pointer.
    listen(list, 'mousedown', (event) => {
      if ((event as MouseEvent).button === 0 && (event.target as Element | null)?.closest('[data-le-option]')) {
        event.preventDefault();
      }
    }),
    listen(list, 'click', (event) => {
      const option = (event.target as Element | null)?.closest('[data-le-option]');
      const entry = visible.find(({ item }) => item === option);
      if (expanded && entry) select(entry);
    }),
  ];
  if (!options.inline) {
    cleanup.push(
      listen(root, 'focusout', (event) => {
        if (!root.contains((event as FocusEvent).relatedTarget as Node | null)) show(false);
      }),
      listen(document, 'pointerdown', (event) => {
        if (expanded && !root.contains(event.target as Node | null)) show(false);
      }),
    );
  }

  return {
    setQuery(query) {
      input.value = query;
      if (expanded) show(true);
    },
    destroy() {
      cleanup.forEach((remove) => remove());
      show(false);
      ['role', 'aria-autocomplete', 'aria-controls', 'aria-expanded'].forEach((name) => input.removeAttribute(name));
    },
  };
}
