---
title: 'quant run'
sidebar_label: '概覽'
sidebar_position: 1
slug: '/cli/quant'
---

# longbridge quant run

在歷史 K 線數據上運行服務端量化腳本，返回指標值、回測績效報告或篩選信號。

## 命令

```bash
longbridge quant run <SYMBOL> \
  --start YYYY-MM-DD \
  --end   YYYY-MM-DD \
  [--period day|week|1h|30m|15m|5m|1m|month|year]
  [--script "..."]       # 內聯腳本
  [--input '[14,2.0]']   # 覆蓋 input.*() 預設值
  [--format table|json]  # table = 可讀圖表（預設）；json = 結構化數據
```

也可以通過管道傳入腳本文件，無需使用 `--script`：

```bash
cat strategy.pine | longbridge quant run TSLA.US --start 2024-01-01 --end 2024-12-31
```

## 腳本語言 — OpenPine

腳本使用 **OpenPine** 編寫 — 一種獨立的指標腳本語言，兼容大部分 **PineScript V6** 語法，現有 Pine 腳本無需或只需少量修改即可直接運行。

### 腳本類型

每個 OpenPine 腳本必須以其中一個聲明開頭，它決定了腳本的執行模式：

| 聲明 | 用途 |
| ---- | ---- |
| `indicator()` | 繪製指標、計算篩選信號 |
| `strategy()` | 帶開平倉指令的回測 |

### 核心概念

**時間序列** — 每個變量都是逐 K 線的流式數據。`close[1]` 是上一根 K 線的收盤價，`close[N]` 向前回溯 N 根。`ta.*` 的大多數輸出也是序列。

**跨 K 線狀態** — 使用 `var` 只初始化一次並在 K 線間保持值：

```pine
var float peak = na
peak := na(peak) ? high : math.max(peak, high)
```

**參數輸入** — 通過 `input.*()` 暴露可調參數：

```pine
len  = input.int(14, "Length", minval=1)
src  = input.source(close, "Source")
mult = input.float(2.0, "Multiplier")
```

**集合類型** — 支持 `array<T>`、`map<K,V>`、`matrix<T>`，可用於高級逐 K 線計算。

### 內置庫

| 命名空間 | 常用函數 |
| -------- | -------- |
| `ta.*` | `sma`, `ema`, `rma`, `wma`, `rsi`, `macd`, `bb`, `kc`, `atr`, `tr`, `stoch`, `sar`, `supertrend`, `vwap`, `crossover`, `crossunder`, `highest`, `lowest`, `stdev`, `barssince`, `valuewhen` |
| `math.*` | `abs`, `ceil`, `floor`, `round`, `sqrt`, `pow`, `exp`, `log`, `max`, `min`, `avg` |
| `str.*` | `tostring`, `format`, `length`, `contains`, `replace`, `split` |
| `array.*` | `new`, `push`, `pop`, `avg`, `sum`, `min`, `max`, `sort`, `includes` |
| `map.*` | `new`, `get`, `put`, `keys`, `values`, `contains` |

### 輸出

| 表達式 | 效果 |
| ------ | ---- |
| `plot(series, "name")` | 命名序列 — 顯示在結果表格 / sparkline 中 |
| `plotshape(cond, ...)` | 在指定 K 線上繪製信號形狀 |
| `bgcolor(cond ? color.green : na)` | 高亮 K 線背景色 |
| `strategy.entry("L", strategy.long)` | 下一個回測多頭入場指令 |
| `strategy.exit("L", stop=..., limit=...)` | 帶止損/止盈平倉 |

### 快速示例

```pine
indicator("MA Cross", overlay=true)

fastLen = input.int(10, "Fast", minval=1)
slowLen = input.int(20, "Slow", minval=1)

fast = ta.ema(close, fastLen)
slow = ta.ema(close, slowLen)

plot(fast, "Fast", color=color.orange)
plot(slow, "Slow", color=color.blue)
plotshape(ta.crossover(fast, slow),  title="Buy",  style=shape.triangleup,   location=location.belowbar, color=color.green)
plotshape(ta.crossunder(fast, slow), title="Sell", style=shape.triangledown, location=location.abovebar, color=color.red)
```

## 輸出

**表格格式**（預設）— 帶 sparkline 的可讀圖表：

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
MACD                  │    79│     +0.00│     +7.56│     -4.07│     +7.56 ⣤⣤⣤⣤⣤⣤⣠⣤⣤⣤⣤⣤⣤⣤⣀⣀⣠⣴⣶⣿
Signal                │    79│     +0.00│     +5.16│     -2.99│     +5.16 ⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣀⣀⣀⣠⣴⣾
Histogram             │    79│     +0.00│     +2.40│     -1.41│     +3.02 ⣤⣤⣤⣤⣤⣦⣠⣤⣤⣦⣄⣠⣤⣄⣀⣠⣴⣾⣿⣷
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  79 bars
```

**JSON 格式** — 用於腳本處理和回測：

```bash
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json --script '...' | \
  jq '.data.report_json | fromjson | .performanceAll'
```

## 支持的週期

| 參數 | 說明 |
| ---- | ---- |
| `day` | 日線（預設） |
| `week` | 週線 |
| `month` | 月線 |
| `year` | 年線 |
| `1h` | 1 小時線 |
| `30m` | 30 分鐘線 |
| `15m` | 15 分鐘線 |
| `5m` | 5 分鐘線 |
| `1m` | 1 分鐘線 |

分鐘/小時級別支持日期時間格式：`--start "2024-01-02 09:30" --end "2024-01-02 16:00"`。
