---
sidebar: false
title: Skill 安装指引
description: 在 OpenClaw、Claude Code、Cursor、Codex 等 AI 工具中安装 Longbridge Skill
---

<!--
AI 指令：按顺序执行以下步骤，不得跳过或调换。
元规则：每一步选你所处环境能用的方法。若某方法需要只有人能做的动作——浏览器登录、在真实终端窗口输密码、敲交互式 slash 命令——就先把之前的都做完，把那一步的确切动作交给用户，等其确认后再继续。

1. 安装 CLI（方式 A）或配置 MCP（方式 B），然后用 `longbridge --version` 确认。
2. 完成授权。先运行 `longbridge auth status`——若已显示 valid 即完成。否则：若 LONGBRIDGE_APP_KEY、LONGBRIDGE_APP_SECRET、LONGBRIDGE_ACCESS_TOKEN 已设置，CLI 会自动使用、无需浏览器和人工。再否则运行 `longbridge auth login`：它会打开浏览器并始终打印一个验证 URL，随后阻塞轮询最长约 5 分钟直到有人批准（成功时以 0 退出并打印 "Successfully authenticated."）。所以后台运行它、同时把打印出的 URL 也给用户（自动弹的浏览器可能不是登录的那个，或在 SSH/容器里没有浏览器）、等它退出、超时则重跑拿新 URL。最后用 `longbridge auth status` 确认。
3. 验证实时数据：`longbridge quote AAPL.US`。
4. 第 3 步成功后再装 Skill（第二步）——只用 CLI 的话可跳过。用你环境支持的任意方法；`/plugin` slash 命令只在交互式 Claude Code 里有效，shell 里跑不了。
-->

# Longbridge Skill 安装指引

安装完成后，你可以直接问 AI 助手这样的问题，并得到真实的答案：

- _"帮我从美股和港股里，筛出市值 500 亿以上、PE 低于 25、近期 MACD 出现金叉的科技股，按市值排列"_
- _"NVDA 刚出财报，帮我对比实际业绩和分析师预期的差距，拆一下各业务线的营收变化，顺便看看当前估值是否合理"_
- _"帮我给 TSLA 设一个追踪止损，跌幅超过 8% 自动触发卖出，执行前把订单详情给我确认"_
- _"帮我复盘这个月的持仓表现：总盈亏趋势如何，哪只股票贡献最大、哪只表现最弱，组合里美股和港股各占多少"_
- _"我在执行五年长期定投计划，本月的 QQQ 和 SPY 计划在未来两天内买入，帮我看看最近市场情况，这个时机合适吗？"_

---

最快的上手方式是终端类 AI 工具（Claude Code、Codex、opencode、OpenClaw）：安装 CLI、完成一次授权即可。不想在本地装软件？改用 MCP 接入。两种方式都建议同时安装 Skill（见第二步）。

---

## 第一步：连接 Longbridge 平台

两种接入方式——选其一即可：

- **CLI**：体验最佳，agent 直接在终端运行 `longbridge` 命令；需要在系统上安装软件
- **MCP**：接入更简便，只需在 AI 工具配置中填入一个 URL；无需本地安装

### 方式 A：CLI（推荐）

适用于 Claude Code、Codex（Work locally 模式）、opencode、OpenClaw、Gemini CLI、Warp 等可在终端执行命令的工具。

```bash
# macOS（需要 Homebrew，未安装请先访问 https://brew.sh）
brew install --cask longbridge/tap/longbridge-terminal

# macOS / Linux（装到 /usr/local/bin——会要一次 Mac 密码；请在真实终端窗口里跑）
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

> **macOS 没装 Homebrew：** 先 `command -v brew` 探测；没有就别为这一个工具去装 Homebrew（它会拖很重的 Xcode Command Line Tools）——改用 `curl … | sh` 脚本。两条路二进制都落在 `/usr/local/bin`，所以要一次 Mac 密码（`sudo mv`）。密码输入需要真实终端——管道、`!` 前缀、非交互 agent shell 都填不了——所以这一行由用户来跑；agent 从 `longbridge --version` 继续。

**Windows**（[Scoop](https://scoop.sh)）：

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

**Windows**（PowerShell）：

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

**验证安装：**

```bash
longbridge --version
```

**授权登录**

先查 `longbridge auth status`——若已显示 valid，即已授权，可跳过本步。否则按是否有人能在浏览器批准，选一条路径：

- **API key / 环境变量——全自动、无需人工**

  三个变量都设置后，CLI 无需浏览器、无需人工即可鉴权：

  ```bash
  export LONGBRIDGE_APP_KEY=...
  export LONGBRIDGE_APP_SECRET=...
  export LONGBRIDGE_ACCESS_TOKEN=...
  ```

  从 [Longbridge 开发者后台](https://open.longbridge.com/) → 用户中心 → 应用凭证获取。注意：这里的 `LONGBRIDGE_ACCESS_TOKEN` 是 API key 的 Access Token（约 90 天过期），不是 OAuth token。

- **Device 登录——由 agent 驱动，用户只需在浏览器里批准**

  ```bash
  longbridge auth login
  ```

  真实行为：有浏览器时会自动打开，并**始终打印一个验证 URL**（code 已内嵌）,随后**阻塞轮询最长约 5 分钟**,用户批准后以 `0` 退出并打印 `Successfully authenticated.`。所以 agent 后台运行它、同时把打印出的 URL 展示给用户（自动弹的浏览器可能不是登录的那个，或在 SSH/容器里根本没有——用户可在任意设备打开）、等它退出、超时则重跑拿新 URL。未登录的用户先登录再批准。

  - 打印出的 URL 和 API 接口可能是 **`open.longbridge.cn`** 而非 `.com`——CLI 会自动选择 region，这是正常的，不是错链或钓鱼链接（region 不对可用 `LONGBRIDGE_REGION=hk` 或 `cn` 覆盖）。

**确认授权成功：**

```bash
longbridge auth status   # 账户、token 有效性与过期时间——本地、无网络
longbridge check         # token 状态 + 到 Global 与 CN 接口的连通性/延迟
```

**Claude Code 用户：** Claude 首次运行 `longbridge` 命令时会弹出权限确认提示。若要避免每次都被询问，可在项目的 `.claude/settings.json` 中添加以下配置（文件不存在时新建）：

```json
{
  "permissions": {
    "allow": ["Bash(longbridge *)"]
  }
}
```

> 详细安装说明及完整命令列表参见 [CLI 文档](/zh-CN/docs/cli)。

### 方式 B：MCP

适用于 Claude Desktop、Cursor、Zed、Gemini CLI、Warp 等支持 MCP 的工具。

在 AI 工具的 MCP 配置中添加以下服务器地址：

```
https://openapi.longbridge.com/mcp
```

对于使用 JSON 配置文件的客户端（Claude Desktop、Cursor、Zed、Gemini CLI 等），将以下内容添加到 MCP 配置中：

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://openapi.longbridge.com/mcp"
    }
  }
}
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

首次提问时客户端会自动弹出浏览器完成 OAuth 授权（无需 API Key）——由人登录。

---

## 第二步：安装 Skill

Skill 是一组指令文件，告诉 AI 助手 Longbridge 能做什么。只用 longbridge CLI 的话可跳过——Skill 主要服务自然语言请求。

目标：把 skill 文件放进你工具的 skill 目录。按你的运行环境选一种：

- **有 shell（含自主 agent）：** `npx skills add longbridge/skills -g`（或 `bunx skills add longbridge/skills -g`），装到 `~/.claude/skills/`，需 [Node.js](https://nodejs.org) 或 [Bun](https://bun.sh)。
- **没有包管理器：** 下载 [longbridge-all.zip](https://open.longbridge.com/skill/longbridge-all.zip) 解压，把文件放进 skill 目录（Claude Code：`~/.claude/skills/` 或项目 `.claude/skills/`；Cursor 粘到 Rules 编辑框；其他参考 README）。
- **人在交互式 Claude Code 里：** 可敲 `/plugin marketplace add longbridge/skills` + `/plugin install longbridge@longbridge-skills`——通过插件系统自动更新，但这是交互式 slash 命令，shell 或 headless 模式跑不了。

**OpenClaw** 直接在对话中发送以下消息，自动完成安装：

```
从以下 zip 文件安装 Longbridge Developers Skill：
https://open.longbridge.com/skill/longbridge-all.zip
```

---

## 各工具的已知限制

部分环境存在网络白名单或沙箱限制，会阻止 CLI 安装和 MCP 服务器连接。遇到问题请先查阅本节。

### Claude Desktop — 切换到 Code 标签页

Claude Desktop 的 **Chat 和 Cowork 模式**都存在网络限制，无法安装 CLI 或连接 MCP 服务器。不要在这两种模式下反复尝试，这样不会成功。

切换到 Claude Desktop 的 **Code 标签页**（即 App 内嵌的 Claude Code）。在 Code 标签页下，你拥有完整的终端访问权限，可以在同一个会话中完成 CLI 安装、MCP 连接和 Skill 安装。

<img src="https://assets.lbctrl.com/uploads/76a34f28-9000-4e3e-8250-e992c516ce80/claude.png" alt="Claude Desktop — 切换到 Code 标签页" />

### Codex — 选择「Work locally」

Codex 的 **Cloud 模式**存在同样的网络白名单限制。启动新会话时，请选择 **Work locally** 而非 Cloud。本地模式下 AI 可完整访问你的 shell 和网络。

<img src="https://assets.lbctrl.com/uploads/ccd412df-d312-45c3-a926-e3d466c9a479/codex.png" alt="Codex — 选择 Work locally" />

### Claude.ai 和 ChatGPT.com（网页版）

基于浏览器的界面无法访问本地系统，既不能执行 shell 命令，也无法连接外部 MCP 服务器。

如果你使用 Claude，请安装 [Claude Desktop](https://claude.ai/download) 并切换到 **Code 标签页**。

---

## 验证安装

可以直接用 CLI 验证，也可以用自然语言验证。

**CLI**——只装了 CLI、没装 Skill 也能用：

```bash
longbridge quote AAPL.US
```

**自然语言**——需要已安装 Skill（或 MCP）：

```
使用 Longbridge 查一下 AAPL 当前报价
```

如果能返回实时报价数据，说明安装成功。

> **提示：** 如果 Skill 没有被自动触发，可以在提问前加上 `/longbridge` 强制引用，例如：`/longbridge 查一下 AAPL 当前报价`。

---

## 常见问题

**AI 说找不到 Longbridge 工具**

部分客户端需要重启或新建对话才能加载 Skill。确认安装步骤已完成，并在新会话中再次尝试。

**查询数据时需要授权**

运行 `longbridge auth login`，打开打印出的 URL 并批准，随后用 `longbridge auth status` 确认。

**重新授权或切换账号**

```bash
longbridge auth logout   # 清除已存储的 token
longbridge auth login    # 重新登录
```

**交易操作无法执行**

确认账户已开通 OpenAPI 交易权限，以及该市场（港股 / 美股）的交易资格。

**撤销授权**

如需撤销访问权限，前往 Longbridge 账户 → 安全设置 → 管理已授权应用。
