import type { AstroIntegration } from 'astro'
import { access, mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const LOCALES = ['en', 'zh-CN', 'zh-HK'] as const

/**
 * 把 @astrojs/sitemap 按语言分出的 sitemap-{locale}-0.xml 挪到 SEO 约定的地址
 * /{locale}/sitemap.xml，并写出总索引 /sitemap.xml（需求 M-24645944，
 * 地址约定见 SEO 文档 wiki/By1PwY2NSid586kv43pjouKbpfc）。
 *
 * 必须注册在 sitemap() 之后：astro:build:done 按注册顺序依次执行。
 */
export function sitemapLocaleFiles(): AstroIntegration {
  let site = ''
  return {
    name: 'lbus-sitemap-locale-files',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = new URL(config.site!).origin
      },
      'astro:build:done': async ({ dir, logger }) => {
        const out = (p: string) => fileURLToPath(new URL(p, dir))
        for (const locale of LOCALES) {
          // @astrojs/sitemap 出错时只打日志不抛错；这里让构建失败，并指向真正的原因。
          await access(out(`sitemap-${locale}-0.xml`)).catch(() => {
            throw new Error(`sitemap-${locale}-0.xml 未生成，原因见上方 @astrojs/sitemap 日志`)
          })
          // 单个文件上限 45000 条，超出会被拆成 -1，此时一个 /{locale}/sitemap.xml 装不下，需要改方案。
          const overflow = await access(out(`sitemap-${locale}-1.xml`)).then(() => true, () => false)
          if (overflow) throw new Error(`sitemap-${locale} 超出单文件上限，/${locale}/sitemap.xml 需要改为索引`)
          await mkdir(out(`${locale}/`), { recursive: true })
          await rename(out(`sitemap-${locale}-0.xml`), out(`${locale}/sitemap.xml`))
        }
        // 插件自带的 sitemap-index.xml 指向已被挪走的文件，删掉，避免对外暴露失效地址。
        await rm(out('sitemap-index.xml'), { force: true })
        const entries = LOCALES.map((l) => `<sitemap><loc>${site}/${l}/sitemap.xml</loc></sitemap>`).join('')
        await writeFile(
          out('sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`,
        )
        logger.info(`sitemap.xml → ${LOCALES.map((l) => `/${l}/sitemap.xml`).join(', ')}`)
      },
    },
  }
}
