---
title: 'quant run'
sidebar_label: '概览'
sidebar_position: 1
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

| 特性 | 说明 |
| ---- | ---- |
| **Series** | 每个变量都是时间序列；`close[1]` 表示上一根 K 线的收盘价 |
| **`ta.*` 库** | `ta.ema`, `ta.sma`, `ta.rsi`, `ta.macd`, `ta.sar`, `ta.stoch`, `ta.atr`, `ta.stdev`, `ta.lowest`, `ta.highest`, `ta.crossover`, `ta.crossunder` |
| **两种模式** | `indicator()` 用于分析/筛选；`strategy()` 用于回测 |
| **`input.*()` 函数** | `input.int`, `input.float` — 暴露可调参数 |
| **`plot(value, "name")`** | 输出一个命名序列，显示在结果表格中 |

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
