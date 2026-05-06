---
title: 'quant run'
sidebar_label: '概览'
sidebar_position: 1
slug: '/cli/quant'
---

# longbridge quant run

在历史 K 线数据上运行服务端量化脚本，返回指标值、回测绩效报告或筛选信号。

## 命令

```bash
longbridge quant run <SYMBOL> \
  --start YYYY-MM-DD \
  --end   YYYY-MM-DD \
  [--period day|week|1h|30m|15m|5m|1m|month|year]
  [--script "..."]       # 内联脚本
  [--input '[14,2.0]']   # 覆盖 input.*() 默认值
  [--format table|json]  # table = 可读图表（默认）；json = 结构化数据
```

也可以通过管道传入脚本文件，无需使用 `--script`：

```bash
cat strategy.pine | longbridge quant run TSLA.US --start 2024-01-01 --end 2024-12-31
```

## 脚本语言 — OpenPine

脚本使用 **OpenPine** 编写 — 一种独立的指标脚本语言，兼容大部分 **PineScript V6** 语法，现有 Pine 脚本无需或只需少量修改即可直接运行。

### 脚本类型

每个 OpenPine 脚本必须以其中一个声明开头，它决定了脚本的执行模式：

| 声明 | 用途 |
| ---- | ---- |
| `indicator()` | 绘制指标、计算筛选信号 |
| `strategy()` | 带开平仓指令的回测 |

### 核心概念

**时间序列** — 每个变量都是逐 K 线的流式数据。`close[1]` 是上一根 K 线的收盘价，`close[N]` 向前回溯 N 根。`ta.*` 的大多数输出也是序列。

**跨 K 线状态** — 使用 `var` 只初始化一次并在 K 线间保持值：

```pine
var float peak = na
peak := na(peak) ? high : math.max(peak, high)
```

**参数输入** — 通过 `input.*()` 暴露可调参数：

```pine
len  = input.int(14, "Length", minval=1)
src  = input.source(close, "Source")
mult = input.float(2.0, "Multiplier")
```

**集合类型** — 支持 `array<T>`、`map<K,V>`、`matrix<T>`，可用于高级逐 K 线计算。

### 内置库

| 命名空间 | 常用函数 |
| -------- | -------- |
| `ta.*` | `sma`, `ema`, `rma`, `wma`, `rsi`, `macd`, `bb`, `kc`, `atr`, `tr`, `stoch`, `sar`, `supertrend`, `vwap`, `crossover`, `crossunder`, `highest`, `lowest`, `stdev`, `barssince`, `valuewhen` |
| `math.*` | `abs`, `ceil`, `floor`, `round`, `sqrt`, `pow`, `exp`, `log`, `max`, `min`, `avg` |
| `str.*` | `tostring`, `format`, `length`, `contains`, `replace`, `split` |
| `array.*` | `new`, `push`, `pop`, `avg`, `sum`, `min`, `max`, `sort`, `includes` |
| `map.*` | `new`, `get`, `put`, `keys`, `values`, `contains` |

### 输出

| 表达式 | 效果 |
| ------ | ---- |
| `plot(series, "name")` | 命名序列 — 显示在结果表格 / sparkline 中 |
| `plotshape(cond, ...)` | 在指定 K 线上绘制信号形状 |
| `bgcolor(cond ? color.green : na)` | 高亮 K 线背景色 |
| `strategy.entry("L", strategy.long)` | 下一个回测多头入场指令 |
| `strategy.exit("L", stop=..., limit=...)` | 带止损/止盈平仓 |

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

## 输出

**表格格式**（默认）— 带 sparkline 的可读图表：

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

**JSON 格式** — 用于脚本处理和回测：

```bash
longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json --script '...' | \
  jq '.data.report_json | fromjson | .performanceAll'
```

## 支持的周期

| 参数 | 说明 |
| ---- | ---- |
| `day` | 日线（默认） |
| `week` | 周线 |
| `month` | 月线 |
| `year` | 年线 |
| `1h` | 1 小时线 |
| `30m` | 30 分钟线 |
| `15m` | 15 分钟线 |
| `5m` | 5 分钟线 |
| `1m` | 1 分钟线 |

分钟/小时级别支持日期时间格式：`--start "2024-01-02 09:30" --end "2024-01-02 16:00"`。
