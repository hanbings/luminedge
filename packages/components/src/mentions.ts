import { createCombobox } from './combobox.js';

/** Suggest names after @ and replace only the mention at the caret. */
export function createMentions(root: HTMLElement) {
  const current = (input: HTMLInputElement | HTMLTextAreaElement) => {
    const caret = input.selectionStart;
    if (caret === null || caret !== input.selectionEnd) return null;
    const match = /(?:^|\s)@([^\s@]*)$/.exec(input.value.slice(0, caret));
    if (!match) return null;
    const suffix = /^[^\s@]*/.exec(input.value.slice(caret))?.[0] ?? '';
    return { query: match[1], start: caret - match[1].length - 1, end: caret + suffix.length };
  };
  return createCombobox(root, {
    query: (input) => current(input)?.query ?? null,
    apply(input, { value }) {
      const mention = current(input);
      if (!mention) return;
      const space = /^\s/.test(input.value.slice(mention.end)) ? '' : ' ';
      input.setRangeText('@' + value + space, mention.start, mention.end, 'end');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    },
  });
}
