---
title: 'ah-premium'
sidebar_label: 'ah-premium'
sidebar_position: 16
---

# longbridge ah-premium

查看 A/H 股溢价率——K 线历史数据或分时数据。

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

### A/H 溢价率 K 线

```bash
longbridge ah-premium 939.HK
longbridge ah-premium 1398.HK --kline-type day --count 100
```

展示每日 A/H 溢价率数据。K 线类型：`1m`、`5m`、`15m`、`30m`、`60m`、`day`、`week`、`month`、`year`。

### 分时溢价率数据

```bash
longbridge ah-premium intraday 939.HK
longbridge ah-premium intraday 1398.HK
```

展示日内分时 A/H 溢价率数据。

### JSON 输出

```bash
longbridge ah-premium 939.HK --format json
```

## 备注

仅适用于同时在 A 股上市的港股（如 939.HK、1398.HK）。如果没有返回数据，说明该股票不是 A/H 双重上市。
