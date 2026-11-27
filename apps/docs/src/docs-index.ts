import { createSubsectionSearch } from './subsection-search';
import { subsectionAtReadingLine } from './showcase/index-window';

const root = document.documentElement;
const chrome = document.querySelector<HTMLElement>('[data-doc-chrome]')!;
const content = document.querySelector<HTMLElement>('#docs-content')!;
const sectionPicker = document.querySelector<HTMLSelectElement>('[data-section-picker]')!;
const subsectionPicker = document.querySelector<HTMLSelectElement>('[data-subsection-picker]')!;
const outlineLinks = document.querySelector<HTMLElement>('[data-subsection-links]')!;
const outlineCue = document.querySelector<HTMLElement>('[data-doc-outline-cue]');
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-subsection-target]'));
const local = links.flatMap((link) => {
  const target = document.getElementById(link.dataset.subsectionTarget!);
  return target ? [{ target, link }] : [];
});
const initial = links.find((link) => link.hasAttribute('aria-current'));
let current = initial;

const articleEntries = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-doc-search-entry]'), (link) => ({
  link,
  title: link.text.trim(),
  section: link.dataset.docSearchGroup,
  searchText: [link.dataset.docSearchGroup, link.dataset.docSearchDescription].filter(Boolean).join(' '),
}));
const articleLinks = new Set(articleEntries.map(({ link }) => link.href));
const examples = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-doc-search-example]'))
  .filter((link) => !articleLinks.has(link.href))
  .map((link) => ({ link, title: link.dataset.docSearchTitle || link.text.trim(), section: link.dataset.docSearchGroup }));
const searchEntries = [...articleEntries, ...examples];
const searchOpen = document.querySelector<HTMLButtonElement>('[data-subsection-search-open]')!;
createSubsectionSearch(searchOpen, searchEntries, () =>
  searchEntries.find(({ link }) => link.href === current?.href)?.link
    ?? articleEntries.find(({ link }) => link.getAttribute('aria-current') === 'page')?.link,
);

function updateOutlineCue() {
  if (!outlineCue) return;
  const { clientHeight, scrollHeight, scrollTop } = outlineLinks;
  const hidden = clientHeight === 0 || scrollHeight - clientHeight - scrollTop <= 1;
  if (outlineCue.hidden === hidden) return;
  if (hidden && outlineCue.contains(document.activeElement)) outlineLinks.focus({ preventScroll: true });
  outlineCue.hidden = hidden;
}

if (outlineCue) {
  outlineLinks.addEventListener('scroll', updateOutlineCue, { passive: true });
  outlineCue.querySelector('button')?.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    outlineLinks.scrollBy({ top: outlineLinks.clientHeight * 0.8, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
}

function updateIndex() {
  const topInset = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const readingLine = Math.max(window.innerHeight / 4, topInset);
  const atEnd = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
  const hashTarget = atEnd ? local.find(({ link, target }) => {
    if (link.hash !== window.location.hash) return false;
    const top = target.getBoundingClientRect().top;
    return top >= topInset - 1 && top < window.innerHeight;
  }) : undefined;
  const active = (hashTarget ?? subsectionAtReadingLine(local, readingLine))?.link ?? initial;
  if (current === active) return;

  current?.removeAttribute('aria-current');
  active?.setAttribute('aria-current', 'location');
  if (active) subsectionPicker.value = active.getAttribute('href')!;
  current = active;
  updateOutlineCue();
}

for (const picker of [sectionPicker, subsectionPicker]) {
  picker.addEventListener('change', () => { window.location.assign(picker.value); });
}

let scheduled = false;
function scheduleUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    updateIndex();
  });
}

function measureChrome() {
  const height = `${chrome.getBoundingClientRect().height}px`;
  if (root.style.getPropertyValue('--docs-chrome-height') !== height) root.style.setProperty('--docs-chrome-height', height);
  updateOutlineCue();
  scheduleUpdate();
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', measureChrome);
window.addEventListener('hashchange', scheduleUpdate);
window.addEventListener('pageshow', measureChrome);
const observer = new ResizeObserver(measureChrome);
observer.observe(chrome);
observer.observe(content);
if (outlineCue) observer.observe(outlineLinks);
measureChrome();
updateIndex();
