---
title: 'acp'
sidebar_label: 'ACP Agent'
sidebar_position: 98
sidebar_icon: bot
---

# longbridge acp

`longbridge acp` 将 [Longbridge AI](https://longbridge.com/ai) 作为兼容 [Agent Client Protocol](https://agentclientprotocol.com/)（ACP）的 Agent 运行。你可以从任何支持启动自定义 ACP Agent 的客户端应用中与 Longbridge AI 对话，查询实时行情、分析公司基本面、解读账户持仓。

## 使用场景

- 在常用 AI 客户端中直接使用 Longbridge AI，无需切换应用
- 围绕市场、公司和持仓连续追问，无需自行调用和组合多个 API
- 恢复之前的会话，继续已有的研究与分析

## 使用前准备

安装 Longbridge CLI 并登录：

```bash
longbridge auth login
```

确认 ACP 命令可用：

```bash
longbridge acp --help
```

ACP Agent 与其他 CLI 命令共用登录状态，无需单独配置 API 密钥。

## 配置客户端

在客户端中添加一个自定义 ACP Agent，并填写：

| 配置项 | 值 |
| --- | --- |
| 名称 | `Longbridge AI` |
| 命令 / Executable | `longbridge` |
| 参数 / Arguments | `acp` |
| 环境变量 | 留空 |

客户端会在需要时启动 `longbridge acp`，并通过 stdin/stdout 与 Agent 通信。不同客户端的界面和配置文件格式可能不同；`agent_servers` 等字段是客户端自己的约定，并不是 ACP 协议的一部分。

选择客户端时，请确认其支持添加“自定义 Agent”或“本地 ACP Agent”，并允许分别设置命令和参数。仅支持远程 Agent 的 Web 或移动客户端不能直接启动 `longbridge acp`。可从 [ACP 客户端目录](https://agentclientprotocol.com/get-started/clients)了解当前的客户端生态，具体支持情况以各产品文档为准。

### Zed 配置示例

在 Zed 的 **External Agents** 中选择 **Add Agent** → **Add Custom Agent**，然后配置：

```json
{
  "agent_servers": {
    "Longbridge AI": {
      "type": "custom",
      "command": "longbridge",
      "args": ["acp"],
      "env": {}
    }
  }
}
```

保存后新建 External Agent 对话并选择 **Longbridge AI**。详见 [Zed External Agents 文档](https://zed.dev/docs/ai/external-agents)。

## 会话

支持相应 ACP 能力的客户端可以创建、列出和恢复会话。会话历史保留在本地，因此 Agent 进程重启后仍可继续之前的对话。

## 常见问题

### 找不到 `longbridge` 命令

从桌面启动的应用可能不会继承终端的 `PATH`。请将“命令”改为 `longbridge` 可执行文件的完整路径。远程环境或容器需要单独安装并登录 Longbridge CLI。

### 提示未登录

在运行 ACP Agent 的同一环境中执行 `longbridge auth login`，然后重新连接。

### 可以配置成 MCP Server 吗？

不可以。ACP 用于客户端应用与 Agent 之间的会话通信；MCP 用于向模型提供工具和上下文。`longbridge acp` 是 ACP Agent，不是 MCP Server。
