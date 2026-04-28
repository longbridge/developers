---
title: 'ah-premium'
sidebar_label: 'ah-premium'
sidebar_position: 16
---

# longbridge ah-premium

查看 A/H 股溢價率——K 線歷史數據或即日分時數據。

## 基本用法

```bash
longbridge ah-premium 939.HK
```

```
| date       | A-share(CNY) | H-share(HKD) | premium | fx_rate  |
|------------|--------------|--------------|---------|----------|
| 2025-11-18 | 9.520        | 8.130        | -21.92% | 0.914300 |
| 2025-11-19 | 9.820        | 8.220        | -23.58% | 0.913000 |
| 2025-11-20 | 9.790        | 8.090        | -24.57% | 0.912800 |
...
```

## 示例

### A/H 溢價 K 線

```bash
longbridge ah-premium 939.HK
longbridge ah-premium 1398.HK --kline-type day --count 100
```

展示每日 A/H 溢價率數據。K 線類型：`1m`、`5m`、`15m`、`30m`、`60m`、`day`、`week`、`month`、`year`。

### 即日溢價數據

```bash
longbridge ah-premium intraday 939.HK
longbridge ah-premium intraday 1398.HK
```

展示即日分時 A/H 溢價率數據。

### JSON 輸出

```bash
longbridge ah-premium 939.HK --format json
```

## 備註

僅適用於同時在 A 股上市的港股（如 939.HK、1398.HK）。如果沒有返回數據，表示該股票並非 A/H 雙重上市。
