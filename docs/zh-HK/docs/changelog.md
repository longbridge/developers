---
id: changelog
title: 更新日誌
slug: changelog
sidebar_position: 7
sidebar_icon: newspaper
---

## 2026-06-16

### CLI v0.23.2

- **日期參數按本地時區解析** — 僅日期和舊版精確到分鐘的日期時間參數會先按用戶本地時區解析再用於 API 請求；同時支援 RFC 3339 輸入，便於明確時區的自動化流程
- **`market-status` 美股盤後狀態修復** — 美股狀態碼 `203` 現在顯示為 `Post-Market` 而非 `Trading`，修正盤後交易時段的市場狀態標籤

## 2026-06-04

### CLI v0.22.4

- **`constituent` 支持 ETF** — ETF 標的返回資產分佈數據（持倉 / 地區 / 資產類別 / 行業）；美股 ETF 默認從 SEC EDGAR N-PORT 文件獲取完整持倉組合（權重、股數、市值），SEC 數據不可用時回退到平台資產分佈摘要；指數標的行為完全不變

## 2026-06-03

### CLI v0.22.3

- **`quote` 新增美股隔夜時段數據** — `--format json` 輸出 `overnight_quote`，與 `pre_market_quote`、`post_market_quote` 並列，補全 AI 工作流的盤後行情覆蓋
- **持倉類命令顯示賬戶類型標識** — `positions`、`fund-positions`、`assets`、`portfolio` 在表格前打印一行賬戶標識（`Live A/C` / `Demo A/C`），直接區分數據所屬賬戶

## 2026-06-02

### CLI v0.22.2

- **JSON 時間戳改為 RFC 3339** — 時間序列和歷史類命令（`kline`、`trades`、`intraday`、`capital-flow` 等）及賬戶盈虧流水輸出 ISO 8601 / RFC 3339 日期時間，替代原始 Unix 時間戳，JSON 輸出可直接被 AI Agent 和下游工具消費
- **`market-temp --history` 默認範圍** — 省略 `--start` 時返回完整一個月的數據，而非單日

## 2026-05-22

### CLI v0.22.0

- **`shareholder --top`** — 前 20 大股東（機構、個人、內部人）多報告期持股對比；`--object-id <id>` 查看單一股東持倉歷史及交易明細
- **`short-positions`** — 新增港股支持（`.HK` 自動路由至港交所沽空持倉數據），與美股 FINRA 數據統一介面
- **`short-trades`** — 每日沽空成交量（美股：FINRA/納斯達克；港股：港交所披露數據）
- **`compare`** — 多股估值對比（PE/PB/PS/市值/收盤價），不傳對比股票時服務端自動選取同行業標的
- **`top-movers`** — 價格波動超近 20 日標準差的異動股票，系統自動關聯相關新聞解讀；支持 `--market`、`--sort time|change|hot` 篩選
- **`screener` 命令組** — 股票篩選工具：`strategies`（推薦/我的策略）、`search --strategy-id <id>` 或 `--filter key:min:max` 執行篩選、`indicators` 查看可用指標
- **`rank`** — 人氣排行榜；不帶 `--key` 列出所有分類，`--key <key>` 獲取對應排行（如 `ib_hot_all-us`）
- MCP 服務同步新增相同工具

### SDK v4.2.0

- **FundamentalContext** — 新增 `shareholder_top`、`shareholder_detail`、`valuation_comparison`
- **QuoteContext** — `short_positions` 統一支持美股和港股；新增 `short_trades`
- **MarketContext** — 新增 `top_movers`、`rank_categories`、`rank_list`
- **新增 ScreenerContext** — `screener_recommend_strategies`、`screener_user_strategies`、`screener_strategy`、`screener_search`、`screener_indicators`
- 覆蓋語言：Rust / Python / Node.js / Java / C / C++ / Go

## 2026-05-15

### CLI v0.21.0

- **`industry-rank`** — 按市場（US/HK/CN/SG）查看行業強弱排名；配合 `industry-peers` 展開任意板塊的完整競爭格局
- **`industry-peers`** — 行業子板塊樹形結構，展示各節點的股票數、當日漲跌和年初至今漲跌
- **`business-segments`** — 按業務分部拆解營收，支援當期數據或歷史趨勢對比
- **`financial-report snapshot`** — AI 生成財報摘要，含營收、EBIT、淨利潤相對分析師預期的差距分析
- **`institution-rating --views`** — 逐月展示機構評級分佈（買入/持有/賣出）的變化趨勢
- MCP 服務同步新增相同功能（工具總數達 133 個）

## 2026-05-13

### SDK v4.1.0

- **7 個新 Context 類型，共 66 個方法** — `FundamentalContext`（20 個方法：財報、分析師評級、股息、EPS 預測、一致性預期、估值），`MarketContext`（9 個方法：市場狀態、券商持倉、A/H 溢價、交易統計），`CalendarContext`（7 個方法：財報 / 股息 / 拆股 / IPO 日曆），`PortfolioContext`（5 個方法：匯率、盈虧分析），`AlertContext`（4 個方法：股價提醒），`DCAContext`（12 個方法：定投計劃全生命週期），`SharelistContext`（9 個方法：自選股列表）
- **QuoteContext** — 新增 4 個方法：`short_positions`、`option_volume`、`option_volume_daily`、`update_pinned`
- **ContentContext** — 新增 `topic_detail` 及話題回覆相關方法
- **Rust SDK** — `Config::header()` 支援注入自訂 HTTP/WebSocket 請求頭
- 參數類型改用 typed enum 替代原始整數；貨幣欄位使用 `Decimal` 類型

### 文件

- 側邊欄重構：新增 **資訊與社區** 分類（含資訊、話題、自選股）；行情 **Watchlist** 替代 Individual；**附錄** 替代 Socket Feed（預設折疊）
- 文件總覽新增 **Fundamental** 和 **資訊與社區** 章節介紹

## 2026-05-08

### CLI v0.20.0

- **`ipo` 指令組** — 港股完整 IPO 工具（`subscriptions`、`wait-listing`、`listed`、`calendar`、`detail`、`orders`、`profit-loss`），美股支援 `us-subscriptions`、`us-wait-listing`、`us-listed`
- **`financial-statement`** — 完整逐行財務報表（損益表 / 資產負債表 / 現金流量表），含層級結構與 YoY 對比；`financial-report --latest` 快速獲取關鍵指標摘要
- **`valuation-rank`** — 每日 PE/PB/PS 行業百分位排名
- **`institution-rating --history` / `--industry-rank`** — 分析師評級變化歷史與行業覆蓋排名
- **`news search` / `topic search`** — 關鍵詞搜尋資訊和社區話題
- **`bank-cards`**、**`withdrawals`**、**`deposits`** — 銀行卡及出入金記錄查詢
- **`portfolio short-margin`** — 各持倉融券保證金明細

## 2026-05-05

### CLI v0.19.2

- **`finance-calendar` 重構** — 改為子命令結構：`report`、`dividend`、`split`、`ipo`、`macrodata`、`closed`；新增 `--filter watchlist|positions` 按自選股或持倉篩選事件
- **TUI 增強** — 支援滑鼠操作；個股詳情頁新增折線圖 / K 線圖切換
- **`quote`** — 新增「漲跌幅」欄；`corp-action` 預設 30 條，`--all` 取得全部；`update --force` 跳過版本檢查

## 2026-04-30

### CLI v0.19.0

- **TUI 歷史訂單 + 撤單/改單** — 訂單頁面按 `Tab` 切換今日/歷史；`c`/`m` 直接在終端撤單或改單
- **`auth status` 行情套餐** — 展示已訂閱套餐詳情及行情商城二維碼
- **`quant run`** — 服務端執行量化指標腳本，基於歷史 K 線資料計算
- **`calc-index` 欄位別名** — 支援短別名（`iv`、`oi`、`vol` 等），`--help` 分組展示

## 2026-04-28

### CLI v0.18.0

- **TUI 訂單頁面** — 互動式訂單列表，支援快捷鍵和下單對話框，無需離開終端即可完成交易
- **`dividend` 增強** — 新增 `--page` 翻頁和 `--year` 年份篩選，每頁 50 筆（原為 30 筆）

## 2026-04-24

### CLI v0.17.4

- **`--limit` 別名** — 所有 `--count` 參數現支援 `--limit` 別名（改善 AI agent 工具呼叫相容性）
- **修復：Unix 自更新** — `longbridge update` 在 Unix 上不再出現 ETXTBUSY 錯誤

## 2026-04-22

### CLI v0.17.3

- **修復：Token 刷新卡死** — 存取令牌過期且網路不穩定時立即報錯，Token 檔案保留供下次重試
- **`auth status`** — 新增三態顯示：`valid` / `refresh pending`（自動刷新）/ `expired`（之前 `refresh pending` 誤顯為 `expired`）
- **修復：`--auth-code` 登入 + Windows 瀏覽器 URL** — 修復無 Token 檔案時 OAuth 流程不觸發及 Windows 上 URL `&` 參數被截斷的問題

## 2026-04-20

### CLI v0.17.1

- **`completion` 指令** — 支援 bash、zsh、fish、elvish、powershell 的 Tab 補全
- 所有 API 請求統一設定 `User-Agent: longbridge-cli/<version>` 並新增 `x-cli-cmd` 請求標頭

## 2026-04-17

### CLI v0.17.0

- **`dca`** — 完整定期定額生命週期：建立計劃（日/週/雙週/月頻）、暫停/恢復/停止、查看交易記錄、確認標的是否支援定投、計算下次交易日
- **`sharelist`** — 社群股票清單：管理自己的清單，透過 `popular` 發現熱門清單
- **`short-positions`** — 美股放空資料：空頭比例、平倉天數、空頭股數（FINRA 雙月更新）
- **`option volume`** — 即時認購/認沽成交量及 P/C 比；`daily` 子指令查看歷史資料
- **`option chain`** 修正：不帶 `--date` 時只返回到期日清單

## 2026-04-16

### CLI v0.16.3

- **`auth` 子命令群組** — `longbridge auth login` / `auth logout` / `auth status`；`auth status` 本機查看 Token 有效性和帳戶資訊，無需網路
- **`alert enable` / `alert disable`** — 切換到價提醒啟用狀態，無需刪除重建
- **修正：美股指數 symbol** — `.DJI.US`、`.VIX.US` 現已正確解析；美股指數需要前置點號
- **「您是否想查詢…」提示** — 查詢無結果時給出 symbol 格式建議

## 2026-04-13

### CLI v0.16.0

- **新增 21+ 個命令** — `company`、`executive`、`industry-valuation`、`operating`、`corp-action`、`invest-relation`、`constituent`、`market-status`、`broker-holding`、`ah-premium`、`trade-stats`、`anomaly`、`alert`、`profit-analysis`
- **`profit-analysis`** — 盈虧分析：總覽、逐隻股票分析、單隻明細與交易流水、按市場篩選
- **`update`** — 跨平台自更新，新增 Windows 支援和 CDN 加速；`--release-notes` 查看更新日誌
- **`intraday --date`** — 支援查詢歷史日期的分時數據

## 2026-04-09

### CLI v0.15.0

- **`portfolio` 指令** — 組合總損益、各市場資產分布、持倉及現金明細
- **`investors` 指令** — 基於 SEC 13F 資料的主動基金經理排行榜，按 CIK 查詢指定投資者持倉（含即時價格）

  ```
  $ longbridge investors
  | #  | name                                        | AUM      | period      | cik        |
  |----|---------------------------------------------|----------|-------------|------------|
  | 1  | Capital International Investors             | $637.97B | 31-DEC-2025 | 0001562230 |
  | 2  | Capital Research Global Investors           | $541.73B | 31-DEC-2025 | 0001422848 |
  | 3  | CTC LLC                                     | $404.44B | 31-DEC-2025 | 0001445893 |
  | 4  | BERKSHIRE HATHAWAY INC                      | $274.16B | 31-DEC-2025 | 0001067983 |
  | 5  | DODGE & COX                                 | $185.26B | 31-DEC-2025 | 0000200217 |

  $ longbridge investors 0001067983
  Period: 2025-12-31  (filed: 2026-02-17)

  BERKSHIRE HATHAWAY INC (period: 2025-12-31)

  Portfolio: 42 positions, total value ~$274.16B

  | company                      | value    | shares  | weight |
  |------------------------------|----------|---------|--------|
  | APPLE INC                    | $61.96B  | 227.92M | 22.6%  |
  | AMERICAN EXPRESS CO          | $56.09B  | 151.61M | 20.5%  |
  | BANK AMERICA CORP            | $28.45B  | 517.30M | 10.4%  |
  | COCA COLA CO                 | $27.96B  | 400.00M | 10.2%  |
  | CHEVRON CORP NEW             | $19.84B  | 130.16M | 7.2%   |
  | MOODYS CORP                  | $12.60B  | 24.67M  | 4.6%   |
  | OCCIDENTAL PETE CORP         | $10.89B  | 264.94M | 4.0%   |
  | CHUBB LIMITED                | $10.69B  | 34.25M  | 3.9%   |
  | KRAFT HEINZ CO               | $7.90B   | 325.63M | 2.9%   |
  | ALPHABET INC                 | $5.59B   | 17.85M  | 2.0%   |
  ```

- **`insider-trades`** — 查看任意標的的內部人士交易記錄（SEC Form 4）

  ```
  $ longbridge insider-trades TSLA.US
  Fetching 20 Form 4 filings...

  | date       | filer        | title         | type     | shares | price   | value    | owned_after |
  |------------|--------------|---------------|----------|--------|---------|----------|-------------|
  | 2026-03-31 | Zhu Xiaotong | SVP           | EXERCISE | 20.00K | $20.57  | $411.40K | 20.00K      |
  | 2025-09-11 | Zhu Xiaotong | SVP, APAC and | SELL     | 20.00K | $363.75 | $7.28M   | 47.60K      |
  | 2025-06-12 | Zhu Xiaotong | SVP, APAC     | EXERCISE | 15.00K | $20.57  | $308.55K | 82.60K      |
  | 2025-06-12 | Zhu Xiaotong | SVP, APAC     | SELL     | 15.00K | $323.81 | $4.86M   | 67.60K      |

  Source: SEC EDGAR Form 4 — TSLA
  ```

- **`watchlist pin/unpin`** — 將標的置頂至自選股分組頂部
- **`assets` 指令** — 原 `balance` 更名，展示完整資產概覽：淨資產、購買力、保證金、風險等級及分幣種現金明細

## 2026-04-08

### CLI v0.14.2

- **`--lang` 標誌** — 為所有指令指定內容語言（`zh-CN`、`zh-HK`、`en`），自動回退到系統 `LANG` 環境變數

## 2026-04-02

### CLI v0.14.1

- **CN 區域登入** — `longbridge auth login` 支援中國大陸區域路由
- **`-v` 標誌** — 快速查看版本號

### CLI v0.14.0

- **Device Auth** — Longbridge Developers 平台現已支援 OAuth Device Auth 授權流程；`longbridge auth login` 顯示驗證 URL 和 Code，可在任意裝置完成授權，支援 SSH 和無頭環境
- **訂單增強** — 支援追蹤止損和 AO 訂單類型；訂單指令新增 `--expire-date`、`--outside-rth`、`--remark` 參數
- **修復** — Linux 預建二進位改為 musl，修復在部分發行版的 Segfault

## 2026-04-01

### CLI v0.13.0

- 新增**基本面 & 分析**命令：
  - `financial-report` — 財務報表，支援期間和類型篩選
  - `valuation` — P/E、P/B、P/S、股息率快照，支援同行對比和歷史模式
  - `forecast-eps` — 分析師 EPS 預測一致預期
  - `consensus` — 營收/利潤/EPS 一致預期，帶超預期/未達預期標注
  - `institution-rating` / `institution-rating detail` — 評級分佈及月度趨勢
  - `shareholder` — 機構持股，支援變動追蹤和排序
  - `fund-holder` — 持有該標的的基金和 ETF
  - `dividend` / `dividend detail` — 分紅歷史和分配方案
  - `finance-calendar` — 財務日曆，支援按事件類型篩選（財務、報告、分紅、IPO、宏觀數據、停市）
  - `exchange-rate` — 所有支援貨幣的匯率
- CLI 命令按業務域重新分組命名

## 2026-03-30

- 新增結單 API：
  - `GET /v1/statement/list` — 查詢日結單或月結單列表
  - `GET /v1/statement/download` — 獲取指定結單文件的預簽名下載地址

## 2026-03-25

- 新增社區 API：
  - `GET /content/topics/mine` — 獲取我發布的討論列表
  - `POST /content/topics` — 創建社區討論
  - `GET /content/topics/{id}` — 獲取討論詳情
  - `GET /content/topics/{topic_id}/comments` — 獲取討論回覆列表
  - `POST /content/topics/{topic_id}/comments` — 創建討論回覆

## 2025-06-17

- 更新獲取賬戶資金接口
  - `GET /v1/asset/account` 增加 (frozen_transaction_fees) 返回字段

## 2024-10-09

### SDK 2.0.0

- 連接伺服器時列印已開啟的行情包
- 交易 API 中的數量類型從 `int` 變更為 `Decimal`

## 2024-09-11

- 更新獲取標的列表接口
  - `GET /v1/quote/get_security_list` 返回的多語言名稱根據請求頭 `accept-language` 返回對應字段，不再一次性返回三種語言名稱

## 2024-08-28

- SDK 中 `Depth.price` 字段从 `Decimal` 类型改为 `Optional[Decimal]` 类型

## 2024-05-17

- 下單及訂單查詢接口擴展 `outside_rth` 字段支持夜盤交易

## 2024-05-06

- 更新獲取賬戶資金接口
  - `GET /v1/asset/account` 增加 (buy_power) 返回字段

## 2024-04-29

- 刪除 `TSMPCT`, `TSMAMT` 訂單類型

## 2024-04-15

- [交易推送](https://open.longbridge.com/docs/trade/trade-definition#websocket-%E6%8E%A8%E9%80%81%E9%80%9A%E7%9F%A5) 新增`last_share`, `last_price`。

## 2024-04-13

- [交易推送](https://open.longbridge.com/docs/trade/trade-definition#websocket-%E6%8E%A8%E9%80%81%E9%80%9A%E7%9F%A5) 新增`remark`。

## 2023-11-03

- 新增行情曆史 K 線接口
  - 長連接 `Business Command：27` 獲取標的曆史 K 線

## 2023-08-17

- 更新獲取賬戶資金接口
  - `GET /v1/asset/account` 增加入參 (currency) 字段

## 2023-04-12

- 更新獲取股票持倉接口
  - `GET /v1/asset/stock` 增加開盤前初始持倉 (init_quantity) 字段

## 2023-04-11

- 新增訂單詳情查詢接口
  - `GET /v1/trade/order` 獲取訂單詳情
- 新增預估最大購買數量接口
  - `GET /v1/trade/estimate/buy_limit` 獲取預估最大購買數量接口
- 美股期權添加市價單和條件單支持

## 2022-07-18

- 更新標的基礎信息接口
  - 長連接 `Business Command：10` 響應增加 `board` 字段

## 2022-07-14

- 新增獲取保證金比例接口
  - `GET /v1/risk/margin-ratio` 獲取保證金比例

## 2022-06-30

- 新增獲取關注分組接口
  - `GET /v1/watchlist/groups` 獲取關注分組

## 2022-06-20

- 更新賬號資金接口
  - `GET /v1/asset/account` 響應增加淨資產 (net_assets)、初始保證金 (init_margin)、維持保證金 (maintenance_margin) 字段
- 更新持倉接口
  - `GET /v1/asset/stock` 支持用戶獲取期權持倉

## 2022-06-15

- 新增行情資金流接口
  - 長連接 `Business Command：24` 獲取標的當日資金流向
  - 長連接 `Business Command：25` 獲取標的當日資金分佈
