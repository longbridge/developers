import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'zod'

const docsSchema = z.object({
  title: z.string().optional(),
  id: z.string().optional(),
  slug: z.string().optional(),
  sidebar_position: z.number().optional(),
  sidebar_icon: z.string().optional(),
  layout: z.union([z.literal(false), z.string()]).optional(),
  // Renamed from `layout:` by vite pre-transform in astro.config.ts —
  // avoids astro-mdx auto-layout module resolution.
  docs_layout: z.union([z.literal(false), z.string()]).optional(),
  hide_breadcrumb: z.boolean().optional(),
})

export const collections = {
  docs: defineCollection({
    loader: glob({
      pattern: '{en,zh-CN,zh-HK}/**/*.mdx',
      base: './docs',
      // Force id = file path (without .mdx). Otherwise Astro 5+ uses
      // frontmatter `slug` as id, which (a) dedupes tri-locale files that
      // share a slug and (b) breaks resolveLocale/resolveUrl since they
      // parse the id as a file path.
      generateId: ({ entry }) => entry.replace(/\.mdx$/, ''),
    }),
    schema: docsSchema,
  }),
}
