import assert from 'node:assert/strict';
import test from 'node:test';
import { createOtpInput, createPasswordInput, createTokenInput } from '@luminedge/ui';
import { FakeDocument, element, fire } from './fixtures/dom.mjs';

test('password toggle reports visibility, respects disabled inputs, and restores its original state', () => {
  const doc = new FakeDocument();
  const input = element(doc, 'input', { id: 'password' });
  input.type = 'password';
  const button = element(doc, 'button');
  button.hidden = true;
  button.textContent = 'Original';
  doc.body.append(input, button);
  const control = createPasswordInput(input, button, { toggleLabel: 'Show password', showText: 'Show', hideText: 'Hide' });
  assert.equal(button.hidden, false);
  assert.equal(button.getAttribute('aria-pressed'), 'false');
  assert.equal(button.getAttribute('aria-controls'), 'password');
  fire(button, 'click');
  assert.equal(input.type, 'text');
  assert.equal(button.textContent, 'Hide');
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  input.disabled = true;
  control.refresh();
  assert.equal(button.disabled, true);
  control.setVisible(false);
  assert.equal(input.type, 'text');
  control.destroy();
  assert.equal(input.type, 'password');
  assert.equal(button.hidden, true);
  assert.equal(button.textContent, 'Original');
  assert.equal(button.getAttribute('aria-pressed'), null);
});

test('token input adds and removes text, prevents duplicates, submits values, and resets', async () => {
  const doc = new FakeDocument();
  const form = element(doc, 'form');
  const root = element(doc, 'div');
  const list = element(doc, 'ul', { 'data-le-token-list': '' });
  const editor = element(doc, 'input', { 'data-le-token-editor': '' });
  editor.value = '';
  editor.form = form;
  const button = element(doc, 'button', { 'data-le-token-add': '' });
  button.hidden = true;
  const status = element(doc, 'p', { 'data-le-token-status': '' });
  root.append(list, editor, button, status);
  form.append(root);
  doc.body.append(form);
  const changes = [];
  root.addEventListener('le:tokenschange', (event) => changes.push(event.detail.values));
  const control = createTokenInput(root, { name: 'topics', values: ['设计'] });
  assert.deepEqual(control.getValues(), ['设计']);
  assert.equal(list.children[0].children[2].name, 'topics');
  assert.equal(list.children[0].children[2].value, '设计');
  editor.disabled = true;
  control.refresh();
  assert.equal(button.disabled, true);
  assert.equal(list.children[0].children[1].disabled, true);
  assert.equal(list.children[0].children[2].disabled, true);
  assert.equal(control.add('阅读'), false);
  editor.disabled = false;
  control.refresh();
  assert.equal(list.children[0].children[2].disabled, false);

  editor.value = '设计';
  fire(editor, 'input');
  assert.equal(fire(editor, 'keydown', { key: 'Enter', isComposing: true }).defaultPrevented, false);
  assert.equal(fire(editor, 'keydown', { key: 'Enter', isComposing: false }).defaultPrevented, true);
  assert.deepEqual(control.getValues(), ['设计']);
  assert.match(status.textContent, /already/);

  editor.value = '<example>';
  fire(editor, 'input');
  fire(editor, 'keydown', { key: 'Enter', isComposing: false });
  assert.deepEqual(control.getValues(), ['设计', '<example>']);
  assert.equal(list.children[1].children[0].textContent, '<example>');
  assert.equal(editor.value, '');
  fire(list.children[0].children[1], 'click');
  assert.deepEqual(control.getValues(), ['<example>']);
  assert.equal(doc.activeElement, editor);
  assert.deepEqual(changes, [['设计', '<example>'], ['<example>']]);

  fire(form, 'reset');
  await Promise.resolve();
  assert.deepEqual(control.getValues(), ['设计']);
  control.destroy();
  assert.equal(button.hidden, true);
  assert.equal(list.children[0].children[1].disabled, true);
  assert.equal(control.add('阅读'), false);
});

test('OTP fields advance, erase backwards and submit a pasted code of the configured length', async () => {
  const doc = new FakeDocument();
  const form = element(doc, 'form');
  const root = element(doc, 'div');
  const cells = Array.from({ length: 4 }, () => {
    const cell = element(doc, 'input', { 'data-le-otp-cell': '' });
    cell.type = 'text';
    cell.value = '';
    cell.form = form;
    return cell;
  });
  const output = element(doc, 'input', { 'data-le-otp-value': '' });
  output.type = 'hidden';
  output.name = 'code';
  root.append(...cells, output);
  form.append(root);
  doc.body.append(form);
  const changes = [];
  root.addEventListener('le:otpchange', (event) => changes.push(event.detail));
  const controller = createOtpInput(root);

  fire(cells[0], 'input', { data: '0' });
  assert.equal(doc.activeElement, cells[1]);
  assert.equal(controller.getValue(), '0');
  assert.equal(output.value, '');
  assert.equal(fire(cells[1], 'keydown', { key: 'Backspace' }).defaultPrevented, true);
  assert.equal(doc.activeElement, cells[0]);
  assert.equal(cells[0].value, '');

  const paste = fire(cells[2], 'paste', { clipboardData: { getData: () => '０1-２3' } });
  assert.equal(paste.defaultPrevented, true);
  assert.deepEqual(cells.map((cell) => cell.value), ['0', '1', '2', '3']);
  assert.equal(output.value, '0123');
  assert.deepEqual(changes.at(-1), { value: '0123', complete: true });

  fire(form, 'reset', { defaultPrevented: true });
  await Promise.resolve();
  assert.equal(output.value, '0123');

  fire(form, 'reset');
  cells.forEach((cell) => { cell.value = ''; });
  await Promise.resolve();
  assert.equal(output.value, '');
  assert.deepEqual(changes.at(-1), { value: '', complete: false });

  controller.destroy();
  fire(cells[0], 'input', { data: '7' });
  assert.equal(controller.getValue(), '');
});
