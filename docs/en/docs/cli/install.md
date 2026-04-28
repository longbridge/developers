---
title: 'Installation'
sidebar_label: 'Installation'
sidebar_position: 2
sidebar_icon: arrow-down-to-line
---

# Installation

Install the CLI and authenticate with your Longbridge account.

Source code and release binaries: [longbridge/longbridge-terminal](https://github.com/longbridge/longbridge-terminal){target="_blank"}

## Install

<Tabs groupId="cli-install">
  <TabItem value="homebrew" label="macOS (Homebrew)" default>

```bash
brew install --cask longbridge/tap/longbridge-terminal
```

  </TabItem>
  <TabItem value="script" label="Linux / macOS (Script)">

```bash
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

  </TabItem>
  <TabItem value="scoop" label="Windows (Scoop)">

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

  </TabItem>
  <TabItem value="powershell" label="Windows (PowerShell)">

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

  </TabItem>
</Tabs>

## auth

Manage authentication — login, logout, and check token status.

### auth login

Authenticate via OAuth 2.0 device authorization flow — works in any environment including SSH
and headless servers.

```bash
longbridge auth login
```

Running `auth login` prints a URL and a short code. Open the URL in any browser, enter the code,
and authorize. The token is saved to `~/.longbridge/openapi/tokens/<client_id>` and reused
automatically by all subsequent commands.

### auth logout

Clears the stored OAuth token. The next command or TUI launch will trigger re-authentication.

```bash
longbridge auth logout
```

### auth status

Shows token validity locally — no network required. Displays expiry time, login time, account
info, and current quote level.

```bash
longbridge auth status
longbridge auth status --format json
```

## check

Verifies token validity and API connectivity. Shows token status, cached region, and latency
to both Global and CN API endpoints. Does not require an active market session.

```bash
longbridge check
longbridge check --format json
```

## update

Downloads and runs the official install script to replace the current binary with the latest
release.

```bash
longbridge update
```
