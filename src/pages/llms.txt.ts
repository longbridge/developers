import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@longbridge/openapi-utils'
import { endpointList } from '@longbridge/openapi-api-reference/markdown'
import rawYaml from '../../openapi.yaml?raw'

export const GET: APIRoute = async ({ site }) => {
  const all = await getCollection('docs')
  const enEntries = all.filter((e) => resolveLocale(e) === 'en')

  const lines = enEntries
    .filter((entry) => !resolveUrl(entry).endsWith('/docs/api'))
    .map((entry) => {
      const url = resolveUrl(entry)
      const title = entry.data.title ?? url
      return `- [${title}](${site}${url.replace(/^\//, '')})`
    })

  // API Reference — one machine-readable .md per endpoint.
  const apiLines = endpointList(rawYaml).map(
    (e) => `- [${e.summary}](${site}docs/api/${e.operationId}.md): ${e.method} ${e.path}`
  )

  const body =
    '# Longbridge Developers\n\n## Docs\n\n' +
    lines.join('\n') +
    '\n\n## API Reference\n\nFull reference: ' +
    `${site}docs/api.md\n\n` +
    apiLines.join('\n') +
    '\n'
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
