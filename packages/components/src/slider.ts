import { listen } from '@luminedge/tools';

export interface SliderController {
  /** Update the track after changing the value or limits in code. */
  refresh(): void;
  destroy(): void;
}

/** Keep the styled track in sync with a native range input. */
export function createSlider(input: HTMLInputElement): SliderController {
  if (input.type !== 'range') throw new Error('Slider needs a range input.');
  const property = '--le-slider-progress';
  const previous = input.style.getPropertyValue(property);
  const previousPriority = input.style.getPropertyPriority(property);
  let destroyed = false;

  const limit = (value: string, fallback: number) => {
    const number = value.trim() ? Number(value) : NaN;
    return Number.isFinite(number) ? number : fallback;
  };
  const refresh = () => {
    if (destroyed) return;
    const min = limit(input.min, 0);
    const max = limit(input.max, 100);
    const value = input.valueAsNumber;
    const progress = max > min && Number.isFinite(value) ? Math.min(100, Math.max(0, (value - min) / (max - min) * 100)) : 0;
    input.style.setProperty(property, `${progress}%`);
  };

  const cleanup = [listen(input, 'input', refresh), listen(input, 'change', refresh)];
  if (input.form) cleanup.push(listen(input.form, 'reset', () => queueMicrotask(refresh)));
  refresh();

  return {
    refresh,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cleanup.forEach((remove) => remove());
      if (previous) input.style.setProperty(property, previous, previousPriority);
      else input.style.removeProperty(property);
    },
  };
}
