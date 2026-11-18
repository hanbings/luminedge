import { encodeQr } from '@luminedge/tools';

/** Render a local, scannable QR code. The quiet zone is part of the image. */
export function createQrCode(root: HTMLElement, value: string, label = 'QR code') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = root.ownerDocument.createElementNS(ns, 'svg');
  const path = root.ownerDocument.createElementNS(ns, 'path');
  svg.classList.add('le-qr');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  svg.setAttribute('shape-rendering', 'crispEdges');
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  const setValue = (text: string) => {
    const { data } = encodeQr(text, { ecc: 'M', border: 4 });
    const modules: string[] = [];
    data.forEach((row, y) => row.forEach((on, x) => {
      if (on) modules.push('M' + x + ' ' + y + 'h1v1h-1z');
    }));
    svg.setAttribute('viewBox', '0 0 ' + data.length + ' ' + data.length);
    path.setAttribute('d', modules.join(''));
  };
  setValue(value);
  root.append(svg);
  return { setValue, destroy: () => svg.remove() };
}
