---
title: '回測'
sidebar_label: '回測'
sidebar_position: 3
slug: '/cli/quant/backtest'
---

# 回測

使用 `strategy()` 模式在歷史數據上模擬交易策略。服務端執行開倉和平倉邏輯，並返回績效報告。

## 工作原理

- 腳本聲明使用 `strategy()`，而非 `indicator()`
- 使用 `strategy.entry()` 和 `strategy.close()`（或 `strategy.exit()`）模擬交易
- 使用 `--format json` 獲取完整績效報告
- 用 `jq` 解析報告：`.data.report_json | fromjson`

## 策略設置

`strategy()` 聲明的常用參數及預設值：

| 參數 | 預設值 | 說明 |
| ---- | ------ | ---- |
| `initial_capital` | `1000000` | 初始資金 |
| `commission_type` | `strategy.commission.percent` | 手續費計算方式 |
| `commission_value` | `0` | 手續費費率 / 金額（0 = 不收手續費） |
| `slippage` | `0` | 每次成交的滑點（以 tick 為單位） |
| `default_qty_type` | `strategy.fixed` | 倉位大小的計量方式：`strategy.fixed`（合約數）、`strategy.percent_of_equity`、`strategy.cash` |
| `default_qty_value` | `1` | 預設倉位大小 |
| `pyramiding` | `0` | 同方向最大加倉次數（0 = 同時只允許一筆） |
| `risk_free_rate` | `2` | 年化無風險利率（%），用於夏普 / 索提諾計算 |

自定義設置示例：

```pine
strategy("My Strategy",
    initial_capital    = 50000,
    commission_type    = strategy.commission.percent,
    commission_value   = 0.1,
    default_qty_type   = strategy.percent_of_equity,
    default_qty_value  = 10)
```

## EMA 金叉策略

EMA8 上穿 EMA21 時買入；下穿時平倉。

```bash
longbridge quant run NVDA.US \
  --start 2025-01-01 --end 2026-04-28 \
  --format json \
  --script '
strategy("EMA Cross", overlay=true)
fast = ta.ema(close, 8)
slow = ta.ema(close, 21)
if ta.crossover(fast, slow)
    strategy.entry("Long", strategy.long)
if ta.crossunder(fast, slow)
    strategy.close("Long")
' | jq '.data.report_json | fromjson | .performanceAll'
```

```json
{
  "netProfit": 4231.00,
  "netProfitPercent": 42.31,
  "grossProfit": 7850.00,
  "grossLoss": 3619.00,
  "profitFactor": 2.17,
  "buyHoldReturnPercent": 31.20,
  "maxDrawdownPercent": -28.15,
  "sharpeRatio": 0.87,
  "sortinoRatio": 1.24,
  "totalClosedTrades": 18,
  "percentProfitable": 50.0,
  "avgWinningTradePercent": 8.72,
  "avgLosingTradePercent": -4.02,
  "commissionPaid": 180.00
}
```

## RSI 均值回歸策略

RSI 跌破 30（超賣）時買入；回升至 55 以上時平倉。

```bash
longbridge quant run AAPL.US \
  --start 2025-01-01 --end 2026-04-28 \
  --format json \
  --script '
strategy("RSI Reversion", overlay=false)
r = ta.rsi(close, 14)
if ta.crossunder(r, 30)
    strategy.entry("Long", strategy.long)
if ta.crossover(r, 55)
    strategy.close("Long")
' | jq '.data.report_json | fromjson | .performanceAll'
```

## 報告參考

解析完整報告對象：

```bash
longbridge quant run NVDA.US ... --format json --script '...' \
  | jq '.data.report_json | fromjson'
```

### 頂層結構

| 字段 | 說明 |
| ---- | ---- |
| `performanceAll` | 全部交易的績效指標 |
| `performanceLong` | 僅多頭交易的績效指標 |
| `performanceShort` | 僅空頭交易的績效指標 |
| `closedTrades` | 已完成交易記錄數組 |
| `openTrades` | 回測結束時的未平倉持倉數組 |
| `equityCurve` | 每根 K 線的賬戶淨值 |
| `drawdownCurve` | 每根 K 線相對淨值峰值的回撤 |
| `buyHoldCurve` | 每根 K 線的買入持有基準淨值 |
| `config` | 策略配置快照 |

### 績效指標

`performanceAll`、`performanceLong`、`performanceShort` 結構相同。標注**僅 all** 的字段在 `performanceLong` / `performanceShort` 中始終為 `0` / `null`——它們依賴合併後的淨值曲線，無法按方向拆分。

**盈虧**

| 字段 | 說明 |
| ---- | ---- |
| `netProfit` | 淨利潤（賬戶貨幣） |
| `netProfitPercent` | 淨利潤佔初始資金的百分比 |
| `grossProfit` | 盈利交易的總利潤 |
| `grossProfitPercent` | 總利潤百分比 |
| `grossLoss` | 虧損交易的總虧損（正數） |
| `grossLossPercent` | 總虧損百分比 |
| `profitFactor` | 總利潤 ÷ 總虧損 |
| `buyHoldReturn` | 買入持有收益（賬戶貨幣）*（僅 all）* |
| `buyHoldReturnPercent` | 買入持有收益百分比 *（僅 all）* |

**回撤與上漲** *（僅 all）*

| 字段 | 說明 |
| ---- | ---- |
| `maxDrawdown` | 最大淨值回撤（賬戶貨幣） |
| `maxDrawdownPercent` | 最大回撤百分比 |
| `maxRunup` | 最大淨值上漲（賬戶貨幣） |
| `maxRunupPercent` | 最大上漲百分比 |

**風險調整收益** *（僅 all）*

| 字段 | 說明 |
| ---- | ---- |
| `sharpeRatio` | 年化夏普比率 |
| `sortinoRatio` | 年化索提諾比率 |

**交易統計**

| 字段 | 說明 |
| ---- | ---- |
| `totalClosedTrades` | 已完成交易次數 |
| `totalOpenTrades` | 回測結束時的未平倉數量 |
| `numWinningTrades` | 盈利交易數（profit > 0） |
| `numLosingTrades` | 虧損交易數（profit < 0） |
| `numEvenTrades` | 保本交易數 *（僅 all）* |
| `percentProfitable` | 勝率（0–100） |

**平均交易**

| 字段 | 說明 |
| ---- | ---- |
| `avgTrade` | 每筆交易平均盈虧 |
| `avgTradePercent` | 每筆交易平均盈虧百分比 |
| `avgWinningTrade` | 盈利交易的平均利潤 |
| `avgWinningTradePercent` | 盈利交易平均利潤百分比 |
| `avgLosingTrade` | 虧損交易的平均虧損 |
| `avgLosingTradePercent` | 虧損交易平均虧損百分比 |
| `ratioAvgWinLoss` | 平均盈利 ÷ 平均虧損 |
| `largestWinningTrade` | 單筆最大利潤 |
| `largestWinningTradePercent` | 單筆最大利潤百分比 |
| `largestLosingTrade` | 單筆最大虧損 |
| `largestLosingTradePercent` | 單筆最大虧損百分比 |

**持倉時長**

| 字段 | 說明 |
| ---- | ---- |
| `avgBarsInTrades` | 每筆交易平均持倉 K 線數 |
| `avgBarsInWinningTrades` | 盈利交易平均持倉 K 線數 |
| `avgBarsInLosingTrades` | 虧損交易平均持倉 K 線數 |

**其他**

| 字段 | 說明 |
| ---- | ---- |
| `commissionPaid` | 已付總手續費 |
| `maxContractsHeld` | 同時持倉的峰值合約數 |
| `marginCalls` | 觸發保證金追繳次數 |

### 交易歷史

`closedTrades` 中每條記錄代表一次完整的開平倉：

| 字段 | 說明 |
| ---- | ---- |
| `tradeNum` | 交易編號（從 0 開始） |
| `entrySide` | `"Long"` 或 `"Short"` |
| `entryId` | 入場指令 ID |
| `entryPrice` | 入場成交價 |
| `entryTime` | 入場時間戳（Unix ms） |
| `exitId` | 出場指令 ID |
| `exitPrice` | 出場成交價 |
| `exitTime` | 出場時間戳（Unix ms） |
| `quantity` | 交易合約數 / 股數 |
| `profit` | 已實現盈虧（扣除手續費後） |
| `profitPercent` | 已實現盈虧百分比 |
| `cumulativeProfit` | 含本筆交易的累計盈虧 |
| `cumulativeProfitPercent` | 累計盈虧佔初始資金的百分比 |
| `maxRunup` / `maxRunupPercent` | 持倉期間最大浮盈 |
| `maxDrawdown` / `maxDrawdownPercent` | 持倉期間最大浮虧 |
| `commission` | 本筆交易手續費（入場 + 出場） |

```bash
# 逐筆打印交易摘要
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json --script '...' \
  | jq -r '.data.report_json | fromjson | .closedTrades[]
    | "#\(.tradeNum) \(.entrySide)  entry=\(.entryPrice)  exit=\(.exitPrice)  P&L=\(.profitPercent)%"'
```

`openTrades` 結構相同，但無出場字段，`profit` 為當前浮盈虧。

### 淨值曲線

三個平行數組，每個元素對應一根 K 線（索引 0 = 第一根）：

| 字段 | 說明 |
| ---- | ---- |
| `equityCurve` | 每根 K 線收盤時的賬戶淨值 |
| `drawdownCurve` | 相對淨值峰值的回撤（始終 ≥ 0） |
| `buyHoldCurve` | 假設買入持有的基準淨值 |

```bash
# 最終淨值
jq '.data.report_json | fromjson | .equityCurve[-1]'

# 最大回撤值
jq '.data.report_json | fromjson | .drawdownCurve | max'
```

### 策略配置

`config` 記錄 `strategy()` 聲明中的參數：

| 字段 | 說明 |
| ---- | ---- |
| `initialCapital` | 初始資金 |
| `commissionType` | `PerContract`、`PerTrade` 或 `PercentOfValue` |
| `commissionValue` | 手續費金額 |
| `slippage` | 滑點（以 tick 為單位） |
| `pyramiding` | 同方向最大加倉次數 |
| `riskFreeRate` | 用於夏普/索提諾計算的年化無風險利率（%） |

## 表格輸出（快速預覽）

不加 `--format json` 時，表格會顯示每個繪製序列 — 適合在運行完整回測前直觀檢查信號時機：

```bash
longbridge quant run NVDA.US \
  --start 2025-01-01 --end 2026-04-28 \
  --script '
strategy("EMA Cross", overlay=true)
fast = ta.ema(close, 8)
slow = ta.ema(close, 21)
plot(fast, "EMA8")
plot(slow, "EMA21")
if ta.crossover(fast, slow)
    strategy.entry("Long", strategy.long)
if ta.crossunder(fast, slow)
    strategy.close("Long")
'
```
