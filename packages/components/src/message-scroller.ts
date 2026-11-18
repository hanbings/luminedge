import { listen } from '@luminedge/tools';

/** Follow new messages while the reader stays near the end of the conversation. */
export function createMessageScroller(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>('[data-le-message-scroll]');
  const latest = root.querySelector<HTMLButtonElement>('[data-le-message-latest]');
  if (!viewport) throw new Error('Message scroller needs a viewport.');
  let following = true;
  const scrollToLatest = () => {
    following = true;
    viewport.scrollTop = viewport.scrollHeight;
    if (latest) latest.disabled = true;
  };
  const update = () => {
    following = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <= 24;
    if (latest) latest.disabled = following;
  };
  const observer = new MutationObserver(() => { if (following) scrollToLatest(); });
  observer.observe(viewport, { childList: true, subtree: true, characterData: true });
  const cleanup = [listen(viewport, 'scroll', update, { passive: true })];
  if (latest) cleanup.push(listen(latest, 'click', scrollToLatest));
  scrollToLatest();
  return { scrollToLatest, destroy() { observer.disconnect(); cleanup.forEach((remove) => remove()); } };
}
