---
title: '指標'
sidebar_label: '指標'
sidebar_position: 2
slug: '/cli/quant/indicator'
---

# 指標

使用 `longbridge quant run` 在歷史 K 線數據上運行任意指標腳本。腳本中的每個 `plot()` 調用都會成為輸出中的一個命名序列。

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

## 布林帶

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

## EMA 均線組合

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

## 隨機指標（Stochastic）

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

> **注意** — `ta.stoch` 返回單個 `%K` 值。通過 `ta.ema(k, 3)` 手動計算 `%D`。

## 拋物線 SAR 與 ATR 通道

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

## 使用管道傳入腳本文件

對於較長的腳本，保存為 `.pine` 文件後通過管道傳入：

```bash
cat my_indicator.pine | longbridge quant run NVDA.US \
  --start 2026-01-02 --end 2026-04-28
```

## 用 `--input` 覆蓋參數

在不修改腳本的情況下，在運行時覆蓋 `input.*()` 的預設值：

```bash
longbridge quant run NVDA.US --start 2026-01-02 --end 2026-04-28 \
  --input '[21]' \
  --script '
indicator()
period = input.int(14)
plot(ta.rsi(close, period), "RSI")
'
```

參數按位置匹配：`[21]` 覆蓋第一個 `input.*()` 調用。
