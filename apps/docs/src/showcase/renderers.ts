import type Components from '../sections/components.astro';
import type ButtonExample from './examples/button.astro';

const sections = import.meta.glob<typeof Components>('../sections/*.astro', { eager: true, import: 'default' });
const examples = import.meta.glob<typeof ButtonExample>('./examples/*.astro', { eager: true, import: 'default' });

export function getShowcaseSection(anchor: string) {
  const Section = sections[`../sections/${anchor}.astro`];
  if (!Section) throw new Error(`Missing showcase section for ${anchor}.`);
  return Section;
}

export function getShowcaseExample(anchor: string) {
  const id = anchor.replace(/^component-example-/, '');
  const Example = examples[`./examples/${id}.astro`];
  if (!Example) throw new Error(`Missing showcase example for ${anchor}.`);
  return Example;
}
