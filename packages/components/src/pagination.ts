import { listen } from '@luminedge/tools';

export interface PaginationController {
  getPage(): number;
  setPage(page: number): boolean;
  destroy(): void;
}

/** Wire page buttons and optional previous/next buttons in a pagination container. */
export function createPagination(root: HTMLElement): PaginationController {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button[data-le-page]'));
  const numbered = buttons.flatMap((button) => {
    const value = button.dataset.lePage ?? '';
    return /^[1-9]\d*$/.test(value) ? [{ button, page: Number(value) }] : [];
  }).sort((a, b) => a.page - b.page);
  if (!numbered.length || numbered.some(({ page }) => !Number.isSafeInteger(page)) || new Set(numbered.map(({ page }) => page)).size !== numbered.length) {
    throw new Error('Pagination requires unique positive page numbers.');
  }
  const previous = buttons.find((button) => button.dataset.lePage === 'previous');
  const next = buttons.find((button) => button.dataset.lePage === 'next');
  let index = numbered.findIndex(({ button }) => button.getAttribute('aria-current') === 'page');
  if (index < 0) index = 0;

  const update = (nextIndex: number, notify: boolean) => {
    const changed = index !== nextIndex;
    const active = root.ownerDocument.activeElement;
    index = nextIndex;
    numbered.forEach(({ button }, i) => {
      if (i === index) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    if (previous) previous.disabled = index === 0;
    if (next) next.disabled = index === numbered.length - 1;
    if ((active === previous && previous?.disabled) || (active === next && next?.disabled)) numbered[index].button.focus();
    if (changed && notify) root.dispatchEvent(new CustomEvent('le:pagechange', { bubbles: true, detail: { page: numbered[index].page } }));
  };
  update(index, false);
  const cleanup = buttons.map((button) => listen(button, 'click', () => {
    if (button.disabled) return;
    const value = button.dataset.lePage;
    const nextIndex = value === 'previous' ? index - 1 : value === 'next' ? index + 1 : numbered.findIndex(({ button: item }) => item === button);
    if (nextIndex >= 0 && nextIndex < numbered.length) update(nextIndex, true);
  }));

  return {
    getPage: () => numbered[index].page,
    setPage(page) {
      const nextIndex = numbered.findIndex((item) => item.page === page);
      if (nextIndex < 0) return false;
      update(nextIndex, true);
      return true;
    },
    destroy: () => cleanup.forEach((remove) => remove()),
  };
}
