# MCP 顶层菜单与 Available tools 组件 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 MCP 从 Docs 侧边栏里的子页提升为顶层菜单入口（URL 保持 `/docs/mcp`），并在 MCP 页新增可搜索可折叠的 Available tools 列表（108 个工具，构建时从 `openapi.longbridge.xyz/mcp/tools.json` 拉取）。

**Architecture:** 三份 nav.ts 加顶层菜单；三份 sidebar.ts 用 filter 从 Docs 侧边栏移除 MCP；三份 mcp.md 调章节顺序并嵌入 `<McpTools />` 组件；新增 Vite plugin 在 `buildStart` 拉 tools.json 写到 `data/mcp-tools.json`（失败回退到仓库内 snapshot），组件在 SSG 构建时直接 `import` 这份 JSON。

**Tech Stack:** VitePress · Vue 3 Composition API · bun · UnoCSS · shadcn-vue Accordion（基于 reka-ui）

---

## 文件清单

### 新建
- `docs/.vitepress/data/mcp-tools.snapshot.json` — tools.json 手动快照（入仓）
- `docs/.vitepress/theme/components/McpTools.vue` — 搜索框 + Accordion 渲染
- `docs/.vitepress/theme/components/ui/accordion/Accordion.vue` — shadcn-vue 生成
- `docs/.vitepress/theme/components/ui/accordion/AccordionItem.vue` — shadcn-vue 生成
- `docs/.vitepress/theme/components/ui/accordion/AccordionTrigger.vue` — shadcn-vue 生成
- `docs/.vitepress/theme/components/ui/accordion/AccordionContent.vue` — shadcn-vue 生成
- `docs/.vitepress/theme/components/ui/accordion/index.ts` — shadcn-vue 生成（re-export）

### 修改
- `docs/.vitepress/locales/en/nav.ts` — 加 MCP 顶层菜单项
- `docs/.vitepress/locales/zh-CN/nav.ts` — 加 MCP 顶层菜单项
- `docs/.vitepress/locales/zh-HK/nav.ts` — 加 MCP 顶层菜单项
- `docs/.vitepress/locales/en/sidebar.ts` — `buildDocsSidebar` 过滤 MCP
- `docs/.vitepress/locales/zh-CN/sidebar.ts` — 同上
- `docs/.vitepress/locales/zh-HK/sidebar.ts` — 同上
- `docs/en/docs/mcp.md` — frontmatter + 章节调序 + `<McpTools />`
- `docs/zh-CN/docs/mcp.md` — 同上
- `docs/zh-HK/docs/mcp.md` — 同上
- `docs/.vitepress/config.mts` — 加 fetch-mcp-tools Vite plugin
- `docs/.vitepress/theme/components/index.ts` — 追加 `McpTools` export
- `.gitignore` — 追加 `docs/.vitepress/data/mcp-tools.json`
- `package.json` — 新增 `reka-ui` 依赖（通过 `bun add`）

### 验证策略

本仓库没有自动化测试（见 `CLAUDE.md` "无测试命令"）。每个任务的验证步骤是：
- **构建/类型检查**：`bun run build:canary` 或启动 `bun run dev` 无报错
- **行为验证**：在浏览器访问页面，用 devtools 或肉眼确认 UI
- **手动 checklist**：最后一个任务走全面验收

---

## Task 1: 三份 nav.ts 加 MCP 顶层菜单

**Files:**
- Modify: `docs/.vitepress/locales/en/nav.ts`
- Modify: `docs/.vitepress/locales/zh-CN/nav.ts`
- Modify: `docs/.vitepress/locales/zh-HK/nav.ts`

- [ ] **Step 1: 修改 en/nav.ts**

将 `docs/.vitepress/locales/en/nav.ts` 现有 nav 返回数组里 `CLI` 项的**后面**加一条 MCP：

```ts
import type { DefaultTheme } from 'vitepress'
import { filterNavItems } from '../../region-utils'

export const nav = (): DefaultTheme.NavItem[] => {
  return filterNavItems([
    { text: 'Home', link: '/', activeMatch: '^(/en)?/$' },
    { text: 'Skill', link: '/skill', activeMatch: '^(/en)?/skill' },
    { text: 'Docs', link: '/docs', activeMatch: '^(/en)?/docs(?!/cli)(?!/api)' },
    { text: 'CLI', link: '/docs/cli', activeMatch: '^(/en)?/docs/cli' },
    { text: 'MCP', link: '/docs/mcp', activeMatch: '^(/en)?/docs/mcp' },
    { text: 'API Reference', link: '/docs/api', activeMatch: '^(/en)?/docs/api' },
    { text: 'SDK', link: '/sdk', activeMatch: '^(/en)?/sdk' },
    { text: 'Feedback', link: 'https://github.com/longbridge/developers/issues', target: '_blank' },
  ])
}
```

- [ ] **Step 2: 修改 zh-CN/nav.ts**

```ts
import type { DefaultTheme } from 'vitepress'
import { filterNavItems } from '../../region-utils'

export const nav = (lang: string): DefaultTheme.NavItem[] => {
  return filterNavItems([
    { text: '首页', link: `/${lang}/`, activeMatch: `^/${lang}/$` },
    { text: 'Skill', link: `/${lang}/skill`, activeMatch: `^/${lang}/skill` },
    { text: '文档', link: `/${lang}/docs`, activeMatch: `^/${lang}/docs(?!/cli)(?!/api)` },
    { text: 'CLI', link: `/${lang}/docs/cli`, activeMatch: `^/${lang}/docs/cli` },
    { text: 'MCP', link: `/${lang}/docs/mcp`, activeMatch: `^/${lang}/docs/mcp` },
    { text: 'API 参考', link: `/${lang}/docs/api`, activeMatch: `^/${lang}/docs/api` },
    { text: 'SDK', link: `/${lang}/sdk`, activeMatch: `^/${lang}/sdk` },
    { text: 'Feedback', link: 'https://github.com/longbridge/developers/issues', target: '_blank' },
  ])
}
```

- [ ] **Step 3: 修改 zh-HK/nav.ts**

```ts
import type { DefaultTheme } from 'vitepress'
import { filterNavItems } from '../../region-utils'

export const nav = (lang: string): DefaultTheme.NavItem[] => {
  return filterNavItems([
    { text: '首頁', link: `/${lang}/`, activeMatch: `^/${lang}/$` },
    { text: 'Skill', link: `/${lang}/skill`, activeMatch: `^/${lang}/skill` },
    { text: '文檔', link: `/${lang}/docs`, activeMatch: `^/${lang}/docs(?!/cli)(?!/api)` },
    { text: 'CLI', link: `/${lang}/docs/cli`, activeMatch: `^/${lang}/docs/cli` },
    { text: 'MCP', link: `/${lang}/docs/mcp`, activeMatch: `^/${lang}/docs/mcp` },
    { text: 'API 參考', link: `/${lang}/docs/api`, activeMatch: `^/${lang}/docs/api` },
    { text: 'SDK', link: `/${lang}/sdk`, activeMatch: `^/${lang}/sdk` },
    { text: 'Feedback', link: 'https://github.com/longbridge/developers/issues', target: '_blank' },
  ])
}
```

- [ ] **Step 4: 启动 dev 验证**

Run: `bun run dev`
Expected: 启动无错，打开 http://localhost:8000/ 看顶部导航栏顺序：
```
Home · Skill · Docs · CLI · MCP · API Reference · SDK · Feedback
```
且 `/zh-CN/` 与 `/zh-HK/` 也显示正确对应的三语言版本（MCP 统一为 "MCP"）。点击 MCP 菜单跳转到 `/docs/mcp`（暂时仍是现有旧页，下一任务再调）。

停止 dev：`Ctrl+C`。

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/locales/en/nav.ts docs/.vitepress/locales/zh-CN/nav.ts docs/.vitepress/locales/zh-HK/nav.ts
git commit -m "feat(nav): add MCP to top-level navigation after CLI"
```

---

## Task 2: 三份 sidebar.ts 过滤掉 MCP

**Files:**
- Modify: `docs/.vitepress/locales/en/sidebar.ts`
- Modify: `docs/.vitepress/locales/zh-CN/sidebar.ts`
- Modify: `docs/.vitepress/locales/zh-HK/sidebar.ts`

- [ ] **Step 1: 修改 en/sidebar.ts**

在 `buildCliSidebar` 之后加 `buildDocsSidebar`，并在 export 里用它替换原来的 `docsSidebar()`：

```ts
import { DefaultTheme } from 'vitepress'
import { genMarkdowDocs, SIDEBAR_ICONS_MAP } from '../../theme/utils/gen'

const docsSidebar = genMarkdowDocs('en', 'docs', { exclude: ['cli'] })
const cliSidebar  = genMarkdowDocs('en', 'docs/cli')

function buildCliSidebar(): DefaultTheme.SidebarItem[] {
  const items = cliSidebar()
  const installIdx = items.findIndex((item) => typeof item.link === 'string' && item.link.includes('installation'))
  const githubItem: DefaultTheme.SidebarItem = {
    text: `<span class="sidebar-item-icon">${SIDEBAR_ICONS_MAP.github}</span>GitHub`,
    link: 'https://github.com/longbridge/longbridge-terminal',
  }
  if (installIdx !== -1) {
    items.splice(installIdx + 1, 0, githubItem)
  } else {
    items.push(githubItem)
  }
  return items
}

function buildDocsSidebar(): DefaultTheme.SidebarItem[] {
  return docsSidebar().filter((item) => {
    const link = typeof item.link === 'string' ? item.link : ''
    return !link.endsWith('/mcp')
  })
}

export const sidebar: DefaultTheme.Sidebar = {
  '/docs/cli': buildCliSidebar(),
  '/docs':     buildDocsSidebar(),
}
```

- [ ] **Step 2: 修改 zh-CN/sidebar.ts**

```ts
import { DefaultTheme } from 'vitepress'
import { genMarkdowDocs, SIDEBAR_ICONS_MAP } from '../../theme/utils/gen'

const lang = 'zh-CN'
const docsSidebar = genMarkdowDocs(lang, 'docs', { exclude: ['cli'] })
const cliSidebar  = genMarkdowDocs(lang, 'docs/cli')

function buildCliSidebar(): DefaultTheme.SidebarItem[] {
  const items = cliSidebar()
  const installIdx = items.findIndex((item) => typeof item.link === 'string' && item.link.includes('installation'))
  const githubItem: DefaultTheme.SidebarItem = {
    text: `<span class="sidebar-item-icon">${SIDEBAR_ICONS_MAP.github}</span>GitHub`,
    link: 'https://github.com/longbridge/longbridge-terminal',
  }
  if (installIdx !== -1) {
    items.splice(installIdx + 1, 0, githubItem)
  } else {
    items.push(githubItem)
  }
  return items
}

function buildDocsSidebar(): DefaultTheme.SidebarItem[] {
  return docsSidebar().filter((item) => {
    const link = typeof item.link === 'string' ? item.link : ''
    return !link.endsWith('/mcp')
  })
}

export const sidebar: DefaultTheme.Sidebar = {
  [`/${lang}/docs/cli`]: buildCliSidebar(),
  [`/${lang}/docs`]:     buildDocsSidebar(),
}
```

- [ ] **Step 3: 修改 zh-HK/sidebar.ts**

与 zh-CN 完全一致，唯一差别把 `const lang = 'zh-CN'` 改为 `const lang = 'zh-HK'`。

- [ ] **Step 4: 启动 dev 验证**

Run: `bun run dev`
Expected:
- 访问 `/docs`（英文）和 `/zh-CN/docs`、`/zh-HK/docs`，左侧 Docs 侧边栏中**不再出现 "MCP" 条目**。
- 其他 sidebar 条目（Quote、Trade、CLI link 等）仍正常显示。
- 访问 `/docs/mcp` 页仍可打开，但左侧可能还显示 sidebar（frontmatter 下一任务改）。

停止 dev。

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/locales/en/sidebar.ts docs/.vitepress/locales/zh-CN/sidebar.ts docs/.vitepress/locales/zh-HK/sidebar.ts
git commit -m "refactor(sidebar): remove MCP from Docs sidebar (moved to top-level nav)"
```

---

## Task 3: 三份 mcp.md frontmatter + 章节调序 + 组件占位

**Files:**
- Modify: `docs/en/docs/mcp.md`
- Modify: `docs/zh-CN/docs/mcp.md`
- Modify: `docs/zh-HK/docs/mcp.md`

- [ ] **Step 1: 修改 en/docs/mcp.md 的 frontmatter**

当前：
```yaml
---
sidebar_position: 2.2
slug: /mcp
sidebar_label: MCP
sidebarCollapsed: true
id: mcp
sidebar_icon: cpu
---
```

改为（删 4 个 sidebar 相关字段、加 `sidebar: false`、补 `title`）：
```yaml
---
title: MCP
id: mcp
slug: /mcp
sidebar: false
---
```

- [ ] **Step 2: 调整 en/docs/mcp.md 章节顺序并插入 `<McpTools />`**

把 `## Prerequisites` 和 `## Available capabilities` 两章互换，并在 `## Available capabilities` 之后插入新章节 `## Available tools`。结果从顶部第一个 `#` 往下（引言 + tip 块保持原样）：

```markdown
# Longbridge MCP Service

Longbridge provides a hosted HTTP MCP (Model Context Protocol) service that lets you use Longbridge market data and account capabilities directly from AI coding assistants and chat tools — without managing API keys manually.

:::tip MCP endpoint
- Global: `https://openapi.longbridge.com/mcp`
- Mainland China: `https://openapi.longbridge.cn/mcp` (faster access)
:::

## Available capabilities

Once connected, MCP clients can call the following tools:

| Category | Description |
| --- | --- |
| Market data | Real-time quotes, candlesticks, historical data queries |
| Account information | Account overview, assets, and position queries |
| Trading actions | Place, modify, and cancel orders (subject to account permissions and regional restrictions) |

Actual tool availability varies by region, account level, and granted scopes.

## Available tools

<McpTools />

## Prerequisites

- An active Longbridge account with onboarding completed, or a paper trading account
- An AI client that supports MCP OAuth 2.1 (see compatibility note below)

## Client setup
```

往下 `## Client setup` 及之后全部保持原样不动。

- [ ] **Step 3: 修改 zh-CN/docs/mcp.md 的 frontmatter**

改为：
```yaml
---
title: MCP
id: mcp
slug: /mcp
sidebar: false
---
```

- [ ] **Step 4: 调整 zh-CN/docs/mcp.md 章节顺序并插入 `<McpTools />`**

```markdown
# Longbridge MCP 服务

Longbridge 提供托管的 HTTP MCP（Model Context Protocol）服务，让你在 AI 编程助手或对话工具中直接使用 Longbridge 的行情与账户能力，无需手动管理 API 密钥。

:::tip MCP 服务地址
- 全球：`https://openapi.longbridge.com/mcp`
- 中国大陆：`https://openapi.longbridge.cn/mcp`（访问更快）
:::

## 可用能力

接入后，MCP 客户端可调用以下能力：

| 能力类别 | 说明 |
| --- | --- |
| 行情数据 | 实时快照、K 线、历史行情查询 |
| 账户信息 | 账户概览、资产、持仓查询 |
| 交易操作 | 下单、改单、撤单（受账户权限与地区限制） |

实际可用能力因地区、账户等级和授权范围而有所不同。

## 可用工具

<McpTools />

## 前置条件

- 已拥有 Longbridge 账户并完成开户，或开通模拟账户
- 使用支持 MCP OAuth 2.1 的 AI 客户端（见下方兼容性说明）

## 客户端接入
```

往下全部保持原样。

- [ ] **Step 5: 修改 zh-HK/docs/mcp.md 的 frontmatter**

```yaml
---
title: MCP
id: mcp
slug: /mcp
sidebar: false
---
```

- [ ] **Step 6: 调整 zh-HK/docs/mcp.md 章节顺序并插入 `<McpTools />`**

```markdown
# Longbridge MCP 服務

Longbridge 提供托管的 HTTP MCP（Model Context Protocol）服務，讓你在 AI 編程助手或對話工具中直接使用 Longbridge 的行情與帳戶能力，無需手動管理 API 金鑰。

:::tip MCP 服務地址
- 全球：`https://openapi.longbridge.com/mcp`
- 中國大陸：`https://openapi.longbridge.cn/mcp`（訪問更快）
:::

## 可用能力

接入後，MCP 客戶端可調用以下能力：

| 能力類別 | 說明 |
| --- | --- |
| 行情資料 | 即時快照、K 線、歷史行情查詢 |
| 帳戶資訊 | 帳戶總覽、資產、持倉查詢 |
| 交易操作 | 下單、改單、撤單（受帳戶權限與地區限制） |

實際可用能力因地區、帳戶等級和授權範圍而有所不同。

## 可用工具

<McpTools />

## 前置條件

- 已擁有 Longbridge 帳戶並完成開戶，或開通模擬帳戶
- 使用支援 MCP OAuth 2.1 的 AI 客戶端（見下方相容性說明）

## 客戶端接入
```

往下全部保持原样。

- [ ] **Step 7: 启动 dev 验证（此时 `<McpTools />` 未实现，页面会有错误是预期的）**

Run: `bun run dev`
Expected:
- 打开 `/docs/mcp`、`/zh-CN/docs/mcp`、`/zh-HK/docs/mcp` — 章节顺序为 "Available capabilities / 可用能力" → "Available tools / 可用工具" → "Prerequisites / 前置条件 / 前置條件"
- 页面**无左侧 sidebar**（因为 `sidebar: false`）
- `<McpTools />` 位置会在 console 报 `Failed to resolve component` 警告 —— **本任务无需修复**，下面任务会加。

停止 dev。

- [ ] **Step 8: Commit**

```bash
git add docs/en/docs/mcp.md docs/zh-CN/docs/mcp.md docs/zh-HK/docs/mcp.md
git commit -m "docs(mcp): swap sections order and add <McpTools /> placeholder"
```

---

## Task 4: 安装 shadcn-vue Accordion

**Files:**
- Create: `docs/.vitepress/theme/components/ui/accordion/Accordion.vue`
- Create: `docs/.vitepress/theme/components/ui/accordion/AccordionItem.vue`
- Create: `docs/.vitepress/theme/components/ui/accordion/AccordionTrigger.vue`
- Create: `docs/.vitepress/theme/components/ui/accordion/AccordionContent.vue`
- Create: `docs/.vitepress/theme/components/ui/accordion/index.ts`
- Modify: `package.json`（加 `reka-ui`）

- [ ] **Step 1: 安装 reka-ui 运行时依赖**

Run: `bun add reka-ui`
Expected: `reka-ui` 出现在 `package.json` 的 `dependencies`；`bun.lock` 更新。

- [ ] **Step 2: 创建目录并手写 Accordion 源码**

不走 `bunx shadcn-vue@latest add accordion` 的原因：该 CLI 需要 `components.json` 配置，会改写别名、引入额外依赖，与本仓 UnoCSS / VitePress 的配置有摩擦风险。直接从 shadcn-vue 文档页复制原始代码到对应文件即可（以下代码与 shadcn-vue v1 的 accordion 源一致）。

创建 `docs/.vitepress/theme/components/ui/accordion/Accordion.vue`：

```vue
<script setup lang="ts">
import { AccordionRoot, type AccordionRootProps, type AccordionRootEmits, useForwardPropsEmits } from 'reka-ui'

const props = defineProps<AccordionRootProps>()
const emits = defineEmits<AccordionRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <AccordionRoot v-bind="forwarded">
    <slot />
  </AccordionRoot>
</template>
```

创建 `docs/.vitepress/theme/components/ui/accordion/AccordionItem.vue`：

```vue
<script setup lang="ts">
import { AccordionItem, type AccordionItemProps, useForwardProps } from 'reka-ui'

const props = defineProps<AccordionItemProps>()
const forwardedProps = useForwardProps(props)
</script>

<template>
  <AccordionItem v-bind="forwardedProps" class="mcp-accordion-item">
    <slot />
  </AccordionItem>
</template>

<style scoped>
.mcp-accordion-item {
  border-bottom: 1px solid var(--vp-c-divider);
}
</style>
```

创建 `docs/.vitepress/theme/components/ui/accordion/AccordionTrigger.vue`：

```vue
<script setup lang="ts">
import { AccordionHeader, AccordionTrigger, type AccordionTriggerProps } from 'reka-ui'

defineProps<AccordionTriggerProps>()
</script>

<template>
  <AccordionHeader class="mcp-accordion-header">
    <AccordionTrigger class="mcp-accordion-trigger">
      <slot />
      <svg
        class="mcp-accordion-chevron"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </AccordionTrigger>
  </AccordionHeader>
</template>

<style scoped>
.mcp-accordion-header {
  display: flex;
  margin: 0;
}
.mcp-accordion-trigger {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: var(--vp-c-text-1);
}
.mcp-accordion-trigger:hover {
  color: var(--vp-c-brand-1);
}
.mcp-accordion-chevron {
  transition: transform 0.2s ease;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}
.mcp-accordion-trigger[data-state='open'] .mcp-accordion-chevron {
  transform: rotate(180deg);
}
</style>
```

创建 `docs/.vitepress/theme/components/ui/accordion/AccordionContent.vue`：

```vue
<script setup lang="ts">
import { AccordionContent, type AccordionContentProps } from 'reka-ui'

defineProps<AccordionContentProps>()
</script>

<template>
  <AccordionContent class="mcp-accordion-content">
    <div class="mcp-accordion-content-inner">
      <slot />
    </div>
  </AccordionContent>
</template>

<style scoped>
.mcp-accordion-content {
  overflow: hidden;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
.mcp-accordion-content[data-state='open'] {
  animation: slide-down 0.2s ease-out;
}
.mcp-accordion-content[data-state='closed'] {
  animation: slide-up 0.2s ease-out;
}
.mcp-accordion-content-inner {
  padding: 0 0 0.75rem;
}
@keyframes slide-down {
  from { height: 0 }
  to   { height: var(--reka-accordion-content-height) }
}
@keyframes slide-up {
  from { height: var(--reka-accordion-content-height) }
  to   { height: 0 }
}
</style>
```

创建 `docs/.vitepress/theme/components/ui/accordion/index.ts`：

```ts
export { default as Accordion } from './Accordion.vue'
export { default as AccordionItem } from './AccordionItem.vue'
export { default as AccordionTrigger } from './AccordionTrigger.vue'
export { default as AccordionContent } from './AccordionContent.vue'
```

- [ ] **Step 3: 启动 dev 验证模块解析不报错**

Run: `bun run dev`
Expected: `/docs/mcp` 页仍报 `<McpTools />` 未注册的警告（预期），但**不能出现** `reka-ui` 模块找不到或 `Accordion` 编译错误。

停止 dev。

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock docs/.vitepress/theme/components/ui/accordion
git commit -m "feat(ui): add shadcn-vue accordion based on reka-ui"
```

---

## Task 5: 抓取 tools.json snapshot 提交到仓库

**Files:**
- Create: `docs/.vitepress/data/mcp-tools.snapshot.json`

- [ ] **Step 1: 抓取 tools.json**

Run: `mkdir -p docs/.vitepress/data && curl -fsSL https://openapi.longbridge.com/mcp/tools.json | python3 -m json.tool > docs/.vitepress/data/mcp-tools.snapshot.json`

Expected:
- 命令成功退出（exit 0）
- `docs/.vitepress/data/mcp-tools.snapshot.json` 存在，是格式化过的 JSON

校验：
Run: `python3 -c "import json; d=json.load(open('docs/.vitepress/data/mcp-tools.snapshot.json')); print(len(d['tools']))"`
Expected: 一个整数（预期 100+，当前约 108）。

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/data/mcp-tools.snapshot.json
git commit -m "feat(mcp): add tools.json snapshot as fallback for build"
```

---

## Task 6: 写 fetch-mcp-tools Vite plugin + 更新 .gitignore

**Files:**
- Modify: `docs/.vitepress/config.mts`
- Modify: `.gitignore`

- [ ] **Step 1: 在 config.mts 顶部定义常量 + 增加文件路径**

在 `config.mts` 现有 `import ... readFileSync, writeFileSync ...` 行已包含需要的 fs API。在文件顶部（`const __dirname = ...` 之后）追加两个常量：

```ts
const MCP_TOOLS_URL = 'https://openapi.longbridge.com/mcp/tools.json'
const MCP_TOOLS_DATA_PATH = resolve(__dirname, 'data/mcp-tools.json')
const MCP_TOOLS_SNAPSHOT_PATH = resolve(__dirname, 'data/mcp-tools.snapshot.json')
```

- [ ] **Step 2: 在 vite.plugins 数组里加 fetch-mcp-tools plugin**

定位到 `config.mts` 的 `vite.plugins: [...]` 数组。在 `groupIconVitePlugin()` 之前插入：

```ts
{
  name: 'fetch-mcp-tools',
  async buildStart() {
    try {
      const res = await fetch(MCP_TOOLS_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      writeFileSync(MCP_TOOLS_DATA_PATH, JSON.stringify(json, null, 2))
      console.log('✓ mcp-tools.json fetched')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`⚠ fetch mcp tools failed (${msg}), falling back to snapshot`)
      const snapshot = readFileSync(MCP_TOOLS_SNAPSHOT_PATH, 'utf-8')
      writeFileSync(MCP_TOOLS_DATA_PATH, snapshot)
    }
  },
},
```

插入后的 plugins 数组顺序应为：`fetch-mcp-tools` → `groupIconVitePlugin()` → `Unocss(...)` → `inject-extra-script`。

- [ ] **Step 3: 更新 .gitignore**

在 `.gitignore` 末尾追加：

```
# generated at build time by fetch-mcp-tools plugin
docs/.vitepress/data/mcp-tools.json
```

- [ ] **Step 4: 启动 dev 验证 plugin 跑起来**

Run: `bun run dev`
Expected:
- 控制台打印 `✓ mcp-tools.json fetched`（若能访问到 xyz）或 `⚠ fetch mcp tools failed ..., falling back to snapshot`（任一情况都正常）
- 文件 `docs/.vitepress/data/mcp-tools.json` 存在且为合法 JSON

校验：
Run: `python3 -c "import json; d=json.load(open('docs/.vitepress/data/mcp-tools.json')); print(len(d['tools']))"`
Expected: 整数（预期 100+）。

停止 dev。

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/config.mts .gitignore
git commit -m "feat(build): add fetch-mcp-tools vite plugin with snapshot fallback"
```

---

## Task 7: 写 McpTools.vue 组件

**Files:**
- Create: `docs/.vitepress/theme/components/McpTools.vue`

- [ ] **Step 1: 创建组件文件**

创建 `docs/.vitepress/theme/components/McpTools.vue`：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import toolsData from '../../data/mcp-tools.json'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion'

interface SchemaProperty {
  type: string | string[]
  description?: string
  enum?: string[]
  default?: unknown
  format?: string
  minimum?: number
  maximum?: number
}

interface ToolSchema {
  properties?: Record<string, SchemaProperty>
  required?: string[]
}

interface Tool {
  name: string
  description: string
  inputSchema?: ToolSchema
}

interface ToolsPayload {
  tools: Tool[]
}

interface ParamRow {
  name: string
  type: string
  required: boolean
  description?: string
  enum?: string[]
  default?: unknown
  format?: string
}

const allTools: Tool[] = (toolsData as ToolsPayload).tools

const query = ref('')

const filtered = computed<Tool[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allTools
  return allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
  )
})

function formatType(type: string | string[]): string {
  return Array.isArray(type) ? type.join(' | ') : type
}

function getParams(schema?: ToolSchema): ParamRow[] {
  if (!schema?.properties) return []
  const required = new Set(schema.required ?? [])
  return Object.entries(schema.properties).map(([name, def]) => ({
    name,
    type: formatType(def.type),
    required: required.has(name),
    description: def.description,
    enum: def.enum,
    default: def.default,
    format: def.format,
  }))
}
</script>

<template>
  <div class="mcp-tools">
    <div class="mcp-tools-search">
      <input
        v-model="query"
        type="text"
        class="mcp-tools-input"
        placeholder="Search tools by name or description..."
      />
      <span class="mcp-tools-count">{{ filtered.length }} of {{ allTools.length }}</span>
    </div>

    <div v-if="filtered.length === 0" class="mcp-tools-empty">
      No tools match "{{ query }}"
    </div>

    <Accordion v-else type="single" collapsible class="mcp-tools-list">
      <AccordionItem
        v-for="tool in filtered"
        :key="tool.name"
        :value="tool.name"
      >
        <AccordionTrigger>
          <code class="mcp-tool-name">{{ tool.name }}</code>
        </AccordionTrigger>
        <AccordionContent>
          <p class="mcp-tool-desc">{{ tool.description }}</p>

          <p v-if="getParams(tool.inputSchema).length === 0" class="mcp-tool-no-params">
            No parameters
          </p>

          <template v-else>
            <h4 class="mcp-params-title">Parameters</h4>
            <dl class="mcp-params">
              <div
                v-for="p in getParams(tool.inputSchema)"
                :key="p.name"
                class="mcp-param"
              >
                <dt class="mcp-param-head">
                  <code class="mcp-param-name">{{ p.name }}</code>
                  <span class="mcp-param-type">{{ p.type }}</span>
                  <span v-if="p.required" class="mcp-param-required">Required</span>
                </dt>
                <dd class="mcp-param-body">
                  <p v-if="p.description" class="mcp-param-desc">{{ p.description }}</p>
                  <p v-if="p.enum" class="mcp-param-meta">
                    Enum: {{ p.enum.map((e) => `"${e}"`).join(' | ') }}
                  </p>
                  <p v-if="p.default !== undefined" class="mcp-param-meta">
                    Default: {{ p.default }}
                  </p>
                  <p v-if="p.format" class="mcp-param-meta">
                    Format: {{ p.format }}
                  </p>
                </dd>
              </div>
            </dl>
          </template>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style scoped>
.mcp-tools {
  margin: 1rem 0;
}

.mcp-tools-search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  position: sticky;
  top: var(--vp-nav-height, 64px);
  z-index: 1;
  background: var(--vp-c-bg);
}
.mcp-tools-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  outline: none;
}
.mcp-tools-input:focus {
  border-color: var(--vp-c-brand-1);
}
.mcp-tools-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.mcp-tools-empty {
  padding: 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.mcp-tools-list {
  border-top: 1px solid var(--vp-c-divider);
}

.mcp-tool-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  background: transparent;
  padding: 0;
}

.mcp-tool-desc {
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-2);
}

.mcp-tool-no-params {
  margin: 0;
  color: var(--vp-c-text-3);
  font-style: italic;
  font-size: 0.85rem;
}

.mcp-params-title {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mcp-params {
  margin: 0;
  padding: 0;
}

.mcp-param {
  padding: 0.5rem 0;
  border-top: 1px dashed var(--vp-c-divider);
}
.mcp-param:first-child {
  border-top: 0;
  padding-top: 0;
}

.mcp-param-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 0.25rem;
}

.mcp-param-name {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
}

.mcp-param-type {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}

.mcp-param-required {
  font-size: 0.7rem;
  font-weight: 600;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mcp-param-body {
  margin: 0;
  padding-left: 0;
}

.mcp-param-desc {
  margin: 0 0 0.25rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.mcp-param-meta {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}
</style>
```

- [ ] **Step 2: 启动 dev 验证组件渲染**

Run: `bun run dev`
Expected: `/docs/mcp` 页打开后 Available tools 章节下：
- 看到搜索框 + `108 of 108`（或当前实际工具数）
- Accordion 列表渲染，每项是等宽字体工具名
- **本 step 不必验证 `<McpTools />` 能否被识别** — 组件未注册到全局，会报 `Failed to resolve component: McpTools`。下一任务解决。

停止 dev。

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/McpTools.vue
git commit -m "feat(mcp): add McpTools component with search and accordion"
```

---

## Task 8: 把 McpTools 注册到全局组件

**Files:**
- Modify: `docs/.vitepress/theme/components/index.ts`

- [ ] **Step 1: 修改 index.ts**

当前：
```ts
export { default as CliCommand } from './CliCommand.vue'
export { default as Tabs } from './Tabs.vue'
export { default as TabItem } from './TabItem.vue'
export { default as TipContainer } from './TipContainer.vue'
export { default as SDKLinks } from './SDKLinks.vue'
export { default as SDK } from './SDK.vue'
export { default as Skill } from './Skill.vue'
export { default as TryIt } from './TryIt/index.vue'
export { default as HomePage } from './HomePage/index.vue'
export { default as NewHomePage } from './NewHomePage/index.vue'
```

在末尾追加：
```ts
export { default as McpTools } from './McpTools.vue'
```

（`theme/index.ts` 的 `enhanceApp` 会自动把所有 exports 通过 `app.component()` 注册。）

- [ ] **Step 2: 启动 dev 做功能验证**

Run: `bun run dev`

打开 `http://localhost:8000/docs/mcp`，逐项验证：

1. ✅ 顶层导航 `Home · Skill · Docs · CLI · MCP · API Reference · SDK · Feedback`，MCP 高亮。
2. ✅ 页面无左侧 sidebar。
3. ✅ 章节顺序：Available capabilities → Available tools → Prerequisites → Client setup。
4. ✅ Available tools 下显示搜索框，右侧计数 `XXX of XXX`。
5. ✅ Accordion **初始全部折叠**。
6. ✅ 点击任一工具名（如 `quote`），展开显示 description + Parameters 列表。
7. ✅ 再点击另一项（如 `candlesticks`），上一项**自动收起**（single 模式行为）。
8. ✅ 搜索框输入 `alert`：列表过滤到 `alert_*` 系列，计数同步更新。
9. ✅ 搜索框输入 `zzz_nomatch`：显示 `No tools match "zzz_nomatch"`。
10. ✅ 展开 `account_balance`：显示 "No parameters"（无参数工具）。
11. ✅ 展开 `submit_order` 或其他复杂工具：Required 徽章显示正确，联合类型（如 `string | null`）格式对，enum/default/format 附注行显示。

访问 `/zh-CN/docs/mcp` 和 `/zh-HK/docs/mcp`：
- 章节标题为"可用能力 / 可用工具 / 前置条件"或繁体对应翻译
- `<McpTools />` 渲染一致（工具列表、搜索框 placeholder 本期硬编码英文，这是预期）

停止 dev。

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/components/index.ts
git commit -m "feat(mcp): register McpTools as global component"
```

---

## Task 9: 生产构建验证

**Files:** 无改动，仅运行构建命令。

- [ ] **Step 1: canary 构建**

Run: `bun run build:canary`
Expected:
- 构建成功，无 error（warnings 可接受但不应有报错）
- 输出中看到 `✓ mcp-tools.json fetched` 或 `⚠ fetch mcp tools failed ..., falling back to snapshot`
- `dist/docs/mcp.html` 或 `dist/docs/mcp/index.html` 存在
- `dist/zh-CN/docs/mcp.html` 或 `dist/zh-CN/docs/mcp/index.html` 存在
- `dist/zh-HK/docs/mcp.html` 或 `dist/zh-HK/docs/mcp/index.html` 存在

校验文件存在（两种 cleanUrls 产物形式任一命中即可）：
Run: `ls dist/docs/mcp* dist/zh-CN/docs/mcp* dist/zh-HK/docs/mcp* 2>/dev/null`
Expected: 三个文件都存在。

- [ ] **Step 2: 校验 build 产物里有工具列表数据**

Run: `grep -o '"name":"account_balance"' dist/assets/*.js | head -1`
Expected: 至少一条匹配——tools 数据被打包进了 JS 产物。若匹配为空，可能 chunk 被切分得跨文件，改查 `dist/assets/*.json`：
Run: `grep -l 'account_balance' dist/assets/*.js dist/assets/*.json 2>/dev/null | head`

- [ ] **Step 3: preview 并肉眼验收**

Run: `bun run preview`
Expected: 启动 preview 服务器，访问 `http://localhost:4173/docs/mcp`（VitePress 默认 preview 端口）——和 dev 模式一样全部交互可用。

停止 preview：`Ctrl+C`。

- [ ] **Step 4: 无需 commit（没有文件改动）**

---

## Task 10: 断网回退路径验证（可选但推荐）

**Files:** 无改动。本任务证明 snapshot fallback 能兜住网络失败。

- [ ] **Step 1: 临时改坏 URL 触发回退**

临时修改 `docs/.vitepress/config.mts` 的 `MCP_TOOLS_URL` 为 `https://openapi.longbridge.com/mcp/tools.json-nonexistent` 或任意无法解析的域名。

- [ ] **Step 2: 跑 dev，确认回退**

Run: `bun run dev`
Expected:
- 控制台打印 `⚠ fetch mcp tools failed ..., falling back to snapshot`
- 访问 `/docs/mcp`，Available tools 列表仍然渲染（数据来自 snapshot）

停止 dev。

- [ ] **Step 3: 还原 URL**

把 `MCP_TOOLS_URL` 改回 `https://openapi.longbridge.com/mcp/tools.json`。

- [ ] **Step 4: 确认变更已还原**

Run: `git diff docs/.vitepress/config.mts`
Expected: 无输出（本地已还原到 commit 状态）。

- [ ] **Step 5: 无需 commit**

---

## URL 说明

本项目自始至终使用 `.com` 正式地址 `https://openapi.longbridge.com/mcp/tools.json`，无需切换。

---

## 完成标志

所有以上任务 ✅ 后：
- 顶层导航加入 MCP
- MCP 页章节重排并包含动态工具列表
- 构建时拉取 + 快照回退双路径都验证通过
- dev / canary / preview 全链路可跑

Plan 结束。
