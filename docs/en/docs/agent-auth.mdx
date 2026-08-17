---
title: 'Agent Auth Code'
id: agent-auth
slug: /agent-auth
sidebar_position: 2.5
sidebar_icon: sparkles
---

# Agent Auth Code

Agent Auth Code lets you authorize an AI agent to use Longbridge market data and account capabilities by pasting a short, one-time code into the agent — no long URLs and no waiting browser.

You generate the code on the Longbridge authorization page, pick the permissions you want to grant, and hand the code to your AI assistant. The agent redeems it in one step through the CLI or the hosted MCP service.

:::tip Generate a code
Open [https://open.longbridge.com/connect](https://open.longbridge.com/connect), sign in, select the scopes you need, and click generate.
:::

## When to use it

Browser-based OAuth is still the default for most desktop clients. Reach for an Agent Auth Code instead when the standard flow does not work well:

- **The client does not render the authorization link** — some chat and agent apps show the long OAuth URL as plain text, so it cannot be clicked.
- **No browser is available** — on mobile, in a remote shell, or in a sandboxed agent environment that cannot launch a browser.
- **The agent does not stay running** — Device Flow requires the CLI to keep polling while you authorize, but many agents do not hold a process open. A one-time code avoids any polling.

For a desktop client that fully supports the browser OAuth flow, the standard [MCP authorization flow](/mcp) is simpler and you do not need a code.

## Steps

1. **Open the authorization page** — go to [https://open.longbridge.com/connect](https://open.longbridge.com/connect).
2. **Sign in** with your Longbridge account.
3. **Select permissions** — choose the scopes (market data, account, trading, etc.) you want to grant. The generated code can only ever carry the scopes you pick here.
4. **Generate the code** — the page produces a short auth code and a ready-to-paste instruction text.
5. **Paste it to your AI agent** — copy the instruction text and send it to your assistant. The agent redeems the code using one of the methods below.

The code is valid for **5 minutes** and can be used **once**.

## Redeem via CLI

Pass the code to `auth login` with the `--auth-code` flag. Replace the example code with your real one:

<CliCommand>
# Redeem an auth code generated from the connect page
longbridge auth login --auth-code 6vYzXq3WbKp9TmHd
</CliCommand>

On success the token is saved to `~/.longbridge/openapi/tokens/<client_id>` and reused automatically by all subsequent commands — exactly like the browser login. See [Installation](/docs/cli/install) for the full `auth` command reference.

## Redeem via MCP

Auth-code redemption runs against a dedicated endpoint, **`https://mcp.longbridge.com/agent`**. This endpoint allows unauthorized connections, and while a session is unauthorized it exposes only the `authenticate` tool. The main endpoint `https://mcp.longbridge.com` is standard OAuth 2.1 only and does not offer `authenticate` — clients that fully support OAuth should use the main endpoint, and `/agent` is the fallback channel for when OAuth is not available.

**Flow:**

1. **Configure the `/agent` endpoint** — point your client at `https://mcp.longbridge.com/agent`. The unauthorized session shows just the `authenticate` tool.
2. **Call `authenticate` with the auth code** — tell your assistant something like: "Authenticate the Longbridge MCP session with auth code 1234567890." The agent invokes `authenticate` with that code.
3. **Configure the returned token as a Bearer header** — on success, the tool result returns a token. Follow the instructions in the result to have the client send it as `Authorization: Bearer <token>` on subsequent requests. The remaining Longbridge MCP tools then become available — no browser redirect required.

For Claude Code, re-add the server with the token as a header:

```bash
claude mcp add --transport http longbridge https://mcp.longbridge.com --header "Authorization: Bearer <token>"
```

Replace `<token>` with the token returned by `authenticate`. Note this points at the main endpoint `https://mcp.longbridge.com` — once you hold a Bearer token, you connect there directly.

## Security

- **Scope is pre-selected on the web** — the code can only grant the permissions you chose on the authorization page; an agent cannot request more than the code carries.
- **5-minute TTL** — the code expires 5 minutes after it is generated.
- **One-time use** — the code is consumed on first successful redemption and cannot be reused.
- **Revocable anytime** — go to your Longbridge account security settings and revoke the **AI Agent** authorization to end access.

Follow least privilege: grant only the scopes the current task needs. For any trading-related grant, instruct the agent to confirm with you before placing orders.

## FAQ

### The code has expired

Auth codes are valid for 5 minutes. Return to [https://open.longbridge.com/connect](https://open.longbridge.com/connect) and generate a new one, then redeem it promptly.

### The code was already used

Each code works only once. If redemption already succeeded earlier, you are authorized — there is no need to redeem again. If you need a fresh session, generate a new code.

### The granted permissions are not enough

The code only carries the scopes selected on the authorization page. Generate a new code and select the additional scopes you need, then redeem it again to refresh the session's permissions.

### Connection still fails after redeeming

- Confirm your Longbridge account is in good standing and identity verification is complete.
- Confirm the scopes you selected cover the action you are attempting (for example, trading requires trading scopes).
- For MCP, verify the agent connects to `https://mcp.longbridge.com/agent` to call `authenticate`, then reconnects to `https://mcp.longbridge.com` with the returned `Authorization: Bearer` token.
