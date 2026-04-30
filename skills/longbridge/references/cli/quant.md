# Quant — Indicator, Strategy & Screener

`longbridge quant run` executes scripts server-side against historical K-line data, returning indicator values, backtest reports, or screening signals.

## Command Reference

```bash
longbridge quant run <SYMBOL> \
  --start YYYY-MM-DD \
  --end   YYYY-MM-DD \
  [--period day|week|1h|30m|15m|5m|1m|month|year]
  [--script "..."]          # inline; or pipe via stdin
  [--input '[14,2.0]']      # override input.*() defaults, in declaration order
  [--format table|json]     # table = human chart (default); json = machine
```

```bash
# Pipe from a file
cat strategy.pine | longbridge quant run TSLA.US --start 2024-01-01 --end 2024-12-31
```

## Script Language (OpenPine)

Scripts are written in **OpenPine** — an independent indicator scripting language for quantitative analysis, with syntax familiar to anyone who has written indicator scripts before.

- **Series-aware**: every variable is a time-series; `close[1]` = yesterday's close
- **Built-in `ta.*`**: `ta.ema`, `ta.sma`, `ta.rsi`, `ta.macd`, `ta.sar`, `ta.stoch`, `ta.atr`, `ta.stdev`, and more
- **Two modes**: `indicator()` for analysis / screening; `strategy()` for backtesting
- **`input.*()` functions**: expose tunable parameters (`input.int`, `input.float`)
- **`plot(value, "name")`**: outputs a named series visible in the results table

---

## Indicators

Each example runs against NVDA.US. The output table shows First/Last/Min/Max and a Unicode sparkline per series.

### 1. MACD

```
indicator("MACD")
[macdLine, signalLine, hist] = ta.macd(close, 12, 26, 9)
plot(macdLine,   "MACD")
plot(signalLine, "Signal")
plot(hist,       "Histogram")
```

```bash
longbridge quant run NVDA.US --start 2026-01-01 --end 2026-04-28 \
  --script 'indicator("MACD")
[m,s,h]=ta.macd(close,12,26,9)
plot(m,"MACD") plot(s,"Signal") plot(h,"Histogram")'
```

**Output:**

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

### 2. RSI with Overbought / Oversold Bands

```
indicator("RSI")
length = input.int(14, "Length")
rsi = ta.rsi(close, length)
plot(rsi,  "RSI")
plot(70.0, "OB")
plot(30.0, "OS")
```

```bash
longbridge quant run AAPL.US --start 2025-01-01 --end 2026-01-31 \
  --script 'indicator("RSI")
rsi=ta.rsi(close,14)
plot(rsi,"RSI") plot(70.0,"OB") plot(30.0,"OS")'
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
RSI                   │   269│     +0.00│    +48.44│     +0.00│    +78.26 ⢠⣴⣶⣦⣶⣴⣶⣶⣶⣶⣶⣿⣾⣾⣷⣾⣷⣷⣶⣤
OB                    │   270│    +70.00│    +70.00│    +70.00│    +70.00 ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀
OS                    │   270│    +30.00│    +30.00│    +30.00│    +30.00 ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  270 bars
```

### 3. Bollinger Bands

Built using `ta.sma` and `ta.stdev` — `ta.bbands` is not available.

```
indicator("Bollinger Bands")
length = input.int(20, "Length")
mult   = input.float(2.0, "Mult")
basis  = ta.sma(close, length)
dev    = mult * ta.stdev(close, length)
plot(basis + dev, "Upper")
plot(basis,       "Mid")
plot(basis - dev, "Lower")
```

```bash
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-01-01 \
  --script 'indicator("BB")
basis=ta.sma(close,20) dev=2.0*ta.stdev(close,20)
plot(basis+dev,"Upper") plot(basis,"Mid") plot(basis-dev,"Lower")'
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
Upper                 │   231│   +153.18│   +193.21│   +117.05│   +209.95 ⠀⠀⣤⣤⣄⣀⣀⣠⣤⣤⣴⣶⣶⣶⣶⣶⣾⣿⣿⣶
Mid                   │   231│   +135.68│   +182.49│   +105.22│   +193.37 ⠀⠀⣤⣤⣄⣀⣀⣀⣤⣤⣴⣶⣶⣷⣶⣾⣿⣿⣿⣿
Lower                 │   231│   +118.18│   +171.77│    +92.55│   +177.94 ⠀⠀⣤⣤⣠⣀⣀⣀⣤⣤⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  250 bars
```

### 4. EMA Ribbon

Three EMAs that visually show trend phase and momentum alignment.

```
indicator("EMA Ribbon")
plot(ta.ema(close,  8), "EMA8")
plot(ta.ema(close, 21), "EMA21")
plot(ta.ema(close, 55), "EMA55")
```

```bash
longbridge quant run NVDA.US --start 2026-01-01 --end 2026-04-28 \
  --script 'indicator("EMA Ribbon")
plot(ta.ema(close,8),"EMA8")
plot(ta.ema(close,21),"EMA21")
plot(ta.ema(close,55),"EMA55")'
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
EMA8                  │    79│   +188.84│   +203.96│   +172.45│   +203.96 ⣶⣦⣤⣤⣤⣦⣤⣤⣤⣶⣤⣤⣤⣤⣄⣀⣀⣤⣶⣾
EMA21                 │    79│   +188.84│   +194.61│   +177.12│   +194.61 ⣶⣶⣶⣶⣶⣶⣤⣤⣴⣶⣦⣤⣤⣤⣄⣀⣀⣠⣴⣾
EMA55                 │    79│   +188.84│   +188.27│   +181.18│   +188.84 ⣿⣿⣿⣷⣶⣷⣶⣶⣶⣶⣶⣶⣶⣦⣤⣀⣀⣀⣤⣶
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  79 bars
```

### 5. Parabolic SAR + ATR Volatility

SAR tracks trend direction; ATR quantifies current volatility. `Trend` is `+1.0` (bullish) or `-1.0` (bearish).

```
indicator("SAR + ATR")
sar   = ta.sar(0.02, 0.02, 0.2)
atr   = ta.atr(14)
trend = close > sar ? 1.0 : -1.0
plot(sar,   "SAR")
plot(atr,   "ATR")
plot(trend, "Trend")
```

```bash
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-01-01 \
  --script 'indicator("SAR+ATR")
sar=ta.sar(0.02,0.02,0.2)
plot(sar,"SAR") plot(ta.atr(14),"ATR") plot(close>sar?1.0:-1.0,"Trend")'
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
SAR                   │   249│   +134.59│   +173.55│    +86.60│   +212.17 ⢰⣤⣤⣤⣠⣄⣀⣠⣤⣤⣶⣶⣶⣶⣶⣶⣷⣿⣷⣶
ATR                   │   250│     +4.25│     +5.29│     +3.73│     +8.59 ⣠⣴⣦⣶⣦⣼⣶⣤⣤⣀⣀⣀⣀⣠⣤⣤⣴⣶⣷⣦
Trend                 │   250│     -1.00│     +1.00│     -1.00│     +1.00 ⣀⣇⣸⣀⣿⣸⣿⣿⣿⣿⣿⣸⣇⣇⣸⣿⣸⣀⣀⣇
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  250 bars
```

### 6. Stochastic Oscillator

`ta.stoch` returns the `%K` line directly; smooth it with `ta.ema` to get `%D`.

```
indicator("Stochastic")
k = ta.stoch(close, high, low, 14)
d = ta.ema(k, 3)
plot(k,    "K")
plot(d,    "D")
plot(80.0, "OB")
plot(20.0, "OS")
```

```bash
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-01-01 \
  --script 'indicator("Stoch")
k=ta.stoch(close,high,low,14) d=ta.ema(k,3)
plot(k,"K") plot(d,"D") plot(80.0,"OB") plot(20.0,"OS")'
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
K                     │   237│    +74.98│    +72.34│     +0.60│   +100.00 ⠀⢠⣾⣀⣤⣰⣶⣿⣿⣿⣿⣶⣧⣆⣶⣧⣼⣤⣴⣴
D                     │   237│    +74.98│    +76.53│     +8.25│    +97.74 ⠀⢠⣼⣀⣴⣰⣴⣿⣷⣿⣿⣾⣷⣆⣶⣷⣴⣤⣤⣴
OB                    │   250│    +80.00│    +80.00│    +80.00│    +80.00 ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀
OS                    │   250│    +20.00│    +20.00│    +20.00│    +20.00 ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀
────────────────────────────────────────────────────────────────────────────────
  4 series  ·  250 bars
```

---

## Backtesting

Use `strategy()` instead of `indicator()`. The engine simulates order fills bar-by-bar and returns a full performance report via `--format json`.

Key report fields (`report_json → .performanceAll`): `netProfitPercent`, `buyHoldReturnPercent`, `sharpeRatio`, `sortinoRatio`, `profitFactor`, `totalClosedTrades`, `percentProfitable`, `maxDrawdownPercent`.

### Backtest 1 — MACD + SAR Trend-Following

Enter long when MACD crosses above signal **and** price is above SAR. Exit on MACD cross-under.

```
strategy("MACD+SAR Trend", initial_capital=10000,
         default_qty_type=strategy.percent_of_equity,
         default_qty_value=100)
[macd, sig, _] = ta.macd(close, 12, 26, 9)
sar = ta.sar(0.02, 0.02, 0.2)
if ta.crossover(macd, sig) and close > sar
    strategy.entry("Long", strategy.long)
if ta.crossunder(macd, sig)
    strategy.close("Long")
```

```bash
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 --format json \
  --script 'strategy("MACD+SAR",initial_capital=10000,default_qty_type=strategy.percent_of_equity,default_qty_value=100)
[m,s,_]=ta.macd(close,12,26,9)
sar=ta.sar(0.02,0.02,0.2)
if ta.crossover(m,s) and close>sar
    strategy.entry("Long",strategy.long)
if ta.crossunder(m,s)
    strategy.close("Long")' | jq '.data.report_json | fromjson | .performanceAll |
  {netProfitPercent, buyHoldReturnPercent, sharpeRatio, profitFactor,
   totalClosedTrades, percentProfitable, maxDrawdownPercent}'
```

**Output:**

```json
{
  "netProfitPercent": -24.178,
  "buyHoldReturnPercent": 51.626,
  "sharpeRatio": -0.194,
  "profitFactor": 0.563,
  "totalClosedTrades": 10,
  "percentProfitable": 30,
  "maxDrawdownPercent": 42.588
}
```

### Backtest 2 — RSI Mean Reversion

Buy when RSI dips below 30 (oversold); close when RSI recovers above 55. Works well on broad index ETFs.

```
strategy("RSI Mean Reversion", initial_capital=10000,
         default_qty_type=strategy.percent_of_equity,
         default_qty_value=100)
rsi = ta.rsi(close, 14)
if rsi < 30
    strategy.entry("Long", strategy.long)
if rsi > 55
    strategy.close("Long")
```

```bash
longbridge quant run QQQ.US --start 2022-01-01 --end 2024-12-31 --format json \
  --script 'strategy("RSI MR",initial_capital=10000,default_qty_type=strategy.percent_of_equity,default_qty_value=100)
rsi=ta.rsi(close,14)
if rsi<30
    strategy.entry("Long",strategy.long)
if rsi>55
    strategy.close("Long")' | jq '.data.report_json | fromjson | .performanceAll |
  {netProfitPercent, buyHoldReturnPercent, totalClosedTrades, percentProfitable, maxDrawdownPercent}'
```

**Output:**

```json
{
  "netProfitPercent": -5.669,
  "buyHoldReturnPercent": 30.953,
  "totalClosedTrades": 3,
  "percentProfitable": 66.667,
  "maxDrawdownPercent": 18.818
}
```

---

## Screening

Run the same `indicator()` script across multiple symbols and check the `Last` value — `1.0` means the condition fired on the most recent bar.

```bash
SCRIPT='...'
for sym in NVDA.US TSLA.US AAPL.US; do
  val=$(longbridge quant run $sym --start 2024-10-01 --end 2024-12-31 \
    --script "$SCRIPT" 2>&1 | \
    python3 -c "import sys,re; c=re.sub(r'\x1b\[[0-9;]*m','',sys.stdin.read()); \
    m=re.search(r'Signal\s.*?([01]\.00)',c); print(m.group(1) if m else '?')")
  echo "$sym: $val"
done
```

### Screen 1 — MACD + SAR Bullish Alignment

Both momentum (MACD > signal) and trend (price above SAR) agree.

```
indicator("MACD+SAR Bullish")
[macd, sig, _] = ta.macd(close, 12, 26, 9)
sar = ta.sar(0.02, 0.02, 0.2)
plot(macd > sig and close > sar ? 1.0 : 0.0, "Signal")
```

```bash
SCRIPT='indicator("Screen")
[m,s,_]=ta.macd(close,12,26,9) sar=ta.sar(0.02,0.02,0.2)
plot(m>s and close>sar ? 1.0:0.0,"Signal")'

for sym in NVDA.US QCOM.US AAPL.US TSLA.US AMZN.US META.US MSFT.US AMD.US; do
  val=$(longbridge quant run $sym --start 2024-10-01 --end 2024-12-31 \
    --script "$SCRIPT" 2>&1 | \
    python3 -c "import sys,re; c=re.sub(r'\x1b\[[0-9;]*m','',sys.stdin.read()); \
    m=re.search(r'Signal\s.*?([01]\.00)',c); print(m.group(1) if m else '?')")
  echo "$sym: $([ "$val" = "1.00" ] && echo BULLISH || echo bearish)"
done
```

### Screen 2 — RSI Oversold Bounce

RSI recovering from below 35 — momentum returning after a pullback.

```
indicator("RSI Oversold")
rsi = ta.rsi(close, 14)
plot(ta.lowest(rsi, 5) < 35 and rsi > rsi[1] and rsi > 35 ? 1.0 : 0.0, "Signal")
```

```bash
SCRIPT='indicator("RSI OS")
rsi=ta.rsi(close,14)
plot(ta.lowest(rsi,5)<35 and rsi>rsi[1] and rsi>35 ? 1.0:0.0,"Signal")'

for sym in NVDA.US QCOM.US AAPL.US TSLA.US 700.HK 9988.HK; do
  val=$(longbridge quant run $sym --start 2024-10-01 --end 2024-12-31 \
    --script "$SCRIPT" 2>&1 | \
    python3 -c "import sys,re; c=re.sub(r'\x1b\[[0-9;]*m','',sys.stdin.read()); \
    m=re.search(r'Signal\s.*?([01]\.00)',c); print(m.group(1) if m else '?')")
  echo "$sym: $val"
done
```

### Screen 3 — Golden Cross (50 MA / 200 MA)

The 50-day SMA crossing above the 200-day SMA — a widely-watched long-term trend signal.

```
indicator("Golden Cross")
plot(ta.crossover(ta.sma(close, 50), ta.sma(close, 200)) ? 1.0 : 0.0, "GoldenCross")
```

```bash
SCRIPT='indicator("GoldenCross")
plot(ta.crossover(ta.sma(close,50),ta.sma(close,200))?1.0:0.0,"GoldenCross")'

for sym in NVDA.US MSFT.US AAPL.US AMZN.US GOOGL.US META.US TSLA.US; do
  val=$(longbridge quant run $sym --start 2023-01-01 --end 2024-12-31 \
    --script "$SCRIPT" 2>&1 | \
    python3 -c "import sys,re; c=re.sub(r'\x1b\[[0-9;]*m','',sys.stdin.read()); \
    m=re.search(r'GoldenCross\s.*?([01]\.00)',c); print(m.group(1) if m else '?')")
  echo "$sym: $([ "$val" = "1.00" ] && echo 'GOLDEN CROSS' || echo '-')"
done
```

---

## Output Formats

| Format  | Best for |
| ------- | -------- |
| `table` (default) | Human review — sparkline, First/Last/Min/Max per series |
| `json`  | Scripting — parse `report_json` for backtest metrics |

For backtests, extract results from `report_json`:

```bash
longbridge quant run TSLA.US --start 2023-01-01 --end 2024-12-31 \
  --format json --script '...' | \
  jq '.data.report_json | fromjson | .performanceAll'
```

## Supported Periods

| Flag    | Description          |
| ------- | -------------------- |
| `day`   | Daily bars (default) |
| `week`  | Weekly bars          |
| `month` | Monthly bars         |
| `year`  | Yearly bars          |
| `1h`    | 1-hour bars          |
| `30m`   | 30-minute bars       |
| `15m`   | 15-minute bars       |
| `5m`    | 5-minute bars        |
| `1m`    | 1-minute bars        |

Intraday periods accept datetime: `--start "2024-01-02 09:30" --end "2024-01-02 16:00"`.
