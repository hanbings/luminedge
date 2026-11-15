import tokenSource from '@luminedge/styles/tokens.css?raw';

const tokens = new Map(
  Array.from(tokenSource.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm), ([, name, value]): [string, string] => [name, value.trim()]),
);

export function tokenValue(name: string): string {
  const value = tokens.get(name);
  if (value === undefined) throw new Error(`Unknown design token: ${name}`);
  return value;
}
