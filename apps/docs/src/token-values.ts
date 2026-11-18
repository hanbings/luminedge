import tokenSource from '@luminedge/styles/tokens.css?raw';

const tokens = new Map(
  Array.from(tokenSource.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm), ([, name, value]): [string, string] => [name, value.trim()]),
);

export function tokenValue(name: string, scheme: 'light' | 'dark' = 'light'): string {
  function resolve(token: string, parents: string[]): string {
    if (parents.includes(token)) throw new Error(`Circular design token: ${token}`);
    const value = tokens.get(token);
    if (value === undefined) throw new Error(`Unknown design token: ${token}`);
    // The palette uses hex, var() and space-separated rgb() for its two colors.
    const pair = /^light-dark\(([^,]+),\s*(.+)\)$/.exec(value);
    const selected = pair ? pair[scheme === 'light' ? 1 : 2] : value;
    return selected.replace(/var\((--[\w-]+)\)/g, (_, alias: string) => resolve(alias, [...parents, token]));
  }

  return resolve(name, []);
}
