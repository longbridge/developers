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
  hide_breadcrumb: z.boolean().optional(),
})

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '{en,zh-CN,zh-HK}/**/*.mdx', base: './docs' }),
    schema: docsSchema,
  }),
}
