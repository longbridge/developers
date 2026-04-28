---
title: '安裝'
sidebar_label: '安裝'
sidebar_position: 2
sidebar_icon: arrow-down-to-line
---

# 安裝

安裝 CLI 並完成 Longbridge 帳戶鑑權。

原始碼與發佈版本：[longbridge/longbridge-terminal](https://github.com/longbridge/longbridge-terminal){target="_blank"}

## 安裝

<Tabs groupId="cli-install">
  <TabItem value="homebrew" label="macOS (Homebrew)" default>

```bash
brew install --cask longbridge/tap/longbridge-terminal
```

  </TabItem>
  <TabItem value="script" label="Linux / macOS（腳本）">

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

管理鑑權——登入、登出和查看 Token 狀態。

### auth login

通過 OAuth 2.0 裝置授權流完成鑑權，適用於任何環境，包括 SSH 和無介面伺服器。

```bash
longbridge auth login
```

執行 `auth login` 後會印出一個 URL 和短碼。在任意瀏覽器中開啟該 URL，輸入短碼並授權。Token 儲存至 `~/.longbridge/openapi/tokens/<client_id>`，後續所有命令自動複用。

### auth logout

清除已儲存的 OAuth Token。下次執行命令或啟動 TUI 時將重新觸發鑑權。

```bash
longbridge auth logout
```

### auth status

本機查看 Token 狀態，無需網路。顯示到期時間、登入時間、帳戶資訊和目前行情權限。

```bash
longbridge auth status
longbridge auth status --format json
```

## check

驗證 Token 有效性與 API 連通性。顯示 Token 狀態、快取區域，以及全球和 CN 兩端 API 的延遲。無需活躍市場交易時段。

```bash
longbridge check
longbridge check --format json
```

## update

下載並執行官方安裝腳本，將目前二進位檔案替換為最新版本。

```bash
longbridge update
```
