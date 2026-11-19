import type { Locale } from '@longbridge/openapi-utils'
import { apiPageMeta } from '@longbridge/openapi-api-reference/markdown'

/** 与 src/pages/docs/api/[op].astro、src/pages/[locale]/docs/api/[op].astro 生成的路由一一对应。 */
const API_PAGE_LOCALES: ReadonlyArray<readonly [Locale, string]> = [
  ['en', ''],
  ['zh-CN', '/zh-CN'],
  ['zh-HK', '/zh-HK'],
]

/** API Reference 单页的 URL（`/docs/api/<id>`、`/zh-CN/docs/api/<id>`、`/zh-HK/docs/api/<id>`）。 */
export function apiPageUrls(rawYaml: string): string[] {
  return API_PAGE_LOCALES.flatMap(([locale, prefix]) =>
    apiPageMeta(rawYaml, locale).map((m) => `${prefix}/docs/api/${m.id}`)
  )
}
