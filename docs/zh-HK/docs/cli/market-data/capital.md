---
title: 'capital'
sidebar_label: 'capital'
sidebar_position: 9
---

# longbridge capital

追蹤盤中資金流向——默認顯示大、中、小資金分佈快照，加 `--flow` 參數可獲取逐分鐘時序數據。

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

### 逐分鐘追蹤大資金淨流入

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

每條數據顯示該分鐘的淨流入量。正值表示淨買入，負值表示淨賣出。

### 快照：大中小資金分佈

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

`capital_in` 按訂單規模（大 / 中 / 小）顯示流入該股票的總資金；`capital_out` 顯示對應的資金流出。對比兩者可判斷大型機構資金是淨買入還是淨賣出。
