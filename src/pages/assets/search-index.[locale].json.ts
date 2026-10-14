/**
 * Build-time search index — one JSON per locale.
 *
 * Structure: each doc is sliced into "sections" — one per heading. A section
 * carries the ancestor heading breadcrumb (h1 → h2 → …) so the client can
 * render the legacy `# Board - Security Board` / `# Scene Demonstration >
 * Submit Order` UI without another lookup.
 *
 * Runs during `astro build` and `astro dev` (dev serves it live). No
 * pagefind required. Kept per-locale so the client only downloads the
 * language it needs.
 */
import type { APIRoute } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getCollection, render } from 'astro:content'
import { resolveUrl, resolveLocale, currentRegion, includedInRegion } from '@longbridge/openapi-utils'

export function getStaticPaths() {
  return [
    { params: { locale: 'en' } },
    { params: { locale: 'zh-CN' } },
    { params: { locale: 'zh-HK' } },
  ]
}

interface Section {
  id: string
  url: string
  title: string
  headings: string[]
  body: string
}

const MAX_SECTION_BODY = 2000

export const GET: APIRoute = async ({ params }) => {
  const locale = params.locale as 'en' | 'zh-CN' | 'zh-HK'
  const region = currentRegion()
  const all = await getCollection('docs')
  const entries = all
    .filter((e: CollectionEntry<'docs'>) => resolveLocale(e) === locale)
    .filter((e: CollectionEntry<'docs'>) => includedInRegion(resolveUrl(e), region))

  const sections: Section[] = []

  for (const entry of entries) {
    const url = resolveUrl(entry)
    const { headings } = await render(entry)
    const raw = entry.body ?? ''
    const docTitle = entry.data.title ?? headings[0]?.text ?? url

    // Slug lookup — heading text may be reused, so key on (text, depth).
    const slugKey = (text: string, depth: number) => `${depth}::${text}`
    const slugMap = new Map<string, string>()
    for (const h of headings) slugMap.set(slugKey(h.text, h.depth), h.slug)

    // Walk raw mdx line by line. Each heading closes the previous section
    // and opens a new one; we maintain an ancestor stack for the breadcrumb.
    const lines = raw.split('\n')
    const stack: { depth: number; text: string }[] = []
    let buf: string[] = []

    // The doc-level intro (content before any heading) is emitted with the
    // doc title as its sole breadcrumb entry — otherwise it becomes
    // unsearchable.
    let sawFirstHeading = false

    const flush = () => {
      const body = stripMarkdown(buf.join('\n')).slice(0, MAX_SECTION_BODY)
      const path = stack.length > 0 ? stack.map((s) => s.text) : [docTitle]
      if (!body && stack.length === 0) return
      const last = stack[stack.length - 1]
      const slug = last ? slugMap.get(slugKey(last.text, last.depth)) : ''
      const href = slug ? `${url}#${slug}` : url
      sections.push({
        id: `${url}::${stack.map((s) => s.depth + s.text).join('/') || '<intro>'}`,
        url: href,
        title: docTitle,
        headings: path,
        body,
      })
    }

    for (const line of lines) {
      const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line)
      if (m) {
        flush()
        buf = []
        const depth = m[1].length
        const text = m[2].trim()
        while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop()
        stack.push({ depth, text })
        sawFirstHeading = true
        continue
      }
      buf.push(line)
    }
    // Final section (only meaningful when we've seen headings or an intro)
    if (sawFirstHeading || buf.some((l) => l.trim())) flush()
  }

  return new Response(JSON.stringify({ locale, sections }, null, 0), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Long cache — index is content-hash-invalidated by build
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

/** Strip markdown/MDX syntax down to search-relevant plain text. Best-effort:
 *  imperfect regexes are fine because search only needs term presence, not
 *  fidelity. */
function stripMarkdown(md: string): string {
  return md
    // Frontmatter shouldn't reach us via entry.body, but guard anyway.
    .replace(/^---\n[\s\S]*?\n---\n?/, '')
    // Fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // Inline code
    .replace(/`([^`\n]+)`/g, '$1')
    // MDX self-closing tags
    .replace(/<[A-Za-z][A-Za-z0-9]*(?:\s+[^>]*)?\/>/g, ' ')
    // MDX paired tags (drop wrapper, keep inner text)
    .replace(/<([A-Za-z][A-Za-z0-9]*)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/g, '$2')
    // HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Imports / exports
    .replace(/^import[^\n]*\n/gm, '')
    .replace(/^export[^\n]*\n/gm, '')
    // Links [text](href) → text
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Images ![alt](url) → alt
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Emphasis / bold
    .replace(/[*_~]{1,3}([^*_~\n]+)[*_~]{1,3}/g, '$1')
    // Blockquotes
    .replace(/^\s*>\s?/gm, '')
    // List markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Table pipes
    .replace(/\|/g, ' ')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()
}
