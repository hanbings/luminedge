import tokenSource from '@luminedge/styles/tokens.css?raw';

const tokens = new Map(
  Array.from(tokenSource.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm), ([, name, value]): [string, string] => [name, value.trim()]),
);

export function tokenValue(name: string): string {
  const seen = new Set<string>();
  let current = name;
  while (true) {
    if (seen.has(current)) throw new Error(`Circular design token: ${current}`);
    seen.add(current);
    const value = tokens.get(current);
    if (value === undefined) throw new Error(`Unknown design token: ${current}`);
    const alias = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value);
    if (!alias) return value;
    current = alias[1];
  }
}
