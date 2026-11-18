/** Overlay repeated text without affecting layout, focus or selection. */
export function createWatermark(root: HTMLElement, text: string) {
  const document = root.ownerDocument;
  const tile = document.createElement('canvas');
  tile.width = 360;
  tile.height = 144;
  const ink = tile.getContext('2d');
  if (!ink) throw new Error('Watermark needs a 2D canvas.');
  const layer = document.createElement('div');
  layer.className = 'le-watermark-layer';
  layer.setAttribute('aria-hidden', 'true');
  const setText = (value: string) => {
    ink.clearRect(0, 0, tile.width, tile.height);
    ink.save();
    ink.translate(tile.width / 2, tile.height / 2);
    ink.rotate(-Math.PI / 12);
    ink.font = '26px system-ui';
    ink.textAlign = 'center';
    ink.textBaseline = 'middle';
    ink.fillText(value, 0, 0, tile.width - 24);
    ink.restore();
    layer.style.maskImage = 'url(' + tile.toDataURL() + ')';
  };
  setText(text);
  root.append(layer);
  return { setText, destroy: () => layer.remove() };
}
