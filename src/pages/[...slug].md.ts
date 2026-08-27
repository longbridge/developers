import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@longbridge/openapi-utils'

// Root-level raw-markdown endpoint for the EN locale, mirroring the prefixless
// page route `[...slug].astro`. Serves `/docs/<path>.md` (no locale prefix),
// matching legacy open.longbridge.com where the EN markdown source lives at the
// same path as the page. Non-EN locales are served by `[locale]/[...slug].md.ts`.
export async function getStaticPaths() {
  const all = await getCollection('docs')
  return all
    .filter((entry) => resolveLocale(entry) === 'en')
    .map((entry) => {
      const url = resolveUrl(entry) // e.g. /docs/trade/grid/list
      const slug = url === '/' ? undefined : url.replace(/^\//, '')
      return { params: { slug }, props: { entry } }
    })
}

export const GET: APIRoute = async ({ props }) => {
  const entry = (props as any).entry
  const body = entry.body ?? ''
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
