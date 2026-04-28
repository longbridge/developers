---
sidebar: false
title: Skill 安装指引
description: 在 OpenClaw、Claude Code、Cursor、Codex 等 AI 工具中安装 Longbridge Skill
---

# Longbridge Skill 安装指引

安装完成后，你可以直接问 AI 助手这样的问题，并得到真实的答案：

- _"帮我从美股和港股里，筛出市值 500 亿以上、PE 低于 25、近期 MACD 出现金叉的科技股，按市值排列"_
- _"NVDA 刚出财报，帮我对比实际业绩和分析师预期的差距，拆一下各业务线的营收变化，顺便看看当前估值是否合理"_
- _"帮我给 TSLA 设一个追踪止损，跌幅超过 8% 自动触发卖出，执行前把订单详情给我确认"_
- _"帮我复盘这个月的持仓表现：总盈亏趋势如何，哪只股票贡献最大、哪只表现最弱，组合里美股和港股各占多少"_
- _"我在执行五年长期定投计划，本月的 QQQ 和 SPY 计划在未来两天内买入，帮我看看最近市场情况，这个时机合适吗？"_

---

## 第一步：安装 Skill

Skill 是一组指令文件，告诉 AI 助手 Longbridge 能做什么。安装方式有两种：

**通过 npx / bunx（推荐，全局安装）：**

```bash
# Node.js
npx skills add longbridge/developers -g -y
# Bun
bunx skills add longbridge/developers -g -y
```

> 需要 [Node.js](https://nodejs.org) 或 [Bun](https://bun.sh) 环境。

**或下载 ZIP 手动安装：**

下载 [longbridge.zip](https://open.longbridge.com/skill/longbridge.zip) 并解压，将文件放入你的 AI 工具指定的 Skill 目录（Claude Code 放 `.claude/skills/`，Cursor 粘贴到 Rules 编辑框，其他工具参考 README）。

**OpenClaw** 直接在对话中发送以下消息，自动完成安装：

```
从以下 zip 文件安装 Longbridge Developers Skill：
https://open.longbridge.com/skill/longbridge.zip
```

---

## 第二步：连接 Longbridge 账户

Skill 只是让 AI 知道能做什么，要真正获取行情数据或执行交易，还需要连接 Longbridge 账户。根据你的 AI 工具选择接入方式：

### 方式 A：安装 CLI（适用于有 shell 执行能力的工具）

Claude Code、Codex、Gemini CLI、Warp 等可以直接在终端执行命令的工具适用此方式。

```bash
# macOS（需要 Homebrew，未安装请先访问 https://brew.sh）
brew install --cask longbridge/tap/longbridge-terminal

# macOS / Linux
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

**Windows**（[Scoop](https://scoop.sh)）：

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

**Windows**（PowerShell）：

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

```bash
longbridge auth login
```

> 详细安装说明及完整命令列表参见 [CLI 文档](/zh-CN/docs/cli)。

### 方式 B：连接 MCP 服务器（适用于支持 MCP 的工具）

Claude Desktop、Cursor、Zed、Gemini CLI、Warp 等支持 MCP 的工具适用此方式。

在 AI 工具的 MCP 配置中添加以下服务器地址：

```
https://openapi.longbridge.com/mcp
```

> 中国大陆用户可使用加速地址：`https://openapi.longbridge.cn/mcp`

各工具配置入口：

| 工具           | 配置位置                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Claude Desktop | 编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）或 `%APPDATA%\Claude\claude_desktop_config.json`（Windows） |
| Cursor         | Settings → MCP Servers → Add Remote MCP Server                                                                                             |
| Zed            | `~/.config/zed/settings.json` 中的 `context_servers` 字段                                                                                  |
| Gemini CLI     | `~/.gemini/settings.json` 中的 `mcpServers` 字段                                                                                           |
| Warp           | Settings → AI → MCP Servers → Add                                                                                                          |

首次提问时客户端会自动弹出浏览器完成 OAuth 授权，无需配置 API Key。

---

## 为什么 Claude.ai 和 ChatGPT.com 无法使用

**Claude.ai**（网页版）和 **ChatGPT.com**（网页版）是基于浏览器的界面，无法访问你的本地系统，既不能执行 shell 命令，也无法连接外部 MCP 服务器，因此 Skill 无法获取实时行情或执行交易。

如果你使用 Claude，请安装 [Claude Desktop](https://claude.ai/download) 并通过上方的 MCP 方式接入。

---

## 验证安装

安装完成后，在对话中发送：

```
使用 Longbridge 查一下 AAPL 当前报价
```

如果 AI 能返回实时报价数据，说明安装成功。

> **提示：** 如果 Skill 没有被自动触发，可以在提问前加上 `/longbridge` 强制引用，例如：`/longbridge 查一下 AAPL 当前报价`。

---

## 常见问题

**AI 说找不到 Longbridge 工具**

部分客户端需要重启或新建对话才能加载 Skill。确认安装步骤已完成，并在新会话中再次尝试。

**查询数据时需要授权**

在终端中运行 `longbridge auth login` 完成 OAuth 授权即可，无需配置 API Key。

**交易操作无法执行**

确认账户已开通 OpenAPI 交易权限，以及该市场（港股 / 美股）的交易资格。

**撤销授权**

如需撤销访问权限，前往 Longbridge 账户 → 安全设置 → 管理已授权应用。
