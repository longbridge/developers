---
title: '授權碼授權'
id: agent-auth
slug: /agent-auth
sidebar_position: 2.5
sidebar_icon: sparkles
---

# 授權碼授權

授權碼授權讓你只需把一個簡短的一次性授權碼貼給 AI Agent，即可授權它使用 Longbridge 行情資料與帳戶能力——無需冗長的 URL，也無需等待瀏覽器。

你在 Longbridge 授權頁產生授權碼、勾選要授予的權限，然後把授權碼交給 AI 助手。Agent 透過 CLI 或託管 MCP 服務一步完成兌換。

:::tip 產生授權碼
開啟 [https://open.longbridge.com/connect](https://open.longbridge.com/connect)，登入，選擇所需的權限範圍，點擊產生。
:::

## 適用場景

大多數桌面客戶端仍以瀏覽器 OAuth 為預設方式。當標準流程不便時，改用授權碼：

- **客戶端不渲染授權連結** — 部分聊天和 Agent 應用把冗長的 OAuth URL 顯示為純文字，無法點擊。
- **沒有可用的瀏覽器** — 在手機端、遠端 shell，或無法拉起瀏覽器的沙箱 Agent 環境中。
- **Agent 不會持續掛起** — Device Flow 需要 CLI 在你授權期間持續輪詢，而許多 Agent 不會保持行程執行。一次性授權碼無需任何輪詢。

如果桌面客戶端完整支援瀏覽器 OAuth 流程，使用標準的 [MCP 授權流程](/zh-HK/docs/mcp) 更簡單，無需授權碼。

## 步驟

1. **開啟授權頁** — 造訪 [https://open.longbridge.com/connect](https://open.longbridge.com/connect)。
2. **登入** Longbridge 帳戶。
3. **選擇權限** — 勾選要授予的權限範圍（行情、帳戶、交易等）。產生的授權碼所攜帶的權限上限就是你在此處選擇的範圍。
4. **產生授權碼** — 頁面會產生一個簡短的授權碼和一段可直接貼上的指令文字。
5. **貼給 AI Agent** — 複製指令文字傳送給助手，Agent 用下面任一方式兌換授權碼。

授權碼有效期 **5 分鐘**，且**僅可使用一次**。

## 透過 CLI 兌換

用 `--auth-code` 參數把授權碼傳給 `auth login`，將範例授權碼替換為你的真實授權碼：

<CliCommand>
# 兌換從 connect 頁面產生的授權碼
longbridge auth login --auth-code 6vYzXq3WbKp9TmHd
</CliCommand>

兌換成功後，Token 儲存至 `~/.longbridge/openapi/tokens/<client_id>`，後續所有命令自動複用——與瀏覽器登入效果一致。完整的 `auth` 命令參考見 [安裝](/zh-HK/docs/cli/install)。

## 透過 MCP 兌換

授權碼兌換走專用端點 **`https://mcp.longbridge.com/agent`**。該端點允許未授權連接，工作階段在未授權時僅暴露 `authenticate` 這一個工具。主端點 `https://mcp.longbridge.com` 僅支援標準 OAuth 2.1，不提供 `authenticate`——完整支援 OAuth 的客戶端應直接用主端點，`/agent` 是 OAuth 不可用時的備用通道。

**流程：**

1. **設定 `/agent` 端點** — 將客戶端指向 `https://mcp.longbridge.com/agent`，未授權工作階段只顯示 `authenticate` 工具。
2. **呼叫 `authenticate` 傳入授權碼** — 你可以這樣告訴助手：「用授權碼 1234567890 為 Longbridge MCP 工作階段完成授權。」Agent 即會帶該授權碼呼叫 `authenticate`。
3. **將回傳的 Token 設定為 Bearer header** — 兌換成功後，工具結果會回傳一個 Token。按結果中的指引讓客戶端在後續請求中以 `Authorization: Bearer <token>` 攜帶它，其餘 Longbridge MCP 工具隨即可用——無需瀏覽器跳轉。

以 Claude Code 為例，用該 Token 作為 header 重新新增服務：

```bash
claude mcp add --transport http longbridge https://mcp.longbridge.com --header "Authorization: Bearer <token>"
```

將 `<token>` 替換為 `authenticate` 回傳的 Token。注意此處指向的是主端點 `https://mcp.longbridge.com`——拿到 Bearer Token 後即可直接連接主端點。

## 安全說明

- **權限在網頁端預選** — 授權碼只能授予你在授權頁勾選的權限，Agent 無法請求超出授權碼攜帶範圍的權限。
- **5 分鐘有效期** — 授權碼在產生 5 分鐘後過期。
- **一次性使用** — 授權碼在首次成功兌換後即失效，不可重複使用。
- **隨時可撤銷** — 前往 Longbridge 帳戶安全設定，撤銷 **AI Agent** 授權即可終止存取。

遵循最小權限原則：只授予當前任務所需的權限範圍。涉及交易的授權，務必要求 Agent 在下單前與你確認。

## 常見問題

### 授權碼已過期

授權碼有效期為 5 分鐘。回到 [https://open.longbridge.com/connect](https://open.longbridge.com/connect) 重新產生一個，並盡快兌換。

### 授權碼已被使用

每個授權碼僅可使用一次。若此前已兌換成功，則你已完成授權，無需再次兌換。如需新的工作階段，請重新產生授權碼。

### 授予的權限不夠

授權碼只攜帶在授權頁勾選的權限範圍。重新產生一個授權碼並勾選所需的額外權限，再次兌換即可重新整理工作階段權限。

### 兌換後仍無法連線

- 確認 Longbridge 帳戶狀態正常且已完成身分認證。
- 確認所選權限範圍涵蓋你嘗試執行的操作（例如交易需要交易權限）。
- 對於 MCP，確認 Agent 連接 `https://mcp.longbridge.com/agent` 呼叫 `authenticate`，再用回傳的 `Authorization: Bearer` Token 連接 `https://mcp.longbridge.com`。
