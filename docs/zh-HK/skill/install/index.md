---
sidebar: false
title: Skill 安裝指引
description: 在 OpenClaw、Claude Code、Cursor、Codex 等 AI 工具中安裝 Longbridge Skill
---

# Longbridge Skill 安裝指引

安裝完成後，你可以直接問 AI 助手這樣的問題，並得到真實的答案：

- _"幫我從美股和港股裡，篩出市值 500 億以上、PE 低於 25、近期 MACD 出現金叉的科技股，按市值排列"_
- _"NVDA 剛出財報，幫我對比實際業績和分析師預期的差距，拆一下各業務線的營收變化，順便看看當前估值是否合理"_
- _"幫我給 TSLA 設一個追蹤止損，跌幅超過 8% 自動觸發賣出，執行前把訂單詳情給我確認"_
- _"幫我復盤這個月的持倉表現：總盈虧趨勢如何，哪只股票貢獻最大、哪只表現最弱，組合裡美股和港股各佔多少"_
- _"我在執行五年長期定投計劃，本月的 QQQ 和 SPY 計劃在未來兩天內買入，幫我看看最近市場情況，這個時機合適嗎？"_

---

## 第一步：安裝 Skill

Skill 是一組指令文件，告訴 AI 助手 Longbridge 能做什麼。安裝方式有兩種：

**通過 npx / bunx（推薦，全局安裝）：**

```bash
# Node.js
npx skills add longbridge/developers -g -y
# Bun
bunx skills add longbridge/developers -g -y
```

> 需要 [Node.js](https://nodejs.org) 或 [Bun](https://bun.sh) 環境。

**或下載 ZIP 手動安裝：**

下載 [longbridge.zip](https://open.longbridge.com/skill/longbridge.zip) 並解壓，將文件放入你的 AI 工具指定的 Skill 目錄（Claude Code 放 `.claude/skills/`，Cursor 貼到 Rules 編輯框，其他工具參考 README）。

**OpenClaw** 直接在對話中發送以下訊息，自動完成安裝：

```
從以下 zip 文件安裝 Longbridge Developers Skill：
https://open.longbridge.com/skill/longbridge.zip
```

---

## 第二步：連接 Longbridge 帳戶

Skill 只是讓 AI 知道能做什麼，要真正獲取行情數據或執行交易，還需要連接 Longbridge 帳戶。根據你的 AI 工具選擇接入方式：

### 方式 A：安裝 CLI（適用於有 shell 執行能力的工具）

Claude Code、Codex、Gemini CLI、Warp 等可以直接在終端執行命令的工具適用此方式。

```bash
# macOS（需要 Homebrew，未安裝請先訪問 https://brew.sh）
brew install --cask longbridge/tap/longbridge-terminal

# macOS / Linux
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

**Windows**（[Scoop](https://scoop.sh)）：

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

**Windows**（PowerShell）：

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

```bash
longbridge auth login
```

> 詳細安裝說明及完整指令列表參見 [CLI 文檔](/zh-HK/docs/cli)。

### 方式 B：連接 MCP 伺服器（適用於支持 MCP 的工具）

Claude Desktop、Cursor、Zed、Gemini CLI、Warp 等支持 MCP 的工具適用此方式。

在 AI 工具的 MCP 配置中添加以下伺服器地址：

```
https://openapi.longbridge.com/mcp
```

> 中國大陸用戶可使用加速地址：`https://openapi.longbridge.cn/mcp`

各工具配置入口：

| 工具           | 配置位置                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Claude Desktop | 編輯 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）或 `%APPDATA%\Claude\claude_desktop_config.json`（Windows） |
| Cursor         | Settings → MCP Servers → Add Remote MCP Server                                                                                             |
| Zed            | `~/.config/zed/settings.json` 中的 `context_servers` 字段                                                                                  |
| Gemini CLI     | `~/.gemini/settings.json` 中的 `mcpServers` 字段                                                                                           |
| Warp           | Settings → AI → MCP Servers → Add                                                                                                          |

首次提問時客戶端會自動彈出瀏覽器完成 OAuth 授權，無需配置 API Key。

---

## 為什麼 Claude.ai 和 ChatGPT.com 無法使用

**Claude.ai**（網頁版）和 **ChatGPT.com**（網頁版）是基於瀏覽器的界面，無法訪問你的本地系統，既不能執行 shell 命令，也無法連接外部 MCP 伺服器，因此 Skill 無法獲取實時行情或執行交易。

如果你使用 Claude，請安裝 [Claude Desktop](https://claude.ai/download) 並通過上方的 MCP 方式接入。

---

## 驗證安裝

安裝完成後，在對話中發送：

```
使用 Longbridge 查一下 AAPL 當前報價
```

如果 AI 能返回實時報價數據，說明安裝成功。

> **提示：** 如果 Skill 沒有被自動觸發，可以在提問前加上 `/longbridge` 強制引用，例如：`/longbridge 查一下 AAPL 當前報價`。

---

## 常見問題

**AI 說找不到 Longbridge 工具**

部分客戶端需要重啟或新建對話才能加載 Skill。確認安裝步驟已完成，並在新會話中再次嘗試。

**查詢數據時需要授權**

在終端中運行 `longbridge auth login` 完成 OAuth 授權即可，無需配置 API Key。

**交易操作無法執行**

確認帳戶已開通 OpenAPI 交易權限，以及該市場（港股 / 美股）的交易資格。

**撤銷授權**

如需撤銷訪問權限，前往 Longbridge 帳戶 → 安全設定 → 管理已授權應用程式。
