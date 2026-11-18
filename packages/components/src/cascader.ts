import { listen } from '@luminedge/tools';

export interface CascaderOption {
  value: string;
  label: string;
  children?: readonly CascaderOption[];
}

/** Use one native select per level of a hierarchy. Each select labels its own level. */
export function createCascader(root: HTMLElement, options: readonly CascaderOption[]) {
  const levels = Array.from(root.querySelectorAll<HTMLSelectElement>('select[data-le-cascade]'));
  if (!levels.length) throw new Error('Cascader needs at least one select.');
  const placeholders = levels.map((select) => select.querySelector('option[value=""]')?.textContent ?? '—');

  let path: string[] = [];
  const render = (values: readonly string[]) => {
    path = [];
    let available = options;
    levels.forEach((select, depth) => {
      const placeholder = select.ownerDocument.createElement('option');
      placeholder.value = '';
      placeholder.textContent = placeholders[depth];
      const choices = available.map(({ label, value }) => {
        const option = select.ownerDocument.createElement('option');
        option.value = value;
        option.textContent = label;
        return option;
      });
      const previous = select.value;
      const selected = available.find(({ value }) => value && value === values[depth]);
      // Avoid replacing the options of a select the user is currently operating.
      const current = Array.from(select.options);
      if (current.length !== choices.length + 1 || choices.some((choice, i) =>
        current[i + 1]?.value !== choice.value || current[i + 1]?.textContent !== choice.textContent)) {
        select.replaceChildren(placeholder, ...choices);
      }
      const value = selected?.value ?? '';
      if (select.value !== value || previous !== value) select.value = value;
      select.disabled = !available.length;
      if (selected) path.push(selected.value);
      available = selected?.children ?? [];
    });
  };
  const notify = () => root.dispatchEvent(new CustomEvent('le:cascadechange', { bubbles: true, detail: { path: [...path] } }));
  const cleanup = levels.map((select, depth) => listen(select, 'change', () => {
    render([...path.slice(0, depth), select.value]);
    notify();
  }));
  render(levels.map((select) => select.value));
  return {
    getPath: () => [...path],
    setPath(values: readonly string[]) { render(values); notify(); },
    destroy: () => cleanup.forEach((remove) => remove()),
  };
}
