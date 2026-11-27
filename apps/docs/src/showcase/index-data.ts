import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { CollectionEntry } from 'astro:content';
import { ELEMENT_NODE, parse, TEXT_NODE, type Node } from 'ultrahtml';
import { querySelector, querySelectorAll } from 'ultrahtml/selector';
import { getShowcaseSection } from './renderers';

export interface ShowcaseChapter {
  id: string;
  anchor: string;
  title: string;
  order: number;
}

export interface ShowcaseSubsection {
  anchor: string;
  title: string;
  label: string;
}

const escapedCharacters: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
};

function decodeAstroText(value: string): string {
  return value.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => escapedCharacters[entity]);
}

export function getShowcaseChapters(entries: CollectionEntry<'docs'>[]): ShowcaseChapter[] {
  return entries.flatMap(({ id, data: { title, showcase } }) => {
    if (showcase?.order === undefined) return [];
    return [{ id, anchor: showcase.anchor, title: showcase.title ?? title, order: showcase.order }];
  }).sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
}

function textContent(node: Node | undefined): string {
  if (node?.type === TEXT_NODE) return node.value;
  if (node?.type === ELEMENT_NODE) return node.children.map(textContent).join('');
  return '';
}

export async function getShowcaseSubsections(chapters: ShowcaseChapter[]): Promise<Record<string, ShowcaseSubsection[]>> {
  const container = await AstroContainer.create();
  const sections: Record<string, ShowcaseSubsection[]> = {};

  for (const chapter of chapters) {
    const Section = getShowcaseSection(chapter.anchor);
    const html = await container.renderToString(Section, { props: { title: chapter.title }, partial: true });
    sections[chapter.anchor] = querySelectorAll(parse(html), '[id][data-index-subsection]').flatMap((node) => {
      if (node.type !== ELEMENT_NODE) return [];
      const anchor = decodeAstroText(node.attributes.id);
      const title = decodeAstroText(textContent(querySelector(node, 'h3'))).trim() || anchor;
      const label = decodeAstroText(node.attributes['data-index-subsection']) || title;
      return [{ anchor, title, label }];
    });
  }

  return sections;
}
