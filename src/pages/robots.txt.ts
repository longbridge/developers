import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  // 线上当前由 websites-nginx 的 open.longbridge.com/robots.txt 对外，两份 Disallow 清单需逐行一致。
  const body = `User-agent: *
Disallow: /auth
Disallow: /en/auth
Disallow: /zh-CN/auth
Disallow: /zh-HK/auth
Disallow: /account
Disallow: /en/account
Disallow: /zh-CN/account
Disallow: /zh-HK/account

Sitemap: ${site}sitemap.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
