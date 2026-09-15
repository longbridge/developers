# 任务：将 openapi commit 523035611 新增的 SDK 接口同步到 developers 文档站

你的任务是将 openapi 仓库 commit `523035611c811e35a5f3ce8f0bd1f52f80723a4f` 中新增的 SDK 接口同步到 developers 文档站（`docs/` 目录）。

## 背景

该 commit 新增了以下 Context（覆盖 Rust / Python / Node.js / Java / C / C++）：

- **FundamentalContext**：财务报告、评级、分红、估值、公司概况、高管、股东、基金持仓、公司行动等
- **MarketContext**：市场状态、经纪商持仓、A/H 溢价、成交统计、异动、指数成分
- **CalendarContext**：财经日历（财报 / 分红 / 拆股 / IPO / 宏观）
- **PortfolioContext**：汇率、盈亏分析（汇总 / 明细 / 按市场 / 资金流）
- **AlertContext**：价格提醒管理（增删改查）
- **DCAContext**：定期投资计划管理（完整 CRUD + 历史记录）
- **SharelistContext**：社区自选列表管理（完整 CRUD）

QuoteContext 扩展：`short_positions`、`option_volume`、`option_volume_daily`、`update_pinned`

ContentContext 扩展：`topic_detail`、`list_topic_replies`、`create_topic_reply`

源码位置：`openapi/` 子模块（commit `523035611c811e35a5f3ce8f0bd1f52f80723a4f`）

---

## 文档结构要求

参考现有页面 `docs/en/docs/trade/order/order_detail.md` 的结构：

### 1. Frontmatter

```yaml
---
slug: method_name
title: Method Title
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---
```

### 2. 简介

一句话说明这个接口做什么。

### 3. CLI 示例（如果 CLI 有对应命令）

```
<CliCommand>
longbridge <command> <args>
</CliCommand>
```

如果没有 CLI 对应命令，省略此块。参考 `docs/en/docs/cli/` 下已有文档判断是否有对应命令。

### 4. SDK 链接

```
<SDKLinks module="<module>" klass="<ContextClass>" method="<method_name>" />
```

module 取值：`quote` / `trade` / `fundamental` / `market` / `calendar` / `portfolio` / `alert` / `dca` / `sharelist` / `content`

### 5. Request 节

HTTP 方法、URL、参数表格（Name / Type / Required / Description）。

### 6. 多语言代码示例

按 Python → Python async → Node.js → Java → Rust → C++ → Go 顺序，从 `openapi/` 子模块对应语言的 context 文件中提取方法签名和类型，写出可运行的示例代码。

### 7. Response 节

响应头、JSON 示例、状态码表。

### 8. Schemas 节

字段表格（Name / Type / Required / Description）。

---

## 目录结构安排

在 `docs/en/docs/` 下新增 **2 个顶层目录**，其余追加到已有目录：

| 目录 | Context | 说明 |
|---|---|---|
| `quote/`（已有，追加） | QuoteContext 扩展 | short_positions、option_volume 等 |
| `content/`（已有，追加） | ContentContext 扩展 | topic_detail、create_topic_reply 等 |
| `fundamental/`（新建） | FundamentalContext、MarketContext、CalendarContext | 研究与行情数据，只读为主 |
| `account/`（新建） | PortfolioContext、AlertContext、DCAContext、SharelistContext | 账户功能与自动化，需要认证 |

### fundamental/ 子目录

```
fundamental/
  fundamental/   # FundamentalContext 各方法
  market/        # MarketContext 各方法
  calendar/      # CalendarContext 各方法
```

### account/ 子目录

```
account/
  portfolio/     # PortfolioContext 各方法
  alert/         # AlertContext 各方法
  dca/           # DCAContext 各方法
  sharelist/     # SharelistContext 各方法
```

每个新目录（含子目录）需要 `_category_.json`：

```json
{ "position": <N>, "label": "<Display Name>", "collapsed": false }
```

---

## 三语言规则

每个 `.md` 页面必须在三个目录下都有对应文件：

- `docs/en/docs/{path}/`
- `docs/zh-CN/docs/{path}/`
- `docs/zh-HK/docs/{path}/`

en 为主，zh-CN / zh-HK 翻译内容，三者结构完全一致。

---

## 执行步骤

1. 读取 `openapi/rust/src/<context>/context.rs`，列出所有公开方法及签名
2. 对照 `openapi/python/pysrc/longbridge/openapi.pyi` 确认 Python 方法名
3. 对照 `openapi/nodejs/index.d.ts` 确认 Node.js 方法名
4. 对照 `openapi/java/javasrc/.../Context.java` 确认 Java 方法名
5. 按上述结构，为每个方法生成三语言文档页
6. 更新各目录的 `_category_.json`，确保侧边栏位置合理

---

## 注意事项

- 代码示例必须使用真实的类名和方法名，不得使用占位符
- 参数描述从 `openapi/.pyi` / `.d.ts` / Rust 注释中提取，不要自行发明
- 如果某方法在 CLI 中有对应命令（参考 `docs/en/docs/cli/` 下已有文档），加上 `<CliCommand>` 块
- 字段描述保持与 openapi 注释一致，不得修改含义
- 页面 `sidebar_position` 按字母或逻辑顺序排列
- 不要改动现有文档，只新增文件
