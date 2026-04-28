<script setup lang="ts">
import { load } from 'js-yaml'
import MarkdownIt from 'markdown-it'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import spec from '../../../../openapi.yaml?raw'

const { t, locale } = useI18n()
const md = new MarkdownIt({
  html: false,
  linkify: true,
  highlight: (str: string, lang: string) => {
    const code = highlightCode(str, lang)
    return `<div class="language-${lang || 'text'}"><pre><code>${code}\n</code></pre></div>`
  },
})
const isZh = computed(() => locale.value.startsWith('zh'))

// Rewrite absolute /docs/ links so zh-CN / zh-HK readers stay in their locale.
// openapi.yaml shares a single Chinese content pool across both zh sites, so
// baked-in locale prefixes would send zh-HK users to zh-CN (or vice versa);
// we inject the prefix at render time based on the active locale instead.
const localePrefix = computed(() => {
  const l = locale.value
  if (l.startsWith('zh-CN') || l === 'zh-Hans') return '/zh-CN'
  if (l.startsWith('zh-HK') || l === 'zh-Hant') return '/zh-HK'
  return ''
})
function localizeDocLinks(markdown: string): string {
  if (!localePrefix.value) return markdown
  return markdown.replace(/\]\(\/docs\//g, `](${localePrefix.value}/docs/`)
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Parameter {
  name: string
  in: string
  required?: boolean
  description?: string
  'x-description-zh'?: string
  schema?: { type?: string }
}

interface ParamRow {
  name: string
  type: string
  location: string
  required: boolean
  description: string
}

interface Section {
  key: string
  title: string
  params: ParamRow[]
  fallback?: boolean
}

interface CodeSample {
  lang: string
  label: string
  source: string
}

interface Operation {
  operationId: string
  summary: string
  'x-summary-zh'?: string
  description?: string
  'x-description-zh'?: string
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

interface EndpointItem {
  method: string
  path: string
  operation: Operation
}

interface PageItem {
  id: string
  title: string
  titleZh?: string
  content: string
  contentZh?: string
  icon?: string
}

const PAGE_ICONS: Record<string, string> = {
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  'alert-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  book: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`,
}
interface TagGroup {
  name: string
  nameZh?: string
  endpoints: EndpointItem[]
}
interface CodeBlock {
  lang: string
  code: string
  label: string
}
interface PathSeg {
  text: string
  isParam: boolean
}

// ── Spec parsing ──────────────────────────────────────────────────────────────

function parseSpec(): { groups: TagGroup[]; pages: PageItem[]; serverUrl: string } {
  const parsed = load(spec) as any
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

function splitDescriptionAndCode(text: string) {
  const codeRe = /^```[\w-]*\n[\s\S]*?^```/gm
  const codeBlocks = [...text.matchAll(codeRe)].map((m) => m[0])
  // Remove "## Heading\n\n```...\n```" so headings don't float without content
  const withHeadings = /^#{1,3} [^\n]+\n+```[\w-]*\n[\s\S]*?^```/gm
  const prose = text.replace(withHeadings, '').replace(codeRe, '').trim()
  return { prose, codeBlocks }
}

function parseCodeBlock(raw: string) {
  const m = raw.match(/^```([\w-]*)\n([\s\S]*?)^```/m)
  return { lang: m?.[1] ?? '', code: m?.[2]?.trimEnd() ?? '' }
}

// ── Syntax highlighting ───────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightCode(code: string, lang: string): string {
  const e = esc(code)
  const l = lang.toLowerCase()

  if (l === 'json') {
    return e
      .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="hl-k">$1</span>$2')
      .replace(/(:[ \t]*)("(?:[^"\\]|\\.)*")/g, '$1<span class="hl-s">$2</span>')
      .replace(/(:[ \t]*)(-?\d+(?:\.\d+)?)/g, '$1<span class="hl-n">$2</span>')
      .replace(/(:[ \t]*)(true|false|null)/g, '$1<span class="hl-b">$2</span>')
  }

  if (['bash', 'shell', 'sh', 'curl'].includes(l)) {
    return e
      .replace(/^(curl|wget)\b/gm, '<span class="hl-cmd">$1</span>')
      .replace(/(--[\w-]+)/g, '<span class="hl-flag">$1</span>')
      .replace(/('[^']*')/g, '<span class="hl-s">$1</span>')
      .replace(/(\\)(\s*$)/gm, '<span class="hl-punct">$1</span>$2')
  }

  if (['typescript', 'javascript', 'ts', 'js'].includes(l)) {
    return e
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="hl-s">$1</span>')
      .replace(
        /\b(const|let|var|function|class|import|export|from|default|if|else|return|async|await|new|true|false|null|undefined)\b/g,
        '<span class="hl-k">$1</span>'
      )
      .replace(/(\/\/[^\n]*)/g, '<span class="hl-comment">$1</span>')
  }

  if (['python', 'py'].includes(l)) {
    return e
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="hl-s">$1</span>')
      .replace(
        /\b(import|from|def|class|if|elif|else|for|while|return|True|False|None|and|or|not|in|print|with|as|try|except)\b/g,
        '<span class="hl-k">$1</span>'
      )
      .replace(/(#[^\n]*)/g, '<span class="hl-comment">$1</span>')
  }

  return e
}

// ── Code generation ───────────────────────────────────────────────────────────

let serverUrl = ''

function buildCurl(ep: EndpointItem): string {
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

function buildResponseExample(ep: EndpointItem): string | null {
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

function formatPath(path: string): PathSeg[] {
  return path
    .split(/(\{[^}]+\})/)
    .filter(Boolean)
    .map((s) => ({ text: s, isParam: s.startsWith('{') }))
}

function epId(ep: EndpointItem): string {
  return (
    ep.operation.operationId ??
    `${ep.method.toLowerCase()}-${ep.path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}`
  )
}

// ── State ─────────────────────────────────────────────────────────────────────

const tagGroups = ref<TagGroup[]>([])
const selectedEndpoint = ref<EndpointItem | null>(null)
const copiedIndex = ref<number | null>(null)
const copiedPath = ref(false)
const searchQuery = ref('')
const pages = ref<PageItem[]>([])
const selectedPage = ref<PageItem | null>(null)

const filteredGroups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return tagGroups.value
  return tagGroups.value
    .map((group) => ({
      ...group,
      endpoints: group.endpoints.filter((ep) => {
        const summary = isZh.value ? (ep.operation['x-summary-zh'] ?? ep.operation.summary) : ep.operation.summary
        return (
          summary.toLowerCase().includes(q) || ep.path.toLowerCase().includes(q) || ep.method.toLowerCase().includes(q)
        )
      }),
    }))
    .filter((group) => group.endpoints.length > 0)
})

function selectEndpoint(ep: EndpointItem) {
  selectedPage.value = null
  selectedEndpoint.value = ep
  history.pushState(null, '', `${location.pathname}?op=${epId(ep)}`)
  window.scrollTo(0, 0)
}

function selectPage(page: PageItem) {
  selectedEndpoint.value = null
  selectedPage.value = page
  history.pushState(null, '', `${location.pathname}?page=${page.id}`)
  window.scrollTo(0, 0)
}

function findEndpointByQuery(): EndpointItem | null {
  const op = new URLSearchParams(location.search).get('op')
  if (!op) return null
  for (const group of tagGroups.value) {
    for (const ep of group.endpoints) {
      if (epId(ep) === op) return ep
    }
  }
  return null
}

function findPageByQuery(): PageItem | null {
  const pageId = new URLSearchParams(location.search).get('page')
  if (!pageId) return null
  return pages.value.find((p) => p.id === pageId) ?? null
}

function onPopState() {
  selectedEndpoint.value = findEndpointByQuery()
  selectedPage.value = findPageByQuery()
}

// ── Computed ──────────────────────────────────────────────────────────────────

const selectedSplit = computed(() => {
  const op = selectedEndpoint.value?.operation
  if (!op) return { prose: '', codeBlocks: [] as string[] }
  const desc = isZh.value && op['x-description-zh'] ? op['x-description-zh'] : op.description
  if (!desc) return { prose: '', codeBlocks: [] as string[] }
  return splitDescriptionAndCode(desc)
})

const selectedSummaryLocalized = computed(() => {
  const op = selectedEndpoint.value?.operation
  if (!op) return ''
  return isZh.value && op['x-summary-zh'] ? op['x-summary-zh'] : op.summary
})

const selectedTagNameLocalized = computed(() => {
  const tag = selectedEndpoint.value?.operation.tags?.[0] ?? ''
  if (!tag || !isZh.value) return tag
  return tagGroups.value.find((g) => g.name === tag)?.nameZh ?? tag
})

const selectedProse = computed(() => {
  const p = selectedSplit.value.prose
  return p ? md.render(p) : ''
})

const selectedCodeBlocks = computed((): CodeBlock[] => {
  const ep = selectedEndpoint.value
  if (!ep) return []
  const blocks: CodeBlock[] = [{ lang: 'bash', code: buildCurl(ep), label: t('api.code.request') }]

  // x-codeSamples from OpenAPI spec (e.g. CLI examples)
  for (const sample of ep.operation['x-codeSamples'] ?? []) {
    blocks.push({ lang: sample.lang, code: sample.source.trimEnd(), label: sample.label })
  }

  // inline code blocks extracted from description
  for (const raw of selectedSplit.value.codeBlocks) {
    const { lang, code } = parseCodeBlock(raw)
    blocks.push({ lang, code, label: lang || 'code' })
  }

  const resp = buildResponseExample(ep)
  if (resp) blocks.push({ lang: 'json', code: resp, label: t('api.code.response') })
  return blocks
})

const selectedPageHtml = computed(() => {
  const page = selectedPage.value
  if (!page) return ''
  const content = isZh.value && page.contentZh ? page.contentZh : page.content
  return content ? md.render(localizeDocLinks(content)) : ''
})

const selectedSections = computed((): Section[] => {
  const ep = selectedEndpoint.value
  if (!ep) return []
  const s: Section[] = []

  s.push({
    key: 'auth',
    title: t('api.section.authorizations'),
    params: [
      {
        name: 'Authorization',
        type: 'string',
        location: 'header',
        required: true,
        description: t('api.authDescription'),
      },
    ],
  })

  function pdesc(p: Parameter): string {
    return isZh.value && p['x-description-zh'] ? p['x-description-zh'] : (p.description ?? '')
  }
  function propdesc(prop: any): string {
    return isZh.value && prop['x-description-zh'] ? prop['x-description-zh'] : (prop.description ?? '')
  }

  const pathParams = (ep.operation.parameters ?? []).filter((p) => p.in === 'path')
  if (pathParams.length) {
    s.push({
      key: 'path',
      title: t('api.section.pathParams'),
      params: pathParams.map((p) => ({
        name: p.name,
        type: p.schema?.type ?? 'string',
        location: 'path',
        required: p.required !== false,
        description: pdesc(p),
      })),
    })
  }

  const queryParams = (ep.operation.parameters ?? []).filter((p) => p.in === 'query')
  if (queryParams.length) {
    s.push({
      key: 'query',
      title: t('api.section.queryParams'),
      params: queryParams.map((p) => ({
        name: p.name,
        type: p.schema?.type ?? 'string',
        location: 'query',
        required: p.required === true,
        description: pdesc(p),
      })),
    })
  }

  const rb = ep.operation.requestBody
  if (rb) {
    const schema = rb.content?.['application/json']?.schema
    if (schema?.properties) {
      s.push({
        key: 'body',
        title: t('api.section.body'),
        params: Object.entries(schema.properties).map(([name, prop]: [string, any]) => ({
          name,
          type: prop.type ?? 'object',
          location: 'body',
          required: (schema.required ?? []).includes(name),
          description: propdesc(prop),
        })),
      })
    } else {
      s.push({ key: 'body', title: t('api.section.body'), params: [], fallback: true })
    }
  }

  const resp200 = ep.operation.responses?.['200']
  if (resp200?.content?.['application/json']?.schema?.properties) {
    s.push({
      key: 'response',
      title: t('api.section.response'),
      params: Object.entries(resp200.content['application/json']!.schema!.properties!).map(
        ([name, prop]: [string, any]) => ({
          name,
          type: prop.type ?? 'object',
          location: '',
          required: false,
          description: propdesc(prop),
        })
      ),
    })
  }

  return s
})

async function copyCode(code: string, index: number) {
  await navigator.clipboard.writeText(code).catch(() => {})
  copiedIndex.value = index
  setTimeout(() => {
    copiedIndex.value = null
  }, 1500)
}

async function copyPath(ep: EndpointItem) {
  await navigator.clipboard.writeText(`${ep.method.toUpperCase()} ${ep.path}`).catch(() => {})
  copiedPath.value = true
  setTimeout(() => {
    copiedPath.value = false
  }, 1500)
}

function methodClass(m: string) {
  return `method-${m.toLowerCase()}`
}

onMounted(() => {
  const result = parseSpec()
  tagGroups.value = result.groups
  pages.value = result.pages
  serverUrl = result.serverUrl

  selectedEndpoint.value = findEndpointByQuery()
  selectedPage.value = findPageByQuery()
  window.addEventListener('popstate', onPopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', onPopState)
})
</script>

<template>
  <div class="api-reference-page">
    <!-- Sidebar -->
    <aside class="api-sidebar">
      <div class="sidebar-search">
        <input v-model="searchQuery" class="search-input" type="text" :placeholder="$t('api.search')" />
      </div>
      <div class="sidebar-scroll">
        <div v-if="pages.length" class="page-group">
          <button
            v-for="page in pages"
            :key="page.id"
            class="nav-item nav-item-page"
            :class="{ active: selectedPage?.id === page.id }"
            @click="selectPage(page)">
            <span v-if="page.icon && PAGE_ICONS[page.icon]" class="nav-page-icon" v-html="PAGE_ICONS[page.icon]" />
            <span class="nav-label">{{ isZh ? page.titleZh || page.title : page.title }}</span>
          </button>
        </div>
        <div v-for="group in filteredGroups" :key="group.name" class="tag-group">
          <div class="tag-label">{{ isZh ? group.nameZh || group.name : group.name }}</div>
          <button
            v-for="ep in group.endpoints"
            :key="ep.operation.operationId ?? `${ep.method}-${ep.path}`"
            class="nav-item"
            :class="{ active: selectedEndpoint?.operation.operationId === ep.operation.operationId }"
            @click="selectEndpoint(ep)">
            <span class="nav-method" :class="methodClass(ep.method)">{{ ep.method }}</span>
            <span class="nav-label">{{
              isZh ? ep.operation['x-summary-zh'] || ep.operation.summary : ep.operation.summary
            }}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Intro (no endpoint selected) -->
    <div v-if="!selectedEndpoint && !selectedPage" class="api-intro">
      <div class="intro-content">
        <h1 class="intro-title">{{ $t('api.intro.title') }}</h1>
        <p class="intro-desc">{{ $t('api.intro.desc') }}</p>

        <div class="intro-card intro-card-http">
          <div class="intro-card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 class="intro-card-title">{{ $t('api.intro.httpTitle') }}</h3>
            <p class="intro-card-desc">{{ $t('api.intro.httpDesc') }}</p>
          </div>
        </div>

        <div class="intro-card intro-card-ws">
          <div class="intro-card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
          <div>
            <h3 class="intro-card-title">{{ $t('api.intro.wsTitle') }}</h3>
            <p class="intro-card-desc">{{ $t('api.intro.wsDesc') }}</p>
          </div>
        </div>

        <p class="intro-hint">← {{ $t('api.intro.hint') }}</p>
      </div>
    </div>

    <!-- Page content (info page selected) -->
    <div v-if="selectedPage && !selectedEndpoint" class="api-main">
      <div class="api-content api-page-content">
        <div class="vp-doc">
          <h1>{{ isZh ? selectedPage.titleZh || selectedPage.title : selectedPage.title }}</h1>
          <div v-html="selectedPageHtml" />
        </div>
      </div>
    </div>

    <!-- Main -->
    <div v-if="selectedEndpoint" class="api-main">
      <!-- Content -->
      <div class="api-content">
        <p class="ep-tag">{{ selectedTagNameLocalized }}</p>
        <h1 class="ep-title">{{ selectedSummaryLocalized }}</h1>

        <div class="ep-path">
          <span class="ep-method-badge" :class="methodClass(selectedEndpoint.method)">
            {{ selectedEndpoint.method }}
          </span>
          <code class="ep-path-text">
            <template v-for="seg in formatPath(selectedEndpoint.path)" :key="seg.text">
              <span v-if="seg.isParam" class="path-param">{{ seg.text }}</span>
              <span v-else>{{ seg.text }}</span>
            </template>
          </code>
          <button class="path-copy-btn" @click="copyPath(selectedEndpoint)" :title="$t('api.copy')">
            <svg
              v-if="!copiedPath"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
        </div>

        <div v-if="selectedProse" class="prose vp-doc" v-html="selectedProse" />

        <section v-for="section in selectedSections" :key="section.key" class="api-section">
          <h4 class="section-title">{{ section.title }}</h4>
          <p v-if="section.fallback" class="fallback-note">{{ $t('api.bodyFallback') }}</p>
          <div v-else class="param-list">
            <div v-for="param in section.params" :key="param.name" class="param-row">
              <div class="param-head">
                <span class="param-name">{{ param.name }}</span>
                <span class="param-meta">{{ param.type }}</span>
                <span v-if="param.location" class="param-meta">{{ param.location }}</span>
                <span
                  v-if="section.key !== 'response'"
                  class="param-badge uppercase"
                  :class="param.required ? 'is-required' : 'is-optional'"
                  >{{ param.required ? $t('api.param.required') : $t('api.param.optional') }}</span
                >
              </div>
              <div v-if="param.description" class="param-desc vp-doc" v-html="md.render(param.description)" />
            </div>
          </div>
        </section>
      </div>

      <!-- Code panel -->
      <div class="code-panel">
        <div v-for="(block, i) in selectedCodeBlocks" :key="i" class="code-card">
          <div class="card-header">
            <span class="card-label">{{ block.label }}</span>
            <button class="copy-btn" @click="copyCode(block.code, i)" :title="$t('api.copy')">
              <svg
                v-if="copiedIndex !== i"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </button>
          </div>
          <div class="card-body">
            <pre class="code-pre"><code v-html="highlightCode(block.code, block.lang)" /></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* ── Layout ────────────────────────────────────────────────────────────────── */
.api-reference-page {
  display: flex;
  align-items: flex-start;
  margin-top: var(--vp-nav-height);
  font-size: 14px;
  background: var(--vp-c-bg);
  max-width: var(--vp-layout-max-width, 1440px);
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* ── Sidebar ───────────────────────────────────────────────────────────────── */
.api-sidebar {
  position: sticky;
  top: var(--vp-nav-height);
  flex-shrink: 0;
  width: 300px;
  height: calc(100vh - var(--vp-nav-height));
  border-right: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-search {
  margin-top: 24px;
  padding: 12px 18px;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
  font-family: var(--vp-font-family-base);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px 24px;
}

.tag-group {
  margin-bottom: 18px;
}

.tag-label {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--vp-c-text-3);
  padding: 0 10px;
  margin-bottom: 3px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  padding: 5px 10px;
  margin-bottom: 1px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.4;
  transition:
    background 0.1s,
    color 0.1s;
}

.nav-item:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.nav-item.active {
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  color: var(--vp-c-brand-1);
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.page-group {
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 8px;
  padding-bottom: 4px;
}

.nav-page-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0.6;
}

.api-page-content {
  max-width: 752px;
  font-size: 16px;
}

/* ── Method badges ─────────────────────────────────────────────────────────── */
.nav-method {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  padding: 1px 0;
  width: 45px;
  border-radius: 3px;
  flex-shrink: 0;
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.03em;
}

.ep-method-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  line-height: 1.2;
  border-radius: 6px;
  flex-shrink: 0;
  font-family: var(--vp-font-family-mono);
}

.method-get {
  color: var(--vp-c-success-1);
  background: var(--vp-c-success-soft);
}
.method-post {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.method-put {
  color: var(--vp-c-warning-1);
  background: var(--vp-c-warning-soft);
}
.method-delete {
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
}
.method-patch {
  color: var(--vp-c-important-1);
  background: var(--vp-c-important-soft);
}

/* ── Main area ─────────────────────────────────────────────────────────────── */
.api-main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  min-width: 0;
}

/* ── Content area ──────────────────────────────────────────────────────────── */
.api-content {
  flex: 1;
  min-width: 0;
  padding: 36px 44px 64px;
}

.ep-tag {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  margin: 0 0 8px;
}

.ep-title {
  font-size: 30px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
  line-height: 36px;
  letter-spacing: -0.75px;
  border: none;
  padding: 0;
}

.ep-path {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;
}

.ep-path-text {
  font-size: 13px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  background: transparent;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.path-param {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.prose {
  font-size: 15px;
  color: var(--vp-c-text-1);
  line-height: 1.7;
  margin-bottom: 32px;
}

/* ── Sections ──────────────────────────────────────────────────────────────── */
.api-section {
  margin-top: 36px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  border-top: none;
  letter-spacing: -0.1px;
}

.fallback-note {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 14px 0 0;
}

/* ── Param rows ────────────────────────────────────────────────────────────── */
.param-list {
  margin-top: 0;
}

.param-row {
  padding: 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.param-row:last-child {
  border-bottom: none;
}

.param-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.param-name {
  font-weight: 600;
  font-size: 13.5px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
}

.param-meta {
  font-size: 12px;
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.param-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  padding: 1px 8px;
  border-radius: 20px;
  line-height: 1.6;
}

.is-required {
  background: color-mix(in srgb, var(--vp-c-danger-1) 12%, transparent);
  color: var(--vp-c-danger-1);
}

.is-optional {
  color: var(--vp-c-text-3);
}

.param-desc {
  font-size: 13px;
  color: var(--vp-c-text-1);
  line-height: 1.65;
  margin: 0;
  font-family: var(--vp-font-family-base);
}
.param-desc p,
.param-desc ul,
.param-desc ol,
.param-desc table {
  margin: 0 0 8px 0;
  line-height: 1.65;
}

/* ── Code panel ────────────────────────────────────────────────────────────── */
.code-panel {
  flex: 1;
  min-width: 320px;
  padding: 36px 20px 64px;
}

.code-card {
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, var(--vp-c-bg-mute));
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 14px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-divider) 60%, transparent);
  padding: 2px 8px;

  .copy-btn {
    svg {
      width: 10px;
      height: 10px;
    }
  }
}

.card-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition:
    background 0.12s,
    color 0.12s;
}

.copy-btn:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.path-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition:
    background 0.12s,
    color 0.12s;
}

.path-copy-btn:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.card-body {
  background: var(--vp-c-bg);
  border-radius: 14px;
  overflow: hidden;
}

.code-pre {
  margin: 0;
  padding: 8px;
  font-size: 12.5px;
  line-height: 1.65;
  overflow-x: auto;
  white-space: pre;
  font-family: var(--vp-font-family-mono);
  color: rgb(36, 41, 47);
}

.dark .code-pre {
  color: rgb(201, 209, 217);
}

.code-pre code {
  font-family: inherit;
  font-size: inherit;
  background: transparent;
  color: inherit;
  padding: 0;
}

/* ── Syntax highlighting ───────────────────────────────────────────────────── */
.hl-k {
  color: #0550ae;
}
.hl-s {
  color: #0a3069;
}
.hl-n {
  color: #0550ae;
}
.hl-b {
  color: #8250df;
}
.hl-cmd {
  color: #953800;
  font-weight: 600;
}
.hl-flag {
  color: #0550ae;
}
.hl-punct {
  color: #cf222e;
}
.hl-comment {
  color: #6e7781;
  font-style: italic;
}

.dark .hl-k {
  color: #79c0ff;
}
.dark .hl-s {
  color: #a5d6ff;
}
.dark .hl-n {
  color: #79c0ff;
}
.dark .hl-b {
  color: #d2a8ff;
}
.dark .hl-cmd {
  color: #ffa657;
}
.dark .hl-flag {
  color: #79c0ff;
}
.dark .hl-punct {
  color: #ff7b72;
}
.dark .hl-comment {
  color: #8b949e;
}

/* ── Intro page ────────────────────────────────────────────────────────────── */
.api-intro {
  flex: 1;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 64px 44px;
}

.intro-content {
  max-width: 560px;
  width: 100%;
}

.intro-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 16px;
  letter-spacing: -0.75px;
  border: none;
  padding: 0;
  line-height: 1.2;
}

.intro-desc {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 32px;
}

.intro-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 14px;
}

.intro-card-http {
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, var(--vp-c-bg-soft));
}

.intro-card-ws {
  background: color-mix(in srgb, var(--vp-c-success-1) 5%, var(--vp-c-bg-soft));
}

.intro-card-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.intro-card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 6px;
  padding: 0;
  border: none;
}

.intro-card-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

.intro-hint {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 24px 0 0;
}
</style>
