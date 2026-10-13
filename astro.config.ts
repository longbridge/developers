import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwind from '@tailwindcss/vite'
import remarkHeadingId from 'remark-heading-id'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { unified } from '@astrojs/markdown-remark'
import { remarkRegionFilter } from './src/integrations/remark-region-filter'
import remarkDirective from 'remark-directive'
import { remarkCallout } from './src/integrations/remark-callout'
import { regionHostnameRewrite } from './src/integrations/region-hostname-rewrite'
import { sitemapLocaleFiles } from './src/integrations/sitemap-locale-files'
import { prebuildMcpTools } from './src/integrations/prebuild-mcp-tools'
import { prebuildSkills } from './src/integrations/prebuild-skills'

const REGION = process.env['VITE_REGION'] ?? 'global'
// 未设置 VITE_SITE_HOSTNAME 时（dev 等）兜底为生产域名；
// sitemap / llms.txt / robots / 页面 canonical 都从这里取（Astro.site）。
const SITE = process.env['VITE_SITE_HOSTNAME'] ?? 'https://open.longbridge.com'
const sitemapLocale = (url: string) =>
  new URL(url).pathname.match(/^\/(zh-CN|zh-HK)(\/|$)/)?.[1] ?? 'en'
const BUILD_FORMAT = process.env['BUILD_FORMAT'] === 'directory' ? 'directory' : 'file'
const ASSETS_DIR = process.env['ASSETS_DIR'] === '_docs' ? '_docs' : 'assets'

export default defineConfig({
  site: SITE,
  // 产物形态按边缘分轨，默认 'file'：
  // - Cloudflare Pages（.com / .longportapp.com）必须用 'file'。Pages 会把 URL 规范化
  //   到与产物一致的形态：'file' 产 `foo.html` → 规范 URL 是 `/foo`（与现网 nginx 完全
  //   一致）；'directory' 产 `foo/index.html` → 规范 URL 变成 `/foo/`，`/foo` 反被 308
  //   到带尾斜杠版本，而 canonical 仍写无尾斜杠，两者自相矛盾（实测见方案 §15.9）。
  // - 阿里云轨（.cn）将来由 OSS 静态网站托管直接承载时才需要 'directory'，配合
  //   「子目录首页 + 文件 404 规则=Index」让 /foo 直接 200 且地址栏不变。届时在那条
  //   流水线上设 BUILD_FORMAT=directory 即可。.cn 今天仍走 nginx（由 nginx 补 .html），
  //   所以现在同样用 'file'。
  // 资源目录按「谁来路由这个产物」分轨，默认 'assets'：
  // - 发往 OSS、由 nginx 承载的构建（.com 的 OSS 副本、.cn、open.longbridge.xyz）必须用
  //   'assets'。nginx 只有 /assets 映射到文档产物，其余路径落进 `location /` 被改写成
  //   `$uri/index.html` 必 404（.cn 则 302 去 .com），实测见方案 §15.14。
  // - 发往 Cloudflare Pages 与阿里云静态托管的构建设 ASSETS_DIR=_docs：与 SPA 的资源
  //   命名空间分开，Function 不必区分 /assets 归谁。
  // 默认取 'assets'：漏设变量时坏的是 CF 轨（仍可用，/assets 在 _routes 排除里走静态），
  // 而不是 nginx 承载的线上站点。nginx 全部下线后改默认值并删掉这个开关。
  build: { format: BUILD_FORMAT, assets: ASSETS_DIR },
  integrations: [
    react(),
    mdx(),
    icon(),
    sitemap({
      // hreflang 取值与页面 head 一致（en / zh-Hans / zh-Hant），见 src/lib/page-meta.ts。
      i18n: {
        defaultLocale: 'en',
        locales: { 'en': 'en', 'zh-CN': 'zh-Hans', 'zh-HK': 'zh-Hant' },
      },
      // Legacy config.mts sitemap.transformItems: drop migration URLs.
      filter: (page) => !page.includes('migration'),
      // 补 x-default → 英文版，与页面 head 一致（规则见 src/lib/page-meta.ts buildSeoLinks）。
      // 只有一种语言的页面插件不输出 links；英文单语页同样补 en + x-default。
      serialize: (item) => {
        const isZh = /^\/zh-(CN|HK)(\/|$)/.test(new URL(item.url).pathname)
        const links = item.links ?? (isZh ? [] : [{ url: item.url, lang: 'en' }])
        const en = links.find((l) => l.lang === 'en')
        return { ...item, links: en ? [...links, { url: en.url, lang: 'x-default' }] : item.links }
      },
      // 按语言分组，再由 sitemapLocaleFiles 落到 /{en,zh-CN,zh-HK}/sitemap.xml，
      // 总索引为 /sitemap.xml。
      chunks: {
        'en': (item) => (sitemapLocale(item.url) === 'en' ? item : undefined),
        'zh-CN': (item) => (sitemapLocale(item.url) === 'zh-CN' ? item : undefined),
        'zh-HK': (item) => (sitemapLocale(item.url) === 'zh-HK' ? item : undefined),
      },
    }),
    sitemapLocaleFiles(),
    regionHostnameRewrite(),
    prebuildMcpTools(),
    prebuildSkills(),
  ],
  vite: {
    plugins: [
      tailwind(),
      // Rename mdx frontmatter `layout:` → `docs_layout:` so astro-mdx
      // doesn't try to resolve values like "api-reference" as module
      // paths. Our page routes dispatch on entry.data.docs_layout manually.
      {
        name: 'lbus-mdx-preflight',
        enforce: 'pre' as const,
        transform(code: string, id: string) {
          if (!id.endsWith('.mdx')) return null
          let out = code
          // 1) Rename frontmatter `layout:` → `docs_layout:` (avoid astro-mdx
          //    auto-layout resolution that treats "api-reference" as a module).
          if (out.startsWith('---')) {
            const end = out.indexOf('\n---', 3)
            if (end > 0) {
              const front = out.slice(0, end)
              if (/^layout:/m.test(front)) {
                out = front.replace(/^layout:/m, 'docs_layout:') + out.slice(end)
              }
            }
          }
          // 1.5) CLI command blocks. `<CliCommand>\n# comment\ncmd\n…\n</CliCommand>`
          //    — MDX parses the inner `#` lines as <h1> headings and each command
          //    as a <p>, destroying the terminal card. Extract the raw inner text
          //    and hand it to a SELF-CLOSING `<CliCommand code={"…"} />` (no
          //    children → MDX never re-parses the block), which rebuilds the
          //    terminal card + syntax highlighting. Mirrors the legacy markdown-it
          //    cli-command plugin, which also operated on raw markdown. Run before
          //    every other transform so the inner text is captured verbatim.
          out = out.replace(
            /<CliCommand>\r?\n([\s\S]*?)\r?\n[ \t]*<\/CliCommand>/g,
            (_m, inner: string) => `<CliCommand code={${JSON.stringify(inner)}} />`,
          )
          // 2) Convert vitepress heading anchor syntax `## Foo {#bar}` →
          //    `<h2 id="bar">Foo<a …/></h2>`.
          //    MDX parses `{#bar}` as a JSX expression (acorn) before remark plugins run,
          //    causing "Could not parse expression with acorn". Converting to a JSX heading
          //    element preserves the explicit id (critical for zh-CN/zh-HK where heading
          //    text ≠ id, e.g. `## 频率限制 {#rate-limit}`). The header-anchor link is
          //    inlined here because rehype-autolink-headings only processes rehype-tree
          //    nodes, not JSX nodes.
          out = out.replace(
            /^(#{1,6})\s+(.+?)\s+\{#([^}\n]+)\}\s*$/gm,
            (_, hashes, text, id) =>
              `<h${hashes.length} id="${id}">${text}<a href="#${id}" className="header-anchor" aria-hidden="true" tabIndex={-1}></a></h${hashes.length}>`,
          )
          // 3) Strip vitepress-era `<style scoped>...</style>` blocks. The
          //    CSS inside has been migrated (§S4) to
          //    src/styles/mdx-page-overrides.css, keyed by
          //    [data-lbus-page="…"] on <main> in BaseLayout.astro — the mdx
          //    source's `<style scoped>` block is now dead code but the docs
          //    content is immutable (spec §-1), so we strip it at preflight.
          //    Also required for correctness: mdx/acorn parses the CSS `{ }`
          //    inside as a JSX expression and fails without this strip.
          out = out.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          // 4) Autolinks `<https://...>` — mdx doesn't recognise them.
          out = out.replace(/<(https?:\/\/[^\s<>]+)>/g, '$1')
          // 5) Vitepress placeholder tags like `<id>`, `<order_id>`.
          //    Whitelist real HTML tags (incl. legacy `<center>` used in
          //    old vitepress tables) so we don't destroy them.
          {
            const HTML_TAGS = /^(a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|slot|small|source|span|strong|style|sub|summary|sup|svg|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)$/
            out = out.replace(/<([a-z][a-z0-9_-]*)>/g, (m, tag) =>
              HTML_TAGS.test(tag) ? m : `&lt;${tag}&gt;`
            )
          }
          // 6) Vue-style reactive prop `<Foo :title="x">` inside JSX
          //    components. Just strip the standalone `:` before a prop
          //    name. Bounded single pass (avoid pathological backtracking).
          out = out.replace(/(\s):([A-Za-z_][\w-]*)=/g, '$1$2=')
          // 7) HTML comments `<!-- ... -->` — mdx expects `{/* ... */}`.
          //    Just strip them; the content is not user-visible.
          out = out.replace(/<!--[\s\S]*?-->/g, '')
          // 8) Vitepress markdown-it-attrs `[text](url){attr="value"}` —
          //    mdx parses the `{...}` as a JSX expression, e.g.
          //    `{target="_blank"}` becomes a reference to a `target`
          //    identifier that doesn't exist at runtime. Strip the
          //    attribute block right after a markdown link. Semantic
          //    restore (external links → target=_blank + rel=noopener)
          //    will land via rehype-external-links in stage-2 §S3.
          out = out.replace(/(\]\([^)\n]+\))\{[^}\n]*[=.#][^}\n]*\}/g, '$1')
          // 9) REST path parameter placeholders `/{name}` (e.g. in JSX
          //    tables `<td>/v1/content/{symbol}/news</td>`) — mdx parses
          //    `{symbol}` as a JSX expression referencing an undefined
          //    identifier. Escape the braces so mdx emits literal `{`/`}`.
          out = out.replace(/\/\{([a-z_][a-z0-9_]*)\}/gi, '/\\{$1\\}')
          // 10) Convert VitePress-style `:::name Title Text` to
          //     remark-directive bracket notation `:::name[Title Text]`.
          //     The micromark-extension-directive tokenizer (used by
          //     remark-directive v4) returns nok when it encounters bare text
          //     after the directive name/whitespace, so only bracket labels
          //     (`[…]`) are accepted.  This transform runs before remark sees
          //     the file.  Regex only matches lines where:
          //       - 3+ colons start the line
          //       - one of the known directive names follows immediately
          //       - at least one space separates name from title text
          //       - title text contains no newlines, brackets, or braces
          //     (Lines with no title, `:::name[…]`, or `:::name{…}` are left
          //     untouched.)
          out = out.replace(
            /^(:{3,})(success|warning|tip|info|danger|note|caution)([ \t]+)([^\n[\]{]+?)\s*$/gm,
            (_match, colons, name, _ws, title) => `${colons}${name}[${title.trim()}]`,
          )
          return out === code ? null : { code: out, map: null }
        },
      },
    ],
    define: {
      'import.meta.env.PUBLIC_REGION': JSON.stringify(REGION),
    },
  },
  markdown: {
    // Explicitly opt out of Sätteri (Rust markdown processor built on
    // oxc) — its stricter expression parser fails on Go struct literals
    // inside fenced code blocks (docs/en/docs/screener/screener_search.mdx
    // and elsewhere). `unified()` forces the acorn-based remark/rehype
    // pipeline. Keeps Astro 7 latest.
    processor: unified({
      remarkPlugins: [remarkHeadingId, remarkRegionFilter, remarkDirective, remarkCallout],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehypePlugins: [
        rehypeSlug as any,
        [rehypeAutolinkHeadings, {
          behavior: 'append',
          properties: { className: ['header-anchor'], ariaHidden: 'true', tabIndex: -1 },
        }] as any,
      ],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
})
