import { createSubsectionSearch } from './subsection-search';
import { getSubsectionWindowSize, getSubsectionWindowStart, subsectionAtReadingLine } from './showcase/index-window';

const root = document.documentElement;
const sectionPicker = document.querySelector<HTMLSelectElement>('[data-section-picker]')!;
const subsectionPicker = document.querySelector<HTMLSelectElement>('[data-subsection-picker]')!;
const subsectionNav = document.querySelector<HTMLElement>('[data-subsection-index]')!;
const subsectionLinks = subsectionNav.querySelector<HTMLElement>('[data-subsection-links]')!;
const cover = document.querySelector<HTMLElement>('.landing-cover');
const appearanceControls = document.querySelector<HTMLElement>('.appearance-controls')!;
const searchOpen = document.querySelector<HTMLButtonElement>('[data-subsection-search-open]')!;
const scrollCue = document.querySelector<HTMLButtonElement>('[data-mobile-scroll-cue]')!;
const docsLink = document.querySelector<HTMLAnchorElement>('[data-showcase-doc-link]')!;
const docsHome = docsLink.href;
const docLinks: Record<string, string> = JSON.parse(docsLink.dataset.docLinks ?? '{}');

const sections = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-index-target]'), (link) => {
  const target = document.getElementById(link.dataset.indexTarget!)!;
  const children = Array.from(target.querySelectorAll<HTMLElement>('[data-index-subsection]'), (group) => {
    const title = group.querySelector('h3')?.textContent.trim() || group.id;
    const label = group.dataset.indexSubsection || title;
    const link = document.createElement('a');
    link.href = '#' + group.id;
    link.textContent = label;
    return { target: group, title, link, option: new Option(label, group.id) };
  });
  return { target, link, children };
});

type Section = typeof sections[number];
let activeSection: Section | undefined;
let activeChild: Section['children'][number] | undefined;
let previousLimit = 0;

const searchEntries = sections.flatMap(({ target, link, children }) => [
  { link, title: target.querySelector('h2')?.textContent.trim() || link.text.trim() },
  ...children.map((child) => ({ link: child.link, title: child.title, section: link.text.trim() })),
]);
createSubsectionSearch(searchOpen, searchEntries, () => activeChild?.link ?? activeSection?.link);

function updateIndex() {
  root.classList.toggle('index-visible', window.scrollY > 24);
  scrollCue.hidden = window.scrollY + window.innerHeight >= root.scrollHeight - 1;
  const topInset = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const coverBottom = cover?.getBoundingClientRect().bottom ?? 0;
  appearanceControls.hidden = coverBottom > topInset + 1;
  const readingLine = Math.max(window.innerHeight / 4, topInset);
  const section = sections.find(({ target }) => {
    const bounds = target.getBoundingClientRect();
    return bounds.top <= readingLine + 1 && bounds.bottom > readingLine + 1;
  });

  if (activeSection !== section) {
    activeSection?.link.removeAttribute('aria-current');
    section?.link.setAttribute('aria-current', 'location');
    sectionPicker.value = section?.target.id ?? '';
    const children = section?.children ?? [];
    subsectionLinks.replaceChildren(...children.map(({ link }) => link));
    subsectionPicker.replaceChildren(...children.map(({ option }) => option));
    subsectionNav.hidden = subsectionPicker.hidden = children.length === 0;
    activeSection = section;
  }

  const child = section && subsectionAtReadingLine(section.children, readingLine);
  const limit = getSubsectionWindowSize(window.innerHeight);
  if (activeChild !== child || previousLimit !== limit) {
    activeChild?.link.removeAttribute('aria-current');
    child?.link.setAttribute('aria-current', 'location');
    subsectionPicker.value = child?.target.id ?? '';
    const children = section?.children ?? [];
    const index = child ? children.indexOf(child) : 0;
    const start = getSubsectionWindowStart(children.length, index, limit);
    children.forEach(({ link }, i) => { link.hidden = i < start || i >= start + limit; });
    activeChild = child;
    previousLimit = limit;
  }
  docsLink.href = docLinks[child?.target.id ?? ''] ?? docLinks[section?.target.id ?? ''] ?? docsHome;
}

for (const picker of [sectionPicker, subsectionPicker]) {
  picker.addEventListener('change', () => { window.location.assign('#' + picker.value); });
}
scrollCue.addEventListener('click', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollBy({ top: window.innerHeight * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
});

let scheduled = false;
function scheduleUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    updateIndex();
  });
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
window.addEventListener('pageshow', scheduleUpdate);
const resizeObserver = new ResizeObserver(scheduleUpdate);
if (cover) resizeObserver.observe(cover);
sections.forEach(({ target }) => resizeObserver.observe(target));
updateIndex();
