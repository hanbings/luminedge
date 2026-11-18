import { listen } from '@luminedge/tools';

export interface TooltipController { destroy(): void; }

/** Show a tooltip on hover or focus and dismiss it with Escape. */
export function createTooltip(trigger: HTMLElement, tooltip: HTMLElement): TooltipController {
  const host = tooltip.parentElement;
  if (!host || !host.contains(trigger) || !tooltip.id) throw new Error('Tooltip and trigger must share a container, and the tooltip needs an id.');
  const originalDescription = trigger.getAttribute('aria-describedby');
  const originalRole = tooltip.getAttribute('role');
  const ids = new Set((originalDescription ?? '').split(/\s+/).filter(Boolean));
  ids.add(tooltip.id);
  trigger.setAttribute('aria-describedby', Array.from(ids).join(' '));
  tooltip.setAttribute('role', 'tooltip');
  let hovering = false;
  let focused = false;
  let touchOpen = false;
  let dismissed = false;
  const update = () => { tooltip.hidden = dismissed || (!hovering && !focused && !touchOpen); };
  update();

  const cleanup = [
    listen(host, 'mouseenter', () => { hovering = true; dismissed = false; update(); }),
    listen(host, 'mouseleave', () => { hovering = false; if (!focused) dismissed = false; update(); }),
    listen(host, 'focusin', () => { focused = true; dismissed = false; update(); }),
    listen(host, 'focusout', (event) => { focused = host.contains((event as FocusEvent).relatedTarget as Node | null); if (!focused && !hovering) { touchOpen = false; dismissed = false; } update(); }),
    listen(trigger, 'pointerdown', (event) => {
      if ((event as PointerEvent).pointerType !== 'touch') return;
      touchOpen = dismissed || !touchOpen;
      dismissed = false;
      update();
    }),
    listen(host.ownerDocument, 'pointerdown', (event) => {
      if (touchOpen && !host.contains(event.target as Node | null)) { touchOpen = false; update(); }
    }),
    listen(host.ownerDocument, 'keydown', (event) => { if ((event as KeyboardEvent).key === 'Escape' && !tooltip.hidden) { dismissed = true; update(); } }),
  ];
  return { destroy() {
    cleanup.forEach((remove) => remove());
    tooltip.hidden = true;
    if (originalDescription === null) trigger.removeAttribute('aria-describedby');
    else trigger.setAttribute('aria-describedby', originalDescription);
    if (originalRole === null) tooltip.removeAttribute('role');
    else tooltip.setAttribute('role', originalRole);
  } };
}
