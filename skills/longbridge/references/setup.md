# Longbridge Setup & Authentication

## CLI Installation

```bash
# macOS (Homebrew)
brew install --cask longbridge/tap/longbridge-terminal

# macOS / Linux
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

Windows (Scoop or PowerShell):

```powershell
# Scoop
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json

# Or PowerShell install script
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

Authenticate:

```bash
longbridge auth login
```

If the browser OAuth flow is unavailable (no browser, headless, or a client that
can't open links), have the user generate a one-time auth code at
https://open.longbridge.com/connect, then redeem it:

```bash
longbridge auth login --auth-code <code>
```

For MCP clients, redeem the code against the dedicated authorization endpoint
`https://mcp.longbridge.com/agent` via the `authenticate` tool (auth-only
channel — the MCP service address remains `https://mcp.longbridge.com`) — see
[references/mcp.md](references/mcp.md).

## CLI Update

```bash
# Built-in updater
longbridge update

# Or re-run the install script
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

## MCP (for AI tools — no code)

```text
# ChatGPT web, desktop, and mobile
https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef
or Apps → search "longbridge" → authorize → use @longbridge in the message box
```

```bash
# Claude Code
claude mcp add longbridge https://mcp.longbridge.com
```

ChatGPT completes authorization while adding Longbridge from Apps. Other clients trigger an OAuth browser flow on the first tool call. See [references/mcp.md](references/mcp.md) for Cursor, Claude Code, Zed, and other MCP clients.

## Revoking Authorization

To revoke access, go to your Longbridge account → Security Settings → manage authorized apps.

## Authentication

All tools use **OAuth 2.0** — no manual token or API key management needed.

**Token cache:** `~/.longbridge/openapi/tokens/<client_id>`
**Register OAuth client:** POST `https://openapi.longbridge.com/oauth2/register`

## Rate Limits

- REST API: max **10 calls/second**
- SDK auto-refreshes OAuth tokens
- WebSocket subscriptions: subject to quote package limits
