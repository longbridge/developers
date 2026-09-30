/**
 * Cloudflare Pages Function —— nginx 下线后接住静态文件表达不了的路由。
 *
 * 为什么不能全放 `_redirects`（Cloudflare 官方文档两条约束）：
 *   1.「Redirects are always followed, regardless of whether or not an asset
 *      matches the incoming request.」重定向优先于静态文件，`/en/*` 的通配会
 *      劫持真实存在的 /en/**.md 端点。
 *   2. 源不支持 hostname。而 install 相关规则**必须**按 hostname 分流：主站要从
 *      本站回源取原文，规则若在所有域名上生效就会形成回环。
 *
 * 邀请码注入不在这里做——注入统一留在主站 nginx 的 sub_filter（主站不在本次下线
 * 范围内）。openapi 侧两条 install 路径按今天的形态各自对接主站：
 *   /skill/install.md  今天就是 301 → 保持 301
 *   /skill-install.md  今天是 200 + 注入 → 反向代理到主站，保持 200 + 注入
 * 两条都是零行为变化。
 *
 * 已实测：S4 把主站上游换成 Pages 后注入链路仍成立（TLS1.2 可用、SNI 已开、
 * Host 头正确、空 Accept-Encoding 不压缩、原文含 4 处锚点且未被预注入）。
 * 反向代理不会回环：主站回源取的是**斜杠**那条 pages.dev/skill/install.md，
 * 而 pages.dev 不在站点表里，直出原文，链路终止。
 *
 * 详见方案 §15.4 / §15.9。
 */

interface Ctx {
  request: Request
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>
}

/** 旧路径（兼容），真实流量里带邀请码：.../skill/install.md?invite-code=XXXXXX */
const LEGACY_INSTALL = /^\/(?:(en|zh-CN|zh-HK)\/)?skill\/install\.md$/
/** 新路径 */
const CURRENT_INSTALL = /^\/(?:(en|zh-CN|zh-HK)\/)?skill-install\.md$/

/**
 * 「站点域名 → 主站域名」显式表。只有列在这里的 host 才把 install 路径 301 到主站；
 * 其余（*.pages.dev、预览别名、本地 dev、longportapp）一律返回原文——**主站正是从
 * 这些地址回源取未注入的原文**，若在那里也跳转就会回环。
 *
 * 用显式表而不是「去掉 open. 前缀」这类推导，因为两处实测反例：
 *
 *  1. open.longportapp.com 的同一路径**直接服务原文**，既不跳也不注入。其 nginx
 *     注释原文：「与仓库路径对齐，不做 URL 迁移，无 invite-code 处理」。实测
 *     /skill/install.md → 200、/skill-install.md → 404、longportapp.com/skill-install.md
 *     → 302 去别处。推导规则会把它 301 到错地址，是回归。
 *  2. 若 canary 自定义域名取成 open-canary.longbridge.xyz 这类形态，前缀规则匹配
 *     不到，会在「以为验过了」的情况下静默失效。
 *
 * open.longbridge.cn 同样 301（→ longbridge.cn），但 .cn 走阿里云 CDN 轨、不经过
 * 本 Function，故不列入。新增站点必须显式加一行——这是安全相关决策，应当过 review。
 */
const INSTALL_MAIN_SITE: Record<string, string> = {
  'open.longbridge.com': 'longbridge.com',
  'open.longbridge.xyz': 'longbridge.xyz',
}

export const onRequest = async ({ request, next }: Ctx): Promise<Response> => {
  const url = new URL(request.url)
  const host = (request.headers.get('host') ?? url.hostname).split(':')[0].toLowerCase()
  const path = url.pathname
  /** 有值 = 该域名把 install 路径 301 到主站；undefined = 原文出口 */
  const mainSite = INSTALL_MAIN_SITE[host]

  // ① 旧路径 → 301 到主站。今天就是这个行为，保持不变。
  //    必须保留 query——邀请码靠它传到主站的 sub_filter，丢了就是静默丢归属。
  const legacy = mainSite ? LEGACY_INSTALL.exec(path) : null
  if (legacy) {
    const prefix = legacy[1] ? `${legacy[1]}/` : ''
    return Response.redirect(`https://${mainSite}/${prefix}skill-install.md${url.search}`, 301)
  }

  // ② 新路径 → 反向代理到主站，由主站注入后原样返回。今天这条是 200 + 注入，
  //    走代理而不是 301 才能保持状态码不变。
  const current = mainSite ? CURRENT_INSTALL.exec(path) : null
  if (current) {
    const prefix = current[1] ? `${current[1]}/` : ''
    const upstream = `https://${mainSite}/${prefix}skill-install.md${url.search}`
    try {
      const res = await fetch(upstream, {
        // identity：sub_filter 遇压缩体会失效，主站对它自己的上游也做了同样处理
        headers: {
          'accept-encoding': 'identity',
          accept: request.headers.get('accept') ?? 'text/markdown,*/*',
          'user-agent': request.headers.get('user-agent') ?? 'longbridge-openapi-pages',
        },
        redirect: 'follow',
      })
      if (res.ok) {
        // 只透传 content-type。主站会下发阿里云 WAF 的 acw_tc cookie，
        // 不能让它落到本域；注入结果因邀请码而异，也绝不能进任何共享缓存。
        return new Response(res.body, {
          status: res.status,
          headers: {
            'content-type': res.headers.get('content-type') ?? 'text/markdown; charset=utf-8',
            'cache-control': 'no-store',
          },
        })
      }
    } catch {
      // 落到下面的降级分支
    }
    // 主站不可用时降级为本站原文：内容仍然正确，只是没有邀请码注入。
    // 加一个响应头把降级暴露出来，避免静默丢归属查不到原因。
    const fallback = await next(new Request(new URL(`/${prefix}skill/install.md`, url), request))
    const headers = new Headers(fallback.headers)
    headers.set('x-install-md-degraded', 'main-site-unreachable')
    headers.set('cache-control', 'no-store')
    return new Response(fallback.body, { status: fallback.status, headers })
  }

  // ③ /en 前缀收敛（对齐 nginx）。放行 .md：/en/**.md 是真实存在的端点
  //    （src/pages/[locale]/[...slug].md.ts 每篇文档 × 每个 locale 各一个），
  //    其中 /en/skill/install.md 正是主站回源路径之一。
  if (path.startsWith('/en/') && !path.endsWith('.md')) {
    // 这条与站点表无关：nginx 在 longbridge 与 longportapp 两侧都有同样的收敛，
    // 且 pages.dev 上一并生效更便于预览时验证。
    // 目标继承请求的 scheme 与 host；Pages 对外只服务 https，故线上必定是 https。
    return Response.redirect(new URL(path.slice('/en'.length) + url.search, url).toString(), 302)
  }

  // ④ TODO(G5-SPA)：/auth /sso /account /log-out /scope /oauth2 /dashboard /connect
  //    （含 locale 前缀与子路径）需代理到 private 仓库的独立 Pages project。
  //    该 project 尚未创建，故暂不接管——这些路径当前会走到静态资源并 404。
  return next()
}
