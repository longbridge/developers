/**
 * openapi-markdown.ts
 * Render openapi.yaml into plain Markdown for AI/LLM consumption — a single
 * source used by the `.md` routes (/docs/api.md, /docs/api/<op>.md) and by
 * llms.txt / llms-full.txt. No JS execution needed by the consumer.
 */
import type { Locale } from '@longbridge/openapi-utils'
import { load } from 'js-yaml'
import { parseSpec, pickLocale, buildResponseExample, type EndpointItem, type WsCommandItem, type XParameter } from './openapi-loader'
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
  // Dedupe by operationId: a multi-tag op appears in more than one group, which
  // would otherwise emit duplicate static paths (a fatal Astro build error).
  const seen = new Set<string>()
  for (const g of groups) {
    // Flat endpoints plus every subsection's endpoints.
    const eps = [...g.endpoints, ...g.subgroups.flatMap((sg) => sg.endpoints)]
    for (const ep of eps) {
      const id = ep.operation.operationId
      if (seen.has(id)) continue
      seen.add(id)
      out.push({
        operationId: id,
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
    const ep = [...g.endpoints, ...g.subgroups.flatMap((sg) => sg.endpoints)].find(
      (e) => e.operation.operationId === operationId
    )
    if (ep) return endpointMarkdown(ep, locale, 1)
  }
  return null
}

// ── WebSocket commands ────────────────────────────────────────────────────────

/** Markdown for a single WebSocket command. `base` is the top heading level. */
export function wsCommandMarkdown(cmd: WsCommandItem, locale: Locale, base = 1): string {
  const h = (n: number) => '#'.repeat(base + n - 1)
  const title = pickLocale(cmd.name, cmd.nameZh, cmd.nameZhHk, locale)
  const desc = pickLocale(cmd.description, cmd.descriptionZh, cmd.descriptionZhHk, locale)
  const dir = cmd.direction === 'push' ? 'push' : 'request'

  let md = `${h(1)} ${title}\n\n\`WS\` \`${dir}${cmd.cmd != null ? ` · cmd ${cmd.cmd}` : ''}\`\n\n`
  if (cmd.quoteCommand) md += quotePermissionMarkdown({ 'x-quote-command': cmd.quoteCommand }, locale)
  if (desc.trim()) md += desc.trim() + '\n\n'
  if (cmd.fields?.length) md += paramTable(cmd.fields, 'Request Parameters', h(2), locale)
  if (cmd.responseFields?.length)
    md += paramTable(cmd.responseFields, cmd.direction === 'push' ? 'Push Fields' : 'Response Fields', h(2), locale)
  if (cmd.responseExample) md += `${h(2)} Response JSON Example\n\n\`\`\`json\n${cmd.responseExample.trim()}\n\`\`\`\n\n`
  return md.trimEnd() + '\n'
}

/** All WS commands (merged into topical subgroups + any standalone ws groups). */
function allWsCommands(rawYaml: string): WsCommandItem[] {
  const { groups, wsGroups } = parseSpec(rawYaml)
  const out: WsCommandItem[] = []
  for (const g of groups) for (const sg of g.subgroups) out.push(...(sg.wsCommands ?? []))
  for (const g of wsGroups) out.push(...g.commands)
  return out
}

/** Flat list of WS commands (for getStaticPaths / indexing). Callers that only
 *  need the id keep working; llms.txt uses name/cmd/direction to label pages. */
export function wsCommandList(
  rawYaml: string
): Array<{ id: string; name: string; cmd?: number; direction: 'request' | 'push' }> {
  return allWsCommands(rawYaml).map((c) => ({ id: c.id, name: c.name, cmd: c.cmd, direction: c.direction }))
}

/** 描述的首段纯文本，去掉 Markdown 标记并截到 160 字符以内，用作 meta description。`:::` 提示块（如账户限制）跳过，没有其他正文时才退回用它。
 *  `prefix`（接口方法和路径）放在最前面、计入 160 字符，截断时保留它，保证和同名文档页的描述不同。 */
function metaDescription(md: string, prefix = ''): string {
  const body = md.replace(/^:::[^\n]*\n[\s\S]*?^:::[ \t]*$/gm, '').trim() || md.replace(/^:::.*$/gm, '').trim()
  const para = body.split(/\n\s*\n/)[0] ?? ''
  const text = para
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const full = prefix ? `${prefix} — ${text}` : text
  return full.length > 160 ? full.slice(0, 159) + '…' : full
}

/** REST 接口写「方法 路径」，WebSocket 写「WebSocket 路径」或「WebSocket cmd N」。 */
function endpointLabel(method: string, path: string): string {
  return `${method.toUpperCase() === 'WEBSOCKET' ? 'WebSocket' : method.toUpperCase()} ${path}`
}

function wsCommandLabel(c: WsCommandItem): string {
  return c.cmd != null ? `WebSocket cmd ${c.cmd}` : 'WebSocket'
}

/** 每个 API 单页（REST 接口与 WS 命令）的本地化标题与描述，给 /docs/api/<id> 静态页用。
 *  API 单页和同一接口的分类文档页（如 /docs/market/top-movers）标题、首段描述相同，搜索引擎会当成重复页只收一份。
 *  这里给标题和描述都带上接口方法和路径（WebSocket 命令带 cmd 编号），和文档页区分开。 */
export function apiPageMeta(rawYaml: string, locale: Locale): Array<{ id: string; title: string; description: string }> {
  const { groups } = parseSpec(rawYaml)
  const out: Array<{ id: string; title: string; description: string }> = []
  const seen = new Set<string>()
  for (const g of groups) {
    for (const ep of [...g.endpoints, ...g.subgroups.flatMap((sg) => sg.endpoints)]) {
      const op = ep.operation
      if (seen.has(op.operationId)) continue
      seen.add(op.operationId)
      const label = endpointLabel(ep.method, ep.path)
      out.push({
        id: op.operationId,
        title: `${pickLocale(op.summary, op['x-summary-zh'], op['x-summary-zh-hk'], locale)} (${label})`,
        description: metaDescription(
          pickLocale(op.description, op['x-description-zh'], op['x-description-zh-hk'], locale),
          label
        ),
      })
    }
  }
  for (const c of allWsCommands(rawYaml)) {
    const label = wsCommandLabel(c)
    out.push({
      id: c.id,
      title: `${pickLocale(c.name, c.nameZh, c.nameZhHk, locale)} (${label})`,
      description: metaDescription(pickLocale(c.description, c.descriptionZh, c.descriptionZhHk, locale), label),
    })
  }
  return out
}

/** Markdown for a single WS command by id (null if not found). */
export function wsCommandMarkdownById(rawYaml: string, id: string, locale: Locale): string | null {
  const cmd = allWsCommands(rawYaml).find((c) => c.id === id)
  return cmd ? wsCommandMarkdown(cmd, locale, 1) : null
}

/** Full reference: intro + every page + every endpoint, grouped by tag. */
export function referenceMarkdown(rawYaml: string, locale: Locale): string {
  const { groups, pages, wsGroups } = parseSpec(rawYaml)
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
    // Flat endpoints (groups without subsections, e.g. Screener) at level 3.
    for (const ep of g.endpoints) md += endpointMarkdown(ep, locale, 3) + '\n'
    // Subsections (docs subgroups): `### Subsection` then endpoints at level 4,
    // followed by any WebSocket commands filed under the same subsection.
    for (const sg of g.subgroups) {
      const sub = pickLocale(sg.name, sg.nameZh, sg.nameZhHk, locale)
      md += `### ${sub}\n\n`
      for (const ep of sg.endpoints) md += endpointMarkdown(ep, locale, 4) + '\n'
      for (const c of sg.wsCommands ?? []) md += wsCommandMarkdown(c, locale, 4) + '\n'
    }
  }

  // Standalone WebSocket protocol groups (commands not merged into a topical
  // subgroup) — usually empty after the merge, rendered here for completeness.
  for (const wg of wsGroups) {
    if (!wg.commands.length) continue
    md += `## ${pickLocale(wg.name, wg.nameZh, wg.nameZhHk, locale)}\n\n`
    for (const c of wg.commands) md += wsCommandMarkdown(c, locale, 3) + '\n'
  }
  return md.trimEnd() + '\n'
}
