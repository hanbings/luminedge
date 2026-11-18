import { compile } from '@tailwindcss/node';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../src/', import.meta.url));
const destination = fileURLToPath(new URL('../dist/', import.meta.url));
const files = (await readdir(source, { recursive: true })).filter((name) => name.endsWith('.css'));

const stylesheets = await Promise.all(files.map(async (name) => {
  const from = join(source, name);
  const css = await readFile(from, 'utf8');

  // Keep CSS imports and the consumer-facing theme as separate files.
  if (!/@(?:apply|reference)\b/.test(css)) return { name, css };

  const stylesheet = await compile(css, { base: dirname(from), from, onDependency() {} });
  return { name, css: stylesheet.build([]) };
}));

await rm(destination, { recursive: true, force: true });
for (const { name, css } of stylesheets) {
  const file = join(destination, name);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, css);
}
