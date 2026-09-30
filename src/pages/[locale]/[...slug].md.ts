import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@longbridge/openapi-utils'

export async function getStaticPaths() {
  const all = await getCollection('docs')
  return all
    // en is the root locale — its markdown is served at /docs/*.md by the
    // top-level [...slug].md.ts; emitting /en/docs/*.md here would just duplicate it.
    .filter((entry) => resolveLocale(entry) !== 'en')
    // /<locale>/docs/api.md is served from openapi.yaml by [locale]/docs/api.md.ts.
    .filter((entry) => !resolveUrl(entry).endsWith('/docs/api'))
    .map((entry) => {
    const url = resolveUrl(entry)
    const locale = resolveLocale(entry)
    const bareUrl = locale === 'en' ? url : url.replace(new RegExp(`^/${locale}`), '')
    const slug = bareUrl === '/' ? undefined : bareUrl.replace(/^\//, '')
    return { params: { locale, slug }, props: { entry } }
  })
}

export const GET: APIRoute = async ({ props }) => {
  const entry = (props as any).entry
  const body = entry.body ?? ''
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
