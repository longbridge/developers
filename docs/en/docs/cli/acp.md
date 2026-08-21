---
title: 'acp'
sidebar_label: 'ACP agent'
sidebar_position: 97
sidebar_icon: bot
---

# longbridge acp

`longbridge acp` runs [LongbridgeAI](https://longbridge.com/ai) as an [Agent Client Protocol](https://agentclientprotocol.com/) (ACP) compatible agent. From any client application that can launch a custom ACP agent, you can talk with LongbridgeAI to look up live market data, analyze company fundamentals, and interpret account positions.

## Use cases

- Use LongbridgeAI from a preferred AI client without switching applications
- Ask follow-up questions about markets, companies, and positions without calling and coordinating multiple APIs yourself
- Resume an earlier session and continue existing research and analysis

## Before you start

Install Longbridge CLI and sign in:

```bash
longbridge auth login
```

Verify that the ACP command is available:

```bash
longbridge acp --help
```

The ACP agent shares authentication with other CLI commands, so no separate API key configuration is required.

## Configure a client

Add a custom ACP agent in your client with these values:

| Setting | Value |
| --- | --- |
| Name | `LongbridgeAI` |
| Command / Executable | `longbridge` |
| Arguments | `acp` |
| Environment | Leave empty |

The client starts `longbridge acp` when needed and communicates with the agent over stdin/stdout. Client interfaces and configuration files differ; fields such as `agent_servers` are client conventions, not part of ACP itself.

When choosing a client, confirm that it can add a custom or local ACP agent and lets you set the command and arguments separately. Web and mobile clients that support only remote agents cannot launch `longbridge acp` directly. See the [ACP client directory](https://agentclientprotocol.com/get-started/clients) for the current ecosystem, and check each product's documentation for custom-agent support.

### Zed configuration example

In Zed, open **External Agents** and choose **Add Agent** → **Add Custom Agent**, then configure:

```json
{
  "agent_servers": {
    "LongbridgeAI": {
      "type": "custom",
      "command": "longbridge",
      "args": ["acp"],
      "env": {}
    }
  }
}
```

Save the configuration, start an External Agent thread, and select **LongbridgeAI**. See the [Zed External Agents documentation](https://zed.dev/docs/ai/external-agents).

## Sessions

Clients that support the corresponding ACP capabilities can create, list, and resume sessions. Session history is stored locally, so a previous conversation can continue after the agent process restarts.

## Troubleshooting

### `longbridge` command not found

Desktop applications may not inherit your terminal's `PATH`. Replace the command with the full path to the `longbridge` executable. Remote environments and containers require their own Longbridge CLI installation and login.

### Authentication required

Run `longbridge auth login` in the same environment that runs the ACP agent, then reconnect.

### Can I configure it as an MCP server?

No. ACP carries conversations between client applications and agents; MCP provides tools and context to models. `longbridge acp` is an ACP agent, not an MCP server.
