import { listen } from '@luminedge/tools';

export interface DataTableOptions {
  filter?: HTMLInputElement;
  empty?: HTMLElement;
  locale?: string;
}

export interface DataTableController {
  setFilter(query: string): void;
  destroy(): void;
}

/** Filter and sort a static table body without recreating its rows. */
export function createDataTable(table: HTMLTableElement, options: DataTableOptions = {}): DataTableController {
  const body = table.tBodies[0];
  if (!body) throw new Error('Data table needs a table body.');
  const { filter, empty } = options;
  const collator = new Intl.Collator(options.locale || table.closest<HTMLElement>('[lang]')?.lang || undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  const rows = Array.from(body.rows, (row) => ({ row, hidden: row.hidden }));
  const columns = Array.from(table.tHead?.querySelectorAll<HTMLTableCellElement>('th[data-le-sort]') ?? [])
    .flatMap((header) => {
      const button = header.querySelector<HTMLButtonElement>('button[data-le-sort-button]');
      return button ? [{ header, button, disabled: button.disabled, sort: header.getAttribute('aria-sort') }] : [];
    });
  const originalEmpty = empty?.hidden;
  const normalize = (value: string) => value.normalize('NFKC').toLowerCase();
  const search = (query: string) => {
    const terms = normalize(query).trim().split(/\s+/);
    let count = 0;
    for (const { row, hidden } of rows) {
      const text = normalize(Array.from(row.cells, (cell) => cell.textContent?.trim() ?? '').join(' '));
      row.hidden = hidden || !terms.every((term) => text.includes(term));
      if (!row.hidden) count += 1;
    }
    if (empty) empty.hidden = count !== 0;
  };

  const initialSort = columns.find(({ sort }) => sort === 'ascending' || sort === 'descending');
  let sortedBy = initialSort?.header;
  let direction = initialSort?.sort === 'descending' ? 'descending' : 'ascending';
  const sortBy = (header: HTMLTableCellElement) => {
    direction = sortedBy === header && direction === 'ascending' ? 'descending' : 'ascending';
    sortedBy = header;
    const index = header.cellIndex;
    const valueOf = (row: HTMLTableRowElement) => {
      const cell = row.cells[index];
      return cell?.dataset.leSortValue ?? cell?.textContent?.trim() ?? '';
    };
    const sign = direction === 'ascending' ? 1 : -1;
    const numeric = header.dataset.leSort === 'number';
    const ordered = rows.map(({ row }) => row).sort((left, right) => {
      const a = valueOf(left);
      const b = valueOf(right);
      if (!numeric) return sign * collator.compare(a, b);
      const aNumber = a.trim() ? Number(a) : NaN;
      const bNumber = b.trim() ? Number(b) : NaN;
      if (!Number.isFinite(aNumber)) return Number.isFinite(bNumber) ? 1 : 0;
      if (!Number.isFinite(bNumber)) return -1;
      return sign * (aNumber - bNumber);
    });
    body.append(...ordered);
    columns.forEach(({ header: column }) => {
      if (column === header) column.setAttribute('aria-sort', direction);
      else column.removeAttribute('aria-sort');
    });
  };

  const cleanup = columns.map(({ header, button }) => {
    button.disabled = false;
    return listen(button, 'click', () => sortBy(header));
  });
  if (filter) cleanup.push(listen(filter, 'input', () => search(filter.value)));
  search(filter?.value ?? '');

  return {
    setFilter(query) {
      if (filter) filter.value = query;
      search(query);
    },
    destroy() {
      cleanup.forEach((remove) => remove());
      columns.forEach(({ header, button, disabled, sort }) => {
        button.disabled = disabled;
        if (sort === null) header.removeAttribute('aria-sort');
        else header.setAttribute('aria-sort', sort);
      });
      body.append(...rows.map(({ row }) => row));
      rows.forEach(({ row, hidden }) => { row.hidden = hidden; });
      if (empty && originalEmpty !== undefined) empty.hidden = originalEmpty;
    },
  };
}
