const root = document.documentElement;
const sectionPicker = document.querySelector<HTMLSelectElement>('[data-section-picker]')!;
const subsectionPicker = document.querySelector<HTMLSelectElement>('[data-subsection-picker]')!;
const subsectionNav = document.querySelector<HTMLElement>('[data-subsection-index]')!;
const scrollCue = document.querySelector<HTMLButtonElement>('[data-mobile-scroll-cue]')!;

const sections = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-index-target]'), (link) => {
  const target = document.getElementById(link.dataset.indexTarget!)!;
  const children = Array.from(target.querySelectorAll<HTMLElement>('[data-index-subsection]'), (group) => {
    const label = group.dataset.indexSubsection || group.querySelector('h3')!.textContent.trim();
    const link = document.createElement('a');
    link.href = '#' + group.id;
    link.textContent = label;
    return { target: group, link, option: new Option(label, group.id) };
  });
  return { target, link, children };
});

type Section = typeof sections[number];
let activeSection: Section | undefined;
let activeChild: Section['children'][number] | undefined;

// Side-by-side groups share a reading position. Honor a direct link within that row.
function currentChild(section: Section, readingLine: number) {
  let current = section.children[0];
  let rowTop = -Infinity;
  for (const child of section.children) {
    const top = child.target.getBoundingClientRect().top;
    if (top > readingLine + 1) continue;
    if (top > rowTop + 1 || (Math.abs(top - rowTop) <= 1 && location.hash === child.link.hash)) {
      current = child;
      rowTop = top;
    }
  }
  return current;
}

function updateIndex() {
  root.classList.toggle('index-visible', window.scrollY > 24);
  scrollCue.hidden = window.scrollY + window.innerHeight >= root.scrollHeight - 1;
  const readingLine = window.innerHeight / 4;
  const section = sections.find(({ target }) => {
    const bounds = target.getBoundingClientRect();
    return bounds.top <= readingLine && bounds.bottom > readingLine;
  });

  if (activeSection !== section) {
    activeSection?.link.removeAttribute('aria-current');
    section?.link.setAttribute('aria-current', 'location');
    sectionPicker.value = section?.target.id ?? '';
    const children = section?.children ?? [];
    subsectionNav.replaceChildren(...children.map(({ link }) => link));
    subsectionPicker.replaceChildren(...children.map(({ option }) => option));
    subsectionNav.hidden = subsectionPicker.hidden = children.length === 0;
    activeSection = section;
  }

  const child = section && currentChild(section, readingLine);
  if (activeChild !== child) {
    activeChild?.link.removeAttribute('aria-current');
    child?.link.setAttribute('aria-current', 'location');
    subsectionPicker.value = child?.target.id ?? '';
    activeChild = child;
  }
}

for (const picker of [sectionPicker, subsectionPicker]) {
  picker.addEventListener('change', () => { window.location.assign('#' + picker.value); });
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

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
window.addEventListener('pageshow', scheduleUpdate);
const resizeObserver = new ResizeObserver(scheduleUpdate);
sections.forEach(({ target }) => resizeObserver.observe(target));
updateIndex();
