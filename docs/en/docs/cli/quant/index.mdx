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
  [--language navi|pine] # `navi` (default), or `pine` for PineScript compatibility
  [--format table|json]  # table = human chart (default); json = machine
```

Pipe a file instead of using `--script`:

```bash
cat strategy.nv | longbridge quant run TSLA.US --start 2024-01-01 --end 2024-12-31
```

## Script Language — Navi

Scripts are written in **Navi**, the default language for `quant run`. PineScript is also supported for compatibility via `--language pine`.

[navi-lang.org](https://navi-lang.org) is the authoritative reference for Navi's syntax and standard library — look up exact names and signatures there, since the API evolves. Machine-readable versions: [`llms-full.txt`](https://navi-lang.org/llms-full.txt) (everything in one file) and [`llms.txt`](https://navi-lang.org/llms.txt) (per-page index).

### Script Types

Every Navi script must begin with one of these declarations — it determines the execution mode:

| Declaration | Purpose |
| ----------- | ------- |
| `indicator()` | Plot indicators, compute screener signals |
| `strategy()` | Backtest with entry / exit orders |
| `library()` | Export reusable helper functions |

### Core Concepts

**Time series** — every variable is a bar-by-bar stream. `close[1]` is the previous bar's close; `close[N]` goes N bars back. Most `ta.*` outputs are also series.

**Per-bar values and state** — `let` recomputes each bar; `var` initializes once and carries the value across bars:

```nv
var peak: series float = na;
peak = na(peak) ? high : math.max(peak, high);
```

**Inputs** — expose tunable parameters. Named arguments use `:`:

```nv
let len = input.int(14, "Length", minval: 1);
let src = input.source(close, "Source");
let mult = input.float(2.0, "Multiplier");
```

**Collections** — `Array<T>`, `Map<K, V>`, and `Matrix<T>` are available for advanced per-bar computation.

### Built-in Libraries

Functions are `snake_case`; types and enums are `PascalCase`.

| Namespace | Purpose |
| --------- | ------- |
| `ta.*` | Technical analysis — moving averages, oscillators, bands, crosses |
| `math.*` | Arithmetic and numeric helpers |
| `String` / `Array` / `Map` / `Matrix` | Text and collection types |
| `strategy.*` | Backtest orders and position management |

See the [standard library reference](https://navi-lang.org/api/stdlib/) for the full list of functions and their signatures.

### Outputs

| Expression | Effect |
| ---------- | ------ |
| `plot(series, "name")` | Named series — shown in the results table / sparkline |
| `plot_shape(cond, ...)` | Mark a signal shape on a specific bar |
| `bg_color(cond ? Color.GREEN : na)` | Highlight bar background |
| `strategy.entry("L", Direction.Long)` | Place a backtest long entry |
| `strategy.exit("L", stop: ..., limit: ...)` | Close with stop / take-profit |

### Quick Example

```nv
indicator("MA Cross", overlay: true);

let fast_len = input.int(10, "Fast", minval: 1);
let slow_len = input.int(20, "Slow", minval: 1);

let fast = ta.ema(close, fast_len);
let slow = ta.ema(close, slow_len);

plot(fast, "Fast", color: Color.ORANGE);
plot(slow, "Slow", color: Color.BLUE);

plot_shape(
    ta.cross_over(fast, slow),
    title: "Buy",
    style: Shape.TriangleUp,
    location: Location.BelowBar,
    color: Color.GREEN
);
plot_shape(
    ta.cross_under(fast, slow),
    title: "Sell",
    style: Shape.TriangleDown,
    location: Location.AboveBar,
    color: Color.RED
);
```

### Validating scripts locally

Install the [Navi CLI](https://navi-lang.org/docs/install.md) and lint before sending a script to the server — the API reports script errors only as an opaque error code:

```bash
navi lint my_indicator.nv
```

## Output

**Table format** (default) — human-readable chart with sparklines:

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

**JSON format** — for scripting and backtests:

```bash
cat strategy.nv | longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json | \
  jq '.report_json | fromjson | .performanceAll'
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
