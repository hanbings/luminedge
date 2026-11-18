import assert from 'node:assert/strict';
import test from 'node:test';
import { createSlider } from '@luminedge/ui';

class InlineStyle {
  values = new Map();
  getPropertyValue(name) { return this.values.get(name)?.value ?? ''; }
  getPropertyPriority(name) { return this.values.get(name)?.priority ?? ''; }
  setProperty(name, value, priority = '') { this.values.set(name, { value, priority }); }
  removeProperty(name) { this.values.delete(name); }
}

test('slider keeps its fill in sync with the native value and restores inline styles', async () => {
  const form = new EventTarget();
  const input = Object.assign(new EventTarget(), {
    type: 'range', min: '-20', max: '80', valueAsNumber: 30, style: new InlineStyle(), form,
  });
  input.style.setProperty('--le-slider-progress', '12%', 'important');
  const slider = createSlider(input);
  const progress = () => input.style.getPropertyValue('--le-slider-progress');
  assert.equal(progress(), '50%');

  input.valueAsNumber = 55;
  input.dispatchEvent(new Event('input'));
  assert.equal(progress(), '75%');
  input.max = '180';
  input.valueAsNumber = 80;
  slider.refresh();
  assert.equal(progress(), '50%');
  input.valueAsNumber = 300;
  input.dispatchEvent(new Event('change'));
  assert.equal(progress(), '100%');

  form.dispatchEvent(new Event('reset'));
  input.valueAsNumber = -20;
  await Promise.resolve();
  assert.equal(progress(), '0%');

  form.dispatchEvent(new Event('reset'));
  slider.destroy();
  await Promise.resolve();
  assert.equal(progress(), '12%');
  assert.equal(input.style.getPropertyPriority('--le-slider-progress'), 'important');
  input.valueAsNumber = 80;
  input.dispatchEvent(new Event('input'));
  assert.equal(progress(), '12%');
  assert.throws(() => createSlider({ type: 'text' }), /range input/);
});
