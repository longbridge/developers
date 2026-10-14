# openapi-website → Astro 迁移设计

- 状态：Draft — 待 boss review
- 分支：`feat/migrate-to-astro`（worktree at `/Users/tangyu/Documents/longbirdge/openapi-website-astro`）
- 基线：`main @ ee8224b3`
- 参考实现：`/Users/tangyu/Documents/longbirdge/whale-apidocs`
- Nginx 仓库：`/Users/tangyu/Documents/longbirdge/websites-nginx/config/sites/open.longbridge.com/`
- Canary 域名：`open.longbridge.xyz`
- 更新日期：2026-08-17

## -1. 最高优先级约束（2026-08-17 追加）

**用户体感等价 = 一切设计的顶层约束**。用户打开新站与旧站，感知层面完全不应有可察觉差异：

- **路由**：URL 集合逐条相等；hash 锚点行为一致；trailing slash 一致
- **视觉**：截图 diff 在 §9.5 阈值内；字体、色值、间距、动画时长、shadow、光标态、hover 态全部对齐
- **交互**：点击 / hover / 键盘 / focus 顺序 / 快捷键 / 弹窗触发 / 滚动记忆 / 表单验证时机 全部对齐
- **加载体感**:FCP / LCP 相对旧站不劣化 5% 以上;骨架屏 / spinner 出现时机一致
- **搜索**:结果排序 / 高亮 / 快捷键 (`Cmd+K` / `/`) / 弹窗尺寸 / 空态提示 一致
- **组件行为**:Tabs / Accordion / TipContainer / TryIt 展开 - 收起动画曲线与时长对齐

**内部实现**可以彻底换（Vue → React、UnoCSS → Tailwind v4、jsonforms → react-hook-form、vitepress → astro），**外部体感**必须零变化。任何偷偷改进体感的冲动（"顺便优化下动画曲线"、"顺便调整下 padding"、"顺便换个更好的搜索排序"）在本轮迁移中**一律禁止**，作为独立需求另开。

**已批准的例外**：
- **shiki 代码高亮 token 色差 ≤ 2%**（决策 #18 选 A：升级到 Astro 内置 shiki，同主题下 token 颜色 diff 阈值 ≤2%）— shiki 版本升级不可避免，与 Astro 内置管线绑定，接受该阈值内可能存在的极小色差。

opencli 校验层（§9）除 DOM / 视觉 / URL diff 外，追加 **§9.8 体感断言层**。

## 0. TL;DR

把 openapi-website 从 VitePress 2.0-alpha + Vue 3 迁到 **Astro 7 SSG + React 19 + Tailwind v4**，架构对齐 whale-apidocs（不引入 nimbus-docs）。

**硬约束**：
- **URL 集合与迁前完全一致**（不增不减不改）
- 样式与迁前视觉等价（阈值见 §9）
- 交互契约与迁前一致（TryIt / 主题 / i18n / 搜索 / Sidebar / Region 全部）
- 内容源保持 `docs/{lang}/`，882 篇仅做 `.md` → `.mdx` 后缀转换

**激进项**（一次到位）：
- md → mdx 全量转
- 95 个 Vue 组件全部 port 到 React
- 样式一次删净 UnoCSS + 全 SCSS，只留 Tailwind v4 + `tokens.css`
- 抽 6 个 workspace 包
- TryIt 弃 `@jsonforms`，改 `react-hook-form` + 自研 SchemaRenderer
- 搜索走 Pagefind + LLM `.md` 导出
- vitepress 依赖直接删

**保守项**（因 URL 不变约束）：
- Sidebar 配置沿用 `_category_.json` + md frontmatter（不搞中心化 `docs.json`）
- **ApiReference 保持运行时 CSR 单页**（`/docs/api` URL 不变）；不做构建期每 op 一路由

**拆除项**（阶段 1 步骤 0 一次到位，见 §10.5）：
- `docs/.vitepress/` 整个目录 `git rm`
- `docs/postcss.config.mjs` / `docs/unocss.config.ts` `git rm`
- `package.json` 删依赖：`vitepress` / `vue` / `vue-i18n` / `reka-ui` / `@headlessui/vue` / `floating-vue` / `@vueuse/core` / `motion-v` / `@vue-flow/*` / `@jsonforms/vue*` / `unocss` / `@unocss/*` / `sass-embedded` / `vitepress-plugin-*` / `@vitejs/plugin-vue` / `vue-tsc` / `markdown-it-container` / `markdown-it-mathjax3`
- `package.json scripts`：`dev` / `dev:canary` / `dev:cn` / `build:canary` / `build:release` / `build:cn` / `preview` 里的 `vitepress` 命令全换 `astro`
- 拆除完 grep 校验：`grep -r "vitepress\|vue" package.json src/` 应无非 workspace 结果

## 1. 目标 / 非目标

### 目标

1. **URL 逐条相等**：全部现存页面（`/docs/...`、`/zh-CN/docs/...`、`/zh-HK/docs/...`、`/pricing`、`/skill`、`/docs/api`、`/sdk`、首页、404）与迁前完全一致，无新增/删除/重定向。
2. **视觉稳定**：同视口下截图差异 ≤ 阈值（首屏 ≤ 2%、正文 ≤ 1%、动画 / TryIt ≤ 5%）。
3. **交互稳定**：TryIt / ApiReference / 主题切换 / i18n 切换 / 侧栏折叠 / Region 切换 / 搜索 / 面包屑 / hash 锚点 —— 行为契约与迁前一致，opencli 可断言。
4. **内容不迁位**：882 篇内容文件保持在 `docs/{en,zh-CN,zh-HK}/`，仅做 `.md` → `.mdx` 后缀转换 + 语法 escape。frontmatter 字段一字不改。
5. **构建产物拓扑**：`dist/{page}.html` + `dist/{page}/index.html` 双份仍在；`llms.txt` / `llms-full.txt` / `sitemap.xml` / `hashmap.json` 全部产出。
6. **CI 单轨**：删除 VitePress 依赖与构建路径，不留 fallback。

### 非目标

- 不重构文档信息架构（不改章节层级、不改 slug）。
- 不改视觉方向。
- 不改业务 API 域名 / 鉴权 / 数据契约。
- 不引入 nimbus-docs。
- **不为 SEO / LLM 拆 API op 为独立路由**（那会新增 URL，违反 §1.1）。

## 2. 阶段结构

| 阶段 | 内容 | 出口 |
|---|---|---|
| **0. 准备** | worktree（已建）+ spec 落定 | boss approve spec |
| **1. 架构 + primitives + shell** | Astro 骨架、Content Collections、i18n 路由、slug 重写、Sidebar 生成、Layout、shell 组件、主题、Region、搜索、部署脚本、`packages/ui` primitives 全部完成 | opencli 全站跑通、DOM 拓扑等价 ≥ 95%、URL 集合与迁前 diff = ∅ |
| **2. 复杂业务组件** | TryIt / ApiReference / NewHomePage / inspira / SkillCatalog / Pricing / QuotePermission / McpTools 一次到位；抽 6 个 workspace 包 | 视觉 diff 全绿 + 交互断言全通 |
| **3. 切换** | canary `open.longbridge.xyz` 灰度、观察一周、切生产 `open.longportapp.com` | 无回滚 |

阶段 1 不做 stub —— primitives 直接实现完整；仅 TryIt / ApiReference / NewHomePage 三大 composite 组件先接 placeholder（不影响其他页），阶段 2 补齐。

## 3. 技术栈选型

| 层 | 选型 | 备注 |
|---|---|---|
| 框架 | **Astro 7.x** SSG，`build.format: "file"` | 与 whale-apidocs 对齐 |
| UI | **React 19** + `@astrojs/react` | 单一 UI 语言 |
| 样式 | **Tailwind v4** (`@tailwindcss/vite`) + 单一 `tokens.css` | 删 UnoCSS + 大部分 SCSS |
| MDX | `@astrojs/mdx` + shiki + 自研 rehype 集 | 参考 whale-apidocs `plugins/satteri/` |
| 高亮 | **shiki**（inline `--shiki-light/--shiki-dark`） | 保留 `naviGrammar` 自定义语法 |
| 搜索 | **Pagefind** + `/{locale}/[...slug].md.ts` LLM 导出 | 弃 VitePress local search |
| Mermaid | `rehype-mermaid` 或参考 whale-apidocs 的 `satteri/mermaid` | |
| 图标 | `astro-icon` | |
| 运行时 | **Bun**（沿用），Node ≥ 24 | |
| Workspaces | Bun workspaces | |
| 部署 | Cloudflare Pages + Aliyun OSS 双发（不变） | |

## 4. 目录结构

```
openapi-website-astro/
├── astro.config.ts
├── package.json                             # bun workspaces
├── tsconfig.json
├── docs/                                    # 【保留】内容源，不迁位
│   ├── en/                                  # .md → .mdx（后缀转换）
│   │   ├── docs/                            # 业务 docs
│   │   ├── docs/api.mdx                     # 【关键】API Reference 单页 layout: api-reference
│   │   ├── pricing/index.mdx
│   │   ├── skill/index.mdx
│   │   ├── sdk.mdx
│   │   └── index.mdx                        # 首页
│   ├── zh-CN/
│   └── zh-HK/
├── openapi.yaml                             # 仅 en，翻译走独立需求
├── openapi/                                 # submodule 分片
├── region.config.ts
├── quote-permissions.yaml
├── public/
├── src/
│   ├── content.config.ts
│   ├── mdx-components.tsx                   # 12 种全局标签映射
│   ├── pages/
│   │   ├── index.astro                      # 复用 en/index.mdx
│   │   ├── [...slug].astro                  # en root 动态路由
│   │   ├── zh-CN/[...slug].astro
│   │   ├── zh-HK/[...slug].astro
│   │   ├── 404.astro
│   │   ├── sitemap.xml.ts
│   │   ├── llms.txt.ts
│   │   ├── llms-full.txt.ts
│   │   ├── robots.txt.ts
│   │   └── [locale]/[...slug].md.ts         # LLM .md 导出（非 sitemap URL，供 crawler）
│   ├── layouts/
│   │   ├── BaseLayout.astro                 # head + theme pre-paint + analytics
│   │   ├── DocsLayout.astro                 # 默认 docs 布局
│   │   ├── ApiReferenceLayout.astro         # /docs/api 专用（承接 layout: api-reference）
│   │   └── PlainLayout.astro                # pricing / skill / 首页
│   ├── components/
│   │   ├── shell/                           # Sidebar / LocalNav / Backdrop / SkipLink / TOC / Breadcrumb / TopNav / Footer
│   │   ├── mdx/                             # 12 种全局标签的 React 实现
│   │   ├── api-reference/                   # ApiReference CSR 组件 + 内部 op switcher（hash 路由）
│   │   ├── tryit/                           # TryIt 内部（AuthorizationForm / ParametersForm / PlayButton / renderers / clients）
│   │   ├── homepage/                        # NewHomePage 16 个 section + ArchCanvas
│   │   ├── inspira/                         # 19 个动画组件（React 复刻，非上游包）
│   │   └── skill-catalog/
│   ├── lib/
│   │   ├── openapi.ts                       # 客户端 CSR 加载 openapi.yaml?raw + js-yaml
│   │   ├── navigation.ts                    # 等价 gen.ts::genMarkdowDocs()
│   │   ├── slug.ts                          # 等价 rewriteMarkdownPath
│   │   ├── region.ts
│   │   ├── i18n.ts
│   │   ├── http-client.ts                   # TryIt 用
│   │   └── websocket-client.ts
│   ├── styles/
│   │   ├── tokens.css                       # 【唯一】设计 token 源
│   │   ├── global.css                       # tailwind base + reset
│   │   └── shiki.css
│   ├── data/
│   │   ├── nav.en.ts / nav.zh-CN.ts / nav.zh-HK.ts
│   │   └── locale.en.ts / locale.zh-CN.ts / locale.zh-HK.ts
│   └── scripts/
│       ├── prebuild-mcp-tools.ts
│       ├── prebuild-skills.ts
│       ├── copy-routes.ts                   # dir/index.html → dir.html
│       ├── generate-llms.ts
│       └── normalize-md.ts
├── packages/                                # 【阶段 2】
│   ├── ui/                                  # primitives
│   ├── api-reference/                       # ApiReference CSR + schema render
│   ├── tryit/
│   ├── inspira/
│   ├── homepage/
│   └── utils/
├── scripts/opencli/                         # A/B 对比脚本
│   ├── crawl-routes.ts
│   ├── snapshot.ts                          # chrome-devtools MCP 驱动
│   ├── dom-diff.ts
│   ├── visual-diff.ts
│   ├── interaction-assertions.ts
│   ├── url-diff.ts                          # 【新】旧 vs 新 URL 集合 diff = ∅ 校验
│   └── report.ts
└── docs/superpowers/specs/
```

**要点**：
- `docs/` 目录零迁位；rename `.md` → `.mdx`（git 追踪断裂由 `--follow` 处理）
- ApiReference 仍是单页 `/docs/api`，内部 op 切换走 hash（保持旧站行为）
- `src/components/api-reference/` 阶段 1 是 placeholder；阶段 2 完整 port（可能抽到 `packages/api-reference`）

## 5. 内容层：Content Collections + MDX

### 5.1 md → mdx 全量转换

一次性脚本 `scripts/convert-md-to-mdx.ts`：
1. `docs/{en,zh-CN,zh-HK}/**/*.md` 全部 rename `.mdx`（git mv 保留 history）
2. 扫裸露 `<` 与 `{` 字符（非 code fence 内），做 escape 或包 `{'<'}`
3. `<foo@bar.com>` 邮件语法 → `&lt;foo@bar.com&gt;`
4. 数学公式加装 `remark-math` + `rehype-katex`
5. 校验：`astro check` 通过

### 5.2 Collection 定义

`src/content.config.ts`：

```ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const docsSchema = z.object({
  title: z.string(),
  id: z.string().optional(),
  slug: z.string().optional(),
  sidebar_position: z.number().optional(),
  sidebar_icon: z.enum(['book_open','book','zap','cpu','terminal','sparkles']).optional(),
  layout: z.union([z.literal(false), z.string()]).optional(),   // 'api-reference' / false / undefined
  hide_breadcrumb: z.boolean().optional(),
})

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '{en,zh-CN,zh-HK}/**/*.mdx', base: '../docs' }),
    schema: docsSchema,
  }),
}
```

### 5.3 URL 计算

`src/lib/slug.ts` 严格等价 vitepress `rewriteMarkdownPath`：

- root locale (`en`) 剥前缀；`zh-CN`/`zh-HK` 保留前缀
- `index.mdx` → 目录路径
- frontmatter `slug` 覆盖：绝对 `/foo` 替换整段，相对 `foo/bar` 相对文件目录
- 单元测试用例覆盖：`docs/en/index.mdx` → `/`、`docs/en/docs/quote/pull/static.mdx` → `/docs/quote/pull/static`、`docs/zh-CN/pricing/index.mdx` → `/zh-CN/pricing`、含 `slug: /foo` 覆盖场景、含 `slug: bar` 相对场景

### 5.4 页面路由

`src/pages/[...slug].astro`：

```astro
---
export async function getStaticPaths() {
  const all = await getCollection('docs')
  const region = import.meta.env.PUBLIC_REGION ?? 'global'
  return all
    .filter(e => resolveLocale(e) === 'en')
    .filter(e => includedInRegion(resolveUrl(e), region))
    .map(e => ({ params: { slug: resolveUrl(e).replace(/^\//, '') || undefined }, props: { entry: e } }))
}
const { entry } = Astro.props
const { Content, headings } = await render(entry)
const Layout = entry.data.layout === 'api-reference'
  ? ApiReferenceLayout
  : entry.data.layout === false ? PlainLayout : DocsLayout
---
<Layout entry={entry} headings={headings}>
  <Content components={mdxComponents} />
</Layout>
```

`zh-CN/[...slug].astro` / `zh-HK/[...slug].astro` 同构，locale 过滤不同。

### 5.5 URL 集合校验（新增门禁）

`scripts/opencli/url-diff.ts`：
1. 抓旧 dist 的 `sitemap.xml` → URL 集 A
2. 抓新 dist 的 `sitemap.xml` → URL 集 B
3. Diff A vs B，允许集为空（`A △ B = ∅`）
4. 阶段 1 结束必须通过

### 5.6 双产物兼容

`astro:build:done` hook 里 `copy-routes.ts`：`foo/index.html` 复制一份到 `foo.html`。Nginx 侧规则不变。

## 6. Docs shell：Sidebar / Nav / Layout / 主题 / 搜索 / Region

### 6.1 Sidebar 配置：保留 `_category_.json` 现状

boss 决策：docs.json 与 openapi.yaml 保持现在的项目配置。信息架构维护方式与 vitepress 现状一致：

- `docs/{lang}/**/_category_.json` 保留（`{ label, position, icon, collapsed, collapsible, link }` 字段沿用）
- md frontmatter `sidebar_position` / `sidebar_icon` / `slug` / `title` 沿用
- 三语目录各维护一份 `_category_.json`（走现有人工翻译流）
- 无中心化 `docs.json`，无迁移脚本

对齐 openapi-website 现有 `CLAUDE.md` 的 "Sidebar 自动生成" 规约。

### 6.2 Sidebar 生成器

`src/lib/navigation.ts`：等价 vitepress `gen.ts::genMarkdowDocs()`：

1. 扫 `docs/{locale}/**/*.mdx` 与 `**/_category_.json`
2. 递归组合目录树，读每份 mdx frontmatter 与每级 `_category_.json`
3. 产出 `SidebarNode[]`（`{ label, link, icon, position, collapsed, items[] }`）
4. 构建期一次，运行时零开销

`DocsLayout.astro` 顶端 `const sidebar = await buildSidebar(locale)`。

### 6.3 Nav

`src/data/nav.{en,zh-CN,zh-HK}.ts` 从现有 `locales/{lang}/nav.ts` 直接搬。React `<TopNav>` 消费。

### 6.4 Layouts

- `BaseLayout.astro`：head、GA `G-P81Y8BDYYS`、sensorsdata、Google One Tap、Helora 客服 SDK、theme pre-paint（`<script is:inline>`）、`insertScript()` 注入 `window.__API_PROXY_URL__` + `longport-internal.iife.js`
- `DocsLayout.astro`：`<Sidebar> + <LocalNav> + <Backdrop> + <main><Breadcrumb>{content}<PrevNext></main> + <TOC>`
- `ApiReferenceLayout.astro`：**沿用旧站 CSR 单页样式**；容器内挂 `<ApiReference client:only="react">`（详见 §7）
- `PlainLayout.astro`：`layout: false` 页面（pricing / skill / 首页）

### 6.5 主题切换

三属性 pre-paint（照抄 whale-apidocs）：

```html
<script is:inline>
  const pref = localStorage.getItem('ui-mode') ?? 'system'
  const dark = pref === 'dark' || (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  const root = document.documentElement
  root.dataset.mode = dark ? 'dark' : 'light'
  root.dataset.theme = 'default'
  root.dataset.nbPref = pref
</script>
```

`--lbus-*` 变量沿用，`--vp-*` 全 rename 为 `--lbus-*`，`.dark` 选择器改 `[data-mode="dark"]`。一次性 codemod 脚本 `scripts/codemod-theme-selectors.ts`。

### 6.6 搜索

**约束**：搜索 UI 必须与 vitepress local search **体感等价**（触发方式、快捷键、弹窗尺寸、结果排序、Highlight、空态提示）。

**方案**：
- **索引后端**：Pagefind（`bun run build` 尾部串 `bunx pagefind --site dist`）
- **UI**：`<SearchDialog client:idle>` React island —— **UI 必须 1:1 复刻 vitepress local search**：
  - 触发：header 搜索按钮 + `/` + `Cmd+K` / `Ctrl+K`（与 vitepress 一致）
  - 弹窗：居中对话框，同尺寸、同圆角、同 backdrop
  - 输入：debounce 时长与 vitepress 一致
  - 结果：分类展示（Docs / API）、匹配文本 highlight 用同色
  - 空态：文案与 vitepress 完全一致（三语）
  - 键盘：↑↓ 选中、Enter 跳转、Esc 关闭
  - 搜索排序：Pagefind 默认 relevance 分数 —— 若与 vitepress mini-search 排序不一致，用 opencli 断言修正
- **URL 校验**：无独立页面（弹窗），无新增 URL
- **LLM `.md` 导出**：`src/pages/[locale]/[...slug].md.ts` 生成每篇纯文本 markdown 版本 —— **不进 sitemap**，供 crawler 用；`Content-Type: text/markdown`

### 6.7 Region 系统

`region.config.ts` 原样搬。消费点：
- **构建期路由过滤**：`getStaticPaths` 里过滤（§5.4）
- **构建期 section 剔除**：remark plugin `remark-region-filter`
- **构建期 hostname 改写**：Astro integration `astro:build:setup` hook 对 tokens.css / 代码块 / mdx 文本替换
- `PUBLIC_REGION=cn|hk|global` 通过 env 注入（`build:cn` / `build:release`）

**URL 集合校验**：region 过滤会**减少 URL**，这个是 vitepress 现状就有的行为，两侧规则一致即可。

## 7. OpenAPI / ApiReference / TryIt

### 7.1 ApiReference：保持运行时 CSR 单页（URL 不变约束下的必然选择）

**决策更正（2026-08-17）**：boss 明确 "URL 保持不变"，撤销原设计的"构建期每 op 一路由"。

**方案**：
- `docs/{lang}/docs/api.mdx` 仍是 `layout: api-reference` 单页
- URL 保持：`/docs/api`（en）+ `/zh-CN/docs/api` + `/zh-HK/docs/api`
- `ApiReferenceLayout.astro` 内挂 `<ApiReference client:only="react">`
- **`<ApiReference>` React 组件**：port from vitepress `ApiReference.vue`
  - 客户端 `import openapiYaml from '../../../openapi.yaml?raw'`
  - `js-yaml` parse + `markdown-it` 渲染 description
  - hash 路由：`#quote/pull/static` 切 op（与旧站一致）
  - i18n 感知重写内链
- **`openapi.yaml` 仅 en**：zh-CN / zh-HK 页面 ApiReference 内容 fallback 到 en 描述；chrome（顶部 nav / 面包屑 / 侧栏 tab 标签）走 i18n

**收益放弃**：SEO 提升、LLM 友好度提升不在本轮范围。若未来独立需求要为 API 拆 op 路由，作单独项目做（届时需 nginx redirect 配合）。

### 7.2 TryIt 重构（弃 @jsonforms）

`packages/tryit/`（阶段 2）：

```
packages/tryit/
├── src/
│   ├── TryIt.tsx                       # 入口，读 openapi.yaml 找到 operation
│   ├── SchemaRenderer.tsx              # 递归渲染 openapi schema → react-hook-form fields
│   ├── fields/                         # TextField / EnumSelect / NumberField / BoolField / ArrayField / ObjectField / RefField
│   ├── AuthorizationForm.tsx           # cookie / appKey / appSecret（拉 login state）
│   ├── ParametersForm.tsx
│   ├── PlayButton.tsx
│   ├── ResponseView.tsx
│   ├── hooks/
│   │   ├── useTryItMode.ts             # useSearchParams（mode=try-it 切态）
│   │   ├── useAuthorization.ts
│   │   └── useResponse.ts
│   ├── clients/
│   │   ├── http-client.ts              # 直接 port from vitepress theme/utils/http-client.ts
│   │   └── websocket-client.ts
│   └── code-gen/                       # curl / SDK 示例代码生成
```

**契约不变**：
- `.mdx` 中 `<TryIt operationId="xxx">` prop 不变
- query mode 切换（`?mode=try-it`）行为不变
- URL 不新增（只是 query string 变化）

**验证**：opencli 交互断言 —— 打开 TryIt → 填 authorization → 点 Play → 观察请求发出（`chrome-devtools list_network_requests`）→ 响应回填。

### 7.3 openapi.yaml 消费点

- 客户端 CSR：`<ApiReference>` 组件 `import openapi.yaml?raw`
- 客户端 CSR：`<TryIt>` 通过 operationId 查找并渲染 form
- 构建期：不消费（放弃每 op 一路由后无需 build-time parse）

## 8. 样式收拢

**保留**：
- Tailwind v4（唯一 utility）
- `src/styles/tokens.css`（唯一设计 token 源，从 `lbus-tokens.css` + `css-var.scss` 合并）
- `src/styles/shiki.css`
- `src/styles/global.css`（reset + tailwind base）

**删除**：
- UnoCSS（`unocss.config.ts`、`virtual:uno.css`、`presetWind3`）
- 全部 SCSS（`custom.scss`、SFC 内嵌 `<style lang="scss">`）—— token 迁 CSS 变量、其余转 Tailwind class
- `postcss.config.mjs`（Astro + Tailwind v4 用 `@tailwindcss/vite`）
- `sass-embedded` 依赖

**主题变量 codemod**：`--vp-*` 全 rename 为 `--lbus-*`，`.dark` → `[data-mode="dark"]`。一次性脚本 `scripts/codemod-theme-selectors.ts`。

## 9. opencli A/B 校验（chrome-devtools MCP 驱动）

### 9.1 基线 / 候选

- 基线：vitepress 现站，本地 `bun run dev`（port 5173）
- 候选：Astro worktree `bun run dev`（port 4321）
- 生产基线：`https://open.longportapp.com`
- Canary 灰度：`https://open.longbridge.xyz`

### 9.2 URL 集合校验（阶段 1 门禁）

`scripts/opencli/url-diff.ts`：
1. 抓旧 dist 的 `sitemap.xml` → URL 集 A
2. 抓新 dist 的 `sitemap.xml` → URL 集 B
3. **A △ B（对称差） = ∅** 是硬门禁
4. 差异出报告 `dist-diff/url-diff.md`

### 9.3 双站截图

```ts
for (const route of routes) {
  await mcp.new_page({ url: `http://localhost:5173${route}` })
  await mcp.take_screenshot({ filePath: `baseline/${slug(route)}.png`, fullPage: true })
  await mcp.new_page({ url: `http://localhost:4321${route}` })
  await mcp.take_screenshot({ filePath: `candidate/${slug(route)}.png`, fullPage: true })
}
```

### 9.4 DOM 结构 diff

`dom-diff.ts`：抓两侧 `<main>` innerHTML → 标准化（剥离 `data-astro-*` / class hash / whitespace / handler）→ 比较：
- heading 序列
- link href 集合（**内链一致性 = 关键**：直接反映 slug 重写正确性）
- 关键组件锚点 `[data-lbus-component]`
- code block 数量 + 语言

**门槛**：DOM 拓扑等价 ≥ 95%。

### 9.5 视觉 diff

`visual-diff.ts` 用 `odiff-bin` 或 `pixelmatch`：
- 首屏（1440x900） ≤ 2%
- 正文段落区 ≤ 1%
- 动画帧、TryIt、ArchCanvas ≤ 5%

### 9.6 交互断言

| Route | 断言 |
|---|---|
| `/` | HeroSection 出现，滚动触发 CoreFeatures 动画 |
| `/docs/quote/pull/static` | `<Tabs>` 切 tab、`<CliCommand>` 复制按钮生效 |
| `/docs/api` | ApiReference 加载，切 op（`#quote/pull/static`）内容切换 |
| `/docs/api?mode=try-it` | TryIt 打开 → 填 auth → Play → 200 响应回填 |
| `/pricing` | Pricing 渲染，region 切换值变化 |
| 主题切换 | `data-mode` 属性 light ↔ dark |
| i18n 切换 | URL 前缀切换 + 正文语言变化 |
| Sidebar 折叠 | 点组标题 → collapsed 切换 |

### 9.8 用户体感断言层（追加）

除 DOM / 视觉 / URL 三条基础校验外，本层专门断言"用户不应察觉迁移发生"。

| 断言项 | 检查方式 | 阈值 |
|---|---|---|
| 快捷键行为 | 模拟 `Cmd+K` / `/` / `Esc` / 方向键 → 观察 DOM 状态变化 | 100% 触发对齐 |
| 弹窗动画时长 | 抓 `transition-duration` computed style | ±30ms |
| Focus 顺序 | Tab 遍历 → 记录 `document.activeElement.dataset.id` 序列 | 序列相等 |
| 滚动记忆 | 跳外链回来后 scrollY 位置 | ±20px |
| 主题切换动画 | 切主题 → 抓 `transition` 生效范围 | 时长一致、闪烁 <100ms |
| Sidebar 折叠动画 | 点击组标题 → 高度变化曲线 | 曲线名与时长一致 |
| Tabs 切换动画 | 切 tab → indicator 位置变化 | 曲线与时长一致 |
| TryIt 表单校验时机 | onBlur / onSubmit / onChange 触发校验 | 时机与旧站一致（jsonforms 默认 onChange） |
| 首屏 FCP / LCP | Chrome DevTools Performance | 新站不劣化 >5% |
| shiki 代码色 | 抓 `<code>` span 的 computed color | 每 token 颜色相等（shiki 版本锁 + 同主题） |
| PrevNext 项 | 抓底部 nav link | 与旧站 hrefs 完全一致 |
| TOC 项 | 抓 aside 内 anchor list | 与旧站数量/顺序/标题完全一致 |

`scripts/opencli/experience-assertions.ts` 承接。阶段 1 走 primitives 覆盖的断言项；阶段 2 补 TryIt / TOC / PrevNext 覆盖。

### 9.7 报告

`report.ts` 输出 `dist-diff/report.md`：
- 每 URL：pass / fail + 视觉分值 + DOM 差异摘要 + 差异截图
- 阶段 1 结束 + 阶段 2 结束各跑一次
- 差异分类：**A 阻断**（DOM<95%、交互失败、URL 集不等）/ **B 讨论**（视觉超阈但语义等价）/ **C 可接受**（明确改进）

## 10. 部署 / CI / Nginx

### 10.1 CI

**保留**：
- Cloudflare Pages `wrangler-action@v3` + Aliyun OSS `ossutil` 双发（`release.yml`）
- `pack-skills.yml`、`autocorrect.yml`

**变更**：
- `build:canary` / `build:release` / `build:cn` 内部改 `astro check && astro build && bunx pagefind --site dist`
- `astro:build:done` hook 合并 `normalize_md.ts` + `generate-llms.ts` + `copy-routes.ts` + `prebuild-skills.ts`
- 新增 `astro check` 前置门禁
- 删除依赖：`vitepress`、`vitepress-plugin-*`、`unocss`、`sass-embedded`、`@shikijs/*`（Astro 自带）
- `NODE_OPTIONS=--max-old-space-size=14336 --expose-gc` 保留

### 10.2 Nginx

- Repo：`/Users/tangyu/Documents/longbirdge/websites-nginx/config/sites/open.longbridge.com/`
- 已有分片：`index.conf` / `_canary.conf` / `_cn.conf` / `_release.conf` / `_assets.conf` / `_llms.conf` / `_common.conf`
- **本次迁移 Nginx 不改动**（URL 集合不变，redirect 无需求）
- Aliyun OSS 静态托管路径与 CF Pages 路径与迁前一致

### 10.3 灰度

- 阶段 1 完成 → canary `open.longbridge.xyz` 灰度 3 天
- 阶段 2 完成 → canary 灰度 5 天
- 观察 GA 事件、Sentry / Helora 客服反馈、Aliyun OSS + CF 双发一致性
- 稳定后合 main → 切生产 `open.longportapp.com`

### 10.5 Vitepress 拆除清单（阶段 1 开工第一步）

worktree `feat/migrate-to-astro` 初始状态仍带完整 vitepress 项目。阶段 1 第 0 步：**一次性 git rm 掉全部 vitepress 相关文件与依赖**，然后开始重建。

**要 git rm 的目录 / 文件**：

```
docs/.vitepress/                      # 全部（config、theme、locales、md-plugins、grammars、helora.d.ts、region-utils.ts、sdk.d.ts、types.ts、dist）
docs/postcss.config.mjs               # vitepress 用的 gated tailwind
docs/unocss.config.ts                 # UnoCSS 配置
docs/en/docs/api.md 里 layout: api-reference frontmatter  # 保留文件，只删 layout 字段（.mdx 后 layout 由 astro layout 处理）
scripts/copy-routes.ts                # 保留，但内部实现改用 astro dist 路径（要重写）
scripts/normalize_md.ts               # 保留，改吃 astro dist（要重写）
scripts/generate-llms.ts              # 保留，改吃 astro dist（要重写）
```

**要 package.json 里删的依赖**：

```jsonc
{
  "scripts": {
    // 全部改：dev / dev:canary / dev:cn / build:canary / build:release / build:cn / preview
    // 由 "vitepress dev docs" / "vitepress build docs" → "astro dev" / "astro build"
  },
  "dependencies": {
    "vitepress": "2.0.0-alpha.16",           // 删
    "vue-i18n": "11",                        // 删（改自研或 react-i18next）
    "reka-ui": "^2.9.6",                     // 删（React 替代自研）
    "@headlessui/vue": "^1.7.23",            // 删（用 @headlessui/react 或 @base-ui/react）
    "floating-vue": "^5.2.2",                // 删（用 floating-ui/react）
    "@vueuse/core": "^14.2.1",               // 删
    "motion-v": "^2.2.0",                    // 删（用 motion/react）
    "@vue-flow/core": "^1.48.2",             // 删（用 @xyflow/react）
    "@vue-flow/background": "^1.3.2",        // 删
    "@jsonforms/vue": "^3.5.1",              // 删（TryIt 自研 SchemaRenderer）
    "@jsonforms/vue-vanilla": "^3.5.1",      // 删
    "@jsonforms/core": "^3.5.1",             // 删
    "markdown-it": "^14.1.1",                // 保留供 ApiReference CSR 复用（若 React 端换 marked/micromark 则删）
    "markdown-it-container": "^4.0.0",       // 删（vitepress md 插件用）
    "markdown-it-mathjax3": "^4.3.2",        // 删（改 rehype-katex）
    "shiki": "^3.6.0",                       // 【删】：改用 Astro 内置 shiki（决策 #18 选 A，接受 token 色差 ≤2%）
    "mermaid": "^11.8.1",                    // 保留（用 rehype-mermaid 或 satteri/mermaid）
    "unocss": "^66.1.2",                     // 删
    "@unocss/extractor-mdc": "^66.1.2",      // 删
    "@unocss/transformer-variant-group": "^66.1.2", // 删
    "sass-embedded": "^1.89.2",              // 删（Astro + tailwind v4 无需 sass）
    "vue": "^3.5.13",                        // 删
    "vitepress-plugin-mermaid": "...",       // 删
    "vitepress-plugin-group-icons": "...",   // 删
    "@shikijs/twoslash": "..."               // 若仅 vitepress 用，删
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "...",             // 删
    "@vue/tsconfig": "...",                  // 删
    "vue-tsc": "...",                        // 删
    "@types/markdown-it": "...",             // 视 ApiReference 是否复用决定
  }
}
```

**要 add 的依赖**（新 astro 栈）：

```jsonc
{
  "dependencies": {
    "astro": "^7.1.3",
    "@astrojs/react": "^latest",
    "@astrojs/mdx": "^latest",
    "astro-icon": "^latest",
    "@tailwindcss/vite": "^4.x",
    "tailwindcss": "^4.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-hook-form": "^7.x",
    "@floating-ui/react": "^latest",
    "@base-ui/react": "^latest",           // 或 reui
    "motion": "^latest",                    // 前 framer-motion
    "@xyflow/react": "^latest",
    "js-yaml": "^4.x",                      // TryIt / ApiReference 用
    "pagefind": "^1.x",                     // 索引 CLI
    "rehype-katex": "^latest",
    "remark-math": "^latest",
    "rehype-mermaid": "^latest"             // 或从 whale-apidocs fork satteri/mermaid
  }
}
```

**要 add 的顶层文件**：`astro.config.ts` / `src/content.config.ts` / `src/mdx-components.tsx` / `src/pages/*` / `src/layouts/*` / `src/components/*` / `src/lib/*` / `src/styles/*` / `src/data/*` 见 §4 目录结构。

**CI workflow 变更**：
- `.github/workflows/build.yml` / `canary.yml` / `release.yml` 里的 `vitepress build docs` → `astro check && astro build && bunx pagefind --site dist`
- `.github/workflows/pack-skills.yml` 不变
- `.github/workflows/autocorrect.yml` 不变

**验证拆除完成**：
```bash
# 拆除后应为空
grep -r "vitepress\|@vue\|unocss" package.json src/ | grep -v node_modules
# 应为空
find . -name "*.vue" -not -path "*/node_modules/*"
```

**Nginx 不变**：`websites-nginx/config/sites/open.longbridge.com/` 完全不改动。

### 10.4 回滚

- main 保留 vitepress 最后一版 tag `v-vitepress-final`
- 出问题走 `git revert` main → 重新构建 → 双发

## 11. workspaces 与 packages（阶段 2 交付）

**根 package.json**：

```json
{
  "workspaces": ["packages/*", "."]
}
```

**包分层**：

| 包 | 内容 | 依赖 |
|---|---|---|
| `packages/utils` | region / slug / i18n / navigation / openapi loader | 无内部依赖 |
| `packages/ui` | Tabs / TabItem / TipContainer / CliCommand / SDK / SDKLinks / Breadcrumb / UserAvatar / Accordion | utils |
| `packages/inspira` | 19 个动画组件（React 手 port from Vue，因 inspira-ui/react 不存在，见 §14） | utils |
| `packages/api-reference` | ApiReference CSR 组件 + schema render + hash 路由 | ui, utils |
| `packages/tryit` | TryIt + SchemaRenderer + fields + AuthorizationForm + PlayButton + clients + code-gen | ui, utils |
| `packages/homepage` | NewHomePage 16 个 section + ArchCanvas (`@xyflow/react`) | ui, inspira, utils |

`src/components/` 阶段 2 后只剩薄壳 re-export。

**发布策略**：private, workspace-only。初期不 publish 到 npm。

## 12. 风险清单 & 缓解

| 风险 | 影响 | 缓解 |
|---|---|---|
| md → mdx 语法冲突（邮件 `<>`、公式、裸露 `{`） | 阶段 1 build 失败 | 转换脚本自带 escape + `astro check` 门禁 |
| URL 集合不等 | 阶段 1 阻断 | `url-diff.ts` 硬门禁，diff 出报告后手动对齐 |
| ApiReference React port 交互回归 | `/docs/api` op 切换失败 | 保持 hash 路由契约、opencli 断言 hash → 内容变化 |
| JSONForms 弃用后 SchemaRenderer 契约不齐 | TryIt 交互回归失败 | 阶段 2 单独攻坚 3-5 天 + opencli 强断言 |
| `@vue-flow/core` → `@xyflow/react` API 差异 | ArchCanvas 视觉偏移 | 逐节对齐 + 视觉 diff 阈值 5% |
| inspira 19 个动画视觉一致性 | opencli 视觉阈值 | 手 port from vitepress Vue 源码（inspira-ui/react 不存在），逐个视觉对齐；备选参考 magicui / motion-primitives（不引依赖，仅参考实现） |
| Region 系统迁移过程中 hostname 错乱 | 生产链接指向错域 | remark plugin + tokens 二重校验 + 上线前 grep 校验 |
| Cloudflare Pages 构建时长增长 | CI 超时 | Astro build 通常比 vitepress 快 20-30% |
| `_category_.json` 与 mdx frontmatter 组合语义在生成器里的边界 | sidebar 项漏或错序 | `navigation.ts` 单元测试对 vitepress `gen.ts` 输出做 golden diff |
| Vue 全局注册 → mdx 显式 map 遗漏 | md 里未识别标签渲染 raw | `mdx-components.tsx` 一次性对齐 12 种 + CI grep 检测未映射标签 |
| openapi.yaml 三语翻译缺失（现状） | zh-CN/zh-HK ApiReference 内容仍是 en | 与迁前行为一致（vitepress 现状即如此），不额外处理 |
| **shiki 版本升级导致代码高亮色差** | 每 token 颜色可能 diff 1-2 度 | 【方案 A】升级到 Astro 内置 shiki；同主题（`github-light` / `github-dark`）下 token 色差阈值 ≤2%；`naviGrammar` 按新 shiki API 重接（若 grammar loader 变化则改用 `rehype-shiki` 独立插件挂载）；`--shiki-light/--shiki-dark` inline mode 若 Astro 用 `--astro-code-*` 前缀，加一层 CSS 变量桥接（`--shiki-light: var(--astro-code-color-light)`），旧 CSS 引用不改 |
| **mdx vs markdown-it 边缘语法差异**（tight/loose list、autolink email、raw HTML block） | 正文渲染细微变化 | rehype 管线补 remark 插件对齐；opencli DOM diff 会兜住 |
| **React 组件动画时长与 Vue 组件不一致** | 用户可察觉的交互变化 | port 时抓 vitepress 生产 DOM 的 `transition-duration` / easing 作 golden，opencli 体感断言层校验 |
| **搜索 UI 与 vitepress local search 体感不同** | 快捷键 / 弹窗 / 排序差异 | §6.6 明确 UI 1:1 复刻；opencli 交互断言强校验 |
| **Focus 顺序与 Tab 遍历变化** | 键盘用户 / 无障碍用户可察觉 | 每个 shell 组件锁 tabIndex 顺序；opencli 断言 `activeElement` 序列 |
| **FCP / LCP 劣化** | 加载体感变化 | Astro build 通常快于 vitepress；opencli 抓 Performance timing 门禁 |
| **PrevNext / TOC 顺序不同** | 底部 nav / 侧栏 aside 项不同 | 严格 port vitepress heading 收集算法；golden diff |

## 13. 开工顺序（阶段 1，3-5 天）

0. **拆除 vitepress**（详见 §10.5）：`git rm -r docs/.vitepress docs/postcss.config.mjs docs/unocss.config.ts`；`package.json` 删掉全部 vitepress / Vue 生态依赖；`bun install` 验证 lock 干净；`git commit -m "chore: remove vitepress stack"` **（此 commit 需 boss 单独确认）**
1. `bun init` + `astro add react tailwind mdx` + `astro-icon`；`package.json` workspaces 空配置
2. `astro.config.ts`：integrations、shiki 主题、markdown 配置、region 注入
3. `content.config.ts` + `slug.ts`（含单元测试，golden diff vs vitepress `rewriteMarkdownPath` 输出）
4. **一次性脚本**：md → mdx 转换（`scripts/convert-md-to-mdx.ts`）
5. `src/pages/[...slug].astro` + zh-CN/zh-HK 变体 + 首篇 e2e smoke（`docs/en/docs/quote/pull/static.mdx` → `/docs/quote/pull/static` 可达 200）
6. `BaseLayout` + `DocsLayout` + `ApiReferenceLayout`(placeholder) + `PlainLayout` + shell 组件（Sidebar / TopNav / Footer / Breadcrumb / TOC / LocalNav / Backdrop / SkipLink）React 实现
7. 主题切换 pre-paint + `--lbus-*` codemod
8. Region 系统：`region.config.ts` 消费 + `remark-region-filter` + hostname 改写 integration
9. Sidebar 生成器（`navigation.ts`）+ `_category_.json` 消费 + 单元测试
10. Pagefind 集成 + `<SearchDialog client:idle>` 弹窗
11. `.md` LLM 导出 route
12. 部署脚本：`copy-routes` / `generate-llms` / `sitemap.xml.ts` / `robots.txt.ts` / `prebuild-skills` / `prebuild-mcp-tools`
13. 12 种 mdx 组件的 **primitives**（`Tabs` / `TabItem` / `TipContainer` / `CliCommand` / `SDK` / `SDKLinks` / `Skill`）React 实现
14. **placeholder** for composite（`TryIt` / `McpTools` / `NewHomePage` / `Pricing` / `QuotePermission` / `ApiReference` 显示 "阶段 2 实施中" 占位）
15. `packages/ui` 空包骨架 + primitives 迁入
16. `opencli` 脚本骨架 + 首轮全站对比 → URL diff = ∅ 硬门禁 → DOM ≥ 95%

## 14. 开工顺序（阶段 2，2-3 周）

1. `packages/utils` 抽离
2. `packages/inspira` 建包 + 19 个动画从 vitepress Vue 源码手 port 为 React（**inspira-ui 无 React 版本**，见 §16.4；参考 magicui / motion-primitives 但不引依赖）
3. `packages/api-reference` 建包 + port `ApiReference.vue` 为 React：openapi.yaml CSR 加载 + hash 路由 + i18n 内链重写；替换 placeholder
4. `packages/tryit` 建包 + SchemaRenderer + 每类 field + AuthorizationForm + ParametersForm + PlayButton + clients + code-gen；替换 placeholder
5. `packages/homepage` 建包 + 16 个 section + ArchCanvas（`@xyflow/react`）+ motion；替换 `<NewHomePage>` placeholder
6. `<McpTools>` `<Pricing>` `<QuotePermission>` `<Skill>` composite port
7. `opencli` 全站二轮对比 → 出报告 → 修补
8. `astro check` + 全链路手工回归清单
9. canary 灰度 `open.longbridge.xyz` 5 天 → 合 main → 切生产

## 15. 决策日志

| # | 决策 | 选项 | 决定 | 日期 |
|---|---|---|---|---|
| 1 | UI 框架 | Vue island / React / 混合 | **React 19（全换）** | 2026-08-17 |
| 2 | Docs shell | Starlight / nimbus-docs / 自研 | **轻量自研** | 2026-08-17 |
| 3 | 阶段划分 | 一次到位 / 两阶段 / 逐页 | **两阶段（架构→组件）** | 2026-08-17 |
| 4 | 验证工具 | chrome-devtools MCP / Playwright / 内部 CLI | **chrome-devtools MCP** | 2026-08-17 |
| 5 | ApiReference 消费 | 保守 CSR 单页 / 激进构建期每 op 一路由 | **CSR 单页（URL 不变约束）** | 2026-08-17（更正） |
| 6 | md 格式 | 保留 .md / 全量转 .mdx | **全量转 .mdx** | 2026-08-17 |
| 7 | Sidebar 配置 | `_category_.json` 扫盘 / 中心化 `docs.json` | **`_category_.json` 扫盘（保持现状）** | 2026-08-17（更正） |
| 8 | TryIt 表单 | port `@jsonforms/react` / 重构 `react-hook-form` | **重构 react-hook-form + 自研 SchemaRenderer** | 2026-08-17 |
| 9 | 样式方案 | 保留 UnoCSS + SCSS / 一次删净 | **一次删净，只留 Tailwind v4 + tokens.css** | 2026-08-17 |
| 10 | 组件抽包 | 只 primitives / 拆多包 | **6 个 workspace 包** | 2026-08-17 |
| 11 | vitepress 依赖 | 保留 fallback / 直接删 | **直接删** | 2026-08-17 |
| 12 | openapi.yaml 三语 | 补 zh-CN / zh-HK 分片 / 保持单 en | **保持单 en**（按 boss 决策） | 2026-08-17 |
| 13 | inspira 上游 | wrap `inspira-ui/react` / 手 port | **手 port**（inspira-ui 无 React 版本） | 2026-08-17 |
| 14 | Canary 域名 | CF Preview / `.xyz` | **`open.longbridge.xyz`** | 2026-08-17 |
| 15 | **URL 兼容性** | 允许新增（激进） / 完全等价（保守） | **URL 集合与迁前完全一致（A △ B = ∅）** | 2026-08-17（更正）|
| 16 | **用户体感等价** | 允许微改进 / 完全等价 | **完全等价，顶层约束（§-1）覆盖 URL / 视觉 / 交互 / 加载 / 搜索 / 组件行为** | 2026-08-17（追加）|
| 17 | 搜索 UI | 用 Pagefind 默认 UI / 复刻 vitepress local search | **复刻 vitepress local search（Pagefind 只做索引后端）** | 2026-08-17（追加）|
| 18 | shiki 版本 | A 升级到 Astro 默认 / B 锁 vitepress 现用版本 / C 混合 | **A 升级到 Astro 内置版本**，接受 ≤2% token 色差；`naviGrammar` 视 API 变化重接 | 2026-08-17（更正）|
| 19 | CI 层级策略 | 每 PR 全量 / 分层（PR sample + canary 全站 + release-gate 本地） | **分层策略**（详见 §18.1） | 2026-08-17 |
| 20 | FCP / LCP 底线 | 必须优于旧站 / 允许 <5% 劣化 | **允许 <5% 劣化**，超阈值阻断合 main | 2026-08-17 |
| 21 | Focus 顺序 | 锁死旧站顺序 / 允许无障碍主动修正 | **锁死旧站顺序**；无障碍改进另开需求 | 2026-08-17 |

## 16. Confirmed Answers（boss 已拍板，供后续参考）

1. **openapi.yaml 三语**：仅 en。zh-CN / zh-HK 页面 ApiReference 内容 fallback 到 en 描述；chrome（顶部 nav、面包屑、侧栏 tab 标签）走 i18n。翻译走独立需求，不在本次迁移范围。
2. **Nginx 仓库自控**：`/Users/tangyu/Documents/longbirdge/websites-nginx/config/sites/open.longbridge.com/` 由团队自控。本次迁移**不改动 Nginx**（URL 集合不变）。
3. **Canary 灰度域名**：`open.longbridge.xyz`。
4. **inspira-ui/react**：**不存在**。`unovue/inspira-ui` 是 Vue-only 项目（[GitHub](https://github.com/unovue/inspira-ui)，README 明确说 "developers had been jealous of React because their eco-system had Magic UI"）。迁移策略：从 openapi-website 现有 Vue 源码手 port 为 React；实现层可参考 `magicui` / `motion-primitives` / `aceternity-ui`，但**不引入这些包作运行时依赖**（保持视觉与原 Vue 复刻一致）。
5. **翻译工作流**：`docs.json` 与 `openapi.yaml` 保持现在的项目配置，走现有人工翻译流。即：无中心化 `docs.json`；`_category_.json` + md frontmatter 三语目录维护不变；`openapi.yaml` 单 en 不变。
6. **URL 保持不变**（追加约束）：新旧站 sitemap URL 集合逐条相等。`url-diff.ts` 是阶段 1 硬门禁。

## 17. Self-Review Notes

- [x] Placeholder scan：无 TBD / TODO
- [x] 内部一致性：
  - §7.1 ApiReference CSR vs §11 `packages/api-reference` — 一致（CSR 组件抽包）
  - §5 URL 计算 vs §9.2 URL diff vs §16.6 — 一致（URL 硬门禁）
  - §6.1 `_category_.json` 保留 vs §13 步骤 9 sidebar 生成器 — 一致
  - §14 inspira 手 port vs §16.4 inspira-ui/react 不存在 — 一致
  - §-1 用户体感等价顶层约束 vs §6.6 搜索 UI 复刻 vs §9.8 体感断言层 vs §12 新增风险 — 一致
- [x] Scope 检查：单 spec 覆盖阶段 0+1+2，尺度合适；实施 plan 再拆
- [x] Ambiguity 检查：
  - ApiReference URL 不变已明确
  - md→mdx 一次性脚本 + escape 规则明确
  - TryIt 弃 jsonforms、schema 契约明确
  - openapi.yaml 单 en fallback 明确
  - 搜索 UI 1:1 复刻明确（不换默认 Pagefind UI）
  - shiki 版本锁明确（不升级）
- [x] 决策日志：21 条关键决策 + 全部 Open Questions 已结案（§18 全 5 条结案）
- [x] URL 硬门禁在 §5.5、§9.2、§13 步骤 16、§16.6 四处交叉引用
- [x] 用户体感等价顶层约束在 §-1、§6.6、§9.8、§12、§15(#16-18) 五处交叉引用

## 18. 待 boss 决策的取舍（全部已结案 2026-08-17）

以下项目在"用户体感 100% 等价"约束下的取舍：

1. **CI 跑 opencli 的层级策略**（原估算 +30-60 min 偏悲观，修正如下）：

   | CI 触发 | 内容 | 增量估算 |
   |---|---|---|
   | 每 PR / commit（blocking） | `astro build` + `astro check` + URL diff + sample 30-50 关键路径 opencli（无视觉截图） | **+3-5 min** |
   | 合入 main（blocking） | 全站 URL diff + 全站 HTML DOM diff（仅结构解析，无截图） | **+2-3 min** |
   | 发 canary / nightly（blocking） | 全站截图 + 视觉 diff + 关键页交互断言（chrome-devtools MCP，8 worker 并行） | **+10-15 min** |
   | Release-gate（非 blocking，可本地或独立 pipeline） | 全 882 页 + 体感断言层（focus / 动画时长 / shiki 色）  | ~20-25 min |

   **依据**：882 URL × 2 站 × 3s 截图并行 8 worker ≈ 11 min；视觉 diff（odiff）1764 张 ≈ 3 min；Astro build 通常比 vitepress 快 20-30%。

   **已结案（2026-08-17）**：先按上表分层跑，落地后按实际增量优化（若发 canary +10-15 min 影响吞吐，视觉断言移到 nightly 独立 pipeline）。
2. ~~PostToolUse hook 冲突~~ **已结案**：忽略。本 spec 不进 hook 格式化范围。
3. ~~shiki 版本兼容~~ **已结案（2026-08-17）**：选 A —— 升级到 Astro 内置 shiki，接受同主题下 token 色差 ≤2%；`naviGrammar` 按新 API 重接（若失败退到独立 `rehype-shiki` 管线，此时仍保持 shiki-latest 与 Astro 一致）。
4. ~~FCP / LCP 底线~~ **已结案（2026-08-17）**：允许 <5% 劣化。opencli 体感断言层的 FCP / LCP 阈值放到 5%，超过则阻断合入 main。
5. ~~Focus 顺序 golden~~ **已结案（2026-08-17）**：**锁死 vitepress 现站的 focus 顺序**（本次迁移不做无障碍主动修正，即使发现明显缺陷）。无障碍改进走独立需求，另开 PR / issue。opencli 体感断言层的"Focus 顺序"断言以旧站为 golden。
