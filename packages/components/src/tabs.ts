import { listen } from '@luminedge/tools';

export interface TabsController {
  /** Select an enabled tab by its id. Returns false if it is not available. */
  select(id: string): boolean;
  destroy(): void;
}

/** Enhance a tablist and its associated panels. Selection follows keyboard focus. */
export function createTabs(root: HTMLElement): TabsController {
  const tablist = root.querySelector<HTMLElement>('[role="tablist"]');
  if (!tablist) throw new Error('Tabs require a tablist.');
  const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
  if (!tabs.length) throw new Error('Tabs require at least one tab.');

  const panels = tabs.map((tab) => {
    const panelId = tab.getAttribute('aria-controls');
    const panel = panelId ? root.ownerDocument.getElementById(panelId) : null;
    if (!tab.id || !panel || !root.contains(panel) || panel.getAttribute('role') !== 'tabpanel') {
      throw new Error('Each tab needs an id and an associated panel inside the tabs container.');
    }
    return panel;
  });
  if (new Set(tabs.map((tab) => tab.id)).size !== tabs.length || new Set(panels).size !== panels.length) {
    throw new Error('Tab and panel ids must be unique.');
  }

  const isEnabled = (tab: HTMLElement) => !tab.matches(':disabled') && tab.getAttribute('aria-disabled') !== 'true';
  const firstEnabled = tabs.findIndex(isEnabled);
  if (firstEnabled < 0) throw new Error('Tabs require at least one enabled tab.');
  let current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true' && isEnabled(tab));
  if (current < 0) current = firstEnabled;

  const update = (index: number, focus: boolean, notify: boolean) => {
    const changed = current !== index;
    current = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
    if (changed && notify) root.dispatchEvent(new CustomEvent('le:tabchange', { bubbles: true, detail: { id: tabs[index].id } }));
  };
  update(current, false, false);

  const cleanup = tabs.flatMap((tab, index) => [
    listen(tab, 'click', (event) => {
      event.preventDefault();
      if (isEnabled(tab)) update(index, false, true);
    }),
    listen(tab, 'keydown', (event) => {
      const key = (event as KeyboardEvent).key;
      if (key === ' ' || key === 'Enter') {
        event.preventDefault();
        if (isEnabled(tab)) update(index, false, true);
        return;
      }
      if (!tabs.some(isEnabled)) return;
      const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
      let next = index;
      if (key === 'Home') next = tabs.findIndex(isEnabled);
      else if (key === 'End') {
        next = tabs.length - 1;
        while (!isEnabled(tabs[next])) next -= 1;
      }
      else {
        const direction = key === (vertical ? 'ArrowDown' : 'ArrowRight') ? 1 : key === (vertical ? 'ArrowUp' : 'ArrowLeft') ? -1 : 0;
        if (!direction) return;
        do { next = (next + direction + tabs.length) % tabs.length; } while (!isEnabled(tabs[next]));
      }
      event.preventDefault();
      update(next, true, true);
    }),
  ]);

  return {
    select(id) {
      const index = tabs.findIndex((tab) => tab.id === id && isEnabled(tab));
      if (index < 0) return false;
      update(index, false, true);
      return true;
    },
    destroy: () => cleanup.forEach((remove) => remove()),
  };
}
