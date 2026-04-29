---
title: 'Backtest'
sidebar_label: 'Backtest'
sidebar_position: 3
---

# Backtesting

Use `strategy()` mode to simulate a trading strategy over historical data. The server executes entries and exits, then returns a performance report.

## How It Works

- Replace `indicator()` with `strategy()`
- Use `strategy.entry()` and `strategy.close()` (or `strategy.exit()`) to simulate trades
- Use `--format json` to get the full performance report
- Parse the report with `jq`: `.data.report_json | fromjson | .performanceAll`

## EMA Crossover Strategy

Buy when EMA8 crosses above EMA21; sell when it crosses below.

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

## RSI Mean-Reversion Strategy

Buy when RSI drops below 30 (oversold); exit when RSI recovers above 55.

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

## Understanding the Report Fields

| Field | Description |
| ----- | ----------- |
| `netProfitPercent` | Total return (%) for the period |
| `totalTrades` | Number of completed round-trips |
| `winRate` | Fraction of profitable trades (0–1) |
| `profitFactor` | Gross profit ÷ gross loss |
| `maxDrawdownPercent` | Largest peak-to-trough decline (%) |
| `sharpeRatio` | Risk-adjusted return (annualized) |
| `avgWin` / `avgLoss` | Average gain / average loss per trade (%) |

## Table Output (Quick Review)

Without `--format json`, the table shows each plotted series — useful for visually checking signal timing before running a full backtest:

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
