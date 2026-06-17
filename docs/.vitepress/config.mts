import { defineConfig } from 'vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import Unocss from 'unocss/vite'
import { markdownConfig } from './config/markdown'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { localesConfig } from './config/locales'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { rewriteMarkdownPath } from './utils'
import { getRegionConfig, computeSrcExclude } from './region-utils'
import * as cheerio from 'cheerio'
import yaml from 'js-yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsRoot = resolve(__dirname, '..')
const MCP_TOOLS_URL = 'https://mcp.longbridge.com/mcp/tools.json'
const MCP_TOOLS_DATA_PATH = resolve(__dirname, 'data/mcp-tools.json')
const regionCfg = getRegionConfig()
const regionSrcExclude = computeSrcExclude(docsRoot)

// Google One Tap：proxy 由环境变量 PROXY 控制（CI 与本地 dev:canary/build:canary 脚本显式注入），
// 默认 production。放在 head 配置里，dev 与 build 都生效。
const oneTapProxy = process.env.PROXY === 'canary' ? 'canary' : 'production'

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
    buildConcurrency: 10,

    srcExclude: ['README.md', ...regionSrcExclude],
    rewrites: rewriteMarkdownPath,
    markdown: markdownConfig,
    transformHtml(code) {
      let html = insertScript(code)
      // Region URL rewriting: replace global hostnames (site + API) with region hostnames in final HTML
      if (regionCfg?.siteHostname && regionCfg.siteHostname !== 'https://open.longbridge.com') {
        html = html.split('https://open.longbridge.com').join(regionCfg.siteHostname)
      }
      if (regionCfg?.apiBaseUrl && regionCfg.apiBaseUrl !== 'https://openapi.longbridge.com') {
        html = html.split('https://openapi.longbridge.com').join(regionCfg.apiBaseUrl)
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
        [
          'meta',
          {
            name: 'twitter:image',
            content: 'https://assets.lbctrl.com/uploads/b510b04f-9238-4fe0-b39d-11e076876ac1/longbridge-og.png',
          },
        ],
        ['meta', { name: 'twitter:title', content: context.title }],
        ['meta', { name: 'twitter:description', content: context.description }],
      ]
    },

    buildEnd(siteConfig) {
      const outSkillDir = resolve(siteConfig.outDir, 'skill')
      mkdirSync(outSkillDir, { recursive: true })

      // Clone longbridge/skills@main and pack zips.
      // Fail the build if the clone or `skills/` directory is missing.
      const tmpDir = resolve(__dirname, '../../.tmp-longbridge-skills')
      rmSync(tmpDir, { recursive: true, force: true })
      try {
        execSync(`git clone --depth 1 --branch main https://github.com/longbridge/skills.git "${tmpDir}"`, {
          stdio: 'inherit',
        })
      } catch (err) {
        throw new Error(`Failed to clone longbridge/skills@main: ${(err as Error).message}`)
      }
      const skillsSrcDir = resolve(tmpDir, 'skills')
      if (!existsSync(skillsSrcDir)) {
        throw new Error(`longbridge/skills@main is missing the "skills/" directory; cannot build skill zips`)
      }

      // Pack all skills into longbridge-all.zip
      execSync(`zip -r "${outSkillDir}/longbridge-all.zip" .`, { cwd: skillsSrcDir })
      console.log('✓ skill/longbridge-all.zip generated from longbridge/skills@main')

      // Pack each skill subdirectory into its own zip
      for (const name of readdirSync(skillsSrcDir)) {
        if (statSync(resolve(skillsSrcDir, name)).isDirectory()) {
          execSync(`zip -r "${outSkillDir}/${name}.zip" "${name}"`, { cwd: skillsSrcDir })
          console.log(`✓ skill/${name}.zip generated`)
        }
      }

      rmSync(tmpDir, { recursive: true, force: true })

      // Region URL rewriting for static assets (site + API hostnames)
      const staticReplacements: [string, string][] = []
      if (regionCfg?.siteHostname && regionCfg.siteHostname !== 'https://open.longbridge.com') {
        staticReplacements.push(['https://open.longbridge.com', regionCfg.siteHostname])
      }
      if (regionCfg?.apiBaseUrl && regionCfg.apiBaseUrl !== 'https://openapi.longbridge.com') {
        staticReplacements.push(['https://openapi.longbridge.com', regionCfg.apiBaseUrl])
      }
      if (staticReplacements.length > 0) {
        const installDir = resolve(siteConfig.outDir, 'longbridge-terminal')
        for (const file of ['install', 'install.ps1']) {
          const filePath = resolve(installDir, file)
          let content = readFileSync(filePath, 'utf-8')
          for (const [from, to] of staticReplacements) {
            content = content.split(from).join(to)
          }
          writeFileSync(filePath, content)
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
    ['script', { src: 'https://assets.wbrks.com/plugin/session/google-one-tap.es.js', 'data-proxy': oneTapProxy }],
  ],
    themeConfig: {
      editLink: {
        pattern: ({ filePath }) => {
          return `https://github.com/longbridge/developers/edit/main/docs/${filePath}`
        },
        text: 'Edit',
      },
      logo: {
        light: 'https://assets.lbkrs.com/uploads/e76f6d93-80f8-4f9b-8b8d-2c86f0c94a78/longbridge-developers-light.png',
        dark: 'https://assets.lbkrs.com/uploads/37a18fa4-46a4-408c-a36a-560004eb3cfb/longbridge-developers-dark.png',
      },
      siteTitle: false,
      search: {
        provider: 'local',
      },
    },

    locales: localesConfig,

    vite: {
      ssr: {
        noExternal: ['vue-i18n', 'mark.js'],
      },
      server: {
        port: 8000,
        proxy: {
          '/api': {
            target: process.env.VITE_API_BASE_URL || 'https://openapi.longbridge.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
          // `/lb-api` 由下方 `lb-api-dynamic-proxy` 插件处理，按 cookie 中的 app_id 切换 upstream
        },
      },
      optimizeDeps: {
        // Exclude vuetify since it has an issue with vite dev - TypeError: makeVExpansionPanelTextProps is not a function - the makeVExpansionPanelTextProps is used before it is defined
        exclude: ['vuetify'],
      },
      build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('shiki') || id.includes('shikiji')) return 'shiki'
                if (id.includes('@vue') || id.includes('vue-demi')) return 'vue-vendor'
                if (id.includes('unocss') || id.includes('@unocss')) return 'unocss'
                return 'vendor'
              }
            },
          },
        },
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
          // dev 时把 `/lb-api/*` 转发到 Portal API；按 cookie 中的 app_id 选 upstream：
          //  - cookie `x-original-app-id` 或 `app_id` 为 `longbridge_us_uat` → m.longbridge-staging.com
          //  - 其它 → VITE_PORTAL_API_BASE_URL 或默认 m.longbridge.xyz
          name: 'lb-api-dynamic-proxy',
          configureServer(server) {
            server.middlewares.use('/lb-api', async (req, res) => {
              try {
                const cookieHeader = (req.headers.cookie as string) || ''
                const cookies: Record<string, string> = {}
                for (const part of cookieHeader.split(/;\s*/)) {
                  if (!part) continue
                  const idx = part.indexOf('=')
                  if (idx === -1) continue
                  cookies[part.slice(0, idx)] = part.slice(idx + 1)
                }
                const appId = cookies['x-original-app-id'] || cookies['app_id']
                const baseTarget =
                  appId === 'longbridge_us_uat'
                    ? 'https://m.longbridge-staging.com'
                    : process.env.VITE_PORTAL_API_BASE_URL || 'https://m.longbridge.xyz'

                const tail = req.url || '/'
                const targetUrl = baseTarget + '/api' + (tail === '/' ? '' : tail)

                const headers: Record<string, string> = {}
                for (const [k, v] of Object.entries(req.headers)) {
                  if (v == null) continue
                  const lower = k.toLowerCase()
                  if (lower === 'host' || lower === 'connection' || lower === 'content-length') continue
                  headers[k] = Array.isArray(v) ? v.join(', ') : String(v)
                }

                const method = req.method || 'GET'
                const hasBody = method !== 'GET' && method !== 'HEAD'
                let body: Uint8Array | undefined
                if (hasBody) {
                  const chunks: Buffer[] = []
                  for await (const chunk of req as AsyncIterable<Buffer>) chunks.push(chunk)
                  const merged = Buffer.concat(chunks)
                  body = new Uint8Array(merged.buffer, merged.byteOffset, merged.byteLength)
                }

                const upstream = await fetch(targetUrl, {
                  method,
                  headers,
                  body: body as BodyInit | undefined,
                  redirect: 'manual',
                })

                res.statusCode = upstream.status
                upstream.headers.forEach((value, key) => {
                  const lower = key.toLowerCase()
                  if (lower === 'content-encoding' || lower === 'content-length' || lower === 'transfer-encoding') return
                  res.setHeader(key, value)
                })
                const buf = Buffer.from(await upstream.arrayBuffer())
                res.end(buf)
              } catch (err) {
                res.statusCode = 502
                res.end(`lb-api proxy error: ${(err as Error).message}`)
              }
            })
          },
        },
        {
          name: 'gc-between-bundles',
          buildEnd() {
            if (typeof global.gc === 'function') {
              global.gc()
              console.log('✓ GC triggered after bundle')
            }
          },
        },
        {
          name: 'yaml-transform',
          transform(src: string, id: string) {
            if (!id.endsWith('.yaml') && !id.endsWith('.yml')) return
            const data = yaml.load(src)
            return { code: `export default ${JSON.stringify(data)}`, map: null }
          },
        },
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
