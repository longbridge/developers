import { defineConfig } from 'vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import Unocss from 'unocss/vite'
import { markdownConfig } from './config/markdown'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { localesConfig } from './config/locales'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { rewriteMarkdownPath } from './utils'
import { getRegionConfig, computeSrcExclude } from './region-utils'
import * as cheerio from 'cheerio'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsRoot = resolve(__dirname, '..')
const MCP_TOOLS_URL = 'https://openapi.longbridge.com/mcp/tools.json'
const MCP_TOOLS_DATA_PATH = resolve(__dirname, 'data/mcp-tools.json')
const regionCfg = getRegionConfig()
const regionSrcExclude = computeSrcExclude(docsRoot)

const insertScript = (html: string) => {
  const $ = cheerio.load(html)
  $('head').prepend(
    `<script>window.__API_PROXY_URL__ = ${JSON.stringify(process.env.VITE_PORTAL_GATEWAY_BASE_URL)}</script>`,
    `<script defer˝ src="https://assets.lbctrl.com/uploads/b63bb77e-74b5-43d3-8bf4-d610be91c838/longport-internal.iife.js"></script>`
  )
  return $.html()
}

export default defineConfig(
  withMermaid({
    title: 'Longbridge Developers',
    appearance: true,
    lastUpdated: true,
    cleanUrls: true,
    metaChunk: true,
    ignoreDeadLinks: true,
    base: '/',

    srcExclude: ['README.md', ...regionSrcExclude],
    rewrites: rewriteMarkdownPath,
    markdown: markdownConfig,
    transformHtml(code) {
      let html = insertScript(code)
      // Region URL rewriting: replace global hostname with region hostname in final HTML
      if (regionCfg?.siteHostname && regionCfg.siteHostname !== 'https://open.longbridge.com') {
        html = html.split('https://open.longbridge.com').join(regionCfg.siteHostname)
      }
      return html
    },
    transformHead(context) {
      const { page } = context
      let localePathname = page.replace(/\.md$/, '')
      if (localePathname.includes('index')) {
        localePathname = localePathname.replace('index', '')
      }
      const pathname = localePathname.replace('zh-CN/', '').replace('zh-HK/', '')

      // AI/agent-friendly markdown discovery link
      // e.g. en/docs/getting-started.md -> /docs/getting-started.md
      //      zh-CN/docs/index.md      -> /zh-CN/docs.md
      let markdownPath = page.startsWith('en/') ? page.slice(3) : page
      if (markdownPath.endsWith('/index.md')) {
        markdownPath = markdownPath.replace('/index.md', '.md')
      }

      const siteHost = regionCfg?.siteHostname || 'https://open.longbridge.com'
      return [
        ['link', { rel: 'canonical', href: `${siteHost}/${localePathname}` }],
        ['link', { rel: 'alternate', hreflang: 'en', href: `${siteHost}/${pathname}` }],
        ['link', { rel: 'alternate', hreflang: 'zh-Hans', href: `${siteHost}/zh-CN/${pathname}` }],
        ['link', { rel: 'alternate', hreflang: 'zh-Hant', href: `${siteHost}/zh-HK/${pathname}` }],
        ['link', { rel: 'alternate', type: 'text/markdown', href: `${siteHost}/${markdownPath}` }],
        ['meta', { property: 'og:url', content: `${siteHost}/${localePathname}` }],
        ['meta', { property: 'og:title', content: context.title }],
        ['meta', { property: 'og:description', content: context.description }],
        ['meta', { name: 'twitter:image', content: 'https://assets.lbctrl.com/uploads/b510b04f-9238-4fe0-b39d-11e076876ac1/longbridge-og.png' }],
        ['meta', { name: 'twitter:title', content: context.title }],
        ['meta', { name: 'twitter:description', content: context.description }],
      ]
    },

    buildEnd(siteConfig) {
      const skillsDir = resolve(__dirname, '../../skills')
      const outSkillDir = resolve(siteConfig.outDir, 'skill')
      mkdirSync(outSkillDir, { recursive: true })
      execSync(`zip -r "${outSkillDir}/longbridge.zip" longbridge`, { cwd: skillsDir })
      console.log('✓ skill/longbridge.zip generated')

      // Region URL rewriting for static assets
      if (regionCfg?.siteHostname && regionCfg.siteHostname !== 'https://open.longbridge.com') {
        const installDir = resolve(siteConfig.outDir, 'longbridge-terminal')
        for (const file of ['install', 'install.ps1']) {
          const filePath = resolve(installDir, file)
          const content = readFileSync(filePath, 'utf-8')
          writeFileSync(filePath, content.split('https://open.longbridge.com').join(regionCfg.siteHostname))
        }
        console.log('✓ install scripts rewritten for region')
      }
    },

    sitemap: {
      hostname: regionCfg?.siteHostname || 'https://open.longbridge.com',
      transformItems(items) {
        return items.filter((item) => !item.url.includes('migration'))
      },
    },

    /* prettier-ignore */
    head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: 'https://assets.wbrks.com/assets/logo/logo1.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: 'https://open.longbridge.com' }],
    ['meta', { name: 'robots', content: 'index,follow' }],
    ['meta', { name: 'googlebot', content: 'index,follow' }],
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-P81Y8BDYYS' }],
    ['script', {}, `window.dataLayer = window.dataLayer||[];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-P81Y8BDYYS');`],
    ['script', { defer: '', src: 'https://assets.lbkrs.com/pkg/sensorsdata/1.21.13.min.js' }],
    ['script', { async: '', src: 'https://at.alicdn.com/t/c/font_2621450_y740y72ffjq.js' }],
  ],
    themeConfig: {
      editLink: {
        pattern: ({ filePath }) => {
          return `https://github.com/longbridge/developers/edit/main/docs/${filePath}`
        },
        text: 'Edit',
      },
      logo: {
        light: 'https://assets.wbrks.com/assets/logo/light/logo.svg',
        dark: 'https://assets.wbrks.com/assets/logo/dark/logo.svg',
        width: 48,
        height: 48,
      },
      search: {
        provider: 'local',
      },
    },

    locales: localesConfig,

    vite: {
      ssr: {
        noExternal: ['vue-i18n'],
      },
      server: {
        port: 8000,
        proxy: {
          '/api': {
            target: process.env.VITE_API_BASE_URL || 'https://openapi.longbridge.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
      optimizeDeps: {
        // Exclude vuetify since it has an issue with vite dev - TypeError: makeVExpansionPanelTextProps is not a function - the makeVExpansionPanelTextProps is used before it is defined
        exclude: ['vuetify'],
      },
      build: {
        chunkSizeWarningLimit: 1000,
      },
      resolve: {
        alias: [
          {
            find: '@',
            replacement: dirname(fileURLToPath(new URL('./theme', import.meta.url))),
          },
          {
            find: '~',
            replacement: dirname(fileURLToPath(new URL('../', import.meta.url))),
          },
        ],
      },
      plugins: [
        {
          name: 'fetch-mcp-tools',
          async buildStart() {
            const res = await fetch(MCP_TOOLS_URL)
            if (!res.ok) throw new Error(`fetch mcp tools failed: HTTP ${res.status}`)
            const json = await res.json()
            mkdirSync(dirname(MCP_TOOLS_DATA_PATH), { recursive: true })
            writeFileSync(MCP_TOOLS_DATA_PATH, JSON.stringify(json, null, 2))
            console.log('✓ mcp-tools.json fetched')
          },
        },
        groupIconVitePlugin(),
        Unocss({
          configFile: resolve(dirname(fileURLToPath(import.meta.url)), '../unocss.config.ts'),
        }),

        /**s
         * see https://github.com/vuejs/vitepress/issues/3314
         * 实际上仅会在开发者模式注入
         */
        {
          name: 'inject-extra-script',
          transformIndexHtml(code) {
            return insertScript(code)
          },
        },
      ],
    },
  })
)
