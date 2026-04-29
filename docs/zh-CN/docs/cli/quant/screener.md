---
title: 'Screener'
sidebar_label: 'Screener'
sidebar_position: 4
---

# 选股筛选

使用带布尔信号的 `indicator()` 进行选股。条件成立时绘制 `1.0`，否则绘制 `0.0` — 通过 JSON 输出的最后一个值判断最近一根 K 线是否满足条件。

## 基本模式

```pine
indicator()
signal = <你的条件>
plot(signal ? 1.0 : 0.0, "Signal")
```

配合 `--format json` 读取最新值：

```bash
longbridge quant run SYMBOL.US --start ... --end ... \
  --format json --script '...' | \
  jq '.data.series[] | select(.name == "Signal") | .values[-1]'
```

返回 `1` 表示最新一根 K 线满足条件。

## RSI 超卖筛选

找出 RSI(14) 当前低于 35 的股票。

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

## EMA 多头排列筛选

三条均线形成多头排列：EMA8 > EMA21 > EMA55。

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

## 布林带收窄筛选

检测布林带宽度（上轨 − 下轨）是否处于 20 根 K 线的最低点 — 经典的波动率收缩信号。

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

## 批量筛选

将 CLI 与 Shell 循环结合，批量筛选多只股票：

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
