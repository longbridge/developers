---
title: 'Backtest'
sidebar_label: 'Backtest'
sidebar_position: 3
---

# Backtesting

Use `strategy()` mode to simulate a trading strategy over historical data. The server executes entries and exits, then returns a performance report.

## How It Works

- Declare your script with `strategy()` instead of `indicator()`
- Use `strategy.entry()` and `strategy.close()` (or `strategy.exit()`) to simulate trades
- Use `--format json` to get the full performance report
- Parse the report with `jq`: `.data.report_json | fromjson`

## Strategy Settings

Common parameters for the `strategy()` declaration and their defaults:

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `initial_capital` | `1000000` | Starting capital |
| `commission_type` | `strategy.commission.percent` | Commission calculation method |
| `commission_value` | `0` | Commission rate / amount (0 = no commission) |
| `slippage` | `0` | Slippage in ticks per fill |
| `default_qty_type` | `strategy.fixed` | How position size is specified: `strategy.fixed` (contracts), `strategy.percent_of_equity`, `strategy.cash` |
| `default_qty_value` | `1` | Default position size |
| `pyramiding` | `0` | Max simultaneous entries in the same direction (0 = one at a time) |
| `risk_free_rate` | `2` | Annual risk-free rate (%) for Sharpe / Sortino |

Example with custom settings:

```pine
strategy("My Strategy",
    initial_capital    = 50000,
    commission_type    = strategy.commission.percent,
    commission_value   = 0.1,
    default_qty_type   = strategy.percent_of_equity,
    default_qty_value  = 10)
```

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

## Report Reference

Parse the full report object:

```bash
longbridge quant run NVDA.US ... --format json --script '...' \
  | jq '.data.report_json | fromjson'
```

### Top-Level Structure

| Field | Description |
| ----- | ----------- |
| `performanceAll` | Performance metrics across all trades |
| `performanceLong` | Performance metrics for long trades only |
| `performanceShort` | Performance metrics for short trades only |
| `closedTrades` | Array of completed trade records |
| `openTrades` | Array of unrealized positions at backtest end |
| `equityCurve` | Per-bar account equity |
| `drawdownCurve` | Per-bar drawdown from equity peak |
| `buyHoldCurve` | Per-bar buy-and-hold benchmark equity |
| `config` | Strategy configuration snapshot |

### Performance Metrics

`performanceAll`, `performanceLong`, and `performanceShort` share the same shape. Fields marked **all only** are always `0` / `null` in `performanceLong` and `performanceShort` — they reflect the combined equity curve and cannot be split by direction.

**Profit & Loss**

| Field | Description |
| ----- | ----------- |
| `netProfit` | Net profit in account currency |
| `netProfitPercent` | Net profit % of initial capital |
| `grossProfit` | Total profit from winning trades |
| `grossProfitPercent` | Gross profit % |
| `grossLoss` | Total loss from losing trades (positive number) |
| `grossLossPercent` | Gross loss % |
| `profitFactor` | Gross profit ÷ gross loss |
| `buyHoldReturn` | Buy-and-hold return in account currency *(all only)* |
| `buyHoldReturnPercent` | Buy-and-hold return % *(all only)* |

**Drawdown & Runup** *(all only)*

| Field | Description |
| ----- | ----------- |
| `maxDrawdown` | Largest equity drawdown in account currency |
| `maxDrawdownPercent` | Max drawdown % |
| `maxRunup` | Largest equity runup in account currency |
| `maxRunupPercent` | Max runup % |

**Risk-Adjusted Returns** *(all only)*

| Field | Description |
| ----- | ----------- |
| `sharpeRatio` | Annualized Sharpe ratio |
| `sortinoRatio` | Annualized Sortino ratio |

**Trade Statistics**

| Field | Description |
| ----- | ----------- |
| `totalClosedTrades` | Completed trades |
| `totalOpenTrades` | Unrealized positions at end of backtest |
| `numWinningTrades` | Trades with profit > 0 |
| `numLosingTrades` | Trades with profit < 0 |
| `numEvenTrades` | Break-even trades *(all only)* |
| `percentProfitable` | Win rate (0–100) |

**Average Trade**

| Field | Description |
| ----- | ----------- |
| `avgTrade` | Average P&L per trade |
| `avgTradePercent` | Average P&L % per trade |
| `avgWinningTrade` | Average profit of winning trades |
| `avgWinningTradePercent` | Average winning trade profit % |
| `avgLosingTrade` | Average loss of losing trades |
| `avgLosingTradePercent` | Average losing trade loss % |
| `ratioAvgWinLoss` | Avg winning trade ÷ avg losing trade |
| `largestWinningTrade` | Single largest profit |
| `largestWinningTradePercent` | Single largest profit % |
| `largestLosingTrade` | Single largest loss |
| `largestLosingTradePercent` | Single largest loss % |

**Holding Period**

| Field | Description |
| ----- | ----------- |
| `avgBarsInTrades` | Average bars held per trade |
| `avgBarsInWinningTrades` | Average bars held for winning trades |
| `avgBarsInLosingTrades` | Average bars held for losing trades |

**Other**

| Field | Description |
| ----- | ----------- |
| `commissionPaid` | Total commissions paid |
| `maxContractsHeld` | Peak simultaneous contracts held |
| `marginCalls` | Number of margin calls triggered |

### Trade History

Each entry in `closedTrades` is a completed round-trip:

| Field | Description |
| ----- | ----------- |
| `tradeNum` | Trade number (0-based) |
| `entrySide` | `"Long"` or `"Short"` |
| `entryId` | Entry order ID |
| `entryPrice` | Entry fill price |
| `entryTime` | Entry timestamp (Unix ms) |
| `exitId` | Exit order ID |
| `exitPrice` | Exit fill price |
| `exitTime` | Exit timestamp (Unix ms) |
| `quantity` | Contracts / shares traded |
| `profit` | Realized P&L after commission |
| `profitPercent` | Realized P&L % relative to entry value |
| `cumulativeProfit` | Running total P&L including this trade |
| `cumulativeProfitPercent` | Running total P&L % vs. initial capital |
| `maxRunup` / `maxRunupPercent` | Best unrealized gain during the trade |
| `maxDrawdown` / `maxDrawdownPercent` | Worst unrealized loss during the trade |
| `commission` | Total commission for this trade (entry + exit) |

```bash
# Print a trade-by-trade summary
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json --script '...' \
  | jq -r '.data.report_json | fromjson | .closedTrades[]
    | "#\(.tradeNum) \(.entrySide)  entry=\(.entryPrice)  exit=\(.exitPrice)  P&L=\(.profitPercent)%"'
```

`openTrades` uses the same shape minus exit fields, and `profit` reflects current unrealized P&L.

### Equity Curves

Three parallel arrays, one value per bar (index 0 = first bar):

| Field | Description |
| ----- | ----------- |
| `equityCurve` | Account equity at bar close |
| `drawdownCurve` | Drawdown from equity peak (always ≥ 0) |
| `buyHoldCurve` | Hypothetical buy-and-hold equity (benchmark) |

```bash
# Final equity
jq '.data.report_json | fromjson | .equityCurve[-1]'

# Worst drawdown value
jq '.data.report_json | fromjson | .drawdownCurve | max'
```

### Strategy Config

`config` captures the declared `strategy()` settings:

| Field | Description |
| ----- | ----------- |
| `initialCapital` | Starting account equity |
| `commissionType` | `PerContract`, `PerTrade`, or `PercentOfValue` |
| `commissionValue` | Commission amount |
| `slippage` | Order slippage in ticks |
| `pyramiding` | Max simultaneous entries in the same direction |
| `riskFreeRate` | Annual risk-free rate used for Sharpe/Sortino (%) |

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
