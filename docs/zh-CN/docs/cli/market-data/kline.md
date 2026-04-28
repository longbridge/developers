---
title: 'kline'
sidebar_label: 'kline'
sidebar_position: 6
---

# longbridge kline

获取任意标的的 K 线数据，支持多种周期和历史日期范围。

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

### 日线（最近 100 天，默认）

```bash
longbridge kline TSLA.US
```

默认返回最近 100 根日线，每根包含开盘价、最高价、最低价、收盘价、成交量和成交额。

### 不同周期的分时 K 线

```bash
longbridge kline TSLA.US --period 1h --count 48
```

使用 `--period` 切换粒度（如 `1m`、`5m`、`15m`、`30m`、`1h`、`day`、`week`、`month`、`year`），用 `--count` 控制返回的 K 线条数。

### 历史日期范围

```bash
longbridge kline history TSLA.US --period day --start 2025-01-01 --end 2025-03-31
longbridge kline history TSLA.US --period day --start 2025-01-01 --end 2025-03-31 --format json
```

使用 `history` 子命令配合 `--start` 和 `--end`（格式：`YYYY-MM-DD`）获取指定日期窗口的 K 线。`--adjust forward` 可获取前复权价格。JSON 输出中的 `time` 字段表示 K 线开盘时间——美股日线以 UTC 时间表示美东时间零点。
