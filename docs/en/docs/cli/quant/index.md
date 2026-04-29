---
title: 'quant run'
sidebar_label: 'Overview'
sidebar_position: 1
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

Scripts are written in **OpenPine** — an independent indicator scripting language designed for quantitative analysis. It is compatible with most **PineScript V6** syntax, so existing Pine scripts work with little to no modification.

| Feature | Description |
| ------- | ----------- |
| **Series** | Every variable is a time-series; `close[1]` = previous bar's close |
| **`ta.*` library** | `ta.ema`, `ta.sma`, `ta.rsi`, `ta.macd`, `ta.sar`, `ta.stoch`, `ta.atr`, `ta.stdev`, `ta.lowest`, `ta.highest`, `ta.crossover`, `ta.crossunder` |
| **Two modes** | `indicator()` for analysis / screening; `strategy()` for backtesting |
| **`input.*()` functions** | `input.int`, `input.float` — expose tunable parameters |
| **`plot(value, "name")`** | Output a named series; visible in the results table |

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
