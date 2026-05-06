---
title: 'quant run'
sidebar_label: 'overview'
sidebar_position: 1
slug: '/cli/quant'
---

# longbridge quant run

Run server-side quantitative scripts against historical K-line data. Returns indicator values, backtest performance reports, or binary screening signals.

## Command

```bash
longbridge quant run <SYMBOL> \
  --start YYYY-MM-DD \
  --end   YYYY-MM-DD \
  [--period day|week|1h|30m|15m|5m|1m|month|year]
  [--script "..."]       # inline script text
  [--input '[14,2.0]']   # override input.*() defaults
  [--format table|json]  # table = human chart (default); json = machine
```

Pipe a file instead of using `--script`:

```bash
cat strategy.pine | longbridge quant run TSLA.US --start 2024-01-01 --end 2024-12-31
```

## Script Language — OpenPine

Scripts are written in **OpenPine** — an independent indicator scripting language compatible with most **PineScript V6** syntax. Existing Pine scripts work with little to no modification.

### Script Types

Every OpenPine script must begin with one of these declarations — it determines the execution mode:

| Declaration | Purpose |
| ----------- | ------- |
| `indicator()` | Plot indicators, compute screener signals |
| `strategy()` | Backtest with entry / exit orders |

### Core Concepts

**Time series** — every variable is a bar-by-bar stream. `close[1]` is the previous bar's close; `close[N]` goes N bars back. Most `ta.*` outputs are also series.

**Persistent state** — use `var` to initialize once and carry the value across bars:

```pine
var float peak = na
peak := na(peak) ? high : math.max(peak, high)
```

**Inputs** — expose tunable parameters:

```pine
len  = input.int(14, "Length", minval=1)
src  = input.source(close, "Source")
mult = input.float(2.0, "Multiplier")
```

**Collections** — `array<T>`, `map<K,V>`, and `matrix<T>` are available for advanced per-bar computation.

### Built-in Libraries

| Namespace | Key functions |
| --------- | ------------- |
| `ta.*` | `sma`, `ema`, `rma`, `wma`, `rsi`, `macd`, `bb`, `kc`, `atr`, `tr`, `stoch`, `sar`, `supertrend`, `vwap`, `crossover`, `crossunder`, `highest`, `lowest`, `stdev`, `barssince`, `valuewhen` |
| `math.*` | `abs`, `ceil`, `floor`, `round`, `sqrt`, `pow`, `exp`, `log`, `max`, `min`, `avg` |
| `str.*` | `tostring`, `format`, `length`, `contains`, `replace`, `split` |
| `array.*` | `new`, `push`, `pop`, `avg`, `sum`, `min`, `max`, `sort`, `includes` |
| `map.*` | `new`, `get`, `put`, `keys`, `values`, `contains` |

### Outputs

| Expression | Effect |
| ---------- | ------ |
| `plot(series, "name")` | Named series — shown in the results table / sparkline |
| `plotshape(cond, ...)` | Mark a signal shape on a specific bar |
| `bgcolor(cond ? color.green : na)` | Highlight bar background |
| `strategy.entry("L", strategy.long)` | Place a backtest long entry |
| `strategy.exit("L", stop=..., limit=...)` | Close with stop / take-profit |

### Quick Example

```pine
indicator("MA Cross", overlay=true)

fastLen = input.int(10, "Fast", minval=1)
slowLen = input.int(20, "Slow", minval=1)

fast = ta.ema(close, fastLen)
slow = ta.ema(close, slowLen)

plot(fast, "Fast", color=color.orange)
plot(slow, "Slow", color=color.blue)
plotshape(ta.crossover(fast, slow),  title="Buy",  style=shape.triangleup,   location=location.belowbar, color=color.green)
plotshape(ta.crossunder(fast, slow), title="Sell", style=shape.triangledown, location=location.abovebar, color=color.red)
```

## Output

**Table format** (default) — human-readable chart with sparklines:

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
MACD                  │    79│     +0.00│     +7.56│     -4.07│     +7.56 ⣤⣤⣤⣤⣤⣤⣠⣤⣤⣤⣤⣤⣤⣤⣀⣀⣠⣴⣶⣿
Signal                │    79│     +0.00│     +5.16│     -2.99│     +5.16 ⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣀⣀⣀⣠⣴⣾
Histogram             │    79│     +0.00│     +2.40│     -1.41│     +3.02 ⣤⣤⣤⣤⣤⣦⣠⣤⣤⣦⣄⣠⣤⣄⣀⣠⣴⣾⣿⣷
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  79 bars
```

**JSON format** — for scripting and backtests:

```bash
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json --script '...' | \
  jq '.data.report_json | fromjson | .performanceAll'
```

## Supported Periods

| Flag | Description |
| ---- | ----------- |
| `day` | Daily bars (default) |
| `week` | Weekly bars |
| `month` | Monthly bars |
| `year` | Yearly bars |
| `1h` | 1-hour bars |
| `30m` | 30-minute bars |
| `15m` | 15-minute bars |
| `5m` | 5-minute bars |
| `1m` | 1-minute bars |

Intraday periods accept datetime: `--start "2024-01-02 09:30" --end "2024-01-02 16:00"`.
