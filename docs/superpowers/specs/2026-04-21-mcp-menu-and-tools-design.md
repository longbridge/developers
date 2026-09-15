# MCP 顶层菜单与 Available tools 组件

**日期**: 2026-04-21
**状态**: Draft

## 背景与目标

Longbridge Developers 站现在把 MCP 作为 Docs 侧边栏里的一个子页（`sidebar_position: 2.2`）。MCP 现在是 Longbridge 对外的重要能力，页面访问优先级被 "Docs" 这一层嵌套稀释。与此同时，MCP 服务已经暴露了 108 个具体工具（`https://openapi.longbridge.xyz/mcp/tools.json`），文档里只笼统描述了三大类能力（Market data / Account / Trading），读者无法直接看到可用工具的清单和入参。

本设计要解决两件事：

1. 把 MCP 提升为顶层导航入口（路径维持 `/docs/mcp`，与 CLI 的 `/docs/cli`、API Reference 的 `/docs/api` 同模式），紧跟在 CLI 之后。
2. 在 MCP 页新增 **Available tools** 小节，按构建时拉取的 `tools.json` 渲染 108 个工具的可搜索折叠列表。

## 非目标

- 不重做 MCP 页的其他内容（OAuth flow、Client setup 等均保持原样）。
- 不为工具列表加后端分类维度（等 `tools.json` 暴露 category 字段再议）。
- 不处理 MCP endpoint 相关的 region 切换（已有 tip 块沿用）。

## 需求与决策

| 项 | 决策 |
|---|---|
| 顶层菜单位置 | CLI 之后，使用 label `MCP`，链接 `/docs/mcp`（en）/ `/${lang}/docs/mcp`（zh）|
| MCP 在 Docs 侧边栏 | **移除**，避免两处入口 |
| 章节顺序 | Available capabilities → Available tools（新增）→ Prerequisites |
| Accordion 组件 | 基于 `reka-ui`（shadcn-vue 的 Accordion 生成物） |
| 数据获取 | 构建时（`buildStart` 钩子）拉取，写入 `docs/.vitepress/data/mcp-tools.json` |
| 拉取失败 | 回退到仓库内 `mcp-tools.snapshot.json` |
| 展示方式 | 扁平列表 + 顶部搜索框（按 name / description 模糊匹配） |
| Accordion 行为 | `type="single"`，初始全部折叠，展开新条目时上一条自动收起 |
| 排序 | 沿用 `tools.json` 原顺序 |
| 参数展示 | 描述段落 + `Parameters` DL 列表，支持联合类型、enum、default、format |
| dev 模式 | `bun run dev` 也走 buildStart，失败落回 snapshot |
| tools.json URL | 常量 `MCP_TOOLS_URL`，当前 `https://openapi.longbridge.xyz/mcp/tools.json`，后续切 `https://openapi.longbridge.com/mcp/tools.json` |

## 架构

三条独立修改路径，文件相互解耦：

```
1. 导航：三份 nav.ts 各插一条
2. 文档：三份 mcp.md 调整章节顺序 + 插入 <McpTools />
3. 组件：
   ├─ 构建钩子：config.mts::buildStart 拉取 tools.json
   ├─ 数据文件：data/mcp-tools.json（生成）+ mcp-tools.snapshot.json（回退）
   ├─ UI 组件：components/McpTools.vue（搜索 + 渲染）
   └─ Accordion：components/ui/accordion/*（shadcn-vue 生成）
```

## 详细设计

### 1. 导航变更

**文件**: `docs/.vitepress/locales/{en,zh-CN,zh-HK}/nav.ts`

三份 nav 在 CLI 条目后插入 MCP：

```ts
// en
{ text: 'CLI', link: '/docs/cli', activeMatch: '^(/en)?/docs/cli' },
{ text: 'MCP', link: '/docs/mcp', activeMatch: '^(/en)?/docs/mcp' },
{ text: 'API Reference', ... }

// zh-CN / zh-HK
{ text: 'CLI', link: `/${lang}/docs/cli`, activeMatch: `^/${lang}/docs/cli` },
{ text: 'MCP', link: `/${lang}/docs/mcp`, activeMatch: `^/${lang}/docs/mcp` },
{ text: 'API 参考' / 'API 參考', ... }
```

三语言 label 统一 `MCP`。

### 2. MCP 页章节调整

**文件**: `docs/{en,zh-CN,zh-HK}/docs/mcp.md`

**frontmatter 调整**：

- 删除 `sidebar_position`、`sidebar_label: MCP`、`sidebarCollapsed`、`sidebar_icon`——这些给 Docs 侧边栏用，MCP 从 Docs sidebar 移除后不再需要。
- 新增 `sidebar: false`（VitePress 原生支持，参考 `docs/en/sdk.md` 同款用法）——MCP 页本身不显示任何侧边栏。
- 保留 `slug: /mcp`、`id: mcp`、`title`。

**MCP 从 Docs 侧边栏列表中移除**：

`docs/.vitepress/theme/utils/gen.ts::genMarkdowDocs()` 目前通过 `options.exclude` 过滤顶层**目录**（当前用法 `exclude: ['cli']`），但不支持过滤单个 markdown 文件。由于 MCP 是文件而非目录，采用 `buildCliSidebar` 同款模式——在 `locales/{lang}/sidebar.ts` 里包一层过滤函数：

```ts
// locales/en/sidebar.ts
const docsSidebar = genMarkdowDocs('en', 'docs', { exclude: ['cli'] })

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

三份 `sidebar.ts`（en / zh-CN / zh-HK）同步此改动。

**章节顺序**：

```markdown
# Longbridge MCP Service

（引言 + tip 块：Global / Mainland China endpoint，保持原样）

## Available capabilities        ← 从第二位上移
（表格：Market data / Account information / Trading actions，保持原样）

## Available tools                ← 新增
<McpTools />

## Prerequisites                  ← 从第一位下移
（原内容不动）

## Client setup                   ← 往下一切不变
...
```

三语言版本同步此改动，章节标题按现有翻译习惯：
- en: `Available tools`
- zh-CN: `可用工具`
- zh-HK: `可用工具`

### 3. 构建时数据拉取

**文件**: `docs/.vitepress/config.mts`

在现有配置对象上添加 `buildStart` 钩子（VitePress 配置钩子）。若 VitePress 本身的生命周期不暴露合适钩子，用 Vite plugin `buildStart`。优先选择方案：Vite plugin，落在 `plugins:` 数组里，与 `inject-extra-script` 同层。

```ts
// 常量：两套 URL，切换只改这一行
const MCP_TOOLS_URL = 'https://openapi.longbridge.xyz/mcp/tools.json'
const MCP_TOOLS_DATA = resolve(__dirname, 'data/mcp-tools.json')
const MCP_TOOLS_SNAPSHOT = resolve(__dirname, 'data/mcp-tools.snapshot.json')

{
  name: 'fetch-mcp-tools',
  async buildStart() {
    try {
      const res = await fetch(MCP_TOOLS_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      writeFileSync(MCP_TOOLS_DATA, JSON.stringify(json, null, 2))
      console.log('✓ mcp-tools.json fetched')
    } catch (err) {
      console.warn(`⚠ fetch mcp tools failed: ${err.message}, falling back to snapshot`)
      const snapshot = readFileSync(MCP_TOOLS_SNAPSHOT, 'utf-8')
      writeFileSync(MCP_TOOLS_DATA, snapshot)
    }
  },
}
```

关键点：
- `buildStart` 是 Vite 生命周期钩子，在 `bun run dev` 和 `bun run build` 都会触发。
- 产物 `data/mcp-tools.json` 加入 `.gitignore`；`data/mcp-tools.snapshot.json` 入仓。
- 首次 snapshot 在实施阶段从 `xyz` 地址手动抓取一次，提交到仓库。

**文件**: `.gitignore`

追加一行：
```
docs/.vitepress/data/mcp-tools.json
```

### 4. UI 组件

**4.1 shadcn-vue Accordion 安装**

执行 `pnpm dlx shadcn-vue@latest add accordion`，落地目录为 `docs/.vitepress/theme/components/ui/accordion/`。预期生成 4 个文件：`Accordion.vue`、`AccordionItem.vue`、`AccordionTrigger.vue`、`AccordionContent.vue`。依赖新增 `reka-ui`。

若 `shadcn-vue` CLI 与本项目现有 UnoCSS / Vitepress 主题冲突，改为**手动从 shadcn-vue 文档页复制源码**落地到相同路径——本质一样，只是跳过 CLI。

**4.2 McpTools.vue 结构**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import toolsData from '../data/mcp-tools.json'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion'

interface ToolSchema {
  properties?: Record<string, {
    type: string | string[]
    description?: string
    enum?: string[]
    default?: unknown
    format?: string
    minimum?: number
    maximum?: number
  }>
  required?: string[]
}

interface Tool {
  name: string
  description: string
  inputSchema?: ToolSchema
}

const allTools: Tool[] = toolsData.tools
const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allTools
  return allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
  )
})

function formatType(type: string | string[]): string {
  if (Array.isArray(type)) return type.join(' | ')
  return type
}

function getParams(schema?: ToolSchema) {
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
      <input v-model="query" type="text" placeholder="Search tools..." />
      <span class="count">{{ filtered.length }} of {{ allTools.length }}</span>
    </div>

    <div v-if="filtered.length === 0" class="empty">
      No tools match "{{ query }}"
    </div>

    <Accordion v-else type="single" collapsible>
      <AccordionItem
        v-for="tool in filtered"
        :key="tool.name"
        :value="tool.name"
      >
        <AccordionTrigger>
          <code class="tool-name">{{ tool.name }}</code>
        </AccordionTrigger>
        <AccordionContent>
          <p class="tool-desc">{{ tool.description }}</p>
          <template v-if="getParams(tool.inputSchema).length === 0">
            <p class="no-params">No parameters</p>
          </template>
          <template v-else>
            <h4 class="params-title">Parameters</h4>
            <dl class="params">
              <div v-for="p in getParams(tool.inputSchema)" :key="p.name" class="param">
                <dt>
                  <code>{{ p.name }}</code>
                  <span class="type">{{ p.type }}</span>
                  <span v-if="p.required" class="required">Required</span>
                </dt>
                <dd>
                  <p v-if="p.description">{{ p.description }}</p>
                  <p v-if="p.enum" class="meta">Enum: {{ p.enum.map(e => `"${e}"`).join(' | ') }}</p>
                  <p v-if="p.default !== undefined" class="meta">Default: {{ p.default }}</p>
                  <p v-if="p.format" class="meta">Format: {{ p.format }}</p>
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
/* 与站内 TipContainer / CliCommand 视觉一致 */
.mcp-tools-search { /* 顶部 sticky，输入框 + 计数 */ }
.tool-name { font-family: ui-monospace, ...; }
.type { color: var(--vp-c-text-2); font-size: 0.8em; }
.required { color: var(--vp-c-danger-1); font-size: 0.75em; ... }
.params dt { display: flex; gap: 0.5rem; align-items: baseline; }
.meta { color: var(--vp-c-text-2); font-size: 0.85em; }
/* ...完整样式在实施时细化 */
</style>
```

**4.3 全局注册**

`docs/.vitepress/theme/components/index.ts` 追加：

```ts
export { default as McpTools } from './McpTools.vue'
```

`theme/index.ts` 的 `enhanceApp` 里已经 `for (const component of Object.keys(components)) app.component(...)` 自动注册所有 exports，无需额外改动。

### 5. 国际化

- 三份 mcp.md 同步章节顺序与 `<McpTools />` 插入点。
- 搜索框 placeholder、No parameters、No tools match 等组件内文案先用英文固定；如需 i18n，后续用 `useData()` 的 `lang` 分支（与 `Skill.vue` 同模式）。**本期先硬编码英文**，避免把简单组件先复杂化。

## 数据与错误处理

**类型定义**: 参照 `tools.json` 真实结构。`type` 字段可能是 `string` 或 `string[]`（联合类型如 `["string","null"]`）。

**构建失败场景**:

| 场景 | 行为 |
|---|---|
| 网络成功 + JSON 合法 | 写入 `data/mcp-tools.json` |
| 网络失败 / 超时 | 读 `mcp-tools.snapshot.json` 写入 `data/mcp-tools.json`；控制台 warn |
| 网络成功 + JSON 非法 | 同上（try/catch 包住） |
| `mcp-tools.snapshot.json` 不存在 | 报错并抛异常（视为仓库状态坏了，需人工修复） |

**运行时场景**: 组件纯静态，无运行时网络失败。搜索空态用组件内分支处理。

## 构建产物影响

- 首次构建后 `data/mcp-tools.json` 约 40KB（108 条 JSON）；gzip 后约 8KB。可接受。
- 组件代码 + reka-ui Accordion ≈ 新增 15KB JS。
- build:llms 任务不受影响（llms.txt 生成逻辑基于 markdown，不扫组件源码）。

## 测试与验收

无自动化测试套件（`CLAUDE.md` 明确"无测试命令"）。手动验收清单：

1. `bun run dev` 启动后访问 `/docs/mcp`、`/zh-CN/docs/mcp`、`/zh-HK/docs/mcp` 三地址都能正常渲染。
2. 顶层导航栏按 `Home · Skill · Docs · CLI · MCP · API Reference · SDK · Feedback` 排列，MCP 当前页会高亮。
3. Docs 页面侧边栏里不再出现 MCP 条目。
4. MCP 页章节顺序为 Available capabilities → Available tools → Prerequisites → Client setup → ...。
5. Available tools：
   - 初始全部折叠。
   - 点击任一项展开，再点另一项，上一项自动收起（single 模式）。
   - 搜索框输入 `quote` / `alert` 能过滤，顶部计数同步。
   - 无参数工具（如 `account_balance`）展开显示 "No parameters"。
   - 有参数工具（如 `submit_order`）展开显示参数 DL 列表，Required 徽章显示正确。
   - 联合类型参数显示为 `string | null`。
   - 有 enum / default / format 的参数显示附注小字。
6. 断网情况下 `bun run dev` 仍能启动，控制台有 warn，页面用 snapshot 渲染。
7. `bun run build:canary` / `build:release` 成功产出，`dist/` 里能看到 /mcp 页。
8. URL 常量从 `xyz` 改到 `com` 是一行改动，切换后构建成功。

## 实施顺序

1. 导航改动（三份 nav.ts）。
2. 三份 sidebar.ts 加 `buildDocsSidebar` 过滤 MCP。
3. 三份 mcp.md：frontmatter 加 `sidebar: false`、章节调顺序、插入 `<McpTools />`。
4. shadcn-vue Accordion 落地到 `components/ui/accordion/`（依赖新增 `reka-ui`）。
5. 首次抓取 `tools.json` 作为 snapshot 提交到 `data/mcp-tools.snapshot.json`。
6. 写 buildStart Vite plugin + `.gitignore`。
7. 写 `McpTools.vue` + 在 `components/index.ts` 追加 export。
8. 手动验收（按"测试与验收"清单）。

## 风险与后续

- ~~**MCP 从 Docs sidebar 移除的实现方式**~~ —— 已在设计中定型，用 `buildCliSidebar` 同款过滤函数模式，无需改动 `gen.ts`。
- **`xyz` 域名未开放 CORS/公网访问**：构建机环境视具体部署而定。snapshot 回退机制能保证文档始终可构建。
- **tools.json 结构后续扩展**（如 category 字段）不会 break 当前组件，因为组件只读 `name` / `description` / `inputSchema`。

## 参考

- 现有导航配置: `docs/.vitepress/locales/{lang}/nav.ts`
- 现有 MCP 页: `docs/{lang}/docs/mcp.md`
- 组件注册模式: `docs/.vitepress/theme/components/index.ts`
- 工具数据源: `https://openapi.longbridge.xyz/mcp/tools.json`（后续切 `.com`）
- shadcn-vue Accordion: `https://ui.shadcn.com/docs/components/radix/accordion`
