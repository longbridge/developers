/**
 * Cloudflare Pages Function —— nginx 下线后接住静态文件表达不了的路由。
 *
 * 为什么不能全放 `_redirects`（Cloudflare 官方文档两条约束）：
 *   1.「Redirects are always followed, regardless of whether or not an asset
 *      matches the incoming request.」重定向优先于静态文件，`/en/*` 的通配会
 *      劫持真实存在的 /en/**.md 端点。
 *   2. 源不支持 hostname，也不能反代外部域名。而 install、SPA、登录页都**必须**
 *      按 hostname 分流到不同上游，terminal 三条又必须反代（见 TERMINAL_*）。
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
 * 而 pages.dev 在站点表里不配 installMainSite，直出原文，链路终止。
 *
 * 路由与 nginx 逐条对齐的依据：websites-nginx 的 open.longbridge.com/_release.conf
 * 及其 include。详见方案 §15.4 / §15.9 / §15.11。
 */

interface Ctx {
  request: Request
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>
}

/** 旧路径（兼容），真实流量里带邀请码：.../skill/install.md?invite-code=XXXXXX */
const LEGACY_INSTALL = /^\/(?:(en|zh-CN|zh-HK)\/)?skill\/install\.md$/
/** 新路径 */
const CURRENT_INSTALL = /^\/(?:(en|zh-CN|zh-HK)\/)?skill-install\.md$/

/** 带 locale 前缀的 llms 文件，nginx 一律回同一份根级产物（_llms.conf）。 */
const LOCALE_LLMS = /^\/(?:en|zh-CN|zh-HK)\/(llms(?:-full)?\.txt)$/

/**
 * 登录页（session 应用），与 nginx `_login-page-proxy-brand.conf` 同一条正则：
 * 大小写不敏感、只锚开头（`/loginx` 也会命中——照搬，不擅自收紧），排除
 * `/login/callback`。所有路径共用一份 index.html，locale 由页面脚本读地址栏；
 * 它引用的 JS/CSS 都是绝对 CDN 地址，所以只需转发这一个文件。
 */
const SESSION_PAGE = /^\/(?:(?:en|zh-HK|zh-CN)\/)?(?:login(?!\/callback)|password\/reset|tfa|binding)/i
const SESSION_INDEX = '/web/longbridge-com/apps/session/index.html'

/**
 * SPA 的 8 个前缀，与 nginx location 正则同源（_release.conf:40）。
 * 形态：`/{locale?}/{prefix}{/seg}*`，对应上游 `<origin>/{locale?/}{path}.html`。
 */
const SPA_PREFIXES = ['auth', 'sso', 'account', 'log-out', 'scope', 'oauth2', 'dashboard', 'connect']
const SPA_PAGE = new RegExp(`^/(?:(en|zh-CN|zh-HK)/)?((?:${SPA_PREFIXES.join('|')})(?:/[^/]+)*)/?$`)
/**
 * SPA 的 hash 资源命名空间（private 仓 vitepress 的 assetsDir）。
 *
 * 它**必须**留在 `public/_routes.json` 的 exclude 之外。看着像静态资源，但文件
 * 在另一个 Pages project 上，本站产物里没有 `_app/`——排除掉就直接 404，而且页面
 * 本身仍是 200，只是 JS/CSS 全丢，只看状态码发现不了（实测踩过）。
 */
const SPA_ASSETS = '/_app/'

/**
 * CLI 版本号与二进制。nginx 对这三条是**反代**不是跳转（_release.conf:53/100/116）：
 * `releases/latest` 返回一行版本号，旧版安装脚本用 `curl --silent` 不带 `-L` 取它，
 * 改成 302 会让这类脚本拿到空内容，所以保持 200。
 * 路径里写死 release：OSS 上只有 release 通道（github/canary/longbridge-terminal
 * 不存在，nginx canary 这几条本来就是 404），canary 环境借此也能真跑通。
 */
const TERMINAL_ORIGIN = 'https://assets.lbkrs.com'
const TERMINAL_ALIAS: Record<string, string> = {
  '/longbridge/longbridge-terminal/releases/latest': '/github/release/longbridge-terminal/latest',
  '/longbridge/longbridge-terminal/longbridge.json': '/github/release/longbridge-terminal/longbridge.json',
}
const TERMINAL_RAW_PREFIX = '/github/release/longbridge-terminal'

interface Site {
  /** SPA 所在的 Pages project（private 仓 developers-website-private 自建 Actions 发布） */
  spa: string
  /** 登录页所在资源站，即 nginx 对应 server 块挂 login 前设的 $upstream_host */
  session: string
  /** install 两条路径交给哪个主站；不填 = 直出本站原文 */
  installMainSite?: string
}

/**
 * 站点表：host → 该站点的全部上游。所有按 host 分流的规则只读这一张表，
 * 新增站点只加一行——这是安全相关决策，应当过 review。
 *
 * 用显式表而不是「去掉 open. 前缀」这类推导，因为两处实测反例：
 *  1. open.longportapp.com 的同一路径**直接服务原文**，既不跳也不注入。其 nginx
 *     注释原文：「与仓库路径对齐，不做 URL 迁移，无 invite-code 处理」。实测
 *     /skill/install.md → 200、/skill-install.md → 404、longportapp.com/skill-install.md
 *     → 302 去别处。推导规则会把它 301 到错地址，是回归。
 *  2. 测试域名 open-canary.longbridge.xyz 不以 `open.` 开头，前缀规则匹配不到，
 *     会在「以为验过了」的情况下静默失效。
 *
 * pages.dev 入口不配 installMainSite：主站将来从这类地址回源取未注入原文，
 * 这里若也跳转就会回环。它保留 SPA 与登录页，好在绑正式域名之前完整验证。
 * open.longbridge.cn 走阿里云 CDN 轨、不经过本 Function，故不列入。
 */
const SITES: Record<string, Site> = {
  'open.longbridge.com': {
    spa: 'https://developers-website-private.pages.dev',
    session: 'https://assets.wbrks.com',
    installMainSite: 'longbridge.com',
  },
  'open-canary.longbridge.xyz': {
    spa: 'https://developers-website-private-canary.pages.dev',
    session: 'https://assets-staging.wbrks.com',
    installMainSite: 'longbridge.xyz',
  },
  'longbridge-developers-canary.pages.dev': {
    spa: 'https://developers-website-private-canary.pages.dev',
    session: 'https://assets-staging.wbrks.com',
  },
}

/**
 * 反代到纯静态上游。`tag` 决定降级头的名字（`x-<tag>-degraded`）。
 *
 * 上游都是纯静态站，5xx 只会来自基础设施而非业务。实测：project 尚未创建时
 * pages.dev **返回** 530（创建后传播期间是 522）而不是抛错，只靠 catch 兜不住，
 * 会把 Cloudflare 内部码原样透给客户端且不打降级标记。故按状态码再判一次。
 *
 * 其余原样透传：上游 404 就是 404。nginx SPA 那条 error_page 404 → index.html 的
 * 兜底是死代码（_common.conf 没有 proxy_intercept_errors，实测 /oauth2/authorize
 * 线上就是 404），这里不实现，保持状态码语义不变。
 *
 * 不转发 query：上游是纯静态，query 对它无意义；页面脚本读的是浏览器地址栏的
 * search，不转发可避免每个 ?code= / ?redirect_to= 在边缘各占一份缓存。
 */
async function forward(target: string, request: Request, tag: string): Promise<Response> {
  const degraded = (reason: string) =>
    new Response(`${tag} origin error`, {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8', [`x-${tag}-degraded`]: reason },
    })
  try {
    const res = await fetch(target, { headers: { accept: request.headers.get('accept') ?? '*/*' } })
    if (res.status >= 500) return degraded(`origin-${res.status}`)
    return new Response(res.body, res)
  } catch {
    return degraded('origin-unreachable')
  }
}

export const onRequest = async ({ request, next }: Ctx): Promise<Response> => {
  const url = new URL(request.url)
  const host = (request.headers.get('host') ?? url.hostname).split(':')[0].toLowerCase()
  const path = url.pathname
  const site = SITES[host]
  const mainSite = site?.installMainSite

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

  // ③～⑤ 必须排在 ⑥ /en 收敛之前：nginx 里它们的 location 都先于 `^/en(.+)$`
  //    声明，`/en/login`、`/en/llms.txt` 是直接服务，不会先被 302 掉前缀。

  // ③ 带 locale 的 llms 文件 → 本站根级那份，200。
  const llms = LOCALE_LLMS.exec(path)
  if (llms) return next(new Request(new URL(`/${llms[1]}`, url), request))

  // ④ 登录页 → session 应用。
  if (site && SESSION_PAGE.test(path)) return forward(`${site.session}${SESSION_INDEX}`, request, 'session')

  // ⑤ CLI 版本号与二进制 → 反代 OSS。与站点无关，任何入口都可用。
  const terminal = TERMINAL_ALIAS[path] ?? (path.startsWith(TERMINAL_RAW_PREFIX) ? path : null)
  if (terminal) return forward(`${TERMINAL_ORIGIN}${terminal}`, request, 'terminal')

  // ⑥ /en 前缀收敛（对齐 nginx）。放行 .md：/en/**.md 是真实存在的端点
  //    （src/pages/[locale]/[...slug].md.ts 每篇文档 × 每个 locale 各一个），
  //    其中 /en/skill/install.md 正是主站回源路径之一。
  if (path.startsWith('/en/') && !path.endsWith('.md')) {
    // 这条与站点表无关：nginx 在 longbridge 与 longportapp 两侧都有同样的收敛，
    // 且 pages.dev 上一并生效更便于预览时验证。
    // 目标继承请求的 scheme 与 host；Pages 对外只服务 https，故线上必定是 https。
    return Response.redirect(new URL(path.slice('/en'.length) + url.search, url).toString(), 302)
  }

  // ⑦ SPA：8 个前缀的页面与 /_app/* 资源转发到 private 仓的 Pages project。
  if (site) {
    const page = SPA_PAGE.exec(path)
    const target = page
      ? `${site.spa}/${page[1] ? `${page[1]}/` : ''}${page[2]}.html`
      : path.startsWith(SPA_ASSETS)
        ? `${site.spa}${path}`
        : null
    if (target) return forward(target, request, 'spa')
  }

  return next()
}
