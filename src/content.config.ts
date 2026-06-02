import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const appearances = defineCollection({
	// Load Markdown and MDX files in the `src/content/appearances/` directory.
	loader: glob({ base: './src/content/appearances', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			url: z.string(),
			youtubeId: z.string().optional(),
			host: z.string(),
			type: z.enum(['podcast', 'video', 'article', 'appearance']),
			hasTranscript: z.boolean().default(false),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog, appearances };
