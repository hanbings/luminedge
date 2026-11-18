import { listen } from '@luminedge/tools';

export interface CopyResult {
  copied: boolean;
  selected: boolean;
}

export interface CopyButtonController { destroy(): void; }

/** Copy an element's text, or leave it selected if clipboard access is unavailable. */
export function createCopyButton(button: HTMLElement, source: HTMLElement): CopyButtonController {
  const document = source.ownerDocument;
  let disposed = false;
  const copy = async (): Promise<CopyResult> => {
    try {
      const clipboard = document.defaultView?.navigator.clipboard;
      if (clipboard) {
        await clipboard.writeText(source.textContent ?? '');
        return { copied: true, selected: false };
      }
    } catch {
      // Fall back to the document selection on HTTP or when permission is denied.
    }
    const selection = document.getSelection();
    if (disposed || !selection || !source.isConnected) return { copied: false, selected: false };
    const previous = Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange());
    const range = document.createRange();
    range.selectNodeContents(source);
    selection.removeAllRanges();
    selection.addRange(range);
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      // The text remains selected so the user can copy it manually.
    }
    if (copied) {
      selection.removeAllRanges();
      previous.forEach((item) => selection.addRange(item));
    }
    return { copied, selected: !copied };
  };
  const remove = listen(button, 'click', async () => {
    const detail = await copy();
    if (!disposed) button.dispatchEvent(new CustomEvent('le:copy', { bubbles: true, detail }));
  });
  return { destroy() { disposed = true; remove(); } };
}
