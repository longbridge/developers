---
title: 'capital'
sidebar_label: 'capital'
sidebar_position: 9
---

# longbridge capital

追踪盘中资金流向——通过 `flow` 子命令逐分钟查看大、中、小资金的流入流出，或通过 `dist` 子命令查看资金分布快照。

## 基本用法

```bash
longbridge capital flow TSLA.US
```

```
| Time                | Inflow   |
|---------------------|----------|
| 2026-04-09 13:30:00 | 1100.46  |
| 2026-04-09 13:31:00 | 1129.09  |
| 2026-04-09 13:32:00 | 1711.27  |
| 2026-04-09 13:33:00 | 1955.54  |
| 2026-04-09 13:34:00 | 1609.27  |
...
```

## 示例

### 逐分钟追踪大资金净流入

```bash
longbridge capital flow TSLA.US --format json
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
longbridge capital dist TSLA.US --format json
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
