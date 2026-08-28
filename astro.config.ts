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
import { prebuildMcpTools } from './src/integrations/prebuild-mcp-tools'
import { prebuildSkills } from './src/integrations/prebuild-skills'

const REGION = process.env['VITE_REGION'] ?? 'global'
const SITE = process.env['VITE_SITE_HOSTNAME'] ?? 'https://open.longportapp.com'

export default defineConfig({
  site: SITE,
  build: { format: 'file' },
  integrations: [
    react(),
    mdx(),
    icon(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { 'en': 'en', 'zh-CN': 'zh-CN', 'zh-HK': 'zh-HK' },
      },
      // Legacy config.mts sitemap.transformItems: drop migration URLs.
      filter: (page) => !page.includes('migration'),
    }),
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
