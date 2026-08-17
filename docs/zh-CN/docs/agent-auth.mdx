---
title: '授权码授权'
id: agent-auth
slug: /agent-auth
sidebar_position: 2.5
sidebar_icon: sparkles
---

# 授权码授权

授权码授权让你只需把一个简短的一次性授权码粘贴给 AI Agent，即可授权它使用 Longbridge 行情数据与账户能力——无需冗长的 URL，也无需等待浏览器。

你在 Longbridge 授权页生成授权码、勾选要授予的权限，然后把授权码交给 AI 助手。Agent 通过 CLI 或托管 MCP 服务一步完成兑换。

:::tip 生成授权码
打开 [https://open.longbridge.com/connect](https://open.longbridge.com/connect)，登录，选择所需的权限范围，点击生成。
:::

## 适用场景

大多数桌面客户端仍以浏览器 OAuth 为默认方式。当标准流程不便时，改用授权码：

- **客户端不渲染授权链接** — 部分聊天和 Agent 应用把冗长的 OAuth URL 显示为纯文本，无法点击。
- **没有可用的浏览器** — 在手机端、远程 shell，或无法拉起浏览器的沙箱 Agent 环境中。
- **Agent 不会持续挂起** — Device Flow 需要 CLI 在你授权期间持续轮询，而许多 Agent 不会保持进程运行。一次性授权码无需任何轮询。

如果桌面客户端完整支持浏览器 OAuth 流程，使用标准的 [MCP 授权流程](/zh-CN/docs/mcp) 更简单，无需授权码。

## 步骤

1. **打开授权页** — 访问 [https://open.longbridge.com/connect](https://open.longbridge.com/connect)。
2. **登录** Longbridge 账户。
3. **选择权限** — 勾选要授予的权限范围（行情、账户、交易等）。生成的授权码所携带的权限上限就是你在此处选择的范围。
4. **生成授权码** — 页面会生成一个简短的授权码和一段可直接粘贴的指令文本。
5. **粘贴给 AI Agent** — 复制指令文本发送给助手，Agent 用下面任一方式兑换授权码。

授权码有效期 **5 分钟**，且**仅可使用一次**。

## 通过 CLI 兑换

用 `--auth-code` 参数把授权码传给 `auth login`，将示例授权码替换为你的真实授权码：

<CliCommand>
# 兑换从 connect 页面生成的授权码
longbridge auth login --auth-code 6vYzXq3WbKp9TmHd
</CliCommand>

兑换成功后，Token 保存至 `~/.longbridge/openapi/tokens/<client_id>`，后续所有命令自动复用——与浏览器登录效果一致。完整的 `auth` 命令参考见 [安装](/zh-CN/docs/cli/install)。

## 通过 MCP 兑换

授权码兑换走专用端点 **`https://mcp.longbridge.com/agent`**。该端点允许未授权连接，会话在未授权时仅暴露 `authenticate` 这一个工具。主端点 `https://mcp.longbridge.com` 仅支持标准 OAuth 2.1，不提供 `authenticate`——完整支持 OAuth 的客户端应直接用主端点，`/agent` 是 OAuth 不可用时的备用通道。

**流程：**

1. **配置 `/agent` 端点** — 将客户端指向 `https://mcp.longbridge.com/agent`，未授权会话只显示 `authenticate` 工具。
2. **调用 `authenticate` 传入授权码** — 你可以这样告诉助手：「用授权码 1234567890 为 Longbridge MCP 会话完成授权。」Agent 即会带该授权码调用 `authenticate`。
3. **将返回的 Token 配置为 Bearer header** — 兑换成功后，工具结果会返回一个 Token。按结果中的指引让客户端在后续请求中以 `Authorization: Bearer <token>` 携带它，其余 Longbridge MCP 工具随即可用——无需浏览器跳转。

以 Claude Code 为例，用该 Token 作为 header 重新添加服务：

```bash
claude mcp add --transport http longbridge https://mcp.longbridge.com --header "Authorization: Bearer <token>"
```

将 `<token>` 替换为 `authenticate` 返回的 Token。注意此处指向的是主端点 `https://mcp.longbridge.com`——拿到 Bearer Token 后即可直接连接主端点。

## 安全说明

- **权限在网页端预选** — 授权码只能授予你在授权页勾选的权限，Agent 无法请求超出授权码携带范围的权限。
- **5 分钟有效期** — 授权码在生成 5 分钟后过期。
- **一次性使用** — 授权码在首次成功兑换后即失效，不可重复使用。
- **随时可撤销** — 前往 Longbridge 账户安全设置，撤销 **AI Agent** 授权即可终止访问。

遵循最小权限原则：只授予当前任务所需的权限范围。涉及交易的授权，务必要求 Agent 在下单前与你确认。

## 常见问题

### 授权码已过期

授权码有效期为 5 分钟。回到 [https://open.longbridge.com/connect](https://open.longbridge.com/connect) 重新生成一个，并尽快兑换。

### 授权码已被使用

每个授权码仅可使用一次。若此前已兑换成功，则你已完成授权，无需再次兑换。如需新的会话，请重新生成授权码。

### 授予的权限不够

授权码只携带在授权页勾选的权限范围。重新生成一个授权码并勾选所需的额外权限，再次兑换即可刷新会话权限。

### 兑换后仍无法连接

- 确认 Longbridge 账户状态正常且已完成身份认证。
- 确认所选权限范围覆盖你尝试执行的操作（例如交易需要交易权限）。
- 对于 MCP，确认 Agent 连接 `https://mcp.longbridge.com/agent` 调用 `authenticate`，再用返回的 `Authorization: Bearer` Token 连接 `https://mcp.longbridge.com`。
