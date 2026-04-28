---
sidebar: false
title: Skill Installation Guide
description: Install Longbridge Skill for OpenClaw, Claude Code, Cursor, Codex, and more
---

# Longbridge Skill Installation Guide

Once installed, you can say things like this to your AI assistant and get real answers:

- _"Screen US and HK stocks: market cap above $50B, P/E below 25, recent MACD golden cross — ranked by market cap"_
- _"NVDA just reported — compare actuals vs analyst estimates, break down revenue by segment, and check if valuation is reasonable"_
- _"Set a trailing stop on TSLA: trigger a sell if it drops more than 8%, show me the order details before executing"_
- _"Review my portfolio this month: P&L trend, biggest winner, worst drag, US vs HK allocation"_
- _"Based on my 5-year long-term DCA plan, I'm due to buy this month's QQQ and SPY within the next two days. Can you check the recent market conditions and let me know if the timing looks reasonable?"_

---

## Step 1 — Install the Skill

The Skill is a set of instruction files that tell your AI assistant what Longbridge can do. Two ways to install:

**Via npx / bunx (recommended, global install):**

```bash
# Node.js
npx skills add longbridge/developers -g -y
# Bun
bunx skills add longbridge/developers -g -y
```

> Requires [Node.js](https://nodejs.org) or [Bun](https://bun.sh).

**Or download the ZIP and install manually:**

Download [longbridge.zip](https://open.longbridge.com/skill/longbridge.zip) and unzip it, then place the files in your AI tool's Skill directory (Claude Code: `.claude/skills/`, Cursor: paste into the Rules editor, other tools: see the README).

**OpenClaw** — send this message in chat and it handles everything automatically:

```
Install the Longbridge Developers Skill from this zip file:
https://open.longbridge.com/skill/longbridge.zip
```

---

## Step 2 — Connect your Longbridge account

The Skill tells the AI what's possible. To actually fetch live data or execute trades, you need one of two capabilities:

- **Shell execution** — the AI runs `longbridge` commands directly in a terminal
- **MCP integration** — the AI connects to the Longbridge MCP server over the network

### Method A — Install the CLI

For AI tools that can execute shell commands (Claude Code, Codex, Gemini CLI, Warp, etc.).

**Install the CLI:**

```bash
# macOS (requires Homebrew — install at https://brew.sh if not already installed)
brew install --cask longbridge/tap/longbridge-terminal

# macOS / Linux
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

**Windows** ([Scoop](https://scoop.sh)):

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

**Windows** (PowerShell):

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

**Connect your Longbridge account:**

```bash
longbridge auth login
```

That's it. The AI can now call `longbridge` commands on your behalf.

> See the [CLI reference](/docs/cli) for the full command list and installation details.

### Method B — Connect the MCP server

For AI tools that support MCP (Claude Desktop, Cursor, Zed, Gemini CLI, Warp, etc.).

Add the following as a remote MCP server in your AI tool:

```
https://openapi.longbridge.com/mcp
```

Where to find the MCP configuration in each client:

| Client         | Where to configure                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Desktop | Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Cursor         | Settings → MCP Servers → Add Remote MCP Server                                                                                            |
| Zed            | `context_servers` key in `~/.config/zed/settings.json`                                                                                    |
| Gemini CLI     | `mcpServers` key in `~/.gemini/settings.json`                                                                                             |
| Warp           | Settings → AI → MCP Servers → Add                                                                                                         |

The first time you ask a Longbridge question, your client will open a browser tab for OAuth authorization — no API key required.

---

## Why Claude.ai and ChatGPT.com don't work

**Claude.ai** (web) and **ChatGPT.com** (web) are browser-based interfaces with no access to your local system. They cannot run shell commands or connect to external MCP servers, so the Skill has no way to fetch live market data or execute trades.

If you use Claude, install [Claude Desktop](https://claude.ai/download) and use the MCP method above.

---

## Verify installation

After installing, ask your AI assistant:

```
Use Longbridge to get the current quote for AAPL
```

If it returns live data, you're all set.

> **Tip:** If the Skill isn't triggered automatically, prefix your request with `/longbridge` to force it — for example: `/longbridge get the current quote for AAPL`.

---

## Troubleshooting

**AI says it can't find the Longbridge tool**

Some clients require a restart or a new conversation to load the Skill. Confirm the installation is complete, then try again in a new session.

**Prompted for authorization when querying data**

Run `longbridge auth login` in your terminal and complete the OAuth flow — no API Key required.

**Trading operations not working**

Confirm your account has OpenAPI trading permissions enabled and is eligible to trade in the target market (HK / US).

**Revoking Authorization**

To revoke access, go to your Longbridge account → Security Settings → manage authorized apps.
