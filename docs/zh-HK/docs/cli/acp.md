---
title: 'acp'
sidebar_label: 'ACP Agent'
sidebar_position: 98
sidebar_icon: bot
---

# longbridge acp

`longbridge acp` 將 [Longbridge AI](https://longbridge.com/ai) 作為兼容 [Agent Client Protocol](https://agentclientprotocol.com/)（ACP）的 Agent 運行。你可以從任何支持啟動自定義 ACP Agent 的客戶端應用中與 Longbridge AI 對話，查詢實時行情、分析公司基本面、解讀賬戶持倉。

## 使用場景

- 在常用 AI 客戶端中直接使用 Longbridge AI，無需切換應用
- 圍繞市場、公司和持倉連續追問，無需自行調用和組合多個 API
- 恢復之前的會話，繼續已有的研究與分析

## 使用前準備

安裝 Longbridge CLI 並登錄：

```bash
longbridge auth login
```

確認 ACP 命令可用：

```bash
longbridge acp --help
```

ACP Agent 與其他 CLI 命令共用登錄狀態，無需單獨配置 API 密鑰。

## 配置客戶端

在客戶端中添加一個自定義 ACP Agent，並填寫：

| 配置項 | 值 |
| --- | --- |
| 名稱 | `Longbridge AI` |
| 命令 / Executable | `longbridge` |
| 參數 / Arguments | `acp` |
| 環境變量 | 留空 |

客戶端會在需要時啟動 `longbridge acp`，並通過 stdin/stdout 與 Agent 通信。不同客戶端的介面和配置文件格式可能不同；`agent_servers` 等字段是客戶端自己的約定，並不是 ACP 協議的一部分。

選擇客戶端時，請確認其支持添加「自定義 Agent」或「本地 ACP Agent」，並允許分別設置命令和參數。僅支持遠程 Agent 的 Web 或移動客戶端不能直接啟動 `longbridge acp`。可從 [ACP 客戶端目錄](https://agentclientprotocol.com/get-started/clients)了解當前的客戶端生態，具體支持情況以各產品文檔為準。

### Zed 配置示例

在 Zed 的 **External Agents** 中選擇 **Add Agent** → **Add Custom Agent**，然後配置：

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

保存後新建 External Agent 對話並選擇 **Longbridge AI**。詳見 [Zed External Agents 文檔](https://zed.dev/docs/ai/external-agents)。

## 會話

支持相應 ACP 能力的客戶端可以創建、列出和恢復會話。會話歷史保留在本地，因此 Agent 進程重啟後仍可繼續之前的對話。

## 常見問題

### 找不到 `longbridge` 命令

從桌面啟動的應用可能不會繼承終端的 `PATH`。請將「命令」改為 `longbridge` 可執行文件的完整路徑。遠程環境或容器需要單獨安裝並登錄 Longbridge CLI。

### 提示未登錄

在運行 ACP Agent 的同一環境中執行 `longbridge auth login`，然後重新連接。

### 可以配置成 MCP Server 嗎？

不可以。ACP 用於客戶端應用與 Agent 之間的會話通信；MCP 用於向模型提供工具和上下文。`longbridge acp` 是 ACP Agent，不是 MCP Server。
