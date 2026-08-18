/**
 * openapi-loader.ts
 * Parses openapi.yaml (passed as raw string) into typed structures.
 * Ported 1:1 from ApiReference.vue (chunks A + B).
 */
import { load } from 'js-yaml'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Parameter {
  name: string
  in: string
  required?: boolean
  description?: string
  'x-description-zh'?: string
  schema?: { type?: string }
}

export interface ParamRow {
  name: string
  type: string
  location: string
  required: boolean
  description: string
}

export interface Section {
  key: string
  title: string
  params: ParamRow[]
  fallback?: boolean
}

export interface CodeSample {
  lang: string
  label: string
  source: string
}

export interface Operation {
  operationId: string
  summary: string
  'x-summary-zh'?: string
  description?: string
  'x-description-zh'?: string
  'x-quote-command'?: string
  tags?: string[]
  parameters?: Parameter[]
  'x-codeSamples'?: CodeSample[]
  requestBody?: {
    content?: {
      'application/json'?: {
        schema?: {
          required?: string[]
          properties?: Record<string, { type?: string; description?: string }>
        }
      }
    }
  }
  responses?: Record<
    string,
    {
      description?: string
      content?: {
        'application/json'?: {
          example?: any
          schema?: {
            properties?: Record<string, { type?: string; description?: string }>
          }
        }
      }
    }
  >
}

export interface EndpointItem {
  method: string
  path: string
  operation: Operation
}

export interface PageItem {
  id: string
  title: string
  titleZh?: string
  content: string
  contentZh?: string
  icon?: string
}

export interface TagGroup {
  name: string
  nameZh?: string
  endpoints: EndpointItem[]
}

export interface CodeBlock {
  lang: string
  code: string
  label: string
}

export interface PathSeg {
  text: string
  isParam: boolean
}

export const PAGE_ICONS: Record<string, string> = {
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  'alert-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  book: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`,
}

// ── Spec parsing ──────────────────────────────────────────────────────────────

export function parseSpec(rawYaml: string): { groups: TagGroup[]; pages: PageItem[]; serverUrl: string } {
  const parsed = load(rawYaml) as any
  const serverUrl: string = parsed.servers?.[0]?.url ?? ''
  const methods = ['get', 'post', 'put', 'delete', 'patch']
  const byTag: Record<string, EndpointItem[]> = {}

  for (const [path, pathItem] of Object.entries((parsed.paths ?? {}) as Record<string, any>)) {
    for (const method of methods) {
      const op = pathItem[method] as Operation | undefined
      if (!op) continue
      const tags = op.tags?.length ? op.tags : ['Other']
      for (const tag of tags) {
        if (!byTag[tag]) byTag[tag] = []
        byTag[tag].push({ method: method.toUpperCase(), path, operation: op })
      }
    }
  }

  const specTagObjs: any[] = (parsed.tags ?? []) as any[]
  const tagZhMap: Record<string, string> = {}
  for (const t of specTagObjs) {
    if (t['x-name-zh']) tagZhMap[t.name] = t['x-name-zh']
  }
  const specTags: string[] = specTagObjs.map((x: any) => x.name)
  const ordered = [...specTags, ...Object.keys(byTag).filter((x) => !specTags.includes(x))]

  const rawPages: any[] = (parsed['x-pages'] ?? []) as any[]
  const pages: PageItem[] = rawPages.map((p: any) => ({
    id: p.id,
    title: p.title,
    titleZh: p['x-title-zh'],
    content: p.content ?? '',
    contentZh: p['x-content-zh'],
    icon: p['x-icon'],
  }))

  return {
    groups: ordered.filter((x) => byTag[x]).map((x) => ({ name: x, nameZh: tagZhMap[x], endpoints: byTag[x] })),
    pages,
    serverUrl,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function splitDescriptionAndCode(text: string): { prose: string; codeBlocks: string[] } {
  const codeRe = /^```[\w-]*\n[\s\S]*?^```/gm
  const codeBlocks = [...text.matchAll(codeRe)].map((m) => m[0])
  const withHeadings = /^#{1,3} [^\n]+\n+```[\w-]*\n[\s\S]*?^```/gm
  const prose = text.replace(withHeadings, '').replace(codeRe, '').trim()
  return { prose, codeBlocks }
}

export function parseCodeBlock(raw: string): { lang: string; code: string } {
  const m = raw.match(/^```([\w-]*)\n([\s\S]*?)^```/m)
  return { lang: m?.[1] ?? '', code: m?.[2]?.trimEnd() ?? '' }
}

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function localizeDocLinks(markdown: string, localePrefix: string): string {
  if (!localePrefix) return markdown
  return markdown.replace(/\]\(\/docs\//g, `](${localePrefix}/docs/`)
}

export function formatPath(path: string): PathSeg[] {
  return path
    .split(/(\{[^}]+\})/)
    .filter(Boolean)
    .map((s) => ({ text: s, isParam: s.startsWith('{') }))
}

export function epId(ep: EndpointItem): string {
  return (
    ep.operation.operationId ??
    `${ep.method.toLowerCase()}-${ep.path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}`
  )
}

export function buildCurl(ep: EndpointItem, serverUrl: string): string {
  const lines: string[] = [
    `curl --request ${ep.method} \\`,
    `  --url '${serverUrl}${ep.path}' \\`,
    `  --header 'Authorization: Bearer <token>'`,
  ]
  const schema = ep.operation.requestBody?.content?.['application/json']?.schema
  if (schema?.properties && ['POST', 'PUT', 'PATCH'].includes(ep.method)) {
    const required: string[] = schema.required ?? []
    const body: Record<string, any> = {}
    for (const [k, v] of Object.entries(schema.properties as Record<string, any>)) {
      if (required.includes(k)) {
        body[k] = (v as any).type === 'integer' ? 0 : `<${k}>`
      }
    }
    if (Object.keys(body).length) {
      lines[lines.length - 1] += ' \\'
      lines.push(`  --header 'Content-Type: application/json' \\`)
      lines.push(`  --data '${JSON.stringify(body)}'`)
    }
  }
  return lines.join('\n')
}

export function buildResponseExample(ep: EndpointItem): string | null {
  const resp200 = ep.operation.responses?.['200']?.content?.['application/json']
  if (!resp200) return null
  if (resp200.example !== undefined) {
    return JSON.stringify(resp200.example, null, 2)
  }
  const schema = resp200.schema
  if (schema?.properties) {
    const obj: Record<string, any> = {}
    for (const [k, v] of Object.entries(schema.properties as Record<string, any>)) {
      const vt = (v as any).type
      obj[k] =
        vt === 'integer' || vt === 'number'
          ? 0
          : vt === 'boolean'
            ? false
            : vt === 'array'
              ? []
              : typeof vt === 'undefined'
                ? {}
                : `<${k}>`
    }
    return JSON.stringify(obj, null, 2)
  }
  return null
}
