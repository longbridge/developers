# API Reference（Reference）扩充设计

日期：2026-09-09
仓库：`longbridge/developers`（Astro 文档站）
关联源：`longbridge/openapi`（Rust SDK，接口的 single source of truth）

## 1. 背景

`developers` 站点已经有一套 whale 风格的交互式 API Reference：

- 页面：`docs/{en,zh-CN,zh-HK}/docs/api.mdx`，frontmatter `layout: api-reference`，路由 `/docs/api`。
- 渲染器：本地包 `@longbridge/openapi-api-reference`（`packages/api-reference/`），把根目录 `openapi.yaml` 解析成左侧标签树 + 右侧接口详情，支持：
  - `?op=<operationId>` 深链到具体接口，`?page=<id>` 深链到 `x-pages` 文章页。
  - 每个操作的详情：路径 + 方法徽章、Authorizations / Path / Query / Body / Response 分区、代码样例（`x-codeSamples` 多语言，回退 curl）、响应示例。
  - `x-quote-command` + `QuotePermission` 组件（行情权限徽章，读取 `quote-permissions.yaml`，本身是 en/zh-CN/zh-HK 三语）。
  - i18n：操作用 `x-summary-zh` / `x-description-zh`，参数用 `x-description-zh`，标签用 `x-name-zh`，文章页用 `x-title-zh` / `x-content-zh`。

因此 `open.longbridge.com/docs/api?op=list_securities` 就是这套渲染器在旧生产域名上的地址。

### 现状缺口

- 顶部导航（`src/data/nav.{en,zh-CN,zh-HK}.ts`）为 **Pricing · Skill · CLI · MCP · Docs**，**没有 "Reference" 项**（但 `Docs` 的 activeMatch 已排除 `/api`，为 Reference 预留）。
- `openapi.yaml` 目前只覆盖约 40 个操作。
- Rust SDK（`openapi/rust/src`）实际调用约 **138 个 HTTP 接口**（`/v1/...`），另有 WebSocket 行情/交易订阅与推送接口。参考文档缺约 100 个接口。
- 渲染器 i18n 用 `isZh = locale !== 'en'`，**zh-CN 与 zh-HK 共用同一套 `-zh` 字段**，无法区分繁体。
- 渲染器 loader 只读 `get/post/put/delete/patch`，**不解析 WebSocket 接口**（尽管 CSS 已预留 `.method-ws` / `.method-websocket` 粉色徽章）。

## 2. 目标与非目标

### 目标

1. 导航在 `Docs` 之后新增 **Reference** 项，指向 `/docs/api`（三语）。
2. 扩充 `openapi.yaml`，以 Rust 源码为准，覆盖**全部 HTTP 接口 + WebSocket 推送接口**。
3. 每个接口的详情风格**参考现有 `docs` 页面**：权限徽章、业务指令号、Request/Parameters、Protobuf、多语言 SDK 示例、Response/示例。
4. 侧栏 tag 分组**镜像 `docs` 目录结构**。
5. 渲染器支持 **zh-CN 与 zh-HK 独立**（真繁体）。
6. 把源码里指向旧 `open.longbridge.com/docs/api?op=xxx` 的历史链接迁移到本地 `/docs/api`。

### 非目标

- 不改用逐接口 `.mdx` 页面的新目录树（沿用现有 yaml + 渲染器）。
- 不做自动生成脚本；接口内容以 Rust 结构体为准**手写**。
- 不收录纯本地 SDK 辅助方法（如 `subscriptions()` 这类本地查询，不对应服务端接口）。

## 3. 总体方案

approach A：**扩充 `openapi.yaml` + 复用并小幅增强现有 `/docs/api` 渲染器**。

分五块：导航、yaml 内容扩充、tag 分组、WebSocket 支持（含渲染器改动）、三语 zh-HK 支持（渲染器改动），外加旧链接迁移。

## 4. 详细设计

### 4.1 导航新增 Reference

在三个 nav 文件的 `Docs` 项之后插入：

```ts
// nav.en.ts
{ text: 'Reference', link: '/docs/api', activeMatch: '^(/en)?/docs/api' }
// nav.zh-CN.ts  → text: 'API 文档'
// nav.zh-HK.ts  → text: 'API 文檔'
```

`Docs` 项的 activeMatch 已含 `(?!/api)`，无需改动。

### 4.2 `openapi.yaml` 接口扩充

以 `openapi/rust/src` 各 context 的 `pub async fn` 及其 HTTP path 为准，逐个补齐。每个操作遵循现有 yaml 约定：

- `operationId`：稳定标识，作为 `?op=` 深链锚点。**沿用 Rust 里对应的 HTTP 语义名**（与旧生产站保持一致，避免旧链接失效）。
- `summary` + `x-summary-zh`（+ 4.5 的 `x-summary-zh-hk`）。
- `description` + `x-description-zh`（+ `x-description-zh-hk`）：可内嵌 Markdown 代码块（如 protobuf）。
- `parameters`（path / query）或 `requestBody.content.application/json.schema`；每个字段带 `x-description-zh`（+ `-zh-hk`）。
- `responses.200.content.application/json`：`schema.properties` 或 `example`。
- `tags`：见 4.3。
- 行情类接口：`x-quote-command`（业务指令号，触发 `QuotePermission` 徽章）。
- `x-codeSamples`：多语言 SDK 示例（Python / Python async / Node.js / Java / C++ / Go / Rust 等，与 docs 页面一致）。**渲染器已支持，直接填。**
- Protobuf：对使用 protobuf 的接口，在 `description` 内以 ```protobuf 代码块给出请求/响应 message（渲染器 `splitDescriptionAndCode` 会抽出为代码卡片）。

### 4.3 tag 分组镜像 `docs` 目录

顶层 `tags:` 列表按 `docs/en/docs` 模块顺序排列，每个带 `x-name-zh` / `x-name-zh-hk`。初步 taxonomy（归类在实现时对着 Rust 模块逐个落实）：

| tag（en） | zh-CN | 对应 docs 目录 | Rust 模块 / path 前缀 |
|---|---|---|---|
| Quote | 行情 | quote/stocks·options·warrants | quote（HTTP） |
| Realtime (WebSocket) | 实时推送 | quote/subscribe、socket | quote 订阅/推送、trade 推送 |
| Watchlist | 自选股 | quote/watchlist | sharelist、`/v1/sharelists*` |
| Analytics | 分析 | quote/analytics、fundamental | fundamental、`/v1/quote/valuation*`、screener、signal |
| Trade | 交易与订单 | trade/order·execution | trade、`/v1/trade/*` |
| Assets | 持仓与资金 | trade/asset、account/portfolio | asset `/v1/asset/*`、portfolio |
| Grid | 网格交易 | trade/grid | grid、`/v1/gridtrading/*` |
| DCA | 定投 | account/dca | dca、`/v1/dailycoins/*` |
| Alert | 提醒 | account/alert | alert、`/v1/notify/reminders` |
| Content | 社区与资讯 | content/news·topics·sharelist | content、`/v1/content/*` |
| Market | 市场 | market/calendar·status | market、`/v1/quote/market*` |
| AI | AI | ai/chat·workspace | agent、`/v1/ai/*` |

### 4.4 WebSocket 接口收录（渲染器改动）

**yaml 约定**：WS 接口用合成 path + 非标准 `websocket:` 操作键表达，例如：

```yaml
paths:
  "quote/subscribe":
    websocket:
      operationId: quote_subscribe
      summary: Subscribe Quote
      x-quote-command: "..."
      tags: [Realtime (WebSocket)]
      description: |
        订阅说明…
        ```protobuf
        message SubscribeRequest { ... }
        ```
```

**渲染器改动**：

- `packages/api-reference/src/openapi-loader.ts`：`methods` 数组加入 `'websocket'`；`method` 归一化为 `WEBSOCKET`（映射到已有 `.method-websocket` 徽章）。
- `packages/api-reference/src/ApiReference.tsx`：详情视图对 `method === 'WEBSOCKET'` 的操作**跳过 curl 生成**（`buildCurl` 假定 HTTP），改为展示 `description` 内的 protobuf 代码块 + `x-quote-command` 徽章 + `x-codeSamples`。
- 内容来源：现有 `docs/en/docs/quote/subscribe`、各 push 文档、以及 `rust/crates/proto` 的 message 定义。

### 4.5 三语：zh-HK 独立于 zh-CN（渲染器改动）

现状 `isZh = locale !== 'en'`，两个中文塌缩为 `-zh`。改为三路解析，新增 `-zh-hk` 系列字段，带回退：

- 字段：`x-summary-zh-hk`、`x-description-zh-hk`、`x-name-zh-hk`（tag）、`x-title-zh-hk` / `x-content-zh-hk`（page）、参数 `x-description-zh-hk`。
- 回退链：
  - `locale === 'zh-HK'` → `*-zh-hk` ?? `*-zh` ?? en
  - `locale === 'zh-CN'` → `*-zh` ?? en
  - `locale === 'en'` → en
- 改动点（`packages/api-reference/src/`）：
  - `openapi-loader.ts`：`Parameter` / `Operation` / `PageItem` / `TagGroup` 类型与解析加 `-zh-hk` 字段。
  - `ApiReference.tsx`：把 `isZh` 二元判断替换为按 `locale` 取值的辅助函数 `pick(en, zh, zhHk)`；覆盖 `buildSections`、description memo、tag label memo、page content memo、搜索串拼接（第 257 行）。
- 既有 `-zh` 内容视为 zh-CN，无需迁移；zh-HK 缺失时自动回退到简体，可分批补繁体。

### 4.6 旧链接迁移

- 全仓扫描 `docs/**`、`src/**`、`packages/**` 中形如 `open.longbridge.com/docs/api?op=` 或绝对 `?op=` 的历史链接，改为本地 `/docs/api?op=<id>`（按页面 locale 加 `/zh-CN`、`/zh-HK` 前缀）。
- 当前源码大多已是干净的 `/docs/api`；本步骤为补漏 + 防回归。

## 5. 渲染器改动文件清单

- `packages/api-reference/src/openapi-loader.ts` — WS 方法解析、`-zh-hk` 字段与类型。
- `packages/api-reference/src/ApiReference.tsx` — 三语取值、WS 详情分支。
- `packages/api-reference/src/api-reference.css` — 如需，微调以贴近 docs 排版（WS 徽章已存在）。
- `openapi.yaml` — 主要工作量：补全接口、tags、三语字段、代码样例。
- `src/data/nav.{en,zh-CN,zh-HK}.ts` — Reference 导航项。

## 6. 实施分批（按 tag 推进，每批可独立 review）

1. 渲染器改动（4.4 WS + 4.5 三语）+ 导航（4.1）——先打通框架，用现有 40 个接口验证不回归。
2. Quote（HTTP）+ Realtime(WebSocket)。
3. Trade + Assets + Grid。
4. Analytics（fundamental / valuation / screener / signal）。
5. Content + Market + AI + Watchlist + DCA + Alert。
6. 旧链接迁移 + 三语补齐（zh-HK 繁体）+ 收尾校对。

## 7. 校验

- `bun run build`（或项目既定命令）通过，`openapi.yaml` 能被 js-yaml 解析。
- `/docs/api`、`/zh-CN/docs/api`、`/zh-HK/docs/api` 三语页面正常，zh-HK 显示繁体（或回退简体）。
- 抽样 `?op=<id>` 深链可直达对应接口；WS 接口显示粉色徽章 + protobuf。
- 侧栏 tag 顺序与 `docs` 模块一致。
- 抽样接口的字段/示例与 Rust 结构体一致。

## 8. 已知限制 / 取舍

- zh-HK 繁体为增量补充；未补的接口回退简体，不阻塞发布。
- 接口内容手写，需与 Rust 源保持同步；后续如需可再评估生成脚本。
- 纯本地 SDK 辅助方法不纳入参考。

## 9. 待确认

- tag taxonomy（4.3）最终归类是否认可，尤其 Analytics 是否进一步拆分。
- 代码样例覆盖哪些语言（是否与 docs 页面完全对齐：Python/Python async/Node/Java/C++/Go/Rust）。
