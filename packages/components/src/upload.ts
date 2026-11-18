import { listen } from '@luminedge/tools';

export type UploadState = 'ready' | 'uploading' | 'uploaded' | 'failed';
export interface UploadOptions {
  accept?: (file: File) => boolean;
  upload?: (file: File, signal: AbortSignal, progress: (percent: number) => void) => Promise<void>;
  removeLabel?: string;
  stateLabels?: Partial<Record<UploadState, string>>;
}

/** Maintain a removable file queue. The caller provides the transport when needed. */
export function createUpload(root: HTMLElement, options: UploadOptions = {}) {
  const input = root.querySelector<HTMLInputElement>('input[type="file"]');
  const list = root.querySelector<HTMLElement>('[data-le-upload-list]');
  const drop = root.querySelector<HTMLElement>('[data-le-upload-drop]');
  if (!input || !list) throw new Error('Upload needs a file input and a list.');
  const queue = new Map<File, AbortController>();
  const cleanups = new Map<File, () => void>();
  const notify = () => root.dispatchEvent(new CustomEvent('le:fileschange', { bubbles: true, detail: { files: Array.from(queue.keys()) } }));
  const add = (files: Iterable<File>) => {
    for (const file of files) {
      if (queue.has(file) || (options.accept && !options.accept(file))) continue;
      const controller = new AbortController();
      queue.set(file, controller);
      const document = root.ownerDocument;
      const row = document.createElement('li');
      row.className = 'le-item le-attachment';
      const name = document.createElement('span');
      name.textContent = file.name;
      const status = document.createElement('span');
      status.className = 'le-item-description';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'le-button le-button--secondary';
      button.textContent = options.removeLabel ?? 'Remove';
      button.setAttribute('aria-label', button.textContent + ' ' + file.name);
      row.append(name, status, button);
      list.append(row);
      const setState = (state: UploadState, percent?: number) => {
        row.dataset.state = state;
        const label = options.stateLabels?.[state] ?? state;
        status.textContent = percent === undefined ? label : label + ' ' + Math.round(percent) + '%';
      };
      setState('ready');
      cleanups.set(file, listen(button, 'click', () => {
        controller.abort();
        cleanups.get(file)?.();
        cleanups.delete(file);
        queue.delete(file);
        row.remove();
        input.focus();
        notify();
      }));
      if (options.upload) {
        setState('uploading', 0);
        const upload = options.upload;
        void Promise.resolve().then(() => upload(file, controller.signal, (percent) => {
          if (!controller.signal.aborted && Number.isFinite(percent)) setState('uploading', Math.max(0, Math.min(100, percent)));
        })).then(() => {
          if (!controller.signal.aborted) setState('uploaded');
        }).catch(() => {
          if (!controller.signal.aborted) setState('failed');
        });
      }
    }
    notify();
  };
  const cleanup = [listen(input, 'change', () => {
    if (input.files) add(input.files);
    input.value = '';
  })];
  if (drop) {
    cleanup.push(
      listen(drop, 'dragover', (event) => {
        const transfer = (event as DragEvent).dataTransfer;
        if (!transfer?.types.includes('Files')) return;
        event.preventDefault();
        drop.dataset.dragging = '';
      }),
      listen(drop, 'dragleave', () => { delete drop.dataset.dragging; }),
      listen(drop, 'drop', (event) => {
        const transfer = (event as DragEvent).dataTransfer;
        delete drop.dataset.dragging;
        if (!transfer?.files.length) return;
        event.preventDefault();
        add(transfer.files);
      }),
    );
  }
  return {
    add,
    getFiles: () => Array.from(queue.keys()),
    destroy() {
      for (const controller of queue.values()) controller.abort();
      for (const remove of cleanups.values()) remove();
      cleanup.forEach((remove) => remove());
      cleanups.clear();
      queue.clear();
    },
  };
}
