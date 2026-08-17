/**
 * remark-region-filter
 *
 * Remark plugin that removes heading sections from MDX/Markdown content
 * based on the current region's `excludeSections` configuration.
 *
 * Legacy approach: VitePress used a markdown-it plugin that walked token arrays
 * and removed heading blocks by matching text content. This port replaces that
 * with an equivalent MDAST visitor (remark).
 *
 * Delimiter: heading text matching (no inline markers in content).
 * The `excludeSections` list in region.config.ts maps page glob patterns to
 * heading texts to drop.
 *
 * When no VITE_REGION is set (global build), this plugin is a no-op.
 */
import type { Root, Heading, PhrasingContent } from 'mdast'
import type { Plugin } from 'unified'
import picomatch from 'picomatch'
import { regionConfig } from '../../region.config'

/** Extract plain-text content from a heading's children */
function headingText(node: Heading): string {
  return node.children
    .map((child: PhrasingContent) => {
      if ('value' in child) return (child as { value: string }).value
      if ('children' in child) {
        return (child as { children: PhrasingContent[] }).children
          .map((c) => ('value' in c ? (c as { value: string }).value : ''))
          .join('')
      }
      return ''
    })
    .join('')
    .trim()
}

export const remarkRegionFilter: Plugin<[], Root> = function () {
  return (tree, file) => {
    const region = process.env['VITE_REGION']
    if (!region) return

    const cfg = regionConfig[region]
    if (!cfg || cfg.excludeSections.length === 0) return

    // Determine the relative path of the file being processed.
    // Vite / Astro sets file.path to the absolute file system path.
    const filePath = file.history[0] ?? ''

    // Build a set of heading texts to exclude for this page.
    const headingsToExclude = new Set<string>()
    for (const rule of cfg.excludeSections) {
      const isMatch = picomatch(rule.page)
      // Try matching against both the full path and the docs-relative portion
      if (isMatch(filePath) || isMatch(filePath.replace(/.*\/docs\//, 'docs/'))) {
        for (const h of rule.headings) {
          headingsToExclude.add(h)
        }
      }
    }

    if (headingsToExclude.size === 0) return

    // Walk the tree and drop heading nodes whose text is in the exclusion set,
    // plus all subsequent sibling nodes until we reach a heading of the same
    // or higher level (i.e. lower or equal heading depth number).
    const children = tree.children as Root['children']
    let skipUntilDepth = -1

    const next: Root['children'] = []
    for (const node of children) {
      if (node.type === 'heading') {
        const h = node as Heading
        // If we are skipping and encounter a same-or-higher-level heading, stop
        if (skipUntilDepth > 0 && h.depth <= skipUntilDepth) {
          skipUntilDepth = -1
        }

        const text = headingText(h)
        if (headingsToExclude.has(text)) {
          skipUntilDepth = h.depth
          continue // drop this heading
        }
      }

      if (skipUntilDepth > 0) {
        continue // drop everything inside the excluded section
      }

      next.push(node as Root['children'][number])
    }

    tree.children = next
  }
}
