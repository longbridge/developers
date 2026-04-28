import type MarkdownItAsync from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import picomatch from 'picomatch'
import { getRegionConfig } from '../region-utils'

/**
 * Markdown-it plugin that removes sections (heading + content) based on region config.
 * A "section" is defined as a heading token and all tokens until the next heading of the same or higher level.
 */
export function RegionFilterPlugin(md: MarkdownItAsync) {
  const config = getRegionConfig()
  if (!config) return

  // URL rewriting: replace global hostname with region hostname in all inline tokens
  if (config.siteHostname && config.siteHostname !== 'https://open.longbridge.com') {
    md.core.ruler.push('region_url_rewrite', (state) => {
      for (const token of state.tokens) {
        rewriteTokenUrls(token, 'https://open.longbridge.com', config.siteHostname)
        if (token.children) {
          for (const child of token.children) {
            rewriteTokenUrls(child, 'https://open.longbridge.com', config.siteHostname)
          }
        }
      }
    })
  }

  if (config.excludeSections.length === 0) return

  md.core.ruler.push('region_filter', (state) => {
    const env = state.env
    // VitePress passes the relative file path in env.relativePath (e.g. 'en/docs/getting-started.md')
    const relativePath: string | undefined = env?.relativePath
    if (!relativePath) return

    // Find matching exclusion rules for this page
    const matchingRules = config.excludeSections.filter((rule) => picomatch(rule.page)(relativePath))
    if (matchingRules.length === 0) return

    // Collect all headings to exclude
    const headingsToExclude = new Set<string>()
    for (const rule of matchingRules) {
      for (const h of rule.headings) {
        headingsToExclude.add(h)
      }
    }

    // Filter tokens: remove heading + its content section
    const tokens = state.tokens
    const filtered: Token[] = []
    let skipUntilLevel = -1

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (token.type === 'heading_open') {
        const level = parseInt(token.tag.slice(1)) // h2 -> 2
        // If we're skipping and hit a same-or-higher level heading, stop skipping
        if (skipUntilLevel > 0 && level <= skipUntilLevel) {
          skipUntilLevel = -1
        }

        // Check if the next inline token's content matches an excluded heading
        const inlineToken = tokens[i + 1]
        if (inlineToken?.type === 'inline' && headingsToExclude.has(inlineToken.content.trim())) {
          skipUntilLevel = level
          continue
        }
      }

      if (skipUntilLevel > 0) {
        // Check if this is a heading that should end the skip
        if (token.type === 'heading_open') {
          const level = parseInt(token.tag.slice(1))
          if (level <= skipUntilLevel) {
            skipUntilLevel = -1
            filtered.push(token)
          }
        }
        continue
      }

      filtered.push(token)
    }

    state.tokens = filtered
  })
}

function rewriteTokenUrls(token: Token, from: string, to: string) {
  // Handle all token types that may contain URLs: inline text, code blocks, fences, html blocks
  if (token.content && token.content.includes(from)) {
    token.content = token.content.split(from).join(to)
  }
  if (token.attrs) {
    for (const attr of token.attrs) {
      if (typeof attr[1] === 'string' && attr[1].includes(from)) {
        attr[1] = attr[1].split(from).join(to)
      }
    }
  }
}
