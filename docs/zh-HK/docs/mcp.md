---
title: MCP
id: mcp
slug: /mcp
sidebar: false
prev: false
next: false
---

# Longbridge MCP 服務

Longbridge 提供託管的 MCP（Model Context Protocol）服務，讓你在 ChatGPT、AI 編程助手或其他對話工具中直接使用 [Longbridge 的行情](https://longbridge.com/markets)與帳戶能力，無需手動管理 API 金鑰。

:::tip MCP 服務地址

- 全球：`https://mcp.longbridge.com`
- 中國大陸：`https://mcp.longbridge.cn`（訪問更快）

美國賬戶請使用全球地址 —— `.cn` 沒有通往美國數據中心的鏈路，僅服務 AP 賬戶（新加坡 / 香港）。詳見[接入點與數據中心](/zh-HK/docs/getting-started#接入點與數據中心)。
:::

## 可用能力

Longbridge MCP 暴露 100+ 工具，覆蓋六大能力域，客戶端連接後會自動發現——無需手動配置。

| 能力             | 覆蓋範圍                                                   |
| ---------------- | ---------------------------------------------------------- |
| **[即時行情](https://longbridge.com/markets)**     | 報價、K 線、深度、經紀隊列、逐筆、分時資金流               |
| **基本面與研究** | 公司資料、[派息](https://longbridge.com/calendar/dividend)、估值、高管持倉、A/H 溢價、宏觀經濟指標     |
| **衍生品**       | 期權鏈、窩輪篩選、發行商、窩輪報價                         |
| **賬戶與組合**   | 餘額、持倉、資金流水、自選股及分組                         |
| **交易**         | 下單、改單、撤單、可買量估算                               |
| **自動化**       | 股價提醒、定投（DCA）計劃                                  |

實際可用工具因地區、帳戶等級與 OAuth 授權範圍而異。

## 可用工具

<McpTools />

## 前置條件

- 已擁有 [Longbridge 帳戶](https://longbridge.com/hk/download)並完成開戶，或開通模擬帳戶
- 支援 MCP OAuth 2.1 的其他 AI 客戶端（見下方相容性說明）

## 客戶端接入

推薦優先從 ChatGPT 開始使用，因為 Longbridge 已經可以直接在 ChatGPT Plugins 中搜尋並授權。其他 MCP 客戶端的配置格式可能隨版本變更，請以客戶端官方文件為準。

### ChatGPT

Longbridge 已經作為官方 ChatGPT App 提供。

在 ChatGPT 網頁版、桌面端或手機 App 中：

1. 開啟 **Plugins**
2. 搜尋 `longbridge`，或直接開啟 [Longbridge ChatGPT App](https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef)
3. 選擇 **Longbridge**，並按提示完成授權登入

![在 ChatGPT Plugins 中搜尋 Longbridge](https://assets.lbkrs.com/uploads/aeb84040-b2c7-442d-af46-adfab66297a1/scr-20260707-nbjr.png)

![授權 Longbridge ChatGPT App](https://assets.lbkrs.com/uploads/a66bcd75-d747-4259-b684-a689d324716c/scr-20260707-nbno.png)

完成授權後，每次提問時需在訊息前加上 `@longbridge`，否則 ChatGPT 不會調用 Longbridge 來查詢數據。例如：`@longbridge 查詢我的當日訂單`。

:::warning ChatGPT 中不含交易下單功能
由於 ChatGPT 平台規則限制，Longbridge ChatGPT App 不含下單及其他交易相關工具。如需使用交易功能，請改用 Claude Code、Cursor 等其他 MCP 客戶端。
:::

### Claude Code

在終端執行以下命令：

```bash
claude mcp add --transport http longbridge https://mcp.longbridge.com
```

然後進入 `claude` 終端介面，輸入 `/mcp`，選擇 `longbridge`，再選擇 **Authenticate** 跟隨流程完成 OAuth 授權。

### Codex

在終端執行以下命令：

```bash
codex mcp add longbridge --url https://mcp.longbridge.com
```

隨後在 Codex 中按提示完成 OAuth 授權流程。

#### Codex Desktop

1. 點擊右下角 **Settings** → **MCP Servers** → **Add Server**
2. 在 "Connect to a custom MCP" 介面填寫：
   - Name：`longbridge`
   - 類型：**Streamable HTTP**
   - URL：`https://mcp.longbridge.com`
   - 其他欄位留空
3. 點擊 **Save**
4. 回到 MCP Servers 列表，點擊 `longbridge` 條目上的 **Authenticate** 完成 OAuth 授權

### Grok

開啟 [Grok Connectors](https://grok.com/connectors)，新增自訂 MCP Server：

1. 在左側邊欄選擇 **Skills and Connectors** → **Connectors** → **New Connector** → **Custom**
2. 填寫：
   - Name：`Longbridge`
   - Server URL：`https://mcp.longbridge.com`
3. 點擊 **Add Connector**，跟隨 Longbridge OAuth 2 授權流程完成新增

![](https://assets.lbkrs.com/uploads/08d07992-5463-4bfd-a4e4-97fab6e9cb41/grok-0.png)

![](https://assets.lbkrs.com/uploads/56eee753-f3d4-4186-b024-ee0145f4eb54/grok-1.png)

### Cursor

Settings → MCP Servers → 添加 Remote MCP Server，填入上方地址即可。

### Zed

在 `settings.json` 的 `context_servers` 欄位（key 名稱可自訂）中加入：

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://mcp.longbridge.com"
    }
  }
}
```

### Cherry Studio

設定 → MCP 伺服器 → 添加，填入上方地址即可。

### Manus

在 Manus 中開啟 **Plugins** 視窗，點擊右側的 **Create** 按鈕，從彈出選單中選擇 **Import MCP by JSON**，貼上以下 JSON 即可完成匯入：

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://mcp.longbridge.com"
    }
  }
}
```

![](https://assets.lbctrl.com/uploads/f3aa3f71-c7a1-48b3-91dc-ea82a7018b53/scr-20260625-ttzy.png)

## OAuth 授權流程

Longbridge MCP 使用標準 OAuth 2.1 授權，你無需向客戶端提供 API 金鑰或 Token。

在 ChatGPT 中，授權會在從 Plugins 新增 Longbridge 時完成；在其他 MCP 客戶端中，通常由首次工具調用觸發瀏覽器授權流程。

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

:::tip 客戶端無法開啟瀏覽器？
若客戶端的 OAuth 實作不完整或無法拉起瀏覽器，可改用[授權碼授權](/zh-HK/docs/agent-auth)：在 [https://open.longbridge.com/connect](https://open.longbridge.com/connect) 產生一次性授權碼，連接專用端點 `https://mcp.longbridge.com/agent`，讓 Agent 透過 `authenticate` 工具兌換。
:::

## 安全建議

- **最小權限**：授權時僅同意當前任務所需的 scope，避免過度授權
- **交易確認**：涉及下單等交易操作時，在 AI 提示詞中明確要求執行前人工確認
- **憑證安全**：OAuth 憑證由客戶端管理，避免將其複製至不受信任的環境
- **定期審查**：定期在 [Longbridge 帳戶](https://longbridge.com/hk/download)安全設定中檢查並撤銷不再使用的授權

## 推薦使用方式

1. **從唯讀能力開始**：優先使用[行情查詢](https://longbridge.com/markets)、持倉查看等低風險功能，熟悉工具行為
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
