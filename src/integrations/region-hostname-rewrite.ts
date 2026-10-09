/**
 * region-hostname-rewrite
 *
 * Astro integration that post-processes built HTML/CSS/JS output files and
 * replaces global hostname references with region-specific hostnames.
 *
 * Global defaults (production site):
 *   open.longbridge.com      → regionConfig[REGION].siteHostname
 *   openapi.longbridge.com   → regionConfig[REGION].apiBaseUrl
 *   mcp.longbridge.com       → regionConfig[REGION].mcpHostname
 *
 * Runs when VITE_REGION is set to a known region with a config entry.
 *
 * 没有 region 的构建（release / canary）只替换站点域名，目标取 VITE_SITE_HOSTNAME：
 * release 设的就是 open.longbridge.com，等于不改；canary 设的是测试域名，文档里
 * 写死的 open.longbridge.com 链接（zip 下载、安装命令等）才会指回测试站，而不是把
 * 测试者带去线上。API / MCP 域名在这条路径上不替换。
 *
 * Legacy reference: .legacy/vitepress-reference/.vitepress/region-utils.ts
 * `buildRegionUrlReplacements()` — same logic ported to an Astro integration.
 */
import type { AstroIntegration } from 'astro'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { regionConfig } from '../../region.config'

/** Build a list of [search, replace] pairs for the current region. */
function buildReplacements(region: string): [string, string][] {
  const cfg = regionConfig[region]
  if (!cfg) return []

  const pairs: [string, string][] = []

  // Protocol-prefixed rules first to avoid double-matching.
  if (cfg.siteHostname && cfg.siteHostname !== 'https://open.longbridge.com') {
    pairs.push(['https://open.longbridge.com', cfg.siteHostname])
    pairs.push(['open.longbridge.com', cfg.siteHostname.replace(/^https?:\/\//, '')])
  }
  if (cfg.apiBaseUrl && cfg.apiBaseUrl !== 'https://openapi.longbridge.com') {
    pairs.push(['https://openapi.longbridge.com', cfg.apiBaseUrl])
    pairs.push(['openapi.longbridge.com', cfg.apiBaseUrl.replace(/^https?:\/\//, '')])
  }
  if (cfg.mcpHostname && cfg.mcpHostname !== 'https://mcp.longbridge.com') {
    pairs.push(['https://mcp.longbridge.com', cfg.mcpHostname])
    pairs.push(['mcp.longbridge.com', cfg.mcpHostname.replace(/^https?:\/\//, '')])
  }

  return pairs
}

/** Site-hostname-only pairs for builds without a region. */
function buildSiteReplacements(site: string | undefined): [string, string][] {
  if (!site || site === 'https://open.longbridge.com') return []
  return [
    ['https://open.longbridge.com', site],
    ['open.longbridge.com', site.replace(/^https?:\/\//, '')],
  ]
}

/** Recursively collect all files with the given extensions under a directory. */
async function collectFiles(dir: string, extensions: string[]): Promise<string[]> {
  const results: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const nested = await collectFiles(fullPath, extensions)
      results.push(...nested)
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath)
    }
  }
  return results
}

export function regionHostnameRewrite(): AstroIntegration {
  return {
    name: 'region-hostname-rewrite',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const region = process.env['VITE_REGION']
        const site = process.env['VITE_SITE_HOSTNAME']
        const replacements = region ? buildReplacements(region) : buildSiteReplacements(site)
        if (replacements.length === 0) {
          logger.info(`[region-hostname-rewrite] No replacements for region "${region ?? site ?? 'global'}", skipping.`)
          return
        }

        const distDir = dir.pathname
        logger.info(
          `[region-hostname-rewrite] Rewriting hostnames for region "${region}" in ${distDir}`
        )

        const files = await collectFiles(distDir, ['.html', '.css', '.js'])
        let modifiedCount = 0

        for (const filePath of files) {
          const original = await readFile(filePath, 'utf-8')
          let content = original

          for (const [search, replace] of replacements) {
            // Escape special regex characters in the search string
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            content = content.replace(new RegExp(escaped, 'g'), replace)
          }

          if (content !== original) {
            await writeFile(filePath, content, 'utf-8')
            modifiedCount++
          }
        }

        logger.info(
          `[region-hostname-rewrite] Done. Modified ${modifiedCount}/${files.length} files.`
        )
      },
    },
  }
}
