import { listen } from '@luminedge/tools';

export interface VirtualListOptions<Item> {
  items: readonly Item[];
  rowHeight: number;
  overscan?: number;
  render(item: Item, index: number): Node;
}

/** Render a window of non-interactive rows with a fixed height. */
export function createVirtualList<Item>(viewport: HTMLElement, options: VirtualListOptions<Item>) {
  const list = viewport.querySelector<HTMLElement>('[data-le-virtual-list]');
  if (!list || !Number.isFinite(options.rowHeight) || options.rowHeight <= 0) {
    throw new Error('Virtual list needs a list and a positive row height.');
  }
  const { rowHeight } = options;
  const overscan = Math.max(0, Math.floor(options.overscan ?? 4));
  let items = options.items;
  let previousStart = -1;
  let previousEnd = -1;

  const render = () => {
    const start = Math.max(0, Math.floor(viewport.scrollTop / rowHeight) - overscan);
    const end = Math.min(items.length, Math.ceil((viewport.scrollTop + viewport.clientHeight) / rowHeight) + overscan);
    if (previousStart === start && previousEnd === end) return;
    previousStart = start;
    previousEnd = end;
    const rows = list.ownerDocument.createDocumentFragment();
    for (let index = start; index < end; index += 1) {
      const row = list.ownerDocument.createElement('li');
      row.className = 'le-virtual-row';
      row.style.top = index * rowHeight + 'px';
      row.style.height = rowHeight + 'px';
      row.setAttribute('aria-setsize', String(items.length));
      row.setAttribute('aria-posinset', String(index + 1));
      row.append(options.render(items[index], index));
      rows.append(row);
    }
    list.replaceChildren(rows);
  };
  const setItems = (next: readonly Item[]) => {
    items = next;
    list.style.height = items.length * rowHeight + 'px';
    previousStart = -1;
    previousEnd = -1;
    render();
  };
  const remove = listen(viewport, 'scroll', render, { passive: true });
  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(render);
  resize?.observe(viewport);
  setItems(items);
  return { setItems, destroy() { remove(); resize?.disconnect(); } };
}
