import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { resolveUrl, resolveLocale } from '@/lib/slug'

export async function getStaticPaths() {
  const all = await getCollection('docs')
  return all.map((entry) => {
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
