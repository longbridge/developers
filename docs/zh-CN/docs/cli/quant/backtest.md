---
title: '回测'
sidebar_label: '回测'
sidebar_position: 3
---

# 回测

使用 `strategy()` 模式在历史数据上模拟交易策略。服务端执行开仓和平仓逻辑，并返回绩效报告。

## 工作原理

- 将 `indicator()` 替换为 `strategy()`
- 使用 `strategy.entry()` 和 `strategy.close()`（或 `strategy.exit()`）模拟交易
- 使用 `--format json` 获取完整绩效报告
- 用 `jq` 解析报告：`.data.report_json | fromjson | .performanceAll`

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
  "netProfit": 42.31,
  "netProfitPercent": 42.31,
  "totalTrades": 18,
  "winRate": 0.50,
  "profitFactor": 1.74,
  "maxDrawdown": -28.15,
  "maxDrawdownPercent": -28.15,
  "sharpeRatio": 0.87,
  "avgWin": 12.43,
  "avgLoss": -7.14
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

```json
{
  "netProfit": 23.87,
  "netProfitPercent": 23.87,
  "totalTrades": 9,
  "winRate": 0.67,
  "profitFactor": 2.11,
  "maxDrawdown": -11.42,
  "maxDrawdownPercent": -11.42,
  "sharpeRatio": 1.23,
  "avgWin": 8.91,
  "avgLoss": -4.22
}
```

## 报告字段说明

| 字段 | 说明 |
| ---- | ---- |
| `netProfitPercent` | 区间总收益（%） |
| `totalTrades` | 完成的交易次数（买卖各算一次） |
| `winRate` | 盈利交易占比（0–1） |
| `profitFactor` | 总盈利 ÷ 总亏损 |
| `maxDrawdownPercent` | 最大回撤（%） |
| `sharpeRatio` | 风险调整收益（年化） |
| `avgWin` / `avgLoss` | 每笔交易平均盈利 / 平均亏损（%） |

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
