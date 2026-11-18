import { listen } from '@luminedge/tools';

export function createCarousel(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('[data-le-carousel-list]');
  const previous = root.querySelector<HTMLButtonElement>('[data-le-carousel-previous]');
  const next = root.querySelector<HTMLButtonElement>('[data-le-carousel-next]');
  const output = root.querySelector<HTMLElement>('[data-le-carousel-position]');
  const slides = list ? Array.from(list.children) as HTMLElement[] : [];
  if (!list || !slides.length) throw new Error('Carousel needs a list with slides.');
  const window = root.ownerDocument.defaultView;
  const closestSlide = () => {
    const left = list.getBoundingClientRect().left;
    return slides.reduce((best, slide, i) =>
      Math.abs(slide.getBoundingClientRect().left - left) < Math.abs(slides[best].getBoundingClientRect().left - left) ? i : best, 0);
  };
  const update = () => {
    const index = closestSlide();
    if (previous) previous.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
    if (output) output.textContent = (index + 1) + ' / ' + slides.length;
  };
  const goTo = (index: number) => {
    if (!Number.isInteger(index) || !slides[index]) return false;
    const distance = slides[index].getBoundingClientRect().left - list.getBoundingClientRect().left;
    const reduceMotion = window?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollBy({ left: distance, behavior: reduceMotion ? 'instant' : 'smooth' });
    return true;
  };
  const cleanup = [listen(list, 'scroll', update, { passive: true })];
  if (window) cleanup.push(listen(window, 'resize', update));
  if (previous) cleanup.push(listen(previous, 'click', () => goTo(closestSlide() - 1)));
  if (next) cleanup.push(listen(next, 'click', () => goTo(closestSlide() + 1)));
  cleanup.push(listen(list, 'keydown', (event) => {
    if (event.target !== list) return;
    const { key } = event as KeyboardEvent;
    const direction = getComputedStyle(list).direction === 'rtl' ? -1 : 1;
    if (key === 'ArrowLeft') goTo(closestSlide() - direction);
    else if (key === 'ArrowRight') goTo(closestSlide() + direction);
    else if (key === 'Home') goTo(0);
    else if (key === 'End') goTo(slides.length - 1);
    else return;
    event.preventDefault();
  }));
  update();
  return { goTo, destroy: () => cleanup.forEach((remove) => remove()) };
}
