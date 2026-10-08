import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  // canary 全站禁爬，与 nginx canary 的 _no_robots.conf 一致。不能指望 Cloudflare：
  // 它只给预览部署自动加 X-Robots-Tag: noindex，canary 是独立 project 的 production
  // 并挂在自定义域名上，拿不到那个头——这里一放开，测试站就会被收录。
  if (process.env.PROXY === 'canary') {
    return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain' } })
  }

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
