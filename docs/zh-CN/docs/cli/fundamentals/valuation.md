---
title: 'valuation'
sidebar_label: 'valuation'
sidebar_position: 7
---

# longbridge valuation

分析股票当前估值（P/E、P/B、P/S、股息率），结合 5 年历史区间和行业同类对比，或追踪估值随时间的变化。

## 基本用法

```bash
longbridge valuation TSLA.US --indicator pe
```

```
Overview:
| indicator | current | high   | low   | median | industry_median | date       |
|-----------|---------|--------|-------|--------|-----------------|------------|
| PE        | 341.83x | 284.01 | 51.31 | 96.85  | -0.11           | 2026-04-09 |
Current P/E 341.83, above fair range, cheaper than 8.85% of last 5 years, industry rank 19/49

Peers (5):
| name  | pe     |
|-------|--------|
| TSLA  | 341.83 |
...
```

## 示例

### 当前估值快照

```bash
longbridge valuation TSLA.US
```

展示当前 P/E、P/B、P/S 及股息率，以及 5 年历史区间和当前值在区间内的位置，包含行业同类排名。

### 历史 P/E 走势

```bash
longbridge valuation TSLA.US --history --indicator pe --range 5
```

返回特斯拉过去 5 年的 P/E 时间序列。使用 `--range` 设置回溯窗口：`1`、`3`、`5` 或 `10` 年。

### 追踪 P/B 历史变化

```bash
longbridge valuation 700.HK --history --indicator pb
```

追踪腾讯市净率的历史变化。`--history` 模式支持的指标：`pe`、`pb`、`ps`、`dvd_yld`。

### JSON 输出用于监控

```bash
# 以 JSON 格式导出历史 P/B 数据，用于脚本或监控流水线
longbridge valuation TSLA.US --history --indicator pb --format json
```

```json
{
  "metrics": {
    "pb": {
      "desc": "current P/B 15.79, in reasonable range, cheaper than 50.31% of last 5 years, industry rank 35/49",
      "high": "24.35",
      "list": [
        { "timestamp": "1619841600", "value": "26.87" },
        { "timestamp": "1622520000", "value": "24.53" }
      ]
    }
  }
}
```

`desc` 字段提供当前估值与历史区间及行业同类对比的可读摘要；`list` 数组包含时间序列数据点。
