---
title: MCP
id: mcp
slug: /mcp
sidebar: false
---

# Longbridge MCP 服務

Longbridge 提供托管的 HTTP MCP（Model Context Protocol）服務，讓你在 AI 編程助手或對話工具中直接使用 Longbridge 的行情與帳戶能力，無需手動管理 API 金鑰。

:::tip MCP 服務地址
- 全球：`https://openapi.longbridge.com/mcp`
- 中國大陸：`https://openapi.longbridge.cn/mcp`（訪問更快）
:::

## 可用能力

接入後，MCP 客戶端可調用以下能力：

| 能力類別 | 說明 |
| --- | --- |
| 行情資料 | 即時快照、K 線、歷史行情查詢 |
| 帳戶資訊 | 帳戶總覽、資產、持倉查詢 |
| 交易操作 | 下單、改單、撤單（受帳戶權限與地區限制） |

實際可用能力因地區、帳戶等級和授權範圍而有所不同。

## 可用工具

<McpTools />

## 前置條件

- 已擁有 Longbridge 帳戶並完成開戶，或開通模擬帳戶
- 使用支援 MCP OAuth 2.1 的 AI 客戶端（見下方相容性說明）

## 客戶端接入

> 各客戶端的 MCP 配置格式可能隨版本變更，以客戶端官方文件為準。以下提供核心配置參數。

### Claude Code

在終端執行以下命令：

```bash
claude mcp add --transport http longbridge https://openapi.longbridge.com/mcp
```

然後進入 `claude` 終端介面，輸入 `/mcp`，選擇 `longbridge`，再選擇 **Authenticate** 跟隨流程完成 OAuth 授權。

### Codex

1. 點擊右下角 **Settings** → **MCP Servers** → **Add Server**
2. 在 "Connect to a custom MCP" 介面填寫：
   - Name：`longbridge`
   - 類型：**Streamable HTTP**
   - URL：`https://openapi.longbridge.com/mcp`
   - 其他欄位留空
3. 點擊 **Save**
4. 回到 MCP Servers 列表，點擊 `longbridge` 條目上的 **Authenticate** 完成 OAuth 授權

### Cursor

Settings → MCP Servers → 添加 Remote MCP Server，填入上方地址即可。

### Zed

在 `settings.json` 的 `context_servers` 欄位（key 名稱可自訂）中加入：

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://openapi.longbridge.com/mcp"
    }
  }
}
```

### Cherry Studio

設定 → MCP 伺服器 → 添加，填入上方地址即可。

## OAuth 授權流程

Longbridge MCP 使用標準 OAuth 2.1 授權，你無需向客戶端提供 API 金鑰或 Token。

```
AI 客戶端                  瀏覽器                    Longbridge
    |                        |                           |
    |--- 發起 MCP 連線 ------>|                           |
    |                        |-- 跳轉授權頁 ------------>|
    |                        |<- 展示登入 & 權限確認 ----|
    |                        |-- 登入並同意 ------------>|
    |<-- 返回授權憑證 --------|                           |
    |--- 攜帶憑證存取工具 ----------------------------------->|
```

**步驟說明：**

1. **發起連線** — 在客戶端添加 Longbridge MCP 配置後，首次調用會觸發授權
2. **瀏覽器跳轉** — 客戶端自動開啟瀏覽器，進入 Longbridge 登入與權限確認頁
3. **登入並授權** — 使用 Longbridge 帳戶登入，查看並同意所請求的權限範圍（scope）
4. **建立會話** — 授權完成後，客戶端取得憑證，MCP 工具即可使用
5. **憑證維護** — 憑證依 OAuth 策略自動刷新；如需撤銷，前往 Longbridge 帳戶安全設定

## 客戶端相容性

Longbridge MCP 依賴 **MCP OAuth 2.1** 標準。若客戶端未完整實作該協議，將無法完成授權。

已知問題：Cherry Studio 早期版本不支援完整 OAuth 流程，請升級至最新版本。

如遇其他客戶端連線失敗，請確認客戶端版本並查閱其 MCP 支援文件。

## 安全建議

- **最小權限**：授權時僅同意當前任務所需的 scope，避免過度授權
- **交易確認**：涉及下單等交易操作時，在 AI 提示詞中明確要求執行前人工確認
- **憑證安全**：OAuth 憑證由客戶端管理，避免將其複製至不受信任的環境
- **定期審查**：定期在 Longbridge 帳戶安全設定中檢查並撤銷不再使用的授權

## 推薦使用方式

1. **從唯讀能力開始**：優先使用行情查詢、持倉查看等低風險功能，熟悉工具行為
2. **逐步開放交易能力**：確認權限範圍和風控邏輯後，再使用下單相關工具
3. **在提示詞中加入限制**：例如「每筆交易金額不超過 X」、「執行前向我確認」等明確限制

## 常見問題

### OAuth 登入失敗

- 確認 Longbridge 帳戶狀態正常，已完成必要的身份驗證
- 在客戶端刪除現有配置後重新添加並發起授權
- 檢查當前帳戶是否支援所請求的 scope

### 已連線但部分工具不可用

- 帳戶或地區限制：特定市場或功能可能受帳戶等級或地區限制
- scope 變更：如工具能力有更新，可能需要重新授權以取得新 scope

### 交易操作提示權限不足

- 檢查帳戶的交易權限和市場可交易資格
- 確認當前 MCP 會話的 OAuth scope 包含交易相關權限
