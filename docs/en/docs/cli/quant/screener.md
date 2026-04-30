---
title: 'Stock Screening'
sidebar_label: 'Stock Screening'
sidebar_position: 4
---

# Stock Screening

Stock screening finds symbols that satisfy a set of technical conditions on the most recent bar. The workflow is:

1. Write an `indicator()` script that plots `1.0` when your condition is met and `0.0` otherwise
2. Run it against each symbol with `--format json`
3. Collect symbols where the last signal value is `1`

```bash
last=$(longbridge quant run "$sym" --start ... --end ... \
  --format json --script "$script" 2>/dev/null | \
  jq -r '.data.series[] | select(.name == "Signal") | .values[-1]')
[ "$last" = "1" ] && echo "$sym"
```

The screening runs only against the symbols you explicitly list. Define your watchlist in the `symbols` array and adjust it to suit your needs.

## RSI Oversold

Screen for stocks where RSI(14) closed below 35 on the latest bar.

```bash
symbols=(AAPL.US NVDA.US TSLA.US MSFT.US META.US AMZN.US GOOGL.US)
script='
indicator()
r = ta.rsi(close, 14)
plot(r < 35 ? 1.0 : 0.0, "Signal")
'

for sym in "${symbols[@]}"; do
  last=$(longbridge quant run "$sym" \
    --start 2026-01-01 --end 2026-04-28 \
    --format json --script "$script" 2>/dev/null | \
    jq -r '.data.series[] | select(.name == "Signal") | .values[-1]')
  [ "$last" = "1" ] && echo "$sym"
done
```

## EMA Bullish Alignment

Screen for stocks with all three EMAs stacked bullishly: EMA8 > EMA21 > EMA55.

```bash
symbols=(AAPL.US NVDA.US TSLA.US MSFT.US META.US AMZN.US GOOGL.US)
script='
indicator()
e8  = ta.ema(close, 8)
e21 = ta.ema(close, 21)
e55 = ta.ema(close, 55)
plot(e8 > e21 and e21 > e55 ? 1.0 : 0.0, "Signal")
'

for sym in "${symbols[@]}"; do
  last=$(longbridge quant run "$sym" \
    --start 2026-01-01 --end 2026-04-28 \
    --format json --script "$script" 2>/dev/null | \
    jq -r '.data.series[] | select(.name == "Signal") | .values[-1]')
  [ "$last" = "1" ] && echo "$sym"
done
```

## Bollinger Band Squeeze

Screen for stocks where the band width (Upper − Lower) hit its 20-bar minimum — a classic volatility contraction signal.

```bash
symbols=(AAPL.US NVDA.US TSLA.US MSFT.US META.US AMZN.US GOOGL.US)
script='
indicator()
length = input.int(20)
mult   = input.float(2.0)
basis  = ta.sma(close, length)
dev    = mult * ta.stdev(close, length)
bw     = (basis + dev) - (basis - dev)
plot(bw <= ta.lowest(bw, 20) ? 1.0 : 0.0, "Signal")
'

for sym in "${symbols[@]}"; do
  last=$(longbridge quant run "$sym" \
    --start 2026-01-01 --end 2026-04-28 \
    --format json --script "$script" 2>/dev/null | \
    jq -r '.data.series[] | select(.name == "Signal") | .values[-1]')
  [ "$last" = "1" ] && echo "$sym"
done
```
