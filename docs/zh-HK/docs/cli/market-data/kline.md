---
title: 'kline'
sidebar_label: 'kline'
sidebar_position: 6
---

# longbridge kline

取得任意標的的 K 線數據，支援多種週期和歷史日期範圍。

## 基本用法

```bash
longbridge kline TSLA.US --period day --count 3
```

```
| Time                | Open    | High    | Low     | Close   | Volume   | Turnover        |
|---------------------|---------|---------|---------|---------|----------|-----------------|
| 2026-04-07 04:00:00 | 346.440 | 348.020 | 337.240 | 346.650 | 74515355 | 25563965746.000 |
| 2026-04-08 04:00:00 | 363.790 | 364.500 | 339.670 | 343.250 | 78838616 | 27457043487.000 |
| 2026-04-09 04:00:00 | 343.150 | 348.880 | 337.250 | 345.620 | 62164016 | 21375312140.000 |
```

## 示例

### 日線（最近 100 天，默認）

```bash
longbridge kline TSLA.US
```

默認返回最近 100 根日線，每根包含開盤價、最高價、最低價、收盤價、成交量和成交額。

### 不同週期的分時 K 線

```bash
longbridge kline TSLA.US --period 1h --count 48
```

使用 `--period` 切換粒度（如 `1m`、`5m`、`15m`、`30m`、`1h`、`day`、`week`、`month`、`year`），用 `--count` 控制返回的 K 線條數。

### 歷史日期範圍

```bash
longbridge kline history TSLA.US --period day --start 2025-01-01 --end 2025-03-31
longbridge kline history TSLA.US --period day --start 2025-01-01 --end 2025-03-31 --format json
```

使用 `history` 子命令配合 `--start` 和 `--end`（格式：`YYYY-MM-DD`）取得指定日期窗口的 K 線。`--adjust forward` 可取得前復權價格。JSON 輸出中的 `time` 欄位表示 K 線開盤時間——美股日線以 UTC 時間表示美東時間零點。
