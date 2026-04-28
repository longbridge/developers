---
title: 'Release Notes'
sidebar_label: 'Release Notes'
sidebar_position: 100
sidebar_icon: newspaper
---

# Release Notes

### [v0.18.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.18.0)

- **TUI：訂單頁面** — 互動式訂單列表，支援快捷鍵操作和下單對話框，無需離開終端即可完成交易
- **`dividend --page` / `--year`** — 支援翻頁瀏覽大量股息歷史記錄，並按年份篩選；每頁獲取 50 筆記錄（原為 30 筆）

### [v0.17.4](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.4)

- **`--limit` 別名** — 所有接受 `--count` 參數的指令現在也支援 `--limit` 作為別名，提升 AI agent 工具呼叫相容性
- **修復：Unix 自更新 ETXTBUSY** — `longbridge update` 在 Unix 上不再因「Text file busy」報錯；更新流程改為先寫入暫存檔再原子重新命名，不再直接寫入正在執行中的二進位檔案

### [v0.17.3](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.3)

- **修復：Token 刷新卡死** — 當存取令牌過期且網路不穩定時，CLI 不再等待 5 分鐘才報錯，現在立即失敗並給出明確提示，同時保留 Token 檔案供下次重試
- **`auth status` 準確性改進** — 現在顯示三種狀態：`valid`（綠色）、`refresh pending`（黃色，存取令牌已過期但刷新令牌有效，下次指令自動刷新無需操作）、`expired`（紅色，需重新登入）；之前 `refresh pending` 狀態被錯誤顯示為 `expired`
- **修復：`--auth-code` 登入** — 在沒有 Token 檔案時，瀏覽器 OAuth 流程現在可以正常觸發
- **修復：Windows 瀏覽器啟動** — 包含 `&` 參數的 OAuth URL 不再在 Windows 上被截斷；改用 `open` crate 實現跨平台瀏覽器呼叫

### [v0.17.1](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.1)

- **`completion` 指令** — 生成 bash、zsh、fish、elvish、powershell 的 Tab 補全腳本；將輸出重導向至對應檔案並重載 shell 即可啟用（如 `longbridge completion zsh > ~/.zfunc/_longbridge`）
- 所有 HTTP 及 WebSocket 請求統一設定 `User-Agent: longbridge-cli/<version>`
- 每次 API 呼叫新增 `x-cli-cmd` 請求標頭，標識當前執行的子指令

### [v0.17.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.0)

- **`dca` 指令** — 定期定額完整生命週期管理：建立、更新、暫停、恢復、停止、查看交易記錄、統計概覽、確認標的是否支援定投、計算下次交易日；港股及新加坡帳戶建立計劃前須同意條款與條件（`--agree-terms` 可跳過互動提示）
- **`sharelist` 指令** — 社群股票清單：查看自己建立和訂閱的清單、瀏覽熱門清單（`popular`）、建立/刪除清單，以及新增/移除/排序成分股
- **`short-positions`** — 美股放空資料：空頭比例、空頭股數、日均成交量、平倉天數及收盤價；FINRA 每兩週更新；`--count` 1–100
- **`option volume`** — 即時認購/認沽成交量快照（含 P/C 比）；`daily` 子指令查看歷史每日成交量及持倉量
- **`option chain`** — 不帶 `--date` 時只返回到期日清單；加 `--date` 才返回對應到期日的行使價
- **`profit-analysis`** — 彙總指令新增 `--start`/`--end` 日期範圍篩選；Simple Yield 和 TWR 改為百分比格式；「Stock P&L Breakdown」更名為「P&L Breakdown」（包含基金和貨幣基金）

### v0.16.3

- **`auth` 子命令群組** — `longbridge auth login`、`auth logout`、`auth status`；`auth status` 本機查看 Token 有效性、到期時間、帳戶資訊和行情權限，無需網路
- **`alert enable` / `alert disable`** — 切換到價提醒的啟用狀態，無需刪除重建
- **修正：美股指數 symbol** — `.DJI.US`、`.VIX.US` 等美股指數 symbol 現已正確解析；美股指數需要前置點號（如 `.DJI.US`，而非 `DJI.US`）
- **「您是否想查詢…」提示** — 查詢無結果時，CLI 會提示正確的 symbol 格式：缺少市場後綴 → `TSLA.US` / `700.HK`；缺少前置點號 → `.DJI.US`

### v0.16.1

**改進**

- `option quote` — 完整輸出 OptionQuote API 全部字段（新增 `timestamp`、`trade_status`、`open_interest`、`historical_volatility`、`contract_multiplier`、`contract_size`、`direction`、`underlying_symbol`）；JSON 輸出使用正確的類型值
- `calc-index` — Theta、Vega、Rho 值已標準化（÷100）為標準的每股單位；自動檢測期權合約並切換為 Greeks 默認字段
- `capital` — 改進命令參數處理
- `market-status` — 修復 `trade_status` 映射錯誤（105 = 午盤交易）；JSON 輸出改為人類可讀的市場和狀態標籤
- 參數標準化：`--adjust none/forward`（原 `no_adjust/forward_adjust`）、`--tif day/gtc/gtd`（原 `Day/GoodTilCanceled/GoodTilDate`）、`--format table` 作為默認名稱（別名：`pretty`）、`finance-calendar --start/--end`（原 `--date/--end-date`）、`statement --start-date` 支持 `YYYY-MM-DD` 格式
- TUI：修復自選列表排序跳動問題，優化滾動條顯示

### [v0.16.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.16.0)

新增 21 個命令，涵蓋公司基本面、行情數據和帳戶功能。

**新增：公司與基本面**

- `company` — 公司概覽（成立日期、員工數、IPO 價格、地址等）
- `executive` — 公司高管與核心人員
- `industry-valuation` — 行業估值對比（PE/PB/EPS/股息率）；`dist` 子命令查看行業百分位排名
- `operating` — 經營評述：財務指標表 + 管理層評論
- `corp-action` — 公司行動（拆股、分紅、配股等）
- `invest-relation` — 投資關係（子公司/母公司結構）

**新增：行情與市場**

- `constituent` — 指數/ETF 成分股，支援排序 + 漲跌統計
- `market-status` — 各交易所開市/休市狀態
- `broker-holding` — 港股券商持倉（大戶/明細/每日變動）
- `ah-premium` — AH 溢價率 K 線與分時數據（僅限 A+H 雙重上市股票）
- `trade-stats` — 成交統計（按價格區間分佈的成交量）
- `anomaly` — 行情異動 / 市場異常波動

**新增：帳戶**

- `alert` — 價格提醒（查看/新增/刪除）
- `profit-analysis` — 盈虧總覽 + 逐隻股票分析；`detail` 查看單隻股票盈虧明細與交易流水；`by-market` 按市場篩選

**增強**

- `update` — 跨平台自更新，新增 Windows 支援和 CDN 加速；`--release-notes` 查看更新日誌；版本變更後首次運行自動顯示
- `intraday --date` — 支援查詢歷史日期的分時數據
- TUI：按 `/` 搜尋自選股，或直接輸入 symbol 快速跳轉到任意股票
- 支援 `BROWSER` 環境變數自訂登入時使用的瀏覽器

### [v0.15.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.15.0)

- **新增：`portfolio` 命令** — 顯示總盈虧、各市場資產分佈（美股/港股/A 股/新加坡/現金）、持倉明細和現金餘額
- **新增：`investors` 命令** — 基於 SEC 13F 的活躍基金經理排行榜；透過 CIK 查看任意投資者的持倉及即時價格
- **新增：`insider-trades`** — 任意標的的 SEC Form 4 內部人交易歷史
- **新增：`watchlist pin/unpin`** — 將證券置頂到自選股分組頂部
- **增強：`assets`** — 從 `balance` 更名；現在顯示完整資產概覽：淨資產、購買力、保證金、風險等級及各幣種現金明細

### [v0.14.2](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.2)

- **新增：`--lang` 全域參數** — 為所有命令設定內容語言（`zh-CN`、`zh-HK`、`en`）；未設定時依次回退到系統 `LANG` 環境變數，最終預設 `en`

### [v0.14.1](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.1)

- **新增：中國區登入** — `longbridge auth login` 現在支援中國區路由
- **新增：`-v` 參數** — 無需輸入完整命令即可查看版本號

### [v0.14.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.0)

- **新增：裝置授權登入** — `longbridge auth login` 改用 OAuth 裝置流程；顯示 URL 和授權碼，可在任意裝置上完成授權，支援 SSH 和無頭環境；移除了 `--headless` 參數
- **新增：訂單增強** — 新增追蹤止損和 AO 訂單類型；訂單命令新增 `--expire-date`、`--outside-rth`、`--remark` 參數
- **修復：Linux 段錯誤** — 預編譯 Linux 二進位檔案改用 musl，修復在部分發行版上的崩潰問題

### [v0.13.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.13.0)

- **新增：基本面與分析命令** — `financial-report`、`valuation`、`forecast-eps`、`consensus`、`institution-rating`、`shareholder`、`fund-holder`、`dividend`、`finance-calendar`、`exchange-rate`
- **破壞性變更：命令重構** — 19 個獨立命令合併為子命令樹（例如 `news-detail` → `news detail`、`kline-history` → `kline history`、`warrant-list` → `warrant list`）
- **支援中國區** — 設定 `LONGBRIDGE_REGION=cn` 以透過中國區端點路由

### [v0.12.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.12.0)

- **新增：`statement` 命令** — 列出並匯出日/月帳戶結單
- **TUI** — 修復 `q` 退出；在自選股內新增資訊列表和詳情視圖

---

完整更新日誌：[github.com/longbridge/longbridge-terminal/releases](https://github.com/longbridge/longbridge-terminal/releases)
