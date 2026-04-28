import picomatch from 'picomatch'
import fs from 'node:fs'
import path from 'node:path'
import { regionConfig, type RegionConfig } from '../../region.config'

/** Current region from VITE_REGION env, undefined means global (no filtering) */
export function getRegion(): string | undefined {
  return process.env['VITE_REGION'] || undefined
}

/** Get region config, returns undefined for global build */
export function getRegionConfig(): RegionConfig | undefined {
  const region = getRegion()
  if (!region) return undefined
  return regionConfig[region]
}

/**
 * Check if a page path is included in the current region's whitelist.
 * When no region is set (global build), all pages are included.
 *
 * @param pagePath - Relative path from docs/ root, e.g. 'en/docs/quote/pull.md'
 */
export function isPageIncluded(pagePath: string): boolean {
  const config = getRegionConfig()
  if (!config) return true // global build: include everything

  return config.includePages.some((pattern) => picomatch(pattern)(pagePath))
}

/**
 * Filter nav items based on region config.
 * Removes nav items whose link matches excludeNavLinks.
 * For locale-prefixed links (e.g. /zh-CN/sdk), matches against the path without locale prefix.
 */
export function filterNavItems<T extends { link?: string }>(items: T[]): T[] {
  const config = getRegionConfig()
  if (!config || config.excludeNavLinks.length === 0) return items

  const excluded = new Set(config.excludeNavLinks)
  return items.filter((item) => {
    if (!item.link) return true
    // Strip locale prefix for matching: /zh-CN/sdk -> /sdk, /zh-HK/docs/api -> /docs/api
    const normalized = item.link.replace(/^\/(zh-CN|zh-HK)/, '')
    return !excluded.has(normalized)
  })
}

/**
 * Compute srcExclude patterns for VitePress config.
 * Scans docs directory and returns paths not matching the whitelist.
 */
export function computeSrcExclude(docsRoot: string): string[] {
  const config = getRegionConfig()
  if (!config) return []

  const excludes: string[] = []
  const locales = ['en', 'zh-CN', 'zh-HK']

  for (const locale of locales) {
    const localeDir = path.join(docsRoot, locale)
    if (!fs.existsSync(localeDir)) continue
    walkMarkdownFiles(localeDir, docsRoot, config.includePages, excludes)
  }

  return excludes
}

function walkMarkdownFiles(
  dir: string,
  docsRoot: string,
  includePatterns: string[],
  excludes: string[]
): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const isMatch = picomatch(includePatterns)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, docsRoot, includePatterns, excludes)
    } else if (entry.name.endsWith('.md')) {
      const relativePath = path.relative(docsRoot, fullPath)
      if (!isMatch(relativePath)) {
        excludes.push(relativePath)
      }
    }
  }
}
