---
title: MCP
id: mcp
slug: /mcp
sidebar: false
---

# Longbridge MCP Service

Longbridge provides a hosted HTTP MCP (Model Context Protocol) service that lets you use Longbridge market data and account capabilities directly from AI coding assistants and chat tools — without managing API keys manually.

:::tip MCP endpoint
- Global: `https://openapi.longbridge.com/mcp`
- Mainland China: `https://openapi.longbridge.cn/mcp` (faster access)
:::

## Available capabilities

Longbridge MCP exposes 100+ tools across six capability areas. Your client discovers them automatically on connect — no manual configuration.

| Capability | Coverage |
| --- | --- |
| **Real-time market data** | Quotes, candlesticks, depth, broker queues, trades, intraday capital flow |
| **Fundamentals & research** | Company profiles, dividends, valuations, executive holdings, A/H premium |
| **Derivatives** | Option chains, warrant filters, issuers, warrant quotes |
| **Account & portfolio** | Balances, positions, cash flow, watchlists and groups |
| **Trading** | Place / modify / cancel orders, estimate max purchase quantity |
| **Automation** | Price alerts, scheduled DCA (dollar-cost averaging) plans |

Actual tool availability depends on your region, account level, and granted OAuth scopes.

## Available tools

<McpTools />

## Prerequisites

- An active Longbridge account with onboarding completed, or a paper trading account
- An AI client that supports MCP OAuth 2.1 (see compatibility note below)

## Client setup

> Configuration format may vary across client versions. Treat your client's official MCP documentation as the source of truth. The core parameter you need is the server URL below.

### Claude Code

Run the following command in your terminal:

```bash
claude mcp add --transport http longbridge https://openapi.longbridge.com/mcp
```

Then open the `claude` terminal interface, type `/mcp`, select `longbridge`, and choose **Authenticate** to complete the OAuth authorization flow.

### Codex

1. Click **Settings** (bottom right) → **MCP Servers** → **Add Server**
2. In the "Connect to a custom MCP" screen, fill in:
   - Name: `longbridge`
   - Type: **Streamable HTTP**
   - URL: `https://openapi.longbridge.com/mcp`
   - Leave all other fields empty
3. Click **Save**
4. Back in the MCP Servers list, click **Authenticate** on the `longbridge` entry to complete OAuth authorization

### Cursor

Settings → MCP Servers → Add Remote MCP Server, then enter the URL above.

### Zed

Add the following to your `settings.json` under the `context_servers` key (key name is customizable):

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

Settings → MCP Servers → Add, then enter the URL above.

## OAuth authorization flow

Longbridge MCP uses standard OAuth 2.1. You never need to paste API keys or tokens into the client.

```
AI client                  Browser                   Longbridge
    |                        |                           |
    |--- initiate MCP ------->|                           |
    |                        |--- redirect to auth ------>|
    |                        |<-- show login & consent ---|
    |                        |--- sign in & approve ------>|
    |<-- return credentials --|                           |
    |--- call tools with credentials ----------------------->|
```

**Steps:**

1. **Initiate connection** — Adding the Longbridge MCP config and calling a tool for the first time triggers the authorization flow
2. **Browser redirect** — The client opens a browser tab with the Longbridge login and consent page
3. **Sign in and approve** — Log in with your Longbridge account and review and accept the requested permission scopes
4. **Session established** — After approval, the client receives credentials and MCP tools become available
5. **Credential maintenance** — Credentials are refreshed automatically per OAuth policy; to revoke access, visit Longbridge account security settings

## Client compatibility

Longbridge MCP requires clients that fully implement **MCP OAuth 2.1**. Clients with incomplete support will fail during the authorization flow.

Known issue: early versions of Cherry Studio do not support the full OAuth flow. Please upgrade to the latest release.

If another client fails to connect, check its version and MCP support documentation.

## Security recommendations

- **Least privilege**: Only approve the scopes required for your current task; avoid over-granting
- **Trading confirmation**: For any order placement prompt, explicitly instruct the AI to ask for human confirmation before executing
- **Credential handling**: OAuth credentials are managed by your client; avoid copying them into untrusted environments
- **Regular review**: Periodically check and revoke unused authorizations in your Longbridge account security settings

## Recommended usage pattern

1. **Start with read-only tools**: Begin with market data, account overview, and position queries to learn tool behavior at low risk
2. **Gradually enable trading**: Enable order placement only after verifying scope configuration and your own risk controls
3. **Add guardrails in prompts**: For example, "keep each trade under X", "always confirm with me before placing an order"

## Troubleshooting

### OAuth sign-in failed

- Confirm your Longbridge account is in good standing and identity verification is complete
- Remove the existing MCP configuration from the client and re-add it to trigger a fresh authorization
- Check whether the requested scopes are supported for your account type

### Connected but some tools are missing

- Account or regional restrictions: certain markets or features may be limited by account level or region
- Scope changes: if tool capabilities have been updated, re-authorize to receive the new scopes

### Permission denied on trading actions

- Verify trading permissions and market eligibility on your account
- Confirm that the current MCP session's OAuth scopes include trading-related permissions
