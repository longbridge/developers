# API Reference（Reference）扩充 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `longbridge/developers` 站点新增 "Reference" 导航，扩充 `openapi.yaml` 覆盖 Rust SDK 的全部 HTTP + WebSocket 接口，并小幅增强现有 `/docs/api` 渲染器以支持 WebSocket 接口与 zh-CN/zh-HK 三语。

**Architecture:** 复用现有 `@longbridge/openapi-api-reference` 渲染器（解析根目录 `openapi.yaml`）。渲染器改动集中在 `packages/api-reference/src/openapi-loader.ts`（纯函数，vitest 可测）与 `ApiReference.tsx`（React 组件，靠 dev/build 验证）。接口内容以 `openapi/rust/src` 为准手写进 `openapi.yaml`，tags 镜像 `docs` 目录。

**Tech Stack:** Astro + React（renderer）、`openapi.yaml`（OpenAPI 3.0.3 + 自定义 `x-*` 扩展）、`bun`、`vitest`、`oxlint`、`js-yaml`、`markdown-it`。

## Global Constraints

- 所有命令在 `developers` 仓库根运行：`/Users/hogan/work/longbridge/developers`。包管理器 **bun**。
- 测试：`bun run test`（= `vitest run`）；单文件：`bunx vitest run <file>`。Lint：`bun run lint`（oxlint）。renderer 代码格式：`bun run lint:docs`（prettier）。
- **接口 single source of truth 是 `/Users/hogan/work/longbridge/openapi/rust/src`**。字段名/类型/必填以 Rust 结构体为准。
- `index.d.ts`/自动生成物不手改；`openapi.yaml` 必须能被 `js-yaml` 的 `load()` 解析。
- i18n 字段命名固定：`x-summary-zh`/`x-summary-zh-hk`、`x-description-zh`/`x-description-zh-hk`、tag `x-name-zh`/`x-name-zh-hk`、page `x-title-zh`/`x-title-zh-hk` 与 `x-content-zh`/`x-content-zh-hk`。回退链：`zh-HK → -zh-hk ?? -zh ?? en`；`zh-CN → -zh ?? en`；`en → en`。
- 既有 `-zh` 字段一律视为 **zh-CN（简体）**，不改。
- WebSocket 接口在 yaml 里用合成 path + `websocket:` 操作键；`method` 归一化为 `WEBSOCKET`，复用已存在的 `.method-websocket` 徽章。
- 现有 40 个操作与深链 `?op=<operationId>` 必须不回归。
- 每完成一个任务提交一次；提交信息用中文或英文均可，**不加任何 Co-Authored-By/Claude 署名**。

---

## File Structure

**新建：**
- `packages/api-reference/src/openapi-loader.test.ts` — loader 单测（三语解析 + WS 解析）。
- `packages/api-reference/src/openapi-yaml.test.ts` — `openapi.yaml` 内容不变量校验（内容任务的 TDD 靶子）。
- `docs/superpowers/plans/api-reference-endpoint-inventory.md` — 接口清单与 tag/rust 源映射（本计划附录同内容，落盘方便执行时勾选）。

**修改：**
- `src/data/nav.en.ts`、`src/data/nav.zh-CN.ts`、`src/data/nav.zh-HK.ts` — 新增 Reference 导航项。
- `packages/api-reference/src/openapi-loader.ts` — 类型加 `-zh-hk` 字段、`pickLocale` 纯函数、`methods` 加 `websocket`、`TagGroup.nameZhHk`、`PageItem.titleZhHk/contentZhHk`。
- `packages/api-reference/src/ApiReference.tsx` — 用 `pickLocale` 替换二元 `isZh`、WS 详情跳过 curl、description 完整渲染（含代码块）。
- `openapi.yaml` — 主要工作量：补 tags、补全部接口、三语字段、代码样例。

---

## Task 1: 新增 "Reference" 导航项

**Files:**
- Modify: `src/data/nav.en.ts`
- Modify: `src/data/nav.zh-CN.ts`
- Modify: `src/data/nav.zh-HK.ts`

**Interfaces:**
- Consumes: 无。
- Produces: 导航出现 Reference → `/docs/api`（三语），activeMatch `^(/en|/zh-CN|/zh-HK)?/docs/api`。

- [ ] **Step 1: 读取三份 nav 文件确认结构**

Run: `cat src/data/nav.en.ts src/data/nav.zh-CN.ts src/data/nav.zh-HK.ts`
Expected: 各文件导出 `nav: NavItem[]`，含 `{ text: 'Docs', link: '/docs', ... }`。

- [ ] **Step 2: 在 `nav.en.ts` 的 Docs 项之后插入 Reference**

在 `nav.en.ts` 数组中 `Docs` 项之后加：

```ts
  { text: 'Reference', link: '/docs/api', activeMatch: '^(/en)?/docs/api' },
```

- [ ] **Step 3: 在 `nav.zh-CN.ts` 同位置插入**

```ts
  { text: 'API 文档', link: '/docs/api', activeMatch: '^(/zh-CN)?/docs/api' },
```

- [ ] **Step 4: 在 `nav.zh-HK.ts` 同位置插入**

```ts
  { text: 'API 文檔', link: '/docs/api', activeMatch: '^(/zh-HK)?/docs/api' },
```

- [ ] **Step 5: Lint 通过**

Run: `bun run lint`
Expected: 无新增错误。

- [ ] **Step 6: dev 目检导航**

Run: `bun run dev`（后台启动），浏览 `/docs`、`/zh-CN/docs`、`/zh-HK/docs`
Expected: 顶部导航 Docs 之后出现 Reference / API 文档 / API 文檔，点击进入 `/docs/api` 且 Reference 高亮、Docs 不高亮。

- [ ] **Step 7: Commit**

```bash
git add src/data/nav.en.ts src/data/nav.zh-CN.ts src/data/nav.zh-HK.ts
git commit -m "feat(nav): add Reference nav item linking to /docs/api"
```

---

## Task 2: loader 支持 zh-CN/zh-HK 三语（`pickLocale`）

**Files:**
- Modify: `packages/api-reference/src/openapi-loader.ts`
- Test: `packages/api-reference/src/openapi-loader.test.ts`

**Interfaces:**
- Consumes: `Locale` from `@longbridge/openapi-utils`（`'en' | 'zh-CN' | 'zh-HK'`）。
- Produces:
  - `pickLocale(en: string | undefined, zh: string | undefined, zhHk: string | undefined, locale: Locale): string` — 按回退链取值。
  - `Parameter`/`Operation` 增加 `x-description-zh-hk`/`x-summary-zh-hk`/`x-description-zh-hk` 字段；`PageItem` 增加 `titleZhHk?`/`contentZhHk?`；`TagGroup` 增加 `nameZhHk?`。
  - `parseSpec` 填充 `nameZhHk`（tag `x-name-zh-hk`）、`titleZhHk`（page `x-title-zh-hk`）、`contentZhHk`（page `x-content-zh-hk`）。

- [ ] **Step 1: 写失败测试**

在 `packages/api-reference/src/openapi-loader.test.ts` 新建：

```ts
import { describe, it, expect } from 'vitest'
import { pickLocale, parseSpec } from './openapi-loader'

describe('pickLocale', () => {
  it('en returns english', () => {
    expect(pickLocale('E', 'C', 'H', 'en')).toBe('E')
  })
  it('zh-CN returns simplified, falls back to en', () => {
    expect(pickLocale('E', 'C', 'H', 'zh-CN')).toBe('C')
    expect(pickLocale('E', undefined, 'H', 'zh-CN')).toBe('E')
  })
  it('zh-HK prefers traditional, falls back to simplified then en', () => {
    expect(pickLocale('E', 'C', 'H', 'zh-HK')).toBe('H')
    expect(pickLocale('E', 'C', undefined, 'zh-HK')).toBe('C')
    expect(pickLocale('E', undefined, undefined, 'zh-HK')).toBe('E')
  })
})

describe('parseSpec zh-HK tag/page fields', () => {
  const yaml = `
openapi: 3.0.3
info: { title: t, version: '1' }
tags:
  - name: Quote
    x-name-zh: 行情
    x-name-zh-hk: 行情（繁）
x-pages:
  - id: intro
    title: Intro
    x-title-zh: 介绍
    x-title-zh-hk: 介紹
    content: hi
    x-content-zh: 你好
    x-content-zh-hk: 你好（繁）
paths:
  /v1/x:
    get:
      operationId: get_x
      summary: Get X
      tags: [Quote]
`
  it('exposes nameZhHk on groups', () => {
    const { groups } = parseSpec(yaml)
    expect(groups.find((g) => g.name === 'Quote')?.nameZhHk).toBe('行情（繁）')
  })
  it('exposes titleZhHk / contentZhHk on pages', () => {
    const { pages } = parseSpec(yaml)
    expect(pages[0].titleZhHk).toBe('介紹')
    expect(pages[0].contentZhHk).toBe('你好（繁）')
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `bunx vitest run packages/api-reference/src/openapi-loader.test.ts`
Expected: FAIL（`pickLocale` 未导出 / `nameZhHk` undefined）。

- [ ] **Step 3: 实现**

在 `openapi-loader.ts`：

1) 顶部加 import：
```ts
import type { Locale } from '@longbridge/openapi-utils'
```

2) `Parameter` 接口加字段：
```ts
  'x-description-zh-hk'?: string
```
`Operation` 接口加字段：
```ts
  'x-summary-zh-hk'?: string
  'x-description-zh-hk'?: string
```
`PageItem` 接口加字段：
```ts
  titleZhHk?: string
  contentZhHk?: string
```
`TagGroup` 接口加字段：
```ts
  nameZhHk?: string
```

3) 新增导出纯函数（放在 Helpers 区）：
```ts
export function pickLocale(
  en: string | undefined,
  zh: string | undefined,
  zhHk: string | undefined,
  locale: Locale,
): string {
  if (locale === 'zh-HK') return zhHk ?? zh ?? en ?? ''
  if (locale === 'zh-CN') return zh ?? en ?? ''
  return en ?? ''
}
```

4) `parseSpec` 中 tag 处理：新增 zh-hk map 并写入 group。改：
```ts
  const tagZhMap: Record<string, string> = {}
  const tagZhHkMap: Record<string, string> = {}
  for (const t of specTagObjs) {
    if (t['x-name-zh']) tagZhMap[t.name] = t['x-name-zh']
    if (t['x-name-zh-hk']) tagZhHkMap[t.name] = t['x-name-zh-hk']
  }
```
`pages` map 加字段：
```ts
    titleZhHk: p['x-title-zh-hk'],
    contentZhHk: p['x-content-zh-hk'],
```
返回的 groups map 加 `nameZhHk`：
```ts
    groups: ordered
      .filter((x) => byTag[x])
      .map((x) => ({ name: x, nameZh: tagZhMap[x], nameZhHk: tagZhHkMap[x], endpoints: byTag[x] })),
```

- [ ] **Step 4: 运行确认通过**

Run: `bunx vitest run packages/api-reference/src/openapi-loader.test.ts`
Expected: PASS。

- [ ] **Step 5: 全量测试不回归**

Run: `bun run test`
Expected: 全部 PASS。

- [ ] **Step 6: Commit**

```bash
git add packages/api-reference/src/openapi-loader.ts packages/api-reference/src/openapi-loader.test.ts
git commit -m "feat(api-reference): add pickLocale and zh-HK fields to loader"
```

---

## Task 3: loader 解析 WebSocket 接口

**Files:**
- Modify: `packages/api-reference/src/openapi-loader.ts`
- Test: `packages/api-reference/src/openapi-loader.test.ts`

**Interfaces:**
- Consumes: Task 2 的 loader 类型。
- Produces: `parseSpec` 把 path 下的 `websocket:` 操作解析为 `EndpointItem{ method: 'WEBSOCKET' }`，参与 tag 分组。

- [ ] **Step 1: 写失败测试（追加到 openapi-loader.test.ts）**

```ts
describe('parseSpec websocket', () => {
  const yaml = `
openapi: 3.0.3
info: { title: t, version: '1' }
tags:
  - name: Realtime (WebSocket)
paths:
  quote/subscribe:
    websocket:
      operationId: quote_subscribe
      summary: Subscribe Quote
      tags: [Realtime (WebSocket)]
`
  it('parses websocket op with WEBSOCKET method', () => {
    const { groups } = parseSpec(yaml)
    const g = groups.find((x) => x.name === 'Realtime (WebSocket)')
    expect(g?.endpoints[0].method).toBe('WEBSOCKET')
    expect(g?.endpoints[0].operation.operationId).toBe('quote_subscribe')
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `bunx vitest run packages/api-reference/src/openapi-loader.test.ts`
Expected: FAIL（找不到 group / endpoints 为空）。

- [ ] **Step 3: 实现**

`openapi-loader.ts` 的 `parseSpec` 中把方法数组加上 `websocket`：
```ts
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'websocket']
```
（`method.toUpperCase()` 自动得到 `WEBSOCKET`，无需额外分支。）

- [ ] **Step 4: 运行确认通过**

Run: `bunx vitest run packages/api-reference/src/openapi-loader.test.ts`
Expected: PASS。

- [ ] **Step 5: 全量测试**

Run: `bun run test`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add packages/api-reference/src/openapi-loader.ts packages/api-reference/src/openapi-loader.test.ts
git commit -m "feat(api-reference): parse websocket operations in loader"
```

---

## Task 4: ApiReference.tsx 接入三语 + WebSocket 详情 + 完整描述渲染

**Files:**
- Modify: `packages/api-reference/src/ApiReference.tsx`（`buildSections`、`buildCodeBlocks`、组件主体均在此文件）

**Interfaces:**
- Consumes: `pickLocale` from `./openapi-loader`。
- Produces: 组件在 zh-CN/zh-HK 分别取简体/繁体（含回退）；WS 操作详情不生成 curl；operation.description 的代码块（如 protobuf）在左栏渲染。

- [ ] **Step 1: import `pickLocale`**

在 `ApiReference.tsx` 顶部 import 块（从 `./openapi-loader`）加入 `pickLocale`。

- [ ] **Step 2: `buildSections` 用 `pickLocale` 替换 `isZh`**

`buildSections(ep, locale)` 内删除 `const isZh = locale !== 'en'`，把三处：
```ts
description: (isZh ? p['x-description-zh'] : p.description) ?? p.description ?? '',
```
改为（path 参数、query 参数）：
```ts
description: pickLocale(p.description, p['x-description-zh'], p['x-description-zh-hk'], locale),
```
body 参数处（变量名 `v`）：
```ts
description: pickLocale(v.description, v['x-description-zh'], v['x-description-zh-hk'], locale),
```

- [ ] **Step 3: WS 详情跳过 curl（改 `buildCodeBlocks`）**

`buildCodeBlocks(ep, serverUrl, locale)` 的 else 分支（无 `x-codeSamples` 时生成 curl）加 WS 守卫：
```ts
  if (ep.operation['x-codeSamples']?.length) {
    for (const sample of ep.operation['x-codeSamples']) {
      blocks.push({ lang: sample.lang.toLowerCase(), code: sample.source, label: sample.label || sample.lang })
    }
  } else if (ep.method !== 'WEBSOCKET') {
    blocks.push({ lang: 'bash', code: buildCurl(ep, serverUrl), label: t(locale, 'api.code.request') })
  }
```

- [ ] **Step 4: 组件主体三语替换**

把 `const isZh = locale !== 'en'`（约第 285 行）删除，改用 `pickLocale`：
- `epProse`（约 297-304）：完整渲染 description（含代码块，供 protobuf 显示），并三语取值：
```ts
  const epProse = useMemo<string>(() => {
    if (!activeEndpoint) return ''
    const op = activeEndpoint.operation
    const raw = pickLocale(op.description, op['x-description-zh'], op['x-description-zh-hk'], locale)
    return raw ? renderMd(raw, localePrefix) : ''
  }, [activeEndpoint, locale, localePrefix])
```
- `epTag`（约 311-317）：
```ts
    const grp = groups.find((g) => g.name === tag)
    return pickLocale(tag, grp?.nameZh, grp?.nameZhHk, locale)
```
（en 分支下 `pickLocale` 首参传 `tag` 即返回英文名。）
- `pageHtml`（约 320-324）：
```ts
    const raw = pickLocale(activePg.content, activePg.contentZh, activePg.contentZhHk, locale)
```
- 侧栏 page 标题（约 365）：
```ts
              {pickLocale(pg.title, pg.titleZh, pg.titleZhHk, locale)}
```
- 侧栏 tag 名（约 371）：
```ts
              <p className="tag-label">{pickLocale(g.name, g.nameZh, g.nameZhHk, locale)}</p>
```
- 侧栏 endpoint summary（约 374-376）：
```ts
                const summary = pickLocale(ep.operation.summary, ep.operation['x-summary-zh'], ep.operation['x-summary-zh-hk'], locale)
```
- 详情标题 `h1`（约 433-437）：
```ts
            <h1 className="ep-title">
              {pickLocale(activeEndpoint.operation.summary, activeEndpoint.operation['x-summary-zh'], activeEndpoint.operation['x-summary-zh-hk'], locale)}
            </h1>
```
- 搜索串（约 257）加繁体：
```ts
          const summary = (op.summary ?? '') + ' ' + (op['x-summary-zh'] ?? '') + ' ' + (op['x-summary-zh-hk'] ?? '')
```

> 注：`PageItem` 的 `titleZh`/`contentZh` 已存在，新增的 `titleZhHk`/`contentZhHk` 来自 Task 2。

- [ ] **Step 5: 类型检查 + 全量测试**

Run: `bunx tsc --noEmit -p tsconfig.json` 若无该配置则 `bun run test`
Expected: 无类型错误；测试 PASS。

- [ ] **Step 6: dev 目检三语 + 既有接口不回归**

Run: `bun run dev`，浏览 `/docs/api?op=list_watchlist_groups`、`/zh-CN/docs/api?op=list_watchlist_groups`、`/zh-HK/docs/api?op=list_watchlist_groups`
Expected: 英/简/繁分别显示（繁体缺失时回退简体）；既有 40 个接口详情正常，代码样例与响应示例正常。

- [ ] **Step 7: prettier + Commit**

```bash
bun run lint:docs || bun run format:docs
git add packages/api-reference/src/ApiReference.tsx packages/api-reference/src/openapi-loader.ts
git commit -m "feat(api-reference): wire zh-HK locale, websocket detail, full description render"
```

---

## Task 5: yaml 内容不变量校验 + tags 骨架 + 模板约定

**Files:**
- Create: `packages/api-reference/src/openapi-yaml.test.ts`
- Modify: `openapi.yaml`（顶层 `tags:` 补齐镜像 docs 的分类）
- Create: `docs/superpowers/plans/api-reference-endpoint-inventory.md`

**Interfaces:**
- Consumes: `parseSpec` from `./openapi-loader`（读根 `openapi.yaml`）。
- Produces: 校验测试 + 完整 tag taxonomy + 接口清单，供后续内容任务作为 TDD 靶子与勾选表。

- [ ] **Step 1: 写不变量校验测试**

`packages/api-reference/src/openapi-yaml.test.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseSpec } from './openapi-loader'
import { load } from 'js-yaml'

const yamlPath = fileURLToPath(new URL('../../../openapi.yaml', import.meta.url))
const raw = readFileSync(yamlPath, 'utf8')
const parsed = load(raw) as any
const { groups } = parseSpec(raw)
const allEps = groups.flatMap((g) => g.endpoints)
const declaredTags: string[] = (parsed.tags ?? []).map((t: any) => t.name)

describe('openapi.yaml invariants', () => {
  it('every operationId is unique', () => {
    const ids = allEps.map((e) => e.operation.operationId)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('every operation has summary + x-summary-zh + x-summary-zh-hk', () => {
    const bad = allEps.filter(
      (e) => !e.operation.summary || !e.operation['x-summary-zh'] || !e.operation['x-summary-zh-hk'],
    )
    expect(bad.map((e) => e.operation.operationId)).toEqual([])
  })
  it('every operation tag is declared in top-level tags', () => {
    const bad = allEps.filter((e) => (e.operation.tags ?? []).some((t) => !declaredTags.includes(t)))
    expect(bad.map((e) => e.operation.operationId)).toEqual([])
  })
  it('every websocket op has x-codeSamples or a protobuf code block in description', () => {
    const ws = allEps.filter((e) => e.method === 'WEBSOCKET')
    const bad = ws.filter(
      (e) => !e.operation['x-codeSamples']?.length && !/```protobuf/.test(e.operation.description ?? ''),
    )
    expect(bad.map((e) => e.operation.operationId)).toEqual([])
  })
})
```

- [ ] **Step 2: 运行——预期现有 40 个操作缺 `x-summary-zh-hk` 会 FAIL**

Run: `bunx vitest run packages/api-reference/src/openapi-yaml.test.ts`
Expected: FAIL（第二条：缺 `x-summary-zh-hk`）。这是预期的，下一步用它驱动补齐。

- [ ] **Step 3: 给现有 40 个操作补 `x-summary-zh-hk`（繁体，可先等于简体）**

对 `openapi.yaml` 现有每个操作，在 `x-summary-zh: …` 下一行补 `x-summary-zh-hk: …`（繁体；暂无繁体时复制简体值）。同理给现有 tags 补 `x-name-zh-hk`，给 `x-pages` 补 `x-title-zh-hk`/`x-content-zh-hk`（缺失回退简体，此条测试不强制 page/tag，但建议一并补）。

- [ ] **Step 4: 补齐镜像 docs 的顶层 `tags:` 骨架**

在 `openapi.yaml` 顶层 `tags:` 补足最终 taxonomy（保留已有项，新增缺的）。最终 tag 集（name / x-name-zh / x-name-zh-hk）：

```yaml
tags:
  - { name: Quote, x-name-zh: 行情, x-name-zh-hk: 行情 }
  - { name: Realtime (WebSocket), x-name-zh: 实时推送, x-name-zh-hk: 實時推送 }
  - { name: Watchlist, x-name-zh: 自选股, x-name-zh-hk: 自選股 }
  - { name: Analytics, x-name-zh: 分析, x-name-zh-hk: 分析 }
  - { name: Trade, x-name-zh: 交易与订单, x-name-zh-hk: 交易與訂單 }
  - { name: Assets, x-name-zh: 持仓与资金, x-name-zh-hk: 持倉與資金 }
  - { name: Grid, x-name-zh: 网格交易, x-name-zh-hk: 網格交易 }
  - { name: DCA, x-name-zh: 定投, x-name-zh-hk: 定投 }
  - { name: Alert, x-name-zh: 提醒, x-name-zh-hk: 提醒 }
  - { name: Content, x-name-zh: 社区与资讯, x-name-zh-hk: 社區與資訊 }
  - { name: Market, x-name-zh: 市场, x-name-zh-hk: 市場 }
  - { name: AI, x-name-zh: AI, x-name-zh-hk: AI }
```

> 说明：现有操作的旧 tag（如 `Watchlist Management`、`Portfolio & Cash` 等）需在后续内容任务中改归到上表 tag。为避免 Step 2 校验第三条误报，若本步暂不迁移旧 tag，则**保留旧 tag 定义**直至对应内容任务迁移完成。

- [ ] **Step 5: 落盘接口清单**

把本计划「附录 A：接口清单」内容写入 `docs/superpowers/plans/api-reference-endpoint-inventory.md`（原样复制）。

- [ ] **Step 6: 运行校验通过**

Run: `bunx vitest run packages/api-reference/src/openapi-yaml.test.ts`
Expected: PASS（4 条全绿）。

- [ ] **Step 7: Commit**

```bash
git add packages/api-reference/src/openapi-yaml.test.ts openapi.yaml docs/superpowers/plans/api-reference-endpoint-inventory.md
git commit -m "test(api-reference): add openapi.yaml invariants; add tag taxonomy + zh-HK"
```

---

## 内容任务通用配方（Task 6–13 每个模块都照此做）

每个内容任务 = 给一个 tag 补齐其全部接口。对每个接口：

1. 打开对应 Rust 源（附录 A 给了 path→context 文件），读该 `pub async fn` 的**请求结构体**（`rust/src/<mod>/requests/…` 或入参）与**响应类型**，以及 HTTP path/method（源码里的字符串字面量）。
2. 按下面模板在 `openapi.yaml` 的 `paths:` 下新增操作。**HTTP GET 模板**：

```yaml
  /v1/quote/valuation:
    get:
      operationId: quote_valuation           # 稳定，作为 ?op= 锚点
      summary: Valuation
      x-summary-zh: 估值
      x-summary-zh-hk: 估值
      description: |
        英文说明。可内嵌 protobuf/JSON 代码块。
      x-description-zh: 简体说明。
      x-description-zh-hk: 繁體說明。
      tags: [Analytics]
      x-quote-command: "..."                  # 仅行情鉴权接口需要，取自 docs/rust
      parameters:
        - name: symbol
          in: query
          required: true
          schema: { type: string }
          description: Security code, ticker.region, e.g. 700.HK
          x-description-zh: 证券代码，ticker.region，如 700.HK
          x-description-zh-hk: 證券代碼，ticker.region，如 700.HK
      x-codeSamples:
        - lang: Shell
          label: CLI
          source: |
            longbridge valuation 700.HK
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              example:
                code: 0
                message: success
                data: { }               # 按响应结构体填真实示例
        default:
          description: Unexpected error
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Error' }
```

3. **HTTP POST 模板**：把 `parameters` 换成 `requestBody`：

```yaml
      requestBody:
        required: true
        content:
          application/json:
            schema:
              required: [symbol]
              properties:
                symbol:
                  type: string
                  description: Security code
                  x-description-zh: 证券代码
                  x-description-zh-hk: 證券代碼
```

4. **WebSocket 模板**（Realtime tag）：

```yaml
  quote/push/quote:
    websocket:
      operationId: quote_push_quote
      summary: Push Realtime Quote
      x-summary-zh: 实时行情推送
      x-summary-zh-hk: 實時行情推送
      x-quote-command: "..."
      tags: [Realtime (WebSocket)]
      description: |
        订阅后服务端推送的行情数据。业务指令号见下。
        ```protobuf
        message PushQuote { string symbol = 1; ... }
        ```
      x-description-zh: |
        ```protobuf
        message PushQuote { string symbol = 1; ... }
        ```
      x-description-zh-hk: |
        ```protobuf
        message PushQuote { string symbol = 1; ... }
        ```
```

5. 每加完一个接口，**如果它属于本任务 tag，就把该 tag 下已迁移完成的旧 tag 定义删除**（避免遗留 `Watchlist Management` 等重复）。
6. 每个模块任务结束跑：`bunx vitest run packages/api-reference/src/openapi-yaml.test.ts`（不变量）+ `bun run dev` 抽查 3 个 `?op=` 深链三语显示。
7. Commit（每模块一提交）。

> 代码样例语言：**默认沿用 docs 现状**（至少 CLI(Shell)；行情/交易类补 Python / Python(async) / Node.js / Java）。此点在 spec §9 待你最终确认——若要全套（+C++/Go/Rust）则每个接口的 `x-codeSamples` 相应扩充。

---

## Task 6: 内容 — Realtime (WebSocket)

**Files:** Modify `openapi.yaml`；参考 `openapi/rust/src/quote/`、`openapi/rust/src/trade/`、`openapi/rust/crates/proto/`。

**接口（合成 path）：** `quote/subscribe`、`quote/unsubscribe`、`quote/push/quote`、`quote/push/depth`、`quote/push/brokers`、`quote/push/trade`、`quote/subscribe/candlesticks`、`quote/push/candlestick`、`trade/subscribe`、`trade/unsubscribe`、`trade/push/order`（内容取自 `docs/en/docs/quote/subscribe`、各 push 文档与 proto message）。

- [ ] Step 1: 按 WS 模板逐个补入 `openapi.yaml`，tag=`Realtime (WebSocket)`。
- [ ] Step 2: `bunx vitest run packages/api-reference/src/openapi-yaml.test.ts` → PASS。
- [ ] Step 3: `bun run dev` 抽查 `?op=quote_push_quote` 三语 + 粉色 WS 徽章 + protobuf 显示。
- [ ] Step 4: `git add openapi.yaml && git commit -m "docs(api): add Realtime WebSocket operations"`

---

## Task 7: 内容 — Quote（HTTP 行情）
**接口/源：** 见附录 A「Quote」。逐个按 GET/POST 模板补入，tag=`Quote`。
- [ ] Step 1–4：同通用配方（补入 → 校验 → dev 抽查 → commit `docs(api): add Quote HTTP operations`）。

## Task 8: 内容 — Trade（交易与订单）
**接口/源：** 附录 A「Trade」，源 `openapi/rust/src/trade/context.rs`。已有部分（order_detail/replace/cancel/executions/orders/estimate）迁移到 tag=`Trade` 并删旧 tag `Trade Execution & Order Management`。补 `submit_order`(`/v1/trade/order` POST)、`submit_multileg`、`today_orders`、`today_executions` 等缺失项。
- [ ] Step 1–4：同通用配方（commit `docs(api): add Trade operations`）。

## Task 9: 内容 — Assets（持仓与资金）
**接口/源：** 附录 A「Assets」，源 `openapi/rust/src/asset/`、`portfolio/`。含 `/v1/asset/account|fund|stock|cashflow|exchange_rates`、`/v1/us/assets/overview`、`/v1/portfolio/profit-analysis*`、`/v1/risk/margin-ratio`。旧 tag `Portfolio & Cash` 迁移后删除。
- [ ] Step 1–4：同通用配方（commit `docs(api): add Assets operations`）。

## Task 10: 内容 — Grid + DCA
**接口/源：** 附录 A「Grid」「DCA」，源 `openapi/rust/src/grid/`、`dca/`。Grid：`/v1/gridtrading/*`（迁移旧 tag `Grid Trading`）。DCA：`/v1/dailycoins/*`。
- [ ] Step 1–4：同通用配方（commit `docs(api): add Grid and DCA operations`）。

## Task 11: 内容 — Analytics（分析/基本面/估值/筛选/信号）
**接口/源：** 附录 A「Analytics」（最大一组），源 `openapi/rust/src/fundamental/`、`screener/`、`signal/`、及 `quote` 下分析类 path。
- [ ] Step 1–4：同通用配方。若单任务过大，可按子域（估值/基本面/评级与持仓/筛选与信号）拆成多次提交，但仍归 tag=`Analytics`（commit `docs(api): add Analytics operations`）。

## Task 12: 内容 — Content + Market + Watchlist
**接口/源：** 附录 A 对应段。Content：`/v1/content/*`（迁移旧 `News & Filings`、`Community`）。Market：`/v1/quote/market*`、`market_temperature`、`history_market_temperature`、`finance_calendar`、`get_security_list`、`index-constituents`（迁移旧 `Market Temperature`）。Watchlist：`/v1/watchlist/groups`、`/v1/sharelists*`（迁移旧 `Watchlist Management`）。
- [ ] Step 1–4：同通用配方（commit `docs(api): add Content, Market, Watchlist operations`）。

## Task 13: 内容 — AI + Alert + 其余
**接口/源：** AI `/v1/ai/*`（`openapi/rust/src/agent/`）。Alert `/v1/notify/reminders`（`openapi/rust/src/alert/`）。其余散项（`/v1/facts/security_facts`、`/v1/statement/*`、`/v1/token/refresh`、`/v1/orders/info`）按语义归入最贴近 tag。
- [ ] Step 1–4：同通用配方（commit `docs(api): add AI, Alert and remaining operations`）。

---

## Task 14: 旧链接迁移到本地 `/docs/api`

**Files:** 扫描 `docs/**`、`src/**`、`packages/**`。

- [ ] **Step 1: 定位历史绝对链接**

Run: `grep -rn "open.longbridge.com/docs/api\|open.longportapp.com/docs/api" docs src packages | grep -v vitepress/dist`
Expected: 列出所有指向旧生产站 API 参考的绝对链接（含带 `?op=` 的）。

- [ ] **Step 2: 逐个改为本地相对路径**

把 `https://open.longbridge.com/docs/api?op=<id>` → `/docs/api?op=<id>`（若在 zh-CN/zh-HK 页面则加对应 locale 前缀）。纯 `.../docs/api` → `/docs/api`。

- [ ] **Step 3: 复查无残留**

Run: `grep -rn "open.longbridge.com/docs/api\|open.longportapp.com/docs/api" docs src packages | grep -v vitepress/dist`
Expected: 空（或仅剩有意保留的外链）。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: migrate legacy /docs/api links to local reference path"
```

---

## Task 15: 全量校验与收尾

- [ ] **Step 1: 不变量与单测**

Run: `bun run test`
Expected: 全绿（含 openapi-loader、openapi-yaml 校验）。

- [ ] **Step 2: 生产构建校验（astro check + build）**

Run: `bun run build:canary`
Expected: `astro check` 无类型错误，构建成功，`/docs/api` 及三语路由产出正常。

- [ ] **Step 3: 覆盖率抽查**

用附录 A 清单核对：每个接口在 `?op=<id>` 可直达；侧栏 tag 顺序与 `docs` 目录一致；WS 接口有粉色徽章 + protobuf；旧 tag 已全部迁移删除。

- [ ] **Step 4: Lint**

Run: `bun run lint && bun run lint:docs`
Expected: 无错误。

- [ ] **Step 5: 最终提交**

```bash
git add -A
git commit -m "chore(api-reference): finalize reference expansion"
```

---

## 附录 A：接口清单（path → tag → Rust 源）

> 来源：`grep -rhoE '"/v[0-9][^"]*"' openapi/rust/src | sort -u`（138 条）+ WebSocket 合成 path。Rust context 文件位于 `openapi/rust/src/<module>/context.rs`，请求体位于 `openapi/rust/src/<module>/requests/`。执行时逐条勾选。

**Realtime (WebSocket)** — `quote/context.rs`、`trade/context.rs`、`crates/proto`：subscribe / unsubscribe / push_quote / push_depth / push_brokers / push_trade / subscribe_candlesticks / push_candlestick / trade subscribe / trade unsubscribe / trade push_order。

**Quote (HTTP)** — `quote/context.rs`：`/v1/quote/*` 中的实时/静态类 HTTP 接口（static_info、realtime 相关 HTTP、option_chain、warrant_list、trading_session、trading_days、capital_flow、capital_distribution、calc_indexes 等，按源码 path 归入）。

**Watchlist** — `sharelist/`、`quote/context.rs`：`/v1/watchlist/groups`、`/v1/sharelists`、`/v1/sharelists/popular`、`/v1/sharelists/{id}`、`/v1/sharelists/{id}/items`、`/v1/sharelists/{id}/items/sort`。

**Analytics** — `fundamental/`、`screener/`、`signal/`、`quote/`：`/v1/quote/valuation`、`/v1/quote/valuation/detail`、`/v1/quote/compare/valuation`、`/v1/quote/industry-valuation-comparison`、`/v1/quote/industry-valuation-distribution`、`/v1/quote/industry/rank`、`/v1/quote/industries/peers`、`/v1/quote/financial-reports`、`/v1/quote/financial-consensus-detail`、`/v1/quote/financials/earnings-snapshot`、`/v1/quote/forecast-eps`、`/v1/quote/fundamentals/business-segments`、`/v1/quote/fundamentals/business-segments/history`、`/v1/quote/operatings`、`/v1/quote/comp-overview`、`/v1/quote/company-act`、`/v1/quote/company-professionals`、`/v1/quote/invest-relations`、`/v1/quote/dividends`、`/v1/quote/dividends/details`、`/v1/quote/buy-backs`、`/v1/quote/changes`、`/v1/quote/shareholders`、`/v1/quote/shareholders/holding`、`/v1/quote/shareholders/top`、`/v1/quote/fund-holders`、`/v1/quote/institution-rating-latest`、`/v1/quote/institution-ratings`、`/v1/quote/institution-ratings/detail`、`/v1/quote/ratings`、`/v1/quote/ratings/institutional`、`/v1/quote/short-positions/hk`、`/v1/quote/short-positions/us`、`/v1/quote/short-trades/hk`、`/v1/quote/short-trades/us`、`/v1/quote/trades-statistics`、`/v1/quote/broker-holding`、`/v1/quote/broker-holding/daily`、`/v1/quote/broker-holding/detail`、`/v1/quote/etf-asset-allocation`、`/v1/quote/ahpremium/klines`、`/v1/quote/ahpremium/timeshares`、`/v1/quote/filings`、`/v1/facts/security_facts`、`/v1/quote/option-volume-stats`、`/v1/quote/option-volume-stats/daily`、`/v1/quote/ai/screener/indicators`、`/v1/quote/ai/screener/search`、`/v1/quote/ai/screener/strategies/mine`、`/v1/quote/ai/screener/strategies/recommend`、`/v1/quote/ai/screener/strategy/{id}`、`/v1/quote/ai/screener/strategy/{sid}`、`/v1/signals`、`/v1/signals/{signal_id}`。

**Trade** — `trade/context.rs`：`/v1/trade/order`（GET 详情 / POST 提交 / PUT 改单 / DELETE 撤单，按源码方法拆）、`/v1/trade/order/history`、`/v1/trade/order/today`、`/v1/trade/order/multileg`、`/v1/trade/execution/history`、`/v1/trade/execution/today`、`/v1/trade/estimate/buy_limit`、`/v1/orders/info`。

**Assets** — `asset/`、`portfolio/`：`/v1/asset/account`、`/v1/asset/fund`、`/v1/asset/stock`、`/v1/asset/cashflow`、`/v1/asset/exchange_rates`、`/v1/us/assets/overview`、`/v1/portfolio/profit-analysis-summary`、`/v1/portfolio/profit-analysis-sublist`、`/v1/portfolio/profit-analysis/by-market`、`/v1/portfolio/profit-analysis/detail`、`/v1/portfolio/profit-analysis/flows`、`/v1/risk/margin-ratio`。

**Grid** — `grid/`：`/v1/gridtrading/submit|replace|cancel|suspend|restart|detail|list|trigger_history_list`。

**DCA** — `dca/`：`/v1/dailycoins/create|update|query|query-records|statistic|toggle|batch-check-support|calc-trd-date|update-alter-hours`。

**Alert** — `alert/`：`/v1/notify/reminders`（增删改查按源码方法拆）。

**Content** — `content/`：`/v1/content/{symbol}/news`、`/v1/content/{symbol}/topics`、`/v1/content/topics`、`/v1/content/topics/mine`、`/v1/content/topics/{id}`、`/v1/content/topics/{topic_id}/comments`。

**Market** — `market/`、`calendar/`、`quote/`：`/v1/quote/market-status`、`/v1/quote/market_temperature`、`/v1/quote/history_market_temperature`、`/v1/quote/finance_calendar`、`/v1/quote/get_security_list`、`/v1/quote/index-constituents`、`/v1/quote/market/rank/categories`、`/v1/quote/market/rank/list`、`/v1/quote/market/stock-events`。

**AI** — `agent/`：`/v1/ai/agents`、`/v1/ai/agents/{agent_id}/conversations`、`/v1/ai/agents/{agent_id}/conversations/{chat_uid}/messages/{message_id}/continue`、`/v1/ai/workspaces`、`/v1/ai/workspaces/{workspace_id}/agents`。

**其余/杂项** — `/v1/statement/list`、`/v1/statement/download`（→ Assets 或独立 Statement）、`/v1/token/refresh`（认证，可归 AI 之外的 Auth 说明页或 x-pages）。

> 注：附录归类为**建议**，最终以 spec §4.3 taxonomy 为准；执行中如发现 Rust path 与归类冲突，以 Rust 源 path 语义为准并在提交信息注明。
