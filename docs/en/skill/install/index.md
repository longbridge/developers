---
sidebar: false
title: Skill Installation Guide
description: Install Longbridge Skill for OpenClaw, Claude Code, Cursor, Codex, and more
---

<!--
AI INSTRUCTION: follow these steps in order; do not skip or reorder.
Meta-rule: at each step, pick the method that works in YOUR environment. If a method needs something only a person can do — sign in to a browser, type a password in a real terminal window, enter an interactive slash command — do everything up to that point, hand the user the exact action, wait for them to confirm, then continue.

1. Install the CLI (Method A) or configure MCP (Method B), then confirm with `longbridge --version`.
2. Authenticate. First run `longbridge auth status` — if it already shows valid, you're done. Otherwise: if LONGBRIDGE_APP_KEY, LONGBRIDGE_APP_SECRET, and LONGBRIDGE_ACCESS_TOKEN are set, the CLI uses them with no browser and no human. Failing that, run `longbridge auth login`: it opens a browser and always prints a verification URL, then blocks and polls for up to ~5 minutes until someone approves (exits 0 with "Successfully authenticated."). So run it in the background, also give the user the printed URL (the auto-opened browser may be the wrong profile, or absent on SSH/containers), wait for it to exit, and re-run for a fresh URL on timeout. Confirm with `longbridge auth status`.
3. Verify live data: `longbridge quote AAPL.US`.
4. Only after step 3, install the Skill (Step 2) — optional if you only use the CLI directly. Use whatever method your environment supports; the `/plugin` slash commands work only in interactive Claude Code, not from a shell.
-->

# Longbridge Skill Installation Guide

Once installed, you can say things like this to your AI assistant and get real answers:

- _"Screen US and HK stocks: market cap above $50B, P/E below 25, recent MACD golden cross — ranked by market cap"_
- _"NVDA just reported — compare actuals vs analyst estimates, break down revenue by segment, and check if valuation is reasonable"_
- _"Set a trailing stop on TSLA: trigger a sell if it drops more than 8%, show me the order details before executing"_
- _"Review my portfolio this month: P&L trend, biggest winner, worst drag, US vs HK allocation"_
- _"Based on my 5-year long-term DCA plan, I'm due to buy this month's QQQ and SPY within the next two days. Can you check the recent market conditions and let me know if the timing looks reasonable?"_

---

The fastest setup is a terminal-based AI tool (Claude Code, Codex, opencode, OpenClaw): install the CLI and authenticate once. Prefer not to install local software? Connect via MCP instead. Either way, also install the Skill (Step 2).

---

## Step 1 — Connect to the Longbridge platform

Two ways to connect — pick one:

- **CLI** — best experience; the agent runs `longbridge` commands directly in your terminal; requires installing software on your system
- **MCP** — easier to connect; just add a URL to your AI tool's config; no local install needed

### Method A — CLI (recommended)

Works with Claude Code, Codex (Work locally), opencode, OpenClaw, Gemini CLI, Warp, and any tool that can run shell commands.

**Install the CLI:**

```bash
# macOS (requires Homebrew — install at https://brew.sh if not already installed)
brew install --cask longbridge/tap/longbridge-terminal

# macOS / Linux (installs to /usr/local/bin — prompts for your Mac password once; run in a real terminal window)
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

> **macOS without Homebrew:** check `command -v brew` first; if it's missing, don't install Homebrew just for this (it pulls the heavy Xcode Command Line Tools) — use the `curl … | sh` script instead. Either way the binary lands in `/usr/local/bin`, so it needs the Mac password once (`sudo mv`). A password prompt needs a real terminal — it can't be typed through a pipe, a `!` prefix, or a non-interactive agent shell — so the user runs that one line; the agent continues at `longbridge --version`.

**Windows** ([Scoop](https://scoop.sh)):

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

**Windows** (PowerShell):

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

**Verify the install:**

```bash
longbridge --version
```

**Authenticate**

First check `longbridge auth status` — if it already shows valid, you're authenticated; skip this step. Otherwise pick one of two paths, depending on whether a human can approve in a browser:

- **API key / environment variables — fully automatic, no human**

  If all three variables are set, the CLI authenticates with no browser and no human:

  ```bash
  export LONGBRIDGE_APP_KEY=...
  export LONGBRIDGE_APP_SECRET=...
  export LONGBRIDGE_ACCESS_TOKEN=...
  ```

  Get them from the [Longbridge developer console](https://open.longbridge.com/) → User Center → application credentials. Note: `LONGBRIDGE_ACCESS_TOKEN` here is the API-key access token (expires after ~90 days), not an OAuth token.

- **Device login — the agent drives it; the user only approves in a browser**

  ```bash
  longbridge auth login
  ```

  Behavior: it auto-opens a browser when one is available and **always prints a verification URL** (code embedded), then **blocks and polls for up to ~5 minutes**, exiting `0` with `Successfully authenticated.` once the user approves. So the agent runs it in the background, also surfaces the printed URL to the user (the auto-opened browser may be the wrong profile, or absent on SSH/containers — they can open it on any device), waits for it to exit, and re-runs for a fresh URL on timeout. A logged-out user signs in before approving.

  - The printed URL and API endpoints may be on **`open.longbridge.cn`** rather than `.com` — the CLI auto-selects your region. That's expected, not a wrong or phishing link (override with `LONGBRIDGE_REGION=hk` or `cn`).

**Confirm authentication succeeded:**

```bash
longbridge auth status   # account, token validity & expiry — local, no network
longbridge check         # token status + connectivity/latency to Global and CN endpoints
```

**Claude Code users:** The first time Claude runs a `longbridge` command, it will ask for permission. To allow all Longbridge commands without repeated prompts, add this to `.claude/settings.json` in your project (create the file if it doesn't exist):

```json
{
  "permissions": {
    "allow": ["Bash(longbridge *)"]
  }
}
```

> See the [CLI reference](/docs/cli) for the full command list and installation details.

### Method B — MCP

Works with Claude Desktop, Cursor, Zed, Gemini CLI, Warp, and any tool that supports MCP.

Add the following as a remote MCP server in your AI tool:

```
https://openapi.longbridge.com/mcp
```

For clients that use a JSON config file (Claude Desktop, Cursor, Zed, Gemini CLI, etc.), add this to your MCP config:

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://openapi.longbridge.com/mcp"
    }
  }
}
```

> Users in mainland China can use the accelerated endpoint: `https://openapi.longbridge.cn/mcp`

Where to find the MCP configuration in each client:

| Client         | Where to configure                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Desktop | Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Cursor         | Settings → MCP Servers → Add Remote MCP Server                                                                                            |
| Zed            | `context_servers` key in `~/.config/zed/settings.json`                                                                                    |
| Gemini CLI     | `mcpServers` key in `~/.gemini/settings.json`                                                                                             |
| Warp           | Settings → AI → MCP Servers → Add                                                                                                         |

The first time you ask a Longbridge question, your client opens a browser tab for OAuth authorization (no API key required) — a human signs in.

---

## Step 2 — Install the Skill

The Skill is a set of instruction files that tell your AI assistant what Longbridge can do. Optional if you only use the `longbridge` CLI directly — it mainly powers natural-language requests.

Goal: get the skill files into your tool's skill directory. Pick the method that fits how you're running:

- **A shell is available (including autonomous agents):** `npx skills add longbridge/skills -g` (or `bunx skills add longbridge/skills -g`). Installs into `~/.claude/skills/`. Requires [Node.js](https://nodejs.org) or [Bun](https://bun.sh).
- **No package manager:** download [longbridge-all.zip](https://open.longbridge.com/skill/longbridge-all.zip), unzip it, and drop the files into the skill directory (Claude Code: `~/.claude/skills/` or a project's `.claude/skills/`; Cursor: paste into the Rules editor; others: see the README).
- **A human is in an interactive Claude Code session:** they can type `/plugin marketplace add longbridge/skills` then `/plugin install longbridge@longbridge-skills` — this auto-updates through the plugin system, but they're interactive slash commands and don't run from a shell or in headless mode.

**OpenClaw** — send this message in chat and it handles everything automatically:

```
Install the Longbridge Developers Skill from this zip file:
https://open.longbridge.com/skill/longbridge-all.zip
```

---

## Known restrictions by tool

Some environments have network whitelists or sandboxing that block CLI installation and MCP server connections. If things aren't working, check here first.

### Claude Desktop — use the Code tab

**Chat and Cowork modes** in Claude Desktop have network restrictions that prevent CLI installation and MCP server connections. Do not try to install from either of these modes — it will not work no matter how many times you retry.

Switch to the **Code** tab in Claude Desktop (this is Claude Code embedded in the app). From the Code tab, you have full terminal access — you can install the CLI, connect MCP, and install the Skill all in one session.

<img src="https://assets.lbctrl.com/uploads/a15cbcb4-26aa-4e2b-bd88-7fa805ebe78b/claude.png" alt="Claude Desktop — switch to the Code tab" />

### Codex — select "Work locally"

Codex in **Cloud** mode has the same network whitelist restrictions. When starting a new session, select **Work locally** instead of Cloud. This gives the agent full access to your shell and network.

<img src="https://assets.lbctrl.com/uploads/966b77d5-b0a8-42a6-a7c4-4820ba5f4b0b/codex.png" alt="Codex — select Work locally" />

### Claude.ai and ChatGPT.com (web)

Browser-based interfaces have no access to your local system. They cannot run shell commands or connect to external MCP servers.

For Claude, use [Claude Desktop](https://claude.ai/download) and switch to the **Code** tab.

---

## Verify installation

Verify with the CLI directly, or with natural language.

**CLI** — works with just the CLI installed, no Skill required:

```bash
longbridge quote AAPL.US
```

**Natural language** — requires the Skill (or MCP) to be installed:

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

Run `longbridge auth login`, open the printed URL, and approve. Then confirm with `longbridge auth status`.

**Re-authenticate or switch accounts**

```bash
longbridge auth logout   # clears the stored token
longbridge auth login    # log in again
```

**Trading operations not working**

Confirm your account has OpenAPI trading permissions enabled and is eligible to trade in the target market (HK / US).

**Revoking Authorization**

To revoke access, go to your Longbridge account → Security Settings → manage authorized apps.
