import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwind from '@tailwindcss/vite'
import remarkHeadingId from 'remark-heading-id'
import { remarkRegionFilter } from './src/integrations/remark-region-filter'
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
          // 2) Strip vitepress heading anchor syntax `## Foo {#bar}` → `## Foo`.
          //    mdx parses `{#bar}` as a JSX expression and fails.
          //    stage-2 will restore anchors via rehype-slug.
          out = out.replace(/^(#{1,6}\s+.+?)\s+\{#[^}\n]+\}\s*$/gm, '$1')
          // 3) Strip vue-style `<style scoped>...</style>` blocks — mdx parses
          //    the CSS `{ }` as JSX expressions and fails. stage-2 will move
          //    these into a proper stylesheet.
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
          return out === code ? null : { code: out, map: null }
        },
      },
    ],
    define: {
      'import.meta.env.PUBLIC_REGION': JSON.stringify(REGION),
    },
  },
  markdown: {
    remarkPlugins: [remarkHeadingId, remarkRegionFilter],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
})
