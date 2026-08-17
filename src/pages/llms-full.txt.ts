import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@/lib/slug'

export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('docs')
  const enEntries = all.filter((e) => resolveLocale(e) === 'en')

  const sections = enEntries.map((entry) => {
    const url = resolveUrl(entry)
    const title = entry.data.title ?? url
    const absUrl = `${site}${url.replace(/^\//, '')}`
    const body = entry.body ?? ''
    return `# [${title}](${absUrl})\n\n${body}`
  })

  const output = sections.join('\n\n---\n\n') + '\n'
  return new Response(output, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
