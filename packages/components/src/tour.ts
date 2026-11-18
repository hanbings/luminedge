import { listen } from '@luminedge/tools';

export interface TourStep {
  target?: HTMLElement;
  title: string;
  description: string;
}

export function createTour(dialog: HTMLDialogElement, steps: readonly TourStep[]) {
  const title = dialog.querySelector<HTMLElement>('[data-le-tour-title]');
  const description = dialog.querySelector<HTMLElement>('[data-le-tour-description]');
  const previous = dialog.querySelector<HTMLButtonElement>('[data-le-tour-previous]');
  const next = dialog.querySelector<HTMLButtonElement>('[data-le-tour-next]');
  const progress = dialog.querySelector<HTMLElement>('[data-le-tour-progress]');
  if (!title || !description || !previous || !next || !steps.length) throw new Error('Tour needs controls and at least one step.');
  const nextLabel = next.textContent;
  const finishLabel = next.dataset.leFinishLabel ?? 'Finish';
  let index = -1;
  const clear = () => {
    steps[index]?.target?.classList.remove('le-tour-active');
    index = -1;
  };
  const show = (target: number) => {
    clear();
    index = target;
    const step = steps[index];
    title.textContent = step.title;
    description.textContent = step.description;
    if (progress) progress.textContent = (index + 1) + ' / ' + steps.length;
    previous.disabled = index === 0;
    next.textContent = index === steps.length - 1 ? finishLabel : nextLabel;
    step.target?.classList.add('le-tour-active');
    step.target?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  const close = () => {
    if (dialog.open) dialog.close();
    clear();
  };
  const cleanup = [
    listen(dialog, 'close', () => { if (!dialog.open) clear(); }),
    listen(previous, 'click', () => { if (index > 0) show(index - 1); }),
    listen(next, 'click', () => {
      if (index < 0 || index === steps.length - 1) close();
      else show(index + 1);
    }),
  ];
  return {
    open() { if (!dialog.open) { show(0); dialog.showModal(); } },
    close,
    destroy() { close(); cleanup.forEach((remove) => remove()); },
  };
}
