import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /

Sitemap: ${site}sitemap-index.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
