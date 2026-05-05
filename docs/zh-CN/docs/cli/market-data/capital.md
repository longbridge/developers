---
title: 'capital'
sidebar_label: 'capital'
sidebar_position: 9
---

# longbridge capital

追踪盘中资金流向——默认显示大、中、小资金分布快照，加 `--flow` 参数可获取逐分钟时序数据。

<QuotePermission command="capital" />

## 基本用法

```bash
longbridge capital TSLA.US
```

```
| large_in   | medium_in   | small_in    | large_out  | medium_out  | small_out   |
|------------|-------------|-------------|------------|-------------|-------------|
| 30160.97   | 131976.32   | 134017.99   | 21801.89   | 132803.77   | 124441.20   |
```

## 示例

### 逐分钟追踪大资金净流入

```bash
longbridge capital TSLA.US --flow --format json
```

```json
[
  { "inflow": "1100.46", "time": "2026-04-09 13:30:00" },
  { "inflow": "1129.09", "time": "2026-04-09 13:31:00" },
  { "inflow": "1711.27", "time": "2026-04-09 13:32:00" }
]
```

每条数据显示该分钟的净流入量。正值表示净买入，负值表示净卖出。

### 快照：大中小资金分布

```bash
longbridge capital TSLA.US --format json
```

```json
{
  "capital_in": { "large": "30160.97", "medium": "131976.32", "small": "134017.99" },
  "capital_out": { "large": "21801.89", "medium": "132803.77", "small": "124441.20" },
  "symbol": "TSLA.US",
  "timestamp": "2026-04-09 20:00:00"
}
```

`capital_in` 按订单规模（大 / 中 / 小）显示流入该股票的总资金；`capital_out` 显示对应的资金流出。对比两者可判断大型机构资金是净买入还是净卖出。
