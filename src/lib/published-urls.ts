import { getCollection } from 'astro:content'
import { currentRegion, includedInRegion, resolveUrl } from '@longbridge/openapi-utils'

let cache: Promise<ReadonlySet<string>> | undefined

async function load(): Promise<ReadonlySet<string>> {
  const region = currentRegion()
  const entries = await getCollection('docs')
  return new Set(entries.map((e) => resolveUrl(e)).filter((url: string) => includedInRegion(url, region)))
}

/** 当前 region 下真实生成的页面 URL（`/`、`/docs`、`/zh-CN/docs/x`），整个构建只算一次。 */
export function getPublishedUrls(): Promise<ReadonlySet<string>> {
  if (!cache) cache = load()
  return cache
}
