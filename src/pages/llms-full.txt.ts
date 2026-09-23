import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@longbridge/openapi-utils'
import { referenceMarkdown } from '@longbridge/openapi-api-reference/markdown'
import rawYaml from '../../openapi.yaml?raw'

export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('docs')
  const enEntries = all.filter((e) => resolveLocale(e) === 'en')

  const header = '# Longbridge Developers\n'
  const sections = enEntries
    .filter((entry) => !resolveUrl(entry).endsWith('/docs/api'))
    .map((entry) => {
      const url = resolveUrl(entry)
      const title = entry.data.title ?? url
      const absUrl = `${site}${url.replace(/^\//, '')}`
      const body = entry.body ?? ''
      return `# ${title}\nURL: ${absUrl}\n\n${body}`
    })

  // Full API reference (all endpoints, generated from openapi.yaml).
  const apiSection = `URL: ${site}docs/api.md\n\n${referenceMarkdown(rawYaml, 'en')}`

  const output = header + '\n\n---\n' + sections.join('\n\n---\n') + '\n\n---\n' + apiSection + '\n'
  return new Response(output, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
