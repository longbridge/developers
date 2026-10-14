/**
 * remark-callout.ts
 *
 * Transforms container directives (from remark-directive) with names matching
 * the VitePress custom-container set into styled callout <div> elements.
 *
 * Supported names: success | warning | tip | info | danger | note | caution
 *
 * Syntax (after the mdx-preflight step converts bare titles):
 *   :::warning[Optional Title]
 *   content…
 *   :::
 *
 * AST output:
 *   <div class="callout callout-warning" role="note" data-lbus-component="callout-warning">
 *     <p class="callout-title">Optional Title</p>
 *     content…
 *   </div>
 *
 * If no label is provided the directive name is used as the title
 * (e.g. :::tip → title "Tip").
 */

import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'

const KNOWN = new Set(['success', 'warning', 'tip', 'info', 'danger', 'note', 'caution'])

const DEFAULT_TITLE: Record<string, string> = {
  success: 'Success',
  warning: 'Warning',
  tip: 'Tip',
  info: 'Info',
  danger: 'Danger',
  note: 'Note',
  caution: 'Caution',
}

export const remarkCallout: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node: any) => {
    if (node.type !== 'containerDirective') return
    if (!KNOWN.has(node.name)) return

    // Wire the outer wrapper
    const data = node.data ?? (node.data = {})
    data.hName = 'div'
    data.hProperties = {
      class: `callout callout-${node.name}`,
      role: 'note',
      'data-lbus-component': `callout-${node.name}`,
    }

    // Check whether the first child is the remark-directive label paragraph
    // (created when the directive uses [label] notation).
    const firstChild = node.children[0] as any
    if (firstChild && firstChild.type === 'paragraph' && firstChild.data?.directiveLabel) {
      // Style the existing label paragraph as the callout title
      const labelData = firstChild.data ?? (firstChild.data = {})
      labelData.hName = 'p'
      labelData.hProperties = { class: 'callout-title' }
    } else {
      // No explicit label — synthesise a default title paragraph
      const titleNode: any = {
        type: 'paragraph',
        data: {
          hName: 'p',
          hProperties: { class: 'callout-title' },
        },
        children: [{ type: 'text', value: DEFAULT_TITLE[node.name] }],
      }
      node.children.unshift(titleNode)
    }
  })
}
