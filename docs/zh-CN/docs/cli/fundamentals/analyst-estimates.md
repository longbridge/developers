---
title: 'analyst-estimates'
sidebar_label: 'analyst-estimates'
sidebar_position: 12
---

# longbridge analyst-estimates

查看个股的历史及预测 EPS 分析师一致性预期，包含高/低/均值/中位数及覆盖分析师数量。

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

`value` 有值时表示实际已披露的 EPS；为空表示该期尚未公布。

## 示例

### EPS 预期

```bash
longbridge analyst-estimates TSLA.US
longbridge analyst-estimates AAPL.US
longbridge analyst-estimates NVDA.US
```

返回历史及未来各期的分析师 EPS 一致预期，含离散度（高/低）和覆盖数。

### JSON 输出

```bash
longbridge analyst-estimates TSLA.US --format json
```

以 JSON 格式返回完整预期数据，适合程序化使用。
