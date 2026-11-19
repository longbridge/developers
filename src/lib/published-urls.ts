import { getCollection } from 'astro:content'
import { currentRegion, includedInRegion, resolveUrl } from '@longbridge/openapi-utils'
import { apiPageUrls } from './api-page-urls'
import rawYaml from '../../openapi.yaml?raw'

let cache: Promise<ReadonlySet<string>> | undefined

async function load(): Promise<ReadonlySet<string>> {
  const region = currentRegion()
  const entries = await getCollection('docs')
  const docs = entries.map((e) => resolveUrl(e)).filter((url: string) => includedInRegion(url, region))
  // API Reference 单页不在 docs 集合里，但三种语言都会生成（路由不按 region 过滤），
  // 不加进来的话这些页拿不到 hreflang。
  return new Set([...docs, ...apiPageUrls(rawYaml)])
}

/** 当前 region 下真实生成的页面 URL（`/`、`/docs`、`/zh-CN/docs/x`、`/docs/api/<id>`），整个构建只算一次。 */
export function getPublishedUrls(): Promise<ReadonlySet<string>> {
  if (!cache) cache = load()
  return cache
}
