---
title: 'analyst-estimates'
sidebar_label: 'analyst-estimates'
sidebar_position: 12
---

# longbridge analyst-estimates

查看個股的歷史及預測 EPS 分析師一致性預期，包含高/低/均值/中位數及覆蓋分析師數量。

## 基本用法

```bash
longbridge analyst-estimates TSLA.US
```

```
estimate:
| currency | day        | high | low  | mean | median | num | value |
|----------|------------|------|------|------|--------|-----|-------|
| USD      | 2026-03-31 | 0.24 | 0.07 | 0.15 | 0.13   | 8   |       |
| USD      | 2026-06-30 | 0.38 | 0.09 | 0.21 | 0.18   | 8   |       |
...
```

`value` 有值時表示實際已披露的 EPS；為空表示該期尚未公布。

## 示例

### EPS 預期

```bash
longbridge analyst-estimates TSLA.US
longbridge analyst-estimates AAPL.US
longbridge analyst-estimates NVDA.US
```

返回歷史及未來各期的分析師 EPS 一致預期，含離散度（高/低）和覆蓋數。

### JSON 輸出

```bash
longbridge analyst-estimates TSLA.US --format json
```

以 JSON 格式返回完整預期數據，適合程式化使用。
