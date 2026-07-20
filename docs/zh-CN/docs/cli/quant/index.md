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
  [--language navi|pine] # `navi`（默认），或 `pine` 用于 PineScript 兼容
  [--format table|json]  # table = 可读图表（默认）；json = 结构化数据
```

也可以通过管道传入脚本文件，无需使用 `--script`：

```bash
cat strategy.nv | longbridge quant run TSLA.US --start 2024-01-01 --end 2024-12-31
```

## 脚本语言 — Navi

脚本使用 **Navi** 编写，这是 `quant run` 的默认语言。同时通过 `--language pine` 兼容支持 PineScript。

[navi-lang.org](https://navi-lang.org) 是 Navi 语法与标准库的权威参考 — 由于 API 会持续演进，请在该站点查询准确的函数名与签名。机器可读版本：[`llms-full.txt`](https://navi-lang.org/llms-full.txt)（全部内容合为一个文件）与 [`llms.txt`](https://navi-lang.org/llms.txt)（分页索引）。

### 脚本类型

每个 Navi 脚本必须以其中一个声明开头，它决定了脚本的执行模式：

| 声明 | 用途 |
| ---- | ---- |
| `indicator()` | 绘制指标、计算筛选信号 |
| `strategy()` | 带开平仓指令的回测 |
| `library()` | 导出可复用的辅助函数 |

### 核心概念

**时间序列** — 每个变量都是逐 K 线的流式数据。`close[1]` 是上一根 K 线的收盘价，`close[N]` 向前回溯 N 根。`ta.*` 的大多数输出也是序列。

**逐 K 线取值与跨 K 线状态** — `let` 每根 K 线重新计算；`var` 只初始化一次并在 K 线间保持值：

```nv
var peak: series float = na;
peak = na(peak) ? high : math.max(peak, high);
```

**参数输入** — 通过 `input.*()` 暴露可调参数，具名参数使用 `:`：

```nv
let len = input.int(14, "Length", minval: 1);
let src = input.source(close, "Source");
let mult = input.float(2.0, "Multiplier");
```

**集合类型** — 支持 `Array<T>`、`Map<K, V>`、`Matrix<T>`，可用于高级逐 K 线计算。

### 内置库

函数使用 `snake_case`，类型与枚举使用 `PascalCase`。

| 命名空间 | 用途 |
| -------- | ---- |
| `ta.*` | 技术分析 — 均线、振荡指标、通道、交叉判断 |
| `math.*` | 算术与数值辅助函数 |
| `String` / `Array` / `Map` / `Matrix` | 文本与集合类型 |
| `strategy.*` | 回测下单与持仓管理 |

完整函数列表与签名见[标准库参考](https://navi-lang.org/api/stdlib/)。

### 输出

| 表达式 | 效果 |
| ------ | ---- |
| `plot(series, "name")` | 命名序列 — 显示在结果表格 / sparkline 中 |
| `plot_shape(cond, ...)` | 在指定 K 线上绘制信号形状 |
| `bg_color(cond ? Color.GREEN : na)` | 高亮 K 线背景色 |
| `strategy.entry("L", Direction.Long)` | 下一个回测多头入场指令 |
| `strategy.exit("L", stop: ..., limit: ...)` | 带止损/止盈平仓 |

### 快速示例

```nv
indicator("MA Cross", overlay: true);

let fast_len = input.int(10, "Fast", minval: 1);
let slow_len = input.int(20, "Slow", minval: 1);

let fast = ta.ema(close, fast_len);
let slow = ta.ema(close, slow_len);

plot(fast, "Fast", color: Color.ORANGE);
plot(slow, "Slow", color: Color.BLUE);

plot_shape(
    ta.cross_over(fast, slow),
    title: "Buy",
    style: Shape.TriangleUp,
    location: Location.BelowBar,
    color: Color.GREEN
);
plot_shape(
    ta.cross_under(fast, slow),
    title: "Sell",
    style: Shape.TriangleDown,
    location: Location.AboveBar,
    color: Color.RED
);
```

### 本地校验脚本

安装 [Navi CLI](https://navi-lang.org/docs/install.md)，在提交到服务端前先做本地校验 — 服务端仅以不透明的错误码返回脚本错误：

```bash
navi lint my_indicator.nv
```

## 输出

**表格格式**（默认）— 带 sparkline 的可读图表：

```
────────────────────────────────────────────────────────────────────────────────
Series                │  Bars│     First│      Last│       Min│       Max Sparkline
────────────────────────────────────────────────────────────────────────────────
MACD                  │    80│     +0.00│     +7.55│     -4.04│     +7.55 ⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣀⣀⣠⣴⣶⣿
Signal                │    80│     +0.00│     +5.16│     -2.96│     +5.16 ⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣀⣀⣀⣠⣴⣾
Histogram             │    80│     +0.00│     +2.39│     -1.50│     +3.01 ⣤⣤⣤⣤⣤⣦⣠⣤⣤⣦⣄⣠⣤⣄⣀⣠⣴⣾⣿⣷
────────────────────────────────────────────────────────────────────────────────
  3 series  ·  80 bars
```

**JSON 格式** — 用于脚本处理和回测：

```bash
cat strategy.nv | longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json | \
  jq '.report_json | fromjson | .performanceAll'
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
