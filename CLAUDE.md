# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 插件

```bash
/plugin install superpowers@claude-plugins-official
```

## Commands

```bash
bun run dev          # 开发（canary 环境 API）
bun run dev:prod     # 开发（生产环境 API）
bun run build:canary   # 构建 canary 环境
bun run build:release  # 构建生产环境
bun run build:llms     # 构建 llms.txt（在 build 之后执行）
bun run preview        # 预览构建产物
```

无测试命令。

## 内容架构

本站分两类内容，定位不同：

### Docs（`docs/{lang}/docs/`）

面向**业务场景**的使用指引。内容包括：

- 入门指南、认证流程
- CLI 命令使用示例（用 `<CliCommand>` 块）
- SDK 调用示例（Python / Rust / Go / Node.js / Java / C++）
- 功能介绍（行情、交易、账户、MCP、AI Skill 等）

Docs 页面以 en 为主，zh-CN / zh-HK 为翻译版本，三者内容保持一致。

### API Reference（`docs/{lang}/api/`）

面向 **HTTP/WebSocket API** 的技术参考。以 `openapi.yaml` 为准：

- 参数名称、类型、Required 字段必须与 `openapi.yaml` 完全一致
- 响应结构、错误码以规范为准，不得自行发明
- 更新 API 文档时，先改 `openapi.yaml`，再同步各语言页面

## 三语言规则

每个 `.md` 页面必须在三个语言目录下都有对应文件：

- `docs/en/` — 英文（root locale，URL 为 `/docs/...`）
- `docs/zh-CN/` — 简体中文（URL 为 `/zh-CN/docs/...`）
- `docs/zh-HK/` — 繁体中文（URL 为 `/zh-HK/docs/...`）

**以 en 为主**，zh-CN / zh-HK 跟随 en 的结构和内容。新增或修改页面时，三个目录必须同步。

### Frontmatter

```yaml
---
title: 'Page Title'
id: category_filename # 例：quote_pull-static
slug: '/quote/pull/static' # 以 / 开头，对应 URL 路径
sidebar_position: 3 # 数字越小越靠前
sidebar_icon: book # 可选：book_open | book | zap | cpu | terminal | sparkles
---
```

## Skills

`skills/longbridge/` 存放 AI Agent 的 Skill 文件。Skill 文件保持高层级描述，命令 flag 和输出细节参考 CLI 的 `--help`，不要复制 help 文本进 Skill。

## 关联子模块

本项目通过 submodule 统一管理以下仓库，修改文档时需同步检查：

| 仓库                             | 用途                              | 同步时机                  |
| -------------------------------- | --------------------------------- | ------------------------- |
| `longbridge/openapi`             | OpenAPI 规范源（`openapi/` 目录） | API 参数/响应变更时       |
| `longbridge/openapi-go`          | Go SDK                            | API 方法签名/参数名变更时 |
| `longbridge/longbridge-terminal` | CLI 二进制                        | CLI 命令/flag 变更时      |

`openapi.yaml`（根目录）是 API Reference 的权威来源，`openapi/` 目录下是各模块的分片 YAML。

## CliCommand 块

在 Docs 中展示 CLI 命令使用 `<CliCommand>` 标签，由 `docs/.vitepress/md-plugins/cli-command.ts` 渲染：

```markdown
<CliCommand>
# 注释说明写在命令前面
longbridge quote TSLA.US
# 可以有多个示例
longbridge quote AAPL.US NVDA.US
</CliCommand>
```

规则：

- 注释行（`# ...`）放在对应命令**前面**，不用行尾注释
- 每个 CliCommand 提供 2–4 个示例，使用真实 symbol（优先美股）
- 命令需实际验证正确后再写入文档（交易类命令除外）
- 尖括号占位符（如 `<order_id>`）会被 Vue 解析为 HTML tag 导致构建失败，改用数字示例 + 注释说明

## Sidebar 自动生成

由 `docs/.vitepress/theme/utils/gen.ts` 的 `genMarkdowDocs()` 从文件系统自动生成，无需手动维护。子目录需有 `_category_.json`：

```json
{ "position": 1, "label": "Market Data", "collapsed": false }
```

## 全局 Vue 组件

在 `docs/.vitepress/theme/components/index.ts` 中导出的组件可直接在 Markdown 中使用：

| 组件                   | 用途                           |
| ---------------------- | ------------------------------ |
| `<Tabs>` / `<TabItem>` | 代码分组标签页                 |
| `<TipContainer>`       | 提示框                         |
| `<TryIt>`              | API 在线调试                   |
| `<SDKLinks>` / `<SDK>` | SDK 链接展示                   |
| `<CliCommand>`         | CLI 命令块（带高亮和安装引导） |
| `<Skill>`              | AI Skill 展示页                |
| `<HomePage>`           | 首页                           |

新增组件需在 `index.ts` 中 export。

## 路由重写

`docs/.vitepress/utils.ts` 的 `rewriteMarkdownPath` 处理 URL 生成。`slug` frontmatter 覆盖默认路径：绝对 slug（`/foo`）替换整个路径；相对 slug 相对文件目录解析。

## 静态资源

所有图片/静态文件必须上传 CDN 后引用 URL，不得放入仓库。

## CLI 页面 Release Notes

`docs/{lang}/docs/cli.md` 末尾维护 **Release Notes** 章节，记录每个 CLI 版本的更新摘要：

- 每个版本 1–3 条要点，只写重点（新增了什么、有无破坏性变更），不列命令细节
- 版本标题带链接：`### [v0.x.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.x.0)`
- 最新版本在最上方
- 章节末尾保留完整 Releases 列表链接：`https://github.com/longbridge/longbridge-terminal/releases`
- 三个语言版本同步更新

## Changelog 页面

`docs/{lang}/docs/changelog.md` 以 **整个 Longbridge Developers 平台**的角度记录变更，不限于 CLI：

- 以日期为单位（`## YYYY-MM-DD`），最新在最上方
- CLI 版本用子标题 `### CLI vX.Y.Z` 标注，平台/API 变更直接写在日期下
- 每条只写重点（1–3 条），从平台视角描述功能价值，不堆砌命令细节
- 发布 CLI 新版本时，同步在 changelog 添加对应条目
- 三个语言版本同步更新
