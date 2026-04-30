---
title: '選股'
sidebar_label: '選股'
sidebar_position: 4
---

# 選股

選股的目標是從一批標的中找出最近一根 K 線滿足特定技術條件的股票。基本流程：

1. 編寫一個 `indicator()` 腳本：條件成立時 `plot(1.0, "Signal")`，否則 `plot(0.0, "Signal")`
2. 對每隻股票執行，加 `--format json`
3. 收集信號最後一個值為 `1` 的股票

```bash
last=$(longbridge quant run "$sym" --start ... --end ... \
  --format json --script "$script" 2>/dev/null | \
  jq -r '.data.series[] | select(.name == "Signal") | .values[-1]')
[ "$last" = "1" ] && echo "$sym"
```

篩選只在 `symbols` 數組中列出的股票池內進行，按需修改這個列表即可。

## RSI 超賣

篩選最新一根 K 線 RSI(14) 低於 35 的股票。

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

## EMA 多頭排列

篩選三條均線形成多頭排列（EMA8 > EMA21 > EMA55）的股票。

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

## 布林帶收窄

篩選帶寬（上軌 − 下軌）處於 20 根 K 線最低點的股票——經典的波動率收縮信號。

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
