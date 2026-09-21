import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  // Disallow 清单与 websites-nginx 的 open.longbridge.com/robots.txt 逐行对齐。
  // nginx 下线后这份产物直接对外，缺一行就等于把登录态页面放开给爬虫。
  const body = `User-agent: *
Disallow: /auth
Disallow: /en/auth
Disallow: /zh-HK/auth
Disallow: /account
Disallow: /en/account
Disallow: /zh-HK/account

Sitemap: ${site}sitemap-index.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
