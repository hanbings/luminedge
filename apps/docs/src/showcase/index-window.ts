export function getSubsectionWindowStart(length: number, index: number, limit: number): number {
  return Math.max(0, Math.min(index - Math.floor(limit / 2), length - limit));
}

export function getSubsectionWindowSize(height: number): number {
  return Math.max(1, Math.min(5, Math.floor((height - 96) / 32)));
}

// Side-by-side groups share a reading position. Honor a direct link within that row.
export function subsectionAtReadingLine<T extends { target: HTMLElement; link: HTMLAnchorElement }>(
  children: T[],
  readingLine: number,
): T | undefined {
  let current: T | undefined = children[0];
  let rowTop = -Infinity;
  for (const child of children) {
    const top = child.target.getBoundingClientRect().top;
    if (top > readingLine + 1) continue;
    if (top > rowTop + 1 || (Math.abs(top - rowTop) <= 1 && window.location.hash === child.link.hash)) {
      current = child;
      rowTop = top;
    }
  }
  return current;
}
