import { listen } from '@luminedge/tools';

/** Move selected options between two multiple-select lists. */
export function createTransfer(root: HTMLElement) {
  const source = root.querySelector<HTMLSelectElement>('select[data-le-transfer-source]');
  const target = root.querySelector<HTMLSelectElement>('select[data-le-transfer-target]');
  const add = root.querySelector<HTMLButtonElement>('button[data-le-transfer-add]');
  const remove = root.querySelector<HTMLButtonElement>('button[data-le-transfer-remove]');
  if (!source?.multiple || !target?.multiple || !add || !remove) {
    throw new Error('Transfer needs two multiple-select lists and two move buttons.');
  }
  const enabled = (select: HTMLSelectElement) => Array.from(select.selectedOptions).filter((option) => !option.matches(':disabled'));
  const getValues = () => Array.from(target.options, (option) => option.value);
  const update = () => {
    add.disabled = !enabled(source).length;
    remove.disabled = !enabled(target).length;
  };
  const move = (from: HTMLSelectElement, to: HTMLSelectElement) => {
    const selected = enabled(from);
    if (!selected.length) return;
    for (const option of selected) {
      to.append(option);
      option.selected = false;
    }
    update();
    from.focus();
    root.dispatchEvent(new CustomEvent('le:transferchange', { bubbles: true, detail: { values: getValues() } }));
  };
  update();
  const cleanup = [
    listen(source, 'change', update), listen(target, 'change', update),
    listen(add, 'click', () => move(source, target)), listen(remove, 'click', () => move(target, source)),
  ];
  return { getValues, destroy: () => cleanup.forEach((dispose) => dispose()) };
}
