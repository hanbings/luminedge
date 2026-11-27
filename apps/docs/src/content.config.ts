import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().optional(),
    group: z.string().trim().min(1),
    order: z.number().int(),
    showcase: z.object({
      anchor: z.string().trim().min(1),
      order: z.number().int().optional(),
      title: z.string().trim().min(1).optional(),
      preview: z.enum(['before', 'after']).optional(),
    }).optional(),
  }),
});

export const collections = { docs };
