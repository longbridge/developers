# MCP Server

Longbridge provides MCP (Model Context Protocol) support through the official ChatGPT App, a hosted cloud service for other MCP clients, and a self-hosted binary.

## ChatGPT App

Longbridge is available directly in ChatGPT Apps.

On ChatGPT web, desktop, or mobile:

1. Open Apps
2. Search for `longbridge`, or open https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef directly
3. Select Longbridge and complete the authorization login
4. Type `@longbridge` in the ChatGPT message box to start Longbridge MCP and query data

## Hosted MCP Service

**Endpoint:** `https://mcp.longbridge.com`

No API keys needed — uses OAuth 2.1. The AI client handles the browser authorization flow automatically.

### Client Configuration

For non-ChatGPT MCP clients, add Longbridge to the MCP config:

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://mcp.longbridge.com"
    }
  }
}
```

**Per-client setup:**

- **Cursor**: Settings → MCP Servers → Add Remote MCP Server
- **Claude Code**: `claude mcp add longbridge https://mcp.longbridge.com`
- **ChatGPT**: https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef or Apps → search `longbridge` → authorize, then use `@longbridge`
- **Zed**: `context_servers` in `settings.json`
- **Cherry Studio**: Settings → MCP Servers → Add (requires latest version for OAuth support)

### OAuth Authorization Flow

1. ChatGPT authorizes while adding Longbridge from Apps; other clients add the config and call any tool to trigger OAuth
2. Client opens a browser tab to Longbridge login & consent page
3. Sign in with your Longbridge account and approve scopes
4. Credentials are stored by the client; tokens refresh automatically
5. To revoke: Longbridge account → Security Settings

**No browser? Use an auth code.** If the client can't open a browser or has
incomplete OAuth support, have the user generate a one-time auth code at
https://open.longbridge.com/connect, then connect to the dedicated
**authorization endpoint** `https://mcp.longbridge.com/agent` — an auth-only
channel, NOT the MCP service address (it allows unauthorized connections and
exposes only the `authenticate` tool) — and call `authenticate` with that code
from the unauthorized session. The tool returns a token; configure the client to
send it as `Authorization: Bearer <token>` against `https://mcp.longbridge.com`
(e.g. `claude mcp add --transport http longbridge https://mcp.longbridge.com --header "Authorization: Bearer <token>"`).

### Security Recommendations

- Only approve scopes required for the task (least privilege)
- For order placement, instruct AI to always ask for confirmation before executing
- Periodically review and revoke unused authorizations

---

## Available MCP Tools

When the MCP server is connected, available tools are automatically exposed to the AI — no hardcoded list needed. The AI can directly inspect and call all tools.

If you need to know what tools are available, ask the AI to list the connected MCP tools, or check the official docs: https://open.longbridge.com

---

## Example AI Prompts

```
# Market data
"What is the current price and PE ratio of TSLA.US?"

# Trade analysis
"Show my current HK stock positions and unrealized P&L"
"Analyze my account and quantify its exposure to AI, semiconductors, and internet-related stocks."

# Order placement (always confirm first)
"I want to buy 100 shares of 700.HK at limit price 50 HKD.
 Please confirm the order details before placing it."

# Research
"Get the latest news and filings for AAPL.US"
```
