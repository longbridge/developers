---
title: 'Indicator'
sidebar_label: 'indicator'
sidebar_position: 2
slug: '/cli/quant/indicator'
---

# Indicators

Run any indicator script over historical K-line data with `longbridge quant run`. Each `plot()` call in your script becomes a named series in the output.

## MACD

<QuantChart type="macd" />

```bash
longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28 \
  --script '
indicator()
fast = input.int(12)
slow = input.int(26)
sig  = input.int(9)
[macdLine, signalLine, hist] = ta.macd(close, fast, slow, sig)
plot(macdLine,   "MACD")
plot(signalLine, "Signal")
plot(hist,       "Histogram")
'
```

## RSI

<QuantChart type="rsi" />

```bash
longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28 \
  --script '
indicator()
period = input.int(14)
plot(ta.rsi(close, period), "RSI")
'
```

## Bollinger Bands

<QuantChart type="bb" />

```bash
longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28 \
  --script '
indicator()
length = input.int(20)
mult   = input.float(2.0)
basis  = ta.sma(close, length)
dev    = mult * ta.stdev(close, length)
plot(basis + dev, "Upper")
plot(basis,       "Mid")
plot(basis - dev, "Lower")
'
```

## EMA Ribbon

<QuantChart type="ema" />

```bash
longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28 \
  --script '
indicator()
plot(ta.ema(close, 8),  "EMA8")
plot(ta.ema(close, 21), "EMA21")
plot(ta.ema(close, 55), "EMA55")
'
```

## Stochastic

<QuantChart type="stoch" />

```bash
longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28 \
  --script '
indicator()
k = ta.stoch(close, high, low, 14)
d = ta.ema(k, 3)
plot(k, "K")
plot(d, "D")
'
```

> **Note** — `ta.stoch` returns a single `%K` value. Compute `%D` by applying `ta.ema(k, 3)` manually.

## Parabolic SAR with ATR Band

```bash
longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28 \
  --script '
indicator()
sarVal = ta.sar(0.02, 0.02, 0.2)
atrVal = ta.atr(14)
plot(sarVal,           "SAR")
plot(close + atrVal,   "Upper ATR")
plot(close - atrVal,   "Lower ATR")
'
```

## Piping a Script File

For longer scripts, save to a `.pine` file and pipe it in:

```bash
cat my_indicator.pine | longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28
```

## Tunable Parameters with `--input`

Override default `input.*()` values at runtime without editing the script:

```bash
longbridge quant run NVDA.US --start 2026-01-02 --end 2026-04-28 \
  --input '[21]' \
  --script '
indicator()
period = input.int(14)
plot(ta.rsi(close, period), "RSI")
'
```

Parameters are matched positionally: `[21]` replaces the first `input.*()` call.
