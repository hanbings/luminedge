import { listen } from '@luminedge/tools';

/** Show one form step at a time, validating the active step and preserving answers. */
export function createQuestionnaire(form: HTMLFormElement) {
  const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-le-question]'));
  const back = form.querySelector<HTMLButtonElement>('[data-le-question-back]');
  const progress = form.querySelector<HTMLElement>('[data-le-question-progress]');
  const submit = form.querySelector<HTMLButtonElement>('[data-le-question-submit]');
  if (!steps.length || !submit) throw new Error('Questionnaire needs steps and a submit button.');
  const previousNoValidate = form.noValidate;
  const nextText = submit.dataset.leNextLabel ?? 'Next';
  const submitText = submit.textContent;
  form.noValidate = true;
  let index = 0;
  const show = (target: number, focus = false) => {
    index = target;
    steps.forEach((step, i) => { step.hidden = i !== index; });
    if (back) back.disabled = index === 0;
    if (progress) progress.textContent = (index + 1) + ' / ' + steps.length;
    submit.textContent = index < steps.length - 1 ? nextText : submitText;
    if (focus) {
      const title = steps[index].querySelector<HTMLElement>('legend, h2, h3, h4');
      if (title) {
        title.tabIndex = -1;
        title.focus();
      }
    }
  };
  const invalidAt = (step: HTMLElement) => Array.from(
    step.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select'),
  ).find((input) => input.willValidate && !input.validity.valid);
  const cleanup = [listen(form, 'submit', (event) => {
    event.preventDefault();
    const invalid = invalidAt(steps[index]);
    if (invalid) { invalid.reportValidity(); return; }
    if (index < steps.length - 1) { show(index + 1, true); return; }
    for (let i = 0; i < steps.length - 1; i += 1) {
      const previousInvalid = invalidAt(steps[i]);
      if (previousInvalid) { show(i); previousInvalid.reportValidity(); return; }
    }
    form.dispatchEvent(new CustomEvent('le:questionnaire-submit', { bubbles: true, detail: { answers: new FormData(form) } }));
  })];
  if (back) cleanup.push(listen(back, 'click', () => { if (index > 0) show(index - 1, true); }));
  show(0);
  return {
    reset() { form.reset(); show(0); },
    destroy() {
      cleanup.forEach((remove) => remove());
      form.noValidate = previousNoValidate;
      steps.forEach((step) => { step.hidden = false; });
      submit.textContent = submitText;
    },
  };
}
