---
title: MCP
id: mcp
slug: /mcp
sidebar: false
prev: false
next: false
---

# Longbridge MCP 服务

Longbridge 提供托管的 MCP（Model Context Protocol）服务，让你在 ChatGPT、AI 编程助手或其他对话工具中直接使用 [Longbridge 的行情](https://longbridge.com/markets)与账户能力，无需手动管理 API 密钥。

:::tip MCP 服务地址

- 全球：`https://mcp.longbridge.com`
- 中国大陆：`https://mcp.longbridge.cn`（访问更快）

美国账户请使用全球地址 —— `.cn` 没有通往美国数据中心的链路，仅服务 AP 账户（新加坡 / 香港）。详见[接入点与数据中心](/zh-CN/docs/getting-started#接入点与数据中心)。
:::

## 可用能力

Longbridge MCP 暴露 100+ 工具，覆盖六大能力域，客户端连接后会自动发现——无需手动配置。

| 能力             | 覆盖范围                                                 |
| ---------------- | -------------------------------------------------------- |
| **[实时行情](https://longbridge.com/markets)**     | 报价、K 线、深度、经纪队列、逐笔、分时资金流             |
| **基本面与研究** | 公司资料、[分红](https://longbridge.com/calendar/dividend)、估值、高管持仓、A/H 溢价、宏观经济指标   |
| **衍生品**       | 期权链、涡轮筛选、发行商、涡轮报价                       |
| **账户与组合**   | 余额、持仓、资金流水、自选股及分组                       |
| **交易**         | 下单、改单、撤单、可买量估算                             |
| **自动化**       | 股价提醒、定投（DCA）计划                                |

实际可用工具因地区、账户等级与 OAuth 授权范围而异。

## 可用工具

<McpTools />

## 前置条件

- 已拥有 [Longbridge 账户](https://longbridge.com/hk/download)并完成开户，或开通模拟账户
- 支持 MCP OAuth 2.1 的其他 AI 客户端（见下方兼容性说明）

## 客户端接入

推荐优先从 ChatGPT 开始使用，因为 Longbridge 已经可以直接在 ChatGPT Plugins 中搜索并授权。其他 MCP 客户端的配置格式可能随版本变更，请以客户端官方文档为准。

### ChatGPT

Longbridge 已经作为官方 ChatGPT App 提供。

在 ChatGPT 网页版、桌面端或手机客户端中：

1. 打开 **Plugins**
2. 搜索 `longbridge`，或直接打开 [Longbridge ChatGPT App](https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef)
3. 选择 **Longbridge**，并按提示完成授权登录

![在 ChatGPT Plugins 中搜索 Longbridge](https://assets.lbkrs.com/uploads/aeb84040-b2c7-442d-af46-adfab66297a1/scr-20260707-nbjr.png)

![授权 Longbridge ChatGPT App](https://assets.lbkrs.com/uploads/a66bcd75-d747-4259-b684-a689d324716c/scr-20260707-nbno.png)

完成授权后，每次提问时需在消息前加上 `@longbridge`，否则 ChatGPT 不会调用 Longbridge 来查询数据。例如：`@longbridge 查询我的当日订单`。

:::warning ChatGPT 中不含交易下单功能
由于 ChatGPT 平台规则限制，Longbridge ChatGPT App 不含下单及其他交易相关工具。如需使用交易功能，请改用 Claude Code、Cursor 等其他 MCP 客户端。
:::

### Claude Code

在终端运行以下命令：

```bash
claude mcp add --transport http longbridge https://mcp.longbridge.com
```

然后进入 `claude` 终端界面，输入 `/mcp`，选择 `longbridge`，再选择 **Authenticate** 跟随流程完成 OAuth 授权。

### Codex

在终端运行以下命令：

```bash
codex mcp add longbridge --url https://mcp.longbridge.com
```

随后在 Codex 中按提示完成 OAuth 授权流程。

#### Codex Desktop

1. 点击右下角 **Settings** → **MCP Servers** → **Add Server**
2. 在 "Connect to a custom MCP" 界面填写：
   - Name：`longbridge`
   - 类型：**Streamable HTTP**
   - URL：`https://mcp.longbridge.com`
   - 其他字段留空
3. 点击 **Save**
4. 回到 MCP Servers 列表，点击 `longbridge` 条目上的 **Authenticate** 完成 OAuth 授权

### Grok

打开 [Grok Connectors](https://grok.com/connectors)，添加自定义 MCP Server：

1. 在左侧边栏选择 **Skills and Connectors** → **Connectors** → **New Connector** → **Custom**
2. 填写：
   - Name：`Longbridge`
   - Server URL：`https://mcp.longbridge.com`
3. 点击 **Add Connector**，跟随 Longbridge OAuth 2 授权流程完成添加

![](https://assets.lbkrs.com/uploads/08d07992-5463-4bfd-a4e4-97fab6e9cb41/grok-0.png)

![](https://assets.lbkrs.com/uploads/56eee753-f3d4-4186-b024-ee0145f4eb54/grok-1.png)

### Cursor

Settings → MCP Servers → 添加 Remote MCP Server，填入上方地址即可。

### Zed

在 `settings.json` 的 `context_servers` 字段（key 名称可自定义）中添加：

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://mcp.longbridge.com"
    }
  }
}
```

### Cherry Studio

设置 → MCP 服务器 → 添加，填入上方地址即可。

### Manus

在 Manus 中打开 **Plugins** 窗口，点击右侧的 **Create** 按钮，从弹出菜单中选择 **Import MCP by JSON**，粘贴以下 JSON 即可完成导入：

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://mcp.longbridge.com"
    }
  }
}
```

![](https://assets.lbctrl.com/uploads/f3aa3f71-c7a1-48b3-91dc-ea82a7018b53/scr-20260625-ttzy.png)

## OAuth 授权流程

Longbridge MCP 使用标准 OAuth 2.1 授权，你无需向客户端提供 API 密钥或 Token。

在 ChatGPT 中，授权会在从 Plugins 添加 Longbridge 时完成；在其他 MCP 客户端中，通常由首次工具调用触发浏览器授权流程。

```
AI 客户端                  浏览器                    Longbridge
    |                        |                           |
    |--- 发起 MCP 连接 ------>|                           |
    |                        |-- 跳转授权页 ------------>|
    |                        |<- 展示登录 & 权限确认 ----|
    |                        |-- 登录并同意 ------------>|
    |<-- 返回授权凭证 --------|                           |
    |--- 携带凭证访问工具 ----------------------------------->|
```

**步骤说明：**

1. **发起连接** — 在客户端添加 Longbridge MCP 配置后，首次调用会触发授权
2. **浏览器跳转** — 客户端自动打开浏览器，进入 Longbridge 登录与权限确认页
3. **登录并授权** — 使用 Longbridge 账户登录，查看并同意所请求的权限范围（scope）
4. **建立会话** — 授权完成后，客户端获得凭证，MCP 工具即可使用
5. **凭证维护** — 凭证按 OAuth 策略自动刷新；如需撤销，前往 Longbridge 账户安全设置

## 客户端兼容性

Longbridge MCP 依赖 **MCP OAuth 2.1** 标准。若客户端未完整实现该协议，将无法完成授权。

已知问题：Cherry Studio 早期版本不支持完整 OAuth 流程，请升级至最新版本。

如遇其他客户端连接失败，请确认客户端版本并查阅其 MCP 支持文档。

:::tip 客户端无法打开浏览器？
若客户端的 OAuth 实现不完整或无法拉起浏览器，可改用[授权码授权](/zh-CN/docs/agent-auth)：在 [https://open.longbridge.com/connect](https://open.longbridge.com/connect) 生成一次性授权码，连接专用端点 `https://mcp.longbridge.com/agent`，让 Agent 通过 `authenticate` 工具兑换。
:::

## 安全建议

- **最小权限**：授权时仅同意当前任务所需的 scope，避免过度授权
- **交易确认**：涉及下单等交易操作时，在 AI 提示词中明确要求执行前人工确认
- **凭证安全**：OAuth 凭证由客户端管理，避免将其复制到不受信任的环境
- **定期审查**：定期在 [Longbridge 账户](https://longbridge.com/hk/download)安全设置中检查并撤销不再使用的授权

## 推荐使用方式

1. **从只读能力开始**：优先使用[行情查询](https://longbridge.com/markets)、持仓查看等低风险功能，熟悉工具行为
2. **逐步开放交易能力**：确认权限范围和风控逻辑后，再使用下单相关工具
3. **在提示词中加入约束**：例如"每笔交易金额不超过 X"、"执行前向我确认"等明确限制

## 常见问题

### OAuth 登录失败

- 确认 Longbridge 账户状态正常，已完成必要的身份验证
- 在客户端删除现有配置后重新添加并发起授权
- 检查当前账户是否支持所请求的 scope

### 已连接但部分工具不可用

- 账户或地区限制：特定市场或功能可能受账户等级或地区限制
- scope 变更：如工具能力有更新，可能需要重新授权以获得新 scope

### 交易操作提示权限不足

- 检查账户的交易权限和市场可交易资格
- 确认当前 MCP 会话的 OAuth scope 包含交易相关权限
