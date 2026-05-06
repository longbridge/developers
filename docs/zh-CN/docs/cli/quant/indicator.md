---
title: '指标'
sidebar_label: '指标'
sidebar_position: 2
slug: '/cli/quant/indicator'
---

# 指标

使用 `longbridge quant run` 在历史 K 线数据上运行任意指标脚本。脚本中的每个 `plot()` 调用都会成为输出中的一个命名序列。

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

## 布林带

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

## EMA 均线组合

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

## 随机指标（Stochastic）

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

> **注意** — `ta.stoch` 返回单个 `%K` 值。通过 `ta.ema(k, 3)` 手动计算 `%D`。

## 抛物线 SAR 与 ATR 通道

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

## 使用管道传入脚本文件

对于较长的脚本，保存为 `.pine` 文件后通过管道传入：

```bash
cat my_indicator.pine | longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28
```

## 用 `--input` 覆盖参数

在不修改脚本的情况下，在运行时覆盖 `input.*()` 的默认值：

```bash
longbridge quant run NVDA.US --start 2026-01-02 --end 2026-04-28 \
  --input '[21]' \
  --script '
indicator()
period = input.int(14)
plot(ta.rsi(close, period), "RSI")
'
```

参数按位置匹配：`[21]` 覆盖第一个 `input.*()` 调用。
