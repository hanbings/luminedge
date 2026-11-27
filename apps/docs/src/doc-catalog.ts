import { getCollection, type CollectionEntry } from 'astro:content';

const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;

export async function getDocEntries(): Promise<CollectionEntry<'docs'>[]> {
  const entries = await getCollection('docs');
  return entries.sort((left, right) => left.data.order - right.data.order || left.id.localeCompare(right.id));
}

export function docSlug(id: string): string | undefined {
  if (id === 'index') return undefined;
  return id.replace(/\/index$/, '');
}

export function docHref(id: string): string {
  const slug = docSlug(id);
  return slug ? `${base}docs/${slug}/` : `${base}docs/`;
}

export function showcaseHref(anchor?: string): string {
  return anchor ? `${base}#${anchor}` : base;
}

export function showcaseDocLinks(entries: CollectionEntry<'docs'>[]): Record<string, string> {
  return Object.fromEntries(entries.flatMap(({ id, data }) =>
    data.showcase ? [[data.showcase.anchor, docHref(id)]] : [],
  ));
}
