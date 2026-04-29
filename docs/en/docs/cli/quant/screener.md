---
title: 'Screener'
sidebar_label: 'Screener'
sidebar_position: 4
---

# Screening

Use `indicator()` with a boolean signal to screen stocks. Plot `1.0` when the condition is met and `0.0` otherwise — check the `Last` value in JSON output to see whether the most recent bar passes the screen.

## Pattern

```pine
indicator()
signal = <your condition>
plot(signal ? 1.0 : 0.0, "Signal")
```

Parse the last value with `--format json`:

```bash
longbridge quant run SYMBOL.US --start ... --end ... \
  --format json --script '...' | \
  jq '.data.series[] | select(.name == "Signal") | .values[-1]'
```

`1` means the condition is active on the most recent bar.

## RSI Oversold Screen

Find stocks where RSI(14) is currently below 35.

```bash
longbridge quant run AAPL.US \
  --start 2026-01-01 --end 2026-04-28 \
  --format json \
  --script '
indicator()
r = ta.rsi(close, 14)
plot(r < 35 ? 1.0 : 0.0, "Oversold")
' | jq '.data.series[] | select(.name == "Oversold") | .values[-1]'
```

## EMA Bullish Alignment Screen

All three EMAs stacked bullishly: EMA8 > EMA21 > EMA55.

```bash
longbridge quant run NVDA.US \
  --start 2026-01-01 --end 2026-04-28 \
  --format json \
  --script '
indicator()
e8  = ta.ema(close, 8)
e21 = ta.ema(close, 21)
e55 = ta.ema(close, 55)
bullish = e8 > e21 and e21 > e55
plot(bullish ? 1.0 : 0.0, "Aligned")
' | jq '.data.series[] | select(.name == "Aligned") | .values[-1]'
```

## Bollinger Band Squeeze Screen

Detect when the band width (Upper − Lower) is at its 20-bar minimum — a classic volatility squeeze signal.

```bash
longbridge quant run TSLA.US \
  --start 2026-01-01 --end 2026-04-28 \
  --format json \
  --script '
indicator()
length = input.int(20)
mult   = input.float(2.0)
basis  = ta.sma(close, length)
dev    = mult * ta.stdev(close, length)
bw     = (basis + dev) - (basis - dev)
squeeze = bw <= ta.lowest(bw, 20)
plot(squeeze ? 1.0 : 0.0, "Squeeze")
' | jq '.data.series[] | select(.name == "Squeeze") | .values[-1]'
```

## Batch Screening

Combine the CLI with a shell loop to screen multiple symbols at once:

```bash
symbols=(AAPL.US NVDA.US TSLA.US MSFT.US META.US AMZN.US)
script='
indicator()
r = ta.rsi(close, 14)
plot(r < 35 ? 1.0 : 0.0, "Signal")
'

for sym in "${symbols[@]}"; do
  last=$(longbridge quant run "$sym" \
    --start 2026-01-01 --end 2026-04-28 \
    --format json \
    --script "$script" 2>/dev/null | \
    jq -r '.data.series[] | select(.name == "Signal") | .values[-1]')

  [ "$last" = "1" ] && echo "$sym PASSED"
done
```
