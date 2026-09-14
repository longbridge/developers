/**
 * openapi-markdown.ts
 * Render openapi.yaml into plain Markdown for AI/LLM consumption — a single
 * source used by the `.md` routes (/docs/api.md, /docs/api/<op>.md) and by
 * llms.txt / llms-full.txt. No JS execution needed by the consumer.
 */
import type { Locale } from '@longbridge/openapi-utils'
import { load } from 'js-yaml'
import { parseSpec, pickLocale, buildResponseExample, type EndpointItem, type XParameter } from './openapi-loader'
import rawQuotePermissions from '../../../quote-permissions.yaml?raw'

// ── Quote-permission callout (mirrors the <QuotePermission> MDX component) ─────

interface QPLocaleString {
  en?: string
  'zh-CN'?: string
  'zh-HK'?: string
}
interface QPData {
  ui: { permission_title: QPLocaleString; separate_note: QPLocaleString; market_labels?: Record<string, QPLocaleString> }
  levels: Record<string, { label: QPLocaleString; description: QPLocaleString }>
  commands?: Record<string, { level: string; market?: string; description?: QPLocaleString }>
}
let _qp: QPData | null = null
const qpData = (): QPData => (_qp ??= load(rawQuotePermissions) as QPData)

const qpLocaleKey = (locale: Locale): keyof QPLocaleString =>
  locale === 'zh-CN' ? 'zh-CN' : locale === 'zh-HK' ? 'zh-HK' : 'en'
const qpStr = (s: QPLocaleString | undefined, locale: Locale): string =>
  (s ? (s[qpLocaleKey(locale)] ?? s.en ?? '') : '')

/**
 * Render an operation's quote-permission requirement as a Markdown blockquote,
 * resolving `x-quote-command` / `x-quote-level` / `x-quote-market` against
 * quote-permissions.yaml. Returns '' when the operation has no permission marker.
 */
function quotePermissionMarkdown(
  op: { 'x-quote-command'?: string; 'x-quote-level'?: string; 'x-quote-market'?: string },
  locale: Locale
): string {
  const command = op['x-quote-command']
  if (!command && !op['x-quote-level'] && !op['x-quote-market']) return ''
  const qp = qpData()
  const cmd = command ? qp.commands?.[command] : undefined
  const level = cmd?.level ?? op['x-quote-level'] ?? 'basic'
  const levelDef = qp.levels?.[level]
  if (!levelDef) return ''
  const market = op['x-quote-market'] ?? cmd?.market
  const title = qpStr(qp.ui?.permission_title, locale)
  const badge = qpStr(levelDef.label, locale)
  const marketLabel = market ? qpStr(qp.ui?.market_labels?.[market], locale) || market : ''
  const desc = qpStr(cmd?.description ?? levelDef.description, locale)
  const note = qpStr(qp.ui?.separate_note, locale)

  const head = [title, marketLabel, badge].filter(Boolean).join(' · ')
  const lines = [`> **${head}**`]
  for (const l of desc.split('\n').map((s) => s.trim()).filter(Boolean)) lines.push(`> ${l}`)
  if (note) lines.push(`> _${note}_`)
  return lines.join('\n') + '\n\n'
}

const loc = (
  p: { description?: string; 'x-description-zh'?: string; 'x-description-zh-hk'?: string },
  locale: Locale
) => pickLocale(p.description, p['x-description-zh'], p['x-description-zh-hk'], locale).replace(/\s*\n\s*/g, ' ').trim()

function paramTable(rows: XParameter[], heading: string, hLevel: string, locale: Locale): string {
  if (!rows.length) return ''
  let s = `${hLevel} ${heading}\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n`
  for (const p of rows) {
    s += `| \`${p.name}\` | ${p.type ?? 'string'} | ${p.required ? 'Yes' : 'No'} | ${loc(p, locale)} |\n`
  }
  return s + '\n'
}

/** Markdown for a single endpoint. `base` is the top heading level (1 = `#`). */
export function endpointMarkdown(ep: EndpointItem, locale: Locale, base = 1): string {
  const op = ep.operation
  const h = (n: number) => '#'.repeat(base + n - 1)
  const title = pickLocale(op.summary, op['x-summary-zh'], op['x-summary-zh-hk'], locale)
  const desc = pickLocale(op.description, op['x-description-zh'], op['x-description-zh-hk'], locale)

  let md = `${h(1)} ${title}\n\n\`${ep.method}\` \`${ep.path}\`\n\n`
  md += quotePermissionMarkdown(op, locale)
  if (desc.trim()) md += desc.trim() + '\n\n'

  const xp = op['x-parameters'] ?? []
  const path = xp.filter((p) => p.in === 'path')
  const query = xp.filter((p) => p.in === 'query')
  const body = xp.filter((p) => p.in === 'body')
  if (path.length || query.length || body.length) {
    md += `${h(2)} Parameters\n\n`
    md += paramTable(path, 'Path Parameters', h(3), locale)
    md += paramTable(query, 'Query Parameters', h(3), locale)
    md += paramTable(body, 'Request Body', h(3), locale)
  }

  const curl =
    op['x-request-examples']?.find((s) => s.label === 'cURL')?.source ??
    op['x-codeSamples']?.find((s) => s.label === 'cURL')?.source
  if (curl) md += `${h(2)} Request Example\n\n\`\`\`bash\n${curl.trimEnd()}\n\`\`\`\n\n`

  const rp = op['x-response-properties'] ?? []
  const respEx = buildResponseExample(ep)
  if (rp.length || respEx) {
    md += `${h(2)} Response\n\n`
    if (rp.length) md += paramTable(rp, 'Response Properties', h(3), locale)
    if (respEx) md += `${h(3)} Response JSON Example\n\n\`\`\`json\n${respEx}\n\`\`\`\n\n`
  }
  return md.trimEnd() + '\n'
}

/** Flat list of endpoints (for getStaticPaths / indexing). */
export function endpointList(
  rawYaml: string
): Array<{ operationId: string; method: string; path: string; tag: string; summary: string }> {
  const { groups } = parseSpec(rawYaml)
  const out: Array<{ operationId: string; method: string; path: string; tag: string; summary: string }> = []
  for (const g of groups) {
    for (const ep of g.endpoints) {
      out.push({
        operationId: ep.operation.operationId,
        method: ep.method,
        path: ep.path,
        tag: g.name,
        summary: ep.operation.summary,
      })
    }
  }
  return out
}

/** Markdown for a single endpoint by operationId (null if not found). */
export function endpointMarkdownById(rawYaml: string, operationId: string, locale: Locale): string | null {
  const { groups } = parseSpec(rawYaml)
  for (const g of groups) {
    const ep = g.endpoints.find((e) => e.operation.operationId === operationId)
    if (ep) return endpointMarkdown(ep, locale, 1)
  }
  return null
}

/** Full reference: intro + every page + every endpoint, grouped by tag. */
export function referenceMarkdown(rawYaml: string, locale: Locale): string {
  const { groups, pages } = parseSpec(rawYaml)
  let md = `# Longbridge OpenAPI Reference\n\nMachine-readable reference for all REST and WebSocket endpoints.\n\n`

  for (const pg of pages) {
    const title = pickLocale(pg.title, pg.titleZh, pg.titleZhHk, locale)
    const content = pickLocale(pg.content, pg.contentZh, pg.contentZhHk, locale).replace('[[SIGNING_TABS]]', '')
    // Drop a leading heading in the page body that repeats the page title, so
    // the title is not rendered twice (e.g. an "Error Codes" page whose content
    // also opens with `## Error Codes`).
    const body = content
      .trim()
      .replace(/^#{1,6}[ \t]+(.+?)[ \t]*\n+/, (m, h) => (h.trim() === title.trim() ? '' : m))
    md += `## ${title}\n\n${body}\n\n`
  }

  for (const g of groups) {
    const tag = pickLocale(g.name, g.nameZh, g.nameZhHk, locale)
    md += `## ${tag}\n\n`
    for (const ep of g.endpoints) md += endpointMarkdown(ep, locale, 3) + '\n'
  }
  return md.trimEnd() + '\n'
}
