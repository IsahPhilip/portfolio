import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    shortTitle: z.string(),
    summary: z.string(),
    problem: z.string(),
    system: z.string(),
    category: z.string(),
    tools: z.array(z.string()),
    cover: image(),
    coverAlt: z.string(),
    order: z.number(),
    featured: z.boolean().default(true),
    demo: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});
export const collections = { projects };
