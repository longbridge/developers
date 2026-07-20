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
  [--language navi|pine]    # `navi` (default), or `pine` for PineScript compatibility
  [--format table|json]     # table = human chart (default); json = machine
```

```bash
# Pipe from a file
cat strategy.nv | longbridge quant run TSLA.US --start 2024-01-01 --end 2024-12-31
```

## Script Language (Navi)

Scripts are written in **Navi**, a bar-by-bar series language: every value is a time-series, `close[1]` is the previous bar, and a script starts with `indicator()`, `strategy()`, or `library()`.

**<https://navi-lang.org> is the authoritative reference** for syntax and the standard library (`ta.*`, `input.*`, `plot`, `strategy.*`, …). Its API evolves — look names and signatures up there rather than relying on the examples below. Machine-readable: `https://navi-lang.org/llms-full.txt`; per-page index: `https://navi-lang.org/llms.txt`.

### Validating scripts locally

Install the Navi CLI (<https://navi-lang.org/docs/install.md>) and lint before sending a script to the server — the API reports script errors only as an opaque error code, so local linting is much faster to iterate on:

```bash
navi lint my_indicator.nv    # syntax, types, imports, formatting
navi fmt  my_indicator.nv    # canonical formatting, one file per call
```

PineScript is also supported via `--language pine`; any unrecognised value falls back to Navi.

---

## Indicators

Each example runs against NVDA.US. The output table shows First/Last/Min/Max and a Unicode sparkline per series.

### 1. MACD

```nv
indicator("MACD");

let (macd_line, signal_line, hist) = ta.macd(close, 12, 26, 9);

plot(macd_line, "MACD");
plot(signal_line, "Signal");
plot(hist, "Histogram");
```

```bash
cat macd.nv | longbridge quant run NVDA.US --start 2026-01-01 --end 2026-04-28
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
MACD                  │    80│     +0.00│     +7.55│     -4.04│     +7.55 ⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣀⣀⣠⣴⣶⣿
Signal                │    80│     +0.00│     +5.16│     -2.96│     +5.16 ⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣀⣀⣀⣠⣴⣾
Histogram             │    80│     +0.00│     +2.39│     -1.50│     +3.01 ⣤⣤⣤⣤⣤⣦⣠⣤⣤⣦⣄⣠⣤⣄⣀⣠⣴⣾⣿⣷
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  80 bars
```

### 2. RSI with Overbought / Oversold Bands

```nv
indicator("RSI");

let length = input.int(14, "Length", minval: 1);
let rsi = ta.rsi(close, length);

plot(rsi, "RSI");
plot(70.0, "OB");
plot(30.0, "OS");
```

```bash
cat rsi.nv | longbridge quant run AAPL.US --start 2025-01-01 --end 2026-01-31
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
RSI                   │   270│     +0.00│    +48.44│     +0.00│    +75.25 ⢀⣴⣶⣦⣶⣶⣶⣶⣶⣶⣶⣿⣿⣾⣷⣾⣷⣷⣶⣤
OB                    │   271│    +70.00│    +70.00│    +70.00│    +70.00 ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀
OS                    │   271│    +30.00│    +30.00│    +30.00│    +30.00 ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  271 bars
```

### 3. Bollinger Bands

`ta.bb` returns basis, upper, and lower as a tuple — no need to build the bands from `ta.sma` and `ta.stdev` by hand.

```nv
indicator("Bollinger Bands", overlay: true);

let length = input.int(20, "Length", minval: 1);
let mult = input.float(2.0, "Mult");

let (basis, upper, lower) = ta.bb(close, length, mult);

plot(upper, "Upper");
plot(basis, "Mid");
plot(lower, "Lower");
```

```bash
cat bb.nv | longbridge quant run NVDA.US --start 2025-01-01 --end 2026-01-01
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
Upper                 │   232│   +152.20│   +192.98│   +116.91│   +209.70 ⠀⠀⣤⣤⣄⣀⣀⣠⣤⣤⣴⣶⣶⣶⣶⣶⣾⣿⣿⣶
Mid                   │   232│   +136.23│   +182.28│   +105.09│   +193.15 ⠀⠀⣤⣤⣄⣀⣀⣀⣤⣤⣴⣶⣶⣷⣶⣾⣿⣿⣿⣿
Lower                 │   232│   +120.26│   +171.57│    +92.44│   +177.74 ⠀⠀⣤⣤⣀⣀⣀⣀⣠⣤⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  251 bars
```

### 4. EMA Ribbon

Three EMAs that visually show trend phase and momentum alignment.

```nv
indicator("EMA Ribbon", overlay: true);

plot(ta.ema(close, 8), "EMA8");
plot(ta.ema(close, 21), "EMA21");
plot(ta.ema(close, 55), "EMA55");
```

```bash
cat ema_ribbon.nv | longbridge quant run NVDA.US --start 2026-01-01 --end 2026-04-28
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
EMA8                  │    80│   +186.27│   +203.72│   +172.25│   +203.72 ⣤⣤⣤⣤⣤⣦⣤⣤⣤⣶⣤⣤⣤⣤⣄⣀⣀⣤⣶⣾
EMA21                 │    80│   +186.27│   +194.38│   +176.91│   +194.38 ⣶⣶⣶⣤⣴⣶⣤⣤⣴⣶⣦⣤⣤⣤⣄⣀⣀⣠⣴⣾
EMA55                 │    80│   +186.27│   +187.92│   +180.75│   +187.92 ⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣦⣤⣀⣀⣠⣴⣾
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  80 bars
```

### 5. Parabolic SAR + ATR Volatility

SAR tracks trend direction; ATR quantifies current volatility. `Trend` is `+1.0` (bullish) or `-1.0` (bearish).

```nv
indicator("SAR + ATR");

let sar = ta.sar(0.02, 0.02, 0.2);
let atr = ta.atr(14);
let trend = close > sar ? 1.0 : -1.0;

plot(sar, "SAR");
plot(atr, "ATR");
plot(trend, "Trend");
```

```bash
cat sar_atr.nv | longbridge quant run NVDA.US --start 2025-01-01 --end 2026-01-01
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
SAR                   │   250│   +133.63│   +173.34│    +86.50│   +211.92 ⢰⣤⣤⣤⣠⣄⣀⣠⣤⣤⣶⣶⣶⣶⣶⣶⣷⣿⣷⣶
ATR                   │   251│     +4.23│     +5.28│     +3.73│     +8.58 ⣠⣴⣦⣴⣦⣼⣶⣤⣤⣀⣀⣀⣀⣠⣤⣤⣴⣶⣷⣦
Trend                 │   251│     -1.00│     +1.00│     -1.00│     +1.00 ⣀⣀⣸⣀⣿⣸⣿⣿⣿⣿⣿⣸⣇⣇⣸⣿⣸⣀⣀⣇
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  251 bars
```

### 6. Stochastic Oscillator

`ta.stoch` returns the `%K` line directly; smooth it with `ta.ema` to get `%D`.

```nv
indicator("Stochastic");

let k = ta.stoch(close, high, low, 14);
let d = ta.ema(k, 3);

plot(k, "K");
plot(d, "D");
plot(80.0, "OB");
plot(20.0, "OS");
```

```bash
cat stoch.nv | longbridge quant run NVDA.US --start 2025-01-01 --end 2026-01-01
```

**Output:**

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
K                     │   238│    +74.34│    +72.34│     +0.60│   +100.00 ⠀⢠⣼⣄⣼⣴⣴⣿⣷⣾⣷⣶⣷⣆⣶⣧⣼⣤⣴⣴
D                     │   238│    +74.34│    +76.53│     +8.25│    +97.74 ⠀⢠⣼⣄⣼⣴⣴⣿⣷⣿⣿⣾⣷⣆⣶⣷⣴⣤⣤⣴
OB                    │   251│    +80.00│    +80.00│    +80.00│    +80.00 ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀
OS                    │   251│    +20.00│    +20.00│    +20.00│    +20.00 ⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀
────────────────────────────────────────────────────────────────────────────────
  4 series  ·  251 bars
```

---

## Backtesting

Use `strategy()` instead of `indicator()`. The engine simulates order fills bar-by-bar and returns a full performance report via `--format json`.

Key report fields (`report_json → .performanceAll`): `netProfitPercent`, `buyHoldReturnPercent`, `sharpeRatio`, `sortinoRatio`, `profitFactor`, `totalClosedTrades`, `percentProfitable`, `maxDrawdownPercent`.

### Backtest 1 — MACD + SAR Trend-Following

Enter long when MACD crosses above signal **and** price is above SAR. Exit on MACD cross-under.

```nv
strategy(
    "MACD+SAR Trend",
    overlay: true,
    initial_capital: 10000,
    default_qty_type: DefaultQtyType.PercentOfEquity,
    default_qty_value: 100
);

let (macd_line, signal_line, _) = ta.macd(close, 12, 26, 9);
let sar = ta.sar(0.02, 0.02, 0.2);

if ta.cross_over(macd_line, signal_line) and close > sar {
    strategy.entry("Long", Direction.Long);
}
if ta.cross_under(macd_line, signal_line) {
    strategy.close("Long");
}
```

```bash
cat macd_sar_strategy.nv | \
  longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 --format json | \
  jq '.report_json | fromjson | .performanceAll |
  {netProfitPercent, buyHoldReturnPercent, sharpeRatio, profitFactor,
   totalClosedTrades, percentProfitable, maxDrawdownPercent}'
```

**Output:**

```json
{
  "netProfitPercent": -15.6374,
  "buyHoldReturnPercent": 56.1645,
  "sharpeRatio": -0.1586,
  "profitFactor": 0.6887,
  "totalClosedTrades": 10,
  "percentProfitable": 30.0,
  "maxDrawdownPercent": 36.04
}
```

### Backtest 2 — RSI Mean Reversion

Buy when RSI dips below 30 (oversold); close when RSI recovers above 55. Works well on broad index ETFs.

```nv
strategy(
    "RSI Mean Reversion",
    overlay: true,
    initial_capital: 10000,
    default_qty_type: DefaultQtyType.PercentOfEquity,
    default_qty_value: 100
);

let rsi = ta.rsi(close, 14);

if rsi < 30.0 {
    strategy.entry("Long", Direction.Long);
}
if rsi > 55.0 {
    strategy.close("Long");
}
```

```bash
cat rsi_mr_strategy.nv | \
  longbridge quant run QQQ.US --start 2022-01-01 --end 2024-12-31 --format json | \
  jq '.report_json | fromjson | .performanceAll |
  {netProfitPercent, buyHoldReturnPercent, totalClosedTrades, percentProfitable, maxDrawdownPercent}'
```

**Output:**

```json
{
  "netProfitPercent": -2.7374,
  "buyHoldReturnPercent": 32.2138,
  "totalClosedTrades": 3,
  "percentProfitable": 66.6667,
  "maxDrawdownPercent": 16.432
}
```

---

## Screening

Run the same `indicator()` script across multiple symbols and check the `Last` value — `1.0` means the condition fired on the most recent bar.

Note that `--format json` sets `exclude_chart`, so the JSON response carries no series values — screening has to read the `Last` column out of the default table output.

```bash
for sym in NVDA.US TSLA.US AAPL.US; do
  val=$(cat screen.nv | longbridge quant run $sym \
    --start 2024-10-01 --end 2024-12-31 2>&1 | \
    python3 -c "import sys,re; c=re.sub(r'\x1b\[[0-9;]*m','',sys.stdin.read()); \
    m=re.search(r'Signal\s.*?([01]\.00)',c); print(m.group(1) if m else '?')")
  echo "$sym: $val"
done
```

### Screen 1 — MACD + SAR Bullish Alignment

Both momentum (MACD > signal) and trend (price above SAR) agree.

```nv
indicator("MACD+SAR Bullish");

let (macd_line, signal_line, _) = ta.macd(close, 12, 26, 9);
let sar = ta.sar(0.02, 0.02, 0.2);

plot(macd_line > signal_line and close > sar ? 1.0 : 0.0, "Signal");
```

```bash
for sym in NVDA.US QCOM.US AAPL.US TSLA.US AMZN.US META.US MSFT.US AMD.US; do
  val=$(cat macd_sar_screen.nv | longbridge quant run $sym \
    --start 2024-10-01 --end 2024-12-31 2>&1 | \
    python3 -c "import sys,re; c=re.sub(r'\x1b\[[0-9;]*m','',sys.stdin.read()); \
    m=re.search(r'Signal\s.*?([01]\.00)',c); print(m.group(1) if m else '?')")
  echo "$sym: $([ "$val" = "1.00" ] && echo BULLISH || echo bearish)"
done
```

### Screen 2 — RSI Oversold Bounce

RSI recovering from below 35 — momentum returning after a pullback.

```nv
indicator("RSI Oversold");

let rsi = ta.rsi(close, 14);

plot(ta.lowest(rsi, 5) < 35.0 and rsi > rsi[1] and rsi > 35.0 ? 1.0 : 0.0, "Signal");
```

```bash
for sym in NVDA.US QCOM.US AAPL.US TSLA.US 700.HK 9988.HK; do
  val=$(cat rsi_oversold_screen.nv | longbridge quant run $sym \
    --start 2024-10-01 --end 2024-12-31 2>&1 | \
    python3 -c "import sys,re; c=re.sub(r'\x1b\[[0-9;]*m','',sys.stdin.read()); \
    m=re.search(r'Signal\s.*?([01]\.00)',c); print(m.group(1) if m else '?')")
  echo "$sym: $val"
done
```

### Screen 3 — Golden Cross (50 MA / 200 MA)

The 50-day SMA crossing above the 200-day SMA — a widely-watched long-term trend signal.

```nv
indicator("Golden Cross");

plot(
    ta.cross_over(ta.sma(close, 50), ta.sma(close, 200)) ? 1.0 : 0.0,
    "GoldenCross"
);
```

```bash
for sym in NVDA.US MSFT.US AAPL.US AMZN.US GOOGL.US META.US TSLA.US; do
  val=$(cat golden_cross.nv | longbridge quant run $sym \
    --start 2023-01-01 --end 2024-12-31 2>&1 | \
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
cat strategy.nv | longbridge quant run TSLA.US --start 2023-01-01 --end 2024-12-31 \
  --format json | \
  jq '.report_json | fromjson | .performanceAll'
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
