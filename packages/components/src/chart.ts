export interface BarChartItem { label: string; value: number; }

/** Render and update a bar chart for nonnegative quantities. */
export function createBarChart(list: HTMLElement, items: readonly BarChartItem[]) {
  const document = list.ownerDocument;
  const setItems = (data: readonly BarChartItem[]) => {
    let max = 1;
    for (const { value } of data) {
      if (!Number.isFinite(value) || value < 0) throw new Error('Bar chart values must be finite and nonnegative.');
      max = Math.max(max, value);
    }
    const format = new Intl.NumberFormat(list.closest<HTMLElement>('[lang]')?.lang || undefined);
    list.replaceChildren(...data.map(({ label, value }) => {
      const row = document.createElement('li');
      row.className = 'le-chart-row';
      const category = document.createElement('span');
      category.textContent = label;
      const track = document.createElement('span');
      track.className = 'le-chart-track';
      track.setAttribute('aria-hidden', 'true');
      const bar = document.createElement('span');
      bar.className = 'le-chart-bar';
      bar.style.setProperty('--le-chart-value', (value / max * 100) + '%');
      track.append(bar);
      const number = document.createElement('span');
      number.textContent = format.format(value);
      row.append(category, track, number);
      return row;
    }));
  };
  setItems(items);
  return { setItems };
}
