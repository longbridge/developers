import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale, isSiteRoot } from '@longbridge/openapi-utils'

// Root-level raw-markdown endpoint for the EN locale, mirroring the prefixless
// page route `[...slug].astro`. Serves `/docs/<path>.md` (no locale prefix),
// matching legacy open.longbridge.com where the EN markdown source lives at the
// same path as the page. Non-EN locales are served by `[locale]/[...slug].md.ts`.
export async function getStaticPaths() {
  const all = await getCollection('docs')
  return all
    .filter((entry) => resolveLocale(entry) === 'en')
    // /docs/api.md is served from openapi.yaml by src/pages/docs/api.md.ts.
    .filter((entry) => !resolveUrl(entry).endsWith('/docs/api'))
    // The homepage has no markdown twin: an empty slug yields the route `/.md`,
    // which resolves to no file and 500s. See isSiteRoot.
    .filter((entry) => !isSiteRoot(resolveUrl(entry)))
    .map((entry) => {
      const url = resolveUrl(entry) // e.g. /docs/trade/grid/list
      return { params: { slug: url.replace(/^\//, '') }, props: { entry } }
    })
}

export const GET: APIRoute = async ({ props }) => {
  const entry = (props as any).entry
  const body = entry.body ?? ''
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
