---
title: 'valuation'
sidebar_label: 'valuation'
sidebar_position: 7
---

# longbridge valuation

分析股票當前估值（P/E、P/B、P/S、股息率），結合 5 年歷史區間和行業同類對比，或追蹤估值隨時間的變化。

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

### 當前估值快照

```bash
longbridge valuation TSLA.US
```

展示當前 P/E、P/B、P/S 及股息率，以及 5 年歷史區間和當前值在區間內的位置，包含行業同類排名。

### 歷史 P/E 走勢

```bash
longbridge valuation TSLA.US --history --indicator pe --range 5
```

返回特斯拉過去 5 年的 P/E 時間序列。使用 `--range` 設置回溯窗口：`1`、`3`、`5` 或 `10` 年。

### 追蹤 P/B 歷史變化

```bash
longbridge valuation 700.HK --history --indicator pb
```

追蹤騰訊市淨率的歷史變化。`--history` 模式支持的指標：`pe`、`pb`、`ps`、`dvd_yld`。

### JSON 輸出用於監控

```bash
# 以 JSON 格式匯出歷史 P/B 數據，用於腳本或監控流水線
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

`desc` 字段提供當前估值與歷史區間及行業同類對比的可讀摘要；`list` 數組包含時間序列數據點。
