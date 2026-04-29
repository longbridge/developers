---
title: '回测'
sidebar_label: '回测'
sidebar_position: 3
---

# 回测

使用 `strategy()` 模式在历史数据上模拟交易策略。服务端执行开仓和平仓逻辑，并返回绩效报告。

## 工作原理

- 脚本声明使用 `strategy()`，而非 `indicator()`
- 使用 `strategy.entry()` 和 `strategy.close()`（或 `strategy.exit()`）模拟交易
- 使用 `--format json` 获取完整绩效报告
- 用 `jq` 解析报告：`.data.report_json | fromjson`

## 策略设置

`strategy()` 声明的常用参数及默认值：

| 参数 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `initial_capital` | `1000000` | 初始资金 |
| `commission_type` | `strategy.commission.percent` | 手续费计算方式 |
| `commission_value` | `0` | 手续费费率 / 金额（0 = 不收手续费） |
| `slippage` | `0` | 每次成交的滑点（以 tick 为单位） |
| `default_qty_type` | `strategy.fixed` | 仓位大小的计量方式：`strategy.fixed`（合约数）、`strategy.percent_of_equity`、`strategy.cash` |
| `default_qty_value` | `1` | 默认仓位大小 |
| `pyramiding` | `0` | 同方向最大加仓次数（0 = 同时只允许一笔） |
| `risk_free_rate` | `2` | 年化无风险利率（%），用于夏普 / 索提诺计算 |

自定义设置示例：

```pine
strategy("My Strategy",
    initial_capital    = 50000,
    commission_type    = strategy.commission.percent,
    commission_value   = 0.1,
    default_qty_type   = strategy.percent_of_equity,
    default_qty_value  = 10)
```

## EMA 金叉策略

EMA8 上穿 EMA21 时买入；下穿时平仓。

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

## RSI 均值回归策略

RSI 跌破 30（超卖）时买入；回升至 55 以上时平仓。

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

## 报告参考

解析完整报告对象：

```bash
longbridge quant run NVDA.US ... --format json --script '...' \
  | jq '.data.report_json | fromjson'
```

### 顶层结构

| 字段 | 说明 |
| ---- | ---- |
| `performanceAll` | 全部交易的绩效指标 |
| `performanceLong` | 仅多头交易的绩效指标 |
| `performanceShort` | 仅空头交易的绩效指标 |
| `closedTrades` | 已完成交易记录数组 |
| `openTrades` | 回测结束时的未平仓持仓数组 |
| `equityCurve` | 每根 K 线的账户净值 |
| `drawdownCurve` | 每根 K 线相对净值峰值的回撤 |
| `buyHoldCurve` | 每根 K 线的买入持有基准净值 |
| `config` | 策略配置快照 |

### 绩效指标

`performanceAll`、`performanceLong`、`performanceShort` 结构相同。标注**仅 all** 的字段在 `performanceLong` / `performanceShort` 中始终为 `0` / `null`——它们依赖合并后的净值曲线，无法按方向拆分。

**盈亏**

| 字段 | 说明 |
| ---- | ---- |
| `netProfit` | 净利润（账户货币） |
| `netProfitPercent` | 净利润占初始资金的百分比 |
| `grossProfit` | 盈利交易的总利润 |
| `grossProfitPercent` | 总利润百分比 |
| `grossLoss` | 亏损交易的总亏损（正数） |
| `grossLossPercent` | 总亏损百分比 |
| `profitFactor` | 总利润 ÷ 总亏损 |
| `buyHoldReturn` | 买入持有收益（账户货币）*（仅 all）* |
| `buyHoldReturnPercent` | 买入持有收益百分比 *（仅 all）* |

**回撤与上涨** *（仅 all）*

| 字段 | 说明 |
| ---- | ---- |
| `maxDrawdown` | 最大净值回撤（账户货币） |
| `maxDrawdownPercent` | 最大回撤百分比 |
| `maxRunup` | 最大净值上涨（账户货币） |
| `maxRunupPercent` | 最大上涨百分比 |

**风险调整收益** *（仅 all）*

| 字段 | 说明 |
| ---- | ---- |
| `sharpeRatio` | 年化夏普比率 |
| `sortinoRatio` | 年化索提诺比率 |

**交易统计**

| 字段 | 说明 |
| ---- | ---- |
| `totalClosedTrades` | 已完成交易次数 |
| `totalOpenTrades` | 回测结束时的未平仓数量 |
| `numWinningTrades` | 盈利交易数（profit > 0） |
| `numLosingTrades` | 亏损交易数（profit < 0） |
| `numEvenTrades` | 保本交易数 *（仅 all）* |
| `percentProfitable` | 胜率（0–100） |

**平均交易**

| 字段 | 说明 |
| ---- | ---- |
| `avgTrade` | 每笔交易平均盈亏 |
| `avgTradePercent` | 每笔交易平均盈亏百分比 |
| `avgWinningTrade` | 盈利交易的平均利润 |
| `avgWinningTradePercent` | 盈利交易平均利润百分比 |
| `avgLosingTrade` | 亏损交易的平均亏损 |
| `avgLosingTradePercent` | 亏损交易平均亏损百分比 |
| `ratioAvgWinLoss` | 平均盈利 ÷ 平均亏损 |
| `largestWinningTrade` | 单笔最大利润 |
| `largestWinningTradePercent` | 单笔最大利润百分比 |
| `largestLosingTrade` | 单笔最大亏损 |
| `largestLosingTradePercent` | 单笔最大亏损百分比 |

**持仓时长**

| 字段 | 说明 |
| ---- | ---- |
| `avgBarsInTrades` | 每笔交易平均持仓 K 线数 |
| `avgBarsInWinningTrades` | 盈利交易平均持仓 K 线数 |
| `avgBarsInLosingTrades` | 亏损交易平均持仓 K 线数 |

**其他**

| 字段 | 说明 |
| ---- | ---- |
| `commissionPaid` | 已付总手续费 |
| `maxContractsHeld` | 同时持仓的峰值合约数 |
| `marginCalls` | 触发保证金追缴次数 |

### 交易历史

`closedTrades` 中每条记录代表一次完整的开平仓：

| 字段 | 说明 |
| ---- | ---- |
| `tradeNum` | 交易编号（从 0 开始） |
| `entrySide` | `"Long"` 或 `"Short"` |
| `entryId` | 入场指令 ID |
| `entryPrice` | 入场成交价 |
| `entryTime` | 入场时间戳（Unix ms） |
| `exitId` | 出场指令 ID |
| `exitPrice` | 出场成交价 |
| `exitTime` | 出场时间戳（Unix ms） |
| `quantity` | 交易合约数 / 股数 |
| `profit` | 已实现盈亏（扣除手续费后） |
| `profitPercent` | 已实现盈亏百分比 |
| `cumulativeProfit` | 含本笔交易的累计盈亏 |
| `cumulativeProfitPercent` | 累计盈亏占初始资金的百分比 |
| `maxRunup` / `maxRunupPercent` | 持仓期间最大浮盈 |
| `maxDrawdown` / `maxDrawdownPercent` | 持仓期间最大浮亏 |
| `commission` | 本笔交易手续费（入场 + 出场） |

```bash
# 逐笔打印交易摘要
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json --script '...' \
  | jq -r '.data.report_json | fromjson | .closedTrades[]
    | "#\(.tradeNum) \(.entrySide)  entry=\(.entryPrice)  exit=\(.exitPrice)  P&L=\(.profitPercent)%"'
```

`openTrades` 结构相同，但无出场字段，`profit` 为当前浮盈亏。

### 净值曲线

三个平行数组，每个元素对应一根 K 线（索引 0 = 第一根）：

| 字段 | 说明 |
| ---- | ---- |
| `equityCurve` | 每根 K 线收盘时的账户净值 |
| `drawdownCurve` | 相对净值峰值的回撤（始终 ≥ 0） |
| `buyHoldCurve` | 假设买入持有的基准净值 |

```bash
# 最终净值
jq '.data.report_json | fromjson | .equityCurve[-1]'

# 最大回撤值
jq '.data.report_json | fromjson | .drawdownCurve | max'
```

### 策略配置

`config` 记录 `strategy()` 声明中的参数：

| 字段 | 说明 |
| ---- | ---- |
| `initialCapital` | 初始资金 |
| `commissionType` | `PerContract`、`PerTrade` 或 `PercentOfValue` |
| `commissionValue` | 手续费金额 |
| `slippage` | 滑点（以 tick 为单位） |
| `pyramiding` | 同方向最大加仓次数 |
| `riskFreeRate` | 用于夏普/索提诺计算的年化无风险利率（%） |

## 表格输出（快速预览）

不加 `--format json` 时，表格会显示每个绘制序列 — 适合在运行完整回测前直观检查信号时机：

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
