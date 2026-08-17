import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@/lib/slug'

export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('docs')
  const enEntries = all.filter((e) => resolveLocale(e) === 'en')

  const lines = enEntries.map((entry) => {
    const url = resolveUrl(entry)
    const title = entry.data.title ?? url
    return `- [${title}](${site}${url.replace(/^\//, '')})`
  })

  const header = '# Longbridge Developers\n\n## Docs\n\n'
  const body = header + lines.join('\n') + '\n'
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
