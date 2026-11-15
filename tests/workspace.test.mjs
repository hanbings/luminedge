import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import test from 'node:test';

import { createDialog } from '@luminedge/ui';
import { listen } from '@luminedge/tools';

test('event listeners can be removed', () => {
  const target = new EventTarget();
  let count = 0;
  const remove = listen(target, 'change', () => count++);
  target.dispatchEvent(new Event('change'));
  remove();
  target.dispatchEvent(new Event('change'));
  assert.equal(count, 1);
});

test('the UI entry exposes a dialog controller and cleans up trigger listeners', () => {
  const openTrigger = new EventTarget();
  const closeTrigger = new EventTarget();
  const dialog = {
    open: false,
    showModal() { this.open = true; },
    close() { this.open = false; },
  };
  const controller = createDialog(dialog, {
    openTriggers: [openTrigger],
    closeTriggers: [closeTrigger],
  });

  openTrigger.dispatchEvent(new Event('click'));
  assert.equal(dialog.open, true);
  closeTrigger.dispatchEvent(new Event('click'));
  assert.equal(dialog.open, false);
  controller.open();
  assert.equal(dialog.open, true);
  controller.close();
  controller.destroy();
  openTrigger.dispatchEvent(new Event('click'));
  assert.equal(dialog.open, false);
});

test('the UI CSS entry includes every referenced stylesheet', async () => {
  const require = createRequire(import.meta.url);
  const entry = require.resolve('@luminedge/ui/styles.css');
  const css = await readFile(entry, 'utf8');
  const imports = [...css.matchAll(/@import\s+['"]([^'"]+)['"]/g)];
  assert.ok(imports.length > 0);
  for (const [, file] of imports) {
    const imported = await readFile(resolve(dirname(entry), file), 'utf8');
    assert.ok(imported.length > 0);
  }
});
