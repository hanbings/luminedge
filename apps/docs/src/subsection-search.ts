import { createDialog } from '@luminedge/ui';

interface SearchEntry {
  link: HTMLAnchorElement;
  title: string;
  section?: string;
}

export function createSubsectionSearch(
  opener: HTMLButtonElement,
  entries: SearchEntry[],
  getCurrent: () => HTMLAnchorElement | undefined,
) {
  const dialog = document.querySelector<HTMLDialogElement>('[data-subsection-search]')!;
  const input = dialog.querySelector<HTMLInputElement>('[data-subsection-search-input]')!;
  const results = dialog.querySelector<HTMLElement>('[data-subsection-search-results]')!;
  const status = dialog.querySelector<HTMLElement>('[data-subsection-search-status]')!;
  const controller = createDialog(dialog, { closeTriggers: dialog.querySelectorAll('[data-subsection-search-close]') });
  const normalize = (text: string) => text.trim().normalize('NFKC').toLowerCase();

  function render() {
    const query = normalize(input.value);
    const matches = entries.filter(({ link, title }) =>
      normalize(title).includes(query) || normalize(link.text).includes(query),
    );
    const current = getCurrent();

    results.replaceChildren(...matches.map(({ link: source, title, section }) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.hash;
      link.text = title;
      if (source === current) link.setAttribute('aria-current', 'location');
      if (section) {
        const context = document.createElement('span');
        context.textContent = section;
        link.append(context);
      } else {
        item.classList.add('subsection-search-chapter');
      }
      item.append(link);
      return item;
    }));
    results.scrollTop = 0;
    status.textContent = matches.length === 0 ? '找不到匹配的条目' : `${matches.length} 项`;
  }

  opener.addEventListener('click', () => {
    input.value = '';
    render();
    controller.open();
    const current = results.querySelector<HTMLElement>('[aria-current="location"]');
    if (current) results.scrollTop = current.offsetTop - results.clientHeight / 3;
  });
  input.addEventListener('input', render);
  input.form!.addEventListener('submit', (event) => {
    event.preventDefault();
    results.querySelector('a')?.click();
  });
  results.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      controller.close();
    }
  });
}
