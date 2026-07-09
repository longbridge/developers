---
title: MCP
id: mcp
slug: /mcp
sidebar: false
prev: false
next: false
---

# Longbridge MCP Service

Longbridge provides a hosted MCP (Model Context Protocol) service that lets you use [Longbridge market data](https://longbridge.com/markets) and account capabilities directly from ChatGPT, AI coding assistants, and other chat tools — without managing API keys manually.

:::tip MCP endpoint

- Global: `https://mcp.longbridge.com`
- Mainland China: `https://mcp.longbridge.cn` (faster access)
  :::

## Available capabilities

Longbridge MCP exposes 100+ tools across six capability areas. Your client discovers them automatically on connect — no manual configuration.

| Capability                  | Coverage                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| **[Real-time market data](https://longbridge.com/markets)**   | Quotes, candlesticks, depth, broker queues, trades, intraday capital flow                          |
| **Fundamentals & research** | Company profiles, [dividends](https://longbridge.com/calendar/dividend), valuations, executive holdings, A/H premium, macroeconomic indicators |
| **Derivatives**             | Option chains, warrant filters, issuers, warrant quotes                                            |
| **Account & portfolio**     | Balances, positions, cash flow, watchlists and groups                                              |
| **Trading**                 | Place / modify / cancel orders, estimate max purchase quantity                                     |
| **Automation**              | Price alerts, scheduled DCA (dollar-cost averaging) plans                                          |

Actual tool availability depends on your region, account level, and granted OAuth scopes.

## Available tools

<McpTools />

## Prerequisites

- An active [Longbridge account](https://longbridge.com/hk/download) with onboarding completed, or a paper trading account
- Another AI client that supports MCP OAuth 2.1 (see compatibility note below)

## Client setup

ChatGPT is the recommended starting point because Longbridge is available directly in ChatGPT Apps. For other MCP clients, configuration format may vary across client versions; treat your client's official MCP documentation as the source of truth.

### ChatGPT

Longbridge is available as an official ChatGPT App.

On ChatGPT web, desktop, or mobile:

1. Open **Apps**
2. Search for `longbridge`, or open the [Longbridge ChatGPT App](https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef) directly
3. Select **Longbridge** and complete the authorization login

![Search for Longbridge in ChatGPT Apps](https://assets.lbkrs.com/uploads/aeb84040-b2c7-442d-af46-adfab66297a1/scr-20260707-nbjr.png)

![Authorize the Longbridge ChatGPT App](https://assets.lbkrs.com/uploads/a66bcd75-d747-4259-b684-a689d324716c/scr-20260707-nbno.png)

After authorization, prefix every message with `@longbridge` to send it to Longbridge MCP — for example: `@longbridge check my today's orders`. Without this prefix, ChatGPT will not route your question to Longbridge.

:::warning Trading features unavailable in ChatGPT
Due to ChatGPT platform policies, the Longbridge ChatGPT App does not include order placement and other trading tools. To use trading features, switch to Claude Code, Cursor, or another MCP client.
:::

### Claude Code

Run the following command in your terminal:

```bash
claude mcp add --transport http longbridge https://mcp.longbridge.com
```

Then open the `claude` terminal interface, type `/mcp`, select `longbridge`, and choose **Authenticate** to complete the OAuth authorization flow.

### Codex

Run the following command in your terminal:

```bash
codex mcp add longbridge --url https://mcp.longbridge.com
```

Then follow the OAuth authorization flow in Codex when prompted.

#### Codex Desktop

1. Click **Settings** (bottom right) → **MCP Servers** → **Add Server**
2. In the "Connect to a custom MCP" screen, fill in:
   - Name: `longbridge`
   - Type: **Streamable HTTP**
   - URL: `https://mcp.longbridge.com`
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
      "url": "https://mcp.longbridge.com"
    }
  }
}
```

### Cherry Studio

Settings → MCP Servers → Add, then enter the URL above.

### Manus

In Manus, open the **Plugins** window, click the **Create** button on the right side, and select **Import MCP by JSON** from the menu. Paste the following JSON to complete the import:

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

## OAuth authorization flow

Longbridge MCP uses standard OAuth 2.1. You never need to paste API keys or tokens into the client.

In ChatGPT, the authorization happens when you add Longbridge from Apps. In other MCP clients, the first tool call usually starts the browser authorization flow.

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

:::tip Client can't open the browser?
If your client has incomplete OAuth support or cannot launch a browser, use an [Agent Auth Code](/agent-auth) instead: generate a one-time code at [https://open.longbridge.com/connect](https://open.longbridge.com/connect), connect to the dedicated endpoint `https://mcp.longbridge.com/agent`, and have the agent redeem it via the `authenticate` tool.
:::

## Security recommendations

- **Least privilege**: Only approve the scopes required for your current task; avoid over-granting
- **Trading confirmation**: For any order placement prompt, explicitly instruct the AI to ask for human confirmation before executing
- **Credential handling**: OAuth credentials are managed by your client; avoid copying them into untrusted environments
- **Regular review**: Periodically check and revoke unused authorizations in your [Longbridge account](https://longbridge.com/hk/download) security settings

## Recommended usage pattern

1. **Start with read-only tools**: Begin with [market data](https://longbridge.com/markets), account overview, and position queries to learn tool behavior at low risk
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
