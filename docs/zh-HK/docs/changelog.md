---
id: changelog
title: 更新日誌
slug: changelog
sidebar_position: 7
sidebar_icon: newspaper
---

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
