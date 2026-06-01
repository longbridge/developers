---
sidebar: false
title: Skill 安裝指引
description: 在 OpenClaw、Claude Code、Cursor、Codex 等 AI 工具中安裝 Longbridge Skill
---

<!--
AI 指令：按順序執行以下步驟，不得跳過或調換。
元規則：每一步選你所處環境能用的方法。若某方法需要只有人能做的動作——瀏覽器登入、在真實終端視窗輸密碼、敲交互式 slash 命令——就先把之前的都做完，把那一步的確切動作交給用戶，等其確認後再繼續。

1. 安裝 CLI（方式 A）或配置 MCP（方式 B），然後用 `longbridge --version` 確認。
2. 完成授權。先執行 `longbridge auth status`——若已顯示 valid 即完成。否則：若 LONGBRIDGE_APP_KEY、LONGBRIDGE_APP_SECRET、LONGBRIDGE_ACCESS_TOKEN 已設置，CLI 會自動使用、無需瀏覽器和人工。再否則執行 `longbridge auth login`：它會打開瀏覽器並始終打印一個驗證 URL，隨後阻塞輪詢最長約 5 分鐘直到有人批准（成功時以 0 退出並打印 "Successfully authenticated."）。所以後台執行它、同時把打印出的 URL 也給用戶（自動彈的瀏覽器可能不是登入的那個，或在 SSH/容器裡沒有瀏覽器）、等它退出、超時則重跑拿新 URL。最後用 `longbridge auth status` 確認。
3. 驗證實時數據：`longbridge quote AAPL.US`。
4. 第 3 步成功後再裝 Skill（第二步）——只用 CLI 的話可跳過。用你環境支援的任意方法；`/plugin` slash 命令只在交互式 Claude Code 裡有效，shell 裡跑不了。
-->

# Longbridge Skill 安裝指引

安裝完成後，你可以直接問 AI 助手這樣的問題，並得到真實的答案：

- _"幫我從美股和港股裡，篩出市值 500 億以上、PE 低於 25、近期 MACD 出現金叉的科技股，按市值排列"_
- _"NVDA 剛出財報，幫我對比實際業績和分析師預期的差距，拆一下各業務線的營收變化，順便看看當前估值是否合理"_
- _"幫我給 TSLA 設一個追蹤止損，跌幅超過 8% 自動觸發賣出，執行前把訂單詳情給我確認"_
- _"幫我復盤這個月的持倉表現：總盈虧趨勢如何，哪只股票貢獻最大、哪只表現最弱，組合裡美股和港股各佔多少"_
- _"我在執行五年長期定投計劃，本月的 QQQ 和 SPY 計劃在未來兩天內買入，幫我看看最近市場情況，這個時機合適嗎？"_

---

最快的上手方式是終端類 AI 工具（Claude Code、Codex、opencode、OpenClaw）：安裝 CLI、完成一次授權即可。不想在本機裝軟件？改用 MCP 接入。兩種方式都建議同時安裝 Skill（見第二步）。

---

## 第一步：連接 Longbridge 平台

兩種接入方式——選其一即可：

- **CLI**：體驗最佳，agent 直接在終端執行 `longbridge` 命令；需要在系統上安裝軟件
- **MCP**：接入更簡便，只需在 AI 工具配置中填入一個 URL；無需本地安裝

### 方式 A：CLI（推薦）

適用於 Claude Code、Codex（Work locally 模式）、opencode、OpenClaw、Gemini CLI、Warp 等可在終端執行命令的工具。

```bash
# macOS（需要 Homebrew，未安裝請先訪問 https://brew.sh）
brew install --cask longbridge/tap/longbridge-terminal

# macOS / Linux（裝到 /usr/local/bin——會要一次 Mac 密碼；請在真實終端視窗裡跑）
curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh
```

> **macOS 沒裝 Homebrew：** 先 `command -v brew` 探測；沒有就別為這一個工具去裝 Homebrew（它會拖很重的 Xcode Command Line Tools）——改用 `curl … | sh` 腳本。兩條路二進制都落在 `/usr/local/bin`，所以要一次 Mac 密碼（`sudo mv`）。密碼輸入需要真實終端——管道、`!` 前綴、非交互 agent shell 都填不了——所以這一行由用戶來跑；agent 從 `longbridge --version` 繼續。

**Windows**（[Scoop](https://scoop.sh)）：

```powershell
scoop install https://open.longbridge.com/longbridge/longbridge-terminal/longbridge.json
```

**Windows**（PowerShell）：

```powershell
iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex
```

**驗證安裝：**

```bash
longbridge --version
```

**授權登入**

先查 `longbridge auth status`——若已顯示 valid，即已授權，可跳過本步。否則按是否有人能在瀏覽器批准，選一條路徑：

- **API key / 環境變量——全自動、無需人工**

  三個變量都設置後，CLI 無需瀏覽器、無需人工即可鑑權：

  ```bash
  export LONGBRIDGE_APP_KEY=...
  export LONGBRIDGE_APP_SECRET=...
  export LONGBRIDGE_ACCESS_TOKEN=...
  ```

  從 [Longbridge 開發者後台](https://open.longbridge.com/) → 用戶中心 → 應用憑證獲取。注意：這裡的 `LONGBRIDGE_ACCESS_TOKEN` 是 API key 的 Access Token（約 90 天過期），不是 OAuth token。

- **Device 登入——由 agent 驅動，用戶只需在瀏覽器裡批准**

  ```bash
  longbridge auth login
  ```

  真實行為：有瀏覽器時會自動打開，並**始終打印一個驗證 URL**（code 已內嵌），隨後**阻塞輪詢最長約 5 分鐘**，用戶批准後以 `0` 退出並打印 `Successfully authenticated.`。所以 agent 後台執行它、同時把打印出的 URL 展示給用戶（自動彈的瀏覽器可能不是登入的那個，或在 SSH/容器裡根本沒有——用戶可在任意設備打開）、等它退出、超時則重跑拿新 URL。未登入的用戶先登入再批准。

  - 打印出的 URL 和 API 接口可能是 **`open.longbridge.cn`** 而非 `.com`——CLI 會自動選擇 region，這是正常的，不是錯連結或釣魚連結（region 不對可用 `LONGBRIDGE_REGION=hk` 或 `cn` 覆蓋）。

**確認授權成功：**

```bash
longbridge auth status   # 帳戶、token 有效性與過期時間——本地、無網絡
longbridge check         # token 狀態 + 到 Global 與 CN 接口的連通性/延遲
```

**Claude Code 用戶：** Claude 首次執行 `longbridge` 指令時會彈出權限確認提示。若要避免每次都被詢問，可在專案的 `.claude/settings.json` 中新增以下配置（文件不存在時新建）：

```json
{
  "permissions": {
    "allow": ["Bash(longbridge *)"]
  }
}
```

> 詳細安裝說明及完整指令列表參見 [CLI 文檔](/zh-HK/docs/cli)。

### 方式 B：MCP

適用於 Claude Desktop、Cursor、Zed、Gemini CLI、Warp 等支援 MCP 的工具。

在 AI 工具的 MCP 配置中新增以下伺服器地址：

```
https://openapi.longbridge.com/mcp
```

對於使用 JSON 配置文件的客戶端（Claude Desktop、Cursor、Zed、Gemini CLI 等），將以下內容添加到 MCP 配置中：

```json
{
  "mcpServers": {
    "longbridge": {
      "url": "https://openapi.longbridge.com/mcp"
    }
  }
}
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

首次提問時客戶端會自動彈出瀏覽器完成 OAuth 授權（無需 API Key）——由人登入。

---

## 第二步：安裝 Skill

Skill 是一組指令文件，告訴 AI 助手 Longbridge 能做什麼。只用 longbridge CLI 的話可跳過——Skill 主要服務自然語言請求。

目標：把 skill 文件放進你工具的 skill 目錄。按你的運行環境選一種：

- **有 shell（含自主 agent）：** `npx skills add longbridge/skills -g`（或 `bunx skills add longbridge/skills -g`），裝到 `~/.claude/skills/`，需 [Node.js](https://nodejs.org) 或 [Bun](https://bun.sh)。
- **沒有包管理器：** 下載 [longbridge-all.zip](https://open.longbridge.com/skill/longbridge-all.zip) 解壓，把文件放進 skill 目錄（Claude Code：`~/.claude/skills/` 或專案 `.claude/skills/`；Cursor 貼到 Rules 編輯框；其他參考 README）。
- **人在交互式 Claude Code 裡：** 可敲 `/plugin marketplace add longbridge/skills` + `/plugin install longbridge@longbridge-skills`——透過插件系統自動更新，但這是交互式 slash 命令，shell 或 headless 模式跑不了。

**OpenClaw** 直接在對話中發送以下訊息，自動完成安裝：

```
從以下 zip 文件安裝 Longbridge Developers Skill：
https://open.longbridge.com/skill/longbridge-all.zip
```

---

## 各工具的已知限制

部分環境存在網絡白名單或沙箱限制，會阻止 CLI 安裝和 MCP 伺服器連接。遇到問題請先查閱本節。

### Claude Desktop — 切換到 Code 標籤頁

Claude Desktop 的 **Chat 和 Cowork 模式**都存在網絡限制，無法安裝 CLI 或連接 MCP 伺服器。不要在這兩種模式下反覆嘗試，這樣不會成功。

切換到 Claude Desktop 的 **Code 標籤頁**（即 App 內嵌的 Claude Code）。在 Code 標籤頁下，你擁有完整的終端存取權限，可以在同一個會話中完成 CLI 安裝、MCP 連接和 Skill 安裝。

<img src="https://assets.lbctrl.com/uploads/76a34f28-9000-4e3e-8250-e992c516ce80/claude.png" alt="Claude Desktop — 切換到 Code 標籤頁" />

### Codex — 選擇「Work locally」

Codex 的 **Cloud 模式**存在同樣的網絡白名單限制。啟動新會話時，請選擇 **Work locally** 而非 Cloud。本地模式下 AI 可完整存取你的 shell 和網絡。

<img src="https://assets.lbctrl.com/uploads/ccd412df-d312-45c3-a926-e3d466c9a479/codex.png" alt="Codex — 選擇 Work locally" />

### Claude.ai 和 ChatGPT.com（網頁版）

基於瀏覽器的界面無法存取本地系統，既不能執行 shell 命令，也無法連接外部 MCP 伺服器。

如果你使用 Claude，請安裝 [Claude Desktop](https://claude.ai/download) 並切換到 **Code 標籤頁**。

---

## 驗證安裝

可以直接用 CLI 驗證，也可以用自然語言驗證。

**CLI**——只裝了 CLI、沒裝 Skill 也能用：

```bash
longbridge quote AAPL.US
```

**自然語言**——需要已安裝 Skill（或 MCP）：

```
使用 Longbridge 查一下 AAPL 當前報價
```

如果能返回實時報價數據，說明安裝成功。

> **提示：** 如果 Skill 沒有被自動觸發，可以在提問前加上 `/longbridge` 強制引用，例如：`/longbridge 查一下 AAPL 當前報價`。

---

## 常見問題

**AI 說找不到 Longbridge 工具**

部分客戶端需要重啟或新建對話才能加載 Skill。確認安裝步驟已完成，並在新會話中再次嘗試。

**查詢數據時需要授權**

執行 `longbridge auth login`，打開打印出的 URL 並批准，隨後用 `longbridge auth status` 確認。

**重新授權或切換帳號**

```bash
longbridge auth logout   # 清除已存儲的 token
longbridge auth login    # 重新登入
```

**交易操作無法執行**

確認帳戶已開通 OpenAPI 交易權限，以及該市場（港股 / 美股）的交易資格。

**撤銷授權**

如需撤銷訪問權限，前往 Longbridge 帳戶 → 安全設定 → 管理已授權應用程式。
