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
  [--language navi|pine] # `navi`（預設），或 `pine` 用於 PineScript 兼容
  [--format table|json]  # table = 可讀圖表（預設）；json = 結構化數據
```

也可以通過管道傳入腳本文件，無需使用 `--script`：

```bash
cat strategy.nv | longbridge quant run TSLA.US --start 2024-01-01 --end 2024-12-31
```

## 腳本語言 — Navi

腳本使用 **Navi** 編寫，這是 `quant run` 的預設語言。同時通過 `--language pine` 兼容支持 PineScript。

[navi-lang.org](https://navi-lang.org) 是 Navi 語法與標準庫的權威參考 — 由於 API 會持續演進，請在該站點查詢準確的函數名與簽名。機器可讀版本：[`llms-full.txt`](https://navi-lang.org/llms-full.txt)（全部內容合為一個文件）與 [`llms.txt`](https://navi-lang.org/llms.txt)（分頁索引）。

### 腳本類型

每個 Navi 腳本必須以其中一個聲明開頭，它決定了腳本的執行模式：

| 聲明 | 用途 |
| ---- | ---- |
| `indicator()` | 繪製指標、計算篩選信號 |
| `strategy()` | 帶開平倉指令的回測 |
| `library()` | 導出可複用的輔助函數 |

### 核心概念

**時間序列** — 每個變量都是逐 K 線的流式數據。`close[1]` 是上一根 K 線的收盤價，`close[N]` 向前回溯 N 根。`ta.*` 的大多數輸出也是序列。

**逐 K 線取值與跨 K 線狀態** — `let` 每根 K 線重新計算；`var` 只初始化一次並在 K 線間保持值：

```nv
var peak: series float = na;
peak = na(peak) ? high : math.max(peak, high);
```

**參數輸入** — 通過 `input.*()` 暴露可調參數，具名參數使用 `:`：

```nv
let len = input.int(14, "Length", minval: 1);
let src = input.source(close, "Source");
let mult = input.float(2.0, "Multiplier");
```

**集合類型** — 支持 `Array<T>`、`Map<K, V>`、`Matrix<T>`，可用於高級逐 K 線計算。

### 內置庫

函數使用 `snake_case`，類型與枚舉使用 `PascalCase`。

| 命名空間 | 用途 |
| -------- | ---- |
| `ta.*` | 技術分析 — 均線、振盪指標、通道、交叉判斷 |
| `math.*` | 算術與數值輔助函數 |
| `String` / `Array` / `Map` / `Matrix` | 文本與集合類型 |
| `strategy.*` | 回測下單與持倉管理 |

完整函數列表與簽名見[標準庫參考](https://navi-lang.org/api/stdlib/)。

### 輸出項

| 表達式 | 效果 |
| ------ | ---- |
| `plot(series, "name")` | 命名序列 — 顯示在結果表格 / sparkline 中 |
| `plot_shape(cond, ...)` | 在指定 K 線上繪製信號形狀 |
| `bg_color(cond ? Color.GREEN : na)` | 高亮 K 線背景色 |
| `strategy.entry("L", Direction.Long)` | 下一個回測多頭入場指令 |
| `strategy.exit("L", stop: ..., limit: ...)` | 帶止損/止盈平倉 |

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

### 本地校驗腳本

安裝 [Navi CLI](https://navi-lang.org/docs/install.md)，在提交到服務端前先做本地校驗 — 服務端僅以不透明的錯誤碼返回腳本錯誤：

```bash
navi lint my_indicator.nv
```

## 輸出

**表格格式**（預設）— 帶 sparkline 的可讀圖表：

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

**JSON 格式** — 用於腳本處理和回測：

```bash
cat strategy.nv | longbridge quant run NVDA.US --start 2025-01-01 --end 2026-04-28 \
  --format json | \
  jq '.report_json | fromjson | .performanceAll'
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
