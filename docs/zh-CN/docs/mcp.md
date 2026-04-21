---
title: MCP
id: mcp
slug: /mcp
sidebar: false
---

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

> 各客户端的 MCP 配置格式可能随版本变更，以客户端官方文档为准。以下提供核心配置参数。

### Claude Code

在终端运行以下命令：

```bash
claude mcp add --transport http longbridge https://openapi.longbridge.com/mcp
```

然后进入 `claude` 终端界面，输入 `/mcp`，选择 `longbridge`，再选择 **Authenticate** 跟随流程完成 OAuth 授权。

### Codex

1. 点击右下角 **Settings** → **MCP Servers** → **Add Server**
2. 在 "Connect to a custom MCP" 界面填写：
   - Name：`longbridge`
   - 类型：**Streamable HTTP**
   - URL：`https://openapi.longbridge.com/mcp`
   - 其他字段留空
3. 点击 **Save**
4. 回到 MCP Servers 列表，点击 `longbridge` 条目上的 **Authenticate** 完成 OAuth 授权

### Cursor

Settings → MCP Servers → 添加 Remote MCP Server，填入上方地址即可。

### Zed

在 `settings.json` 的 `context_servers` 字段（key 名称可自定义）中添加：

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://openapi.longbridge.com/mcp"
    }
  }
}
```

### Cherry Studio

设置 → MCP 服务器 → 添加，填入上方地址即可。

## OAuth 授权流程

Longbridge MCP 使用标准 OAuth 2.1 授权，你无需向客户端提供 API 密钥或 Token。

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

## 安全建议

- **最小权限**：授权时仅同意当前任务所需的 scope，避免过度授权
- **交易确认**：涉及下单等交易操作时，在 AI 提示词中明确要求执行前人工确认
- **凭证安全**：OAuth 凭证由客户端管理，避免将其复制到不受信任的环境
- **定期审查**：定期在 Longbridge 账户安全设置中检查并撤销不再使用的授权

## 推荐使用方式

1. **从只读能力开始**：优先使用行情查询、持仓查看等低风险功能，熟悉工具行为
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
