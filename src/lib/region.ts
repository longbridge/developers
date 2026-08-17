// @ts-ignore – picomatch ships no .d.ts; @types/picomatch is not installed
import picomatch from 'picomatch'
import { regionConfig } from '../../region.config'

/**
 * The three possible build regions.
 * - 'global': full site (no filtering)
 * - 'cn': China region (allowlist-based page and section filtering)
 * - 'hk': HK region (allowlist-based; no config defined yet → behaves as global)
 */
export type Region = 'global' | 'cn' | 'hk'

/**
 * Returns the current region from the Vite define injected at build time.
 * Falls back to 'global' if not set.
 */
export function currentRegion(): Region {
  const r = (import.meta.env.PUBLIC_REGION as string | undefined) ?? 'global'
  if (r === 'cn' || r === 'hk') return r
  return 'global'
}

/**
 * Convert a resolved URL (e.g. '/docs/cli' or '/zh-CN/docs/mcp') to candidate
 * relative file paths that can be matched against the region config includePages
 * glob patterns.
 */
function urlToRelativePaths(url: string): string[] {
  let localePart = 'en'
  let pathPart = url

  if (url.startsWith('/zh-CN')) {
    localePart = 'zh-CN'
    pathPart = url.slice('/zh-CN'.length) || '/'
  } else if (url.startsWith('/zh-HK')) {
    localePart = 'zh-HK'
    pathPart = url.slice('/zh-HK'.length) || '/'
  }

  const normalized = pathPart === '/' ? '/index' : pathPart

  return [
    `${localePart}${normalized}.md`,
    `${localePart}${normalized}/index.md`,
    `${localePart}${normalized}.mdx`,
    `${localePart}${normalized}/index.mdx`,
  ]
}

/**
 * Returns true if the given URL should be included in the given region build.
 *
 * - 'global': all pages included
 * - 'cn' / 'hk': included only if at least one candidate path matches the
 *   region's `includePages` glob list (picomatch)
 * - If no config exists for the region (e.g. 'hk' not yet defined): included
 *
 * @param url - Resolved URL from resolveUrl(), e.g. '/docs/cli' or '/zh-CN/docs/mcp'
 * @param region - Current build region
 */
export function includedInRegion(url: string, region: Region): boolean {
  if (region === 'global') return true

  const cfg = regionConfig[region]
  if (!cfg) return true // no config for this region → include everything

  const patterns = cfg.includePages
  if (patterns.length === 0) return true

  const isMatch = picomatch(patterns)
  const candidates = urlToRelativePaths(url)
  return candidates.some((p) => isMatch(p))
}
