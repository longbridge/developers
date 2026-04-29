---
title: '选股'
sidebar_label: '选股'
sidebar_position: 4
---

# 选股

选股的目标是从一批标的中找出最近一根 K 线满足特定技术条件的股票。基本流程：

1. 编写一个 `indicator()` 脚本：条件成立时 `plot(1.0, "Signal")`，否则 `plot(0.0, "Signal")`
2. 对每只股票执行，加 `--format json`
3. 收集信号最后一个值为 `1` 的股票

```bash
last=$(longbridge quant run "$sym" --start ... --end ... \
  --format json --script "$script" 2>/dev/null | \
  jq -r '.data.series[] | select(.name == "Signal") | .values[-1]')
[ "$last" = "1" ] && echo "$sym"
```

筛选只在 `symbols` 数组中列出的股票池内进行，按需修改这个列表即可。

## RSI 超卖

筛选最新一根 K 线 RSI(14) 低于 35 的股票。

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

## EMA 多头排列

筛选三条均线形成多头排列（EMA8 > EMA21 > EMA55）的股票。

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

## 布林带收窄

筛选带宽（上轨 − 下轨）处于 20 根 K 线最低点的股票——经典的波动率收缩信号。

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
