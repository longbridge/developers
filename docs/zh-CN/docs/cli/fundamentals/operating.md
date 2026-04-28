---
title: 'operating'
sidebar_label: 'operating'
sidebar_position: 11
---

# longbridge operating

查看公司经营回顾——按报告期展示核心财务指标和管理层评述。

## 基本用法

```bash
longbridge operating 700.HK
```

```
Currency: HKD

| period | 营业收入 | 营业收入_yoy | 净利润   | 净利润_yoy | 每股收益 | 每股收益_yoy |
|--------|----------|--------------|----------|------------|----------|--------------|
| af *   | 8217 亿  | 14.96%       | 2457 亿  | 16.98%     | 26.4     | 19.04%       |
| q3     | 6056 亿  | 13.98%       | 1811 亿  | 16.41%     | 19.47    | 18.88%       |
| saf    | 3947 亿  | 14.07%       | 1120 亿  | 15.95%     | 12.05    | 19.04%       |
...
```

## 示例

### 查看经营回顾

```bash
longbridge operating AAPL.US
longbridge operating 700.HK
```

展示财务指标表格和管理层回顾摘要。

### 按报告期筛选

```bash
# 年报
longbridge operating AAPL.US --report af
# Q1 报告
longbridge operating TSLA.US --report q1
```

支持的报告类型：`af`（年报）、`saf`（半年报）、`q1`（一季报）、`q3`（三季报）。可用逗号分隔多个类型。

### JSON 输出

```bash
longbridge operating TSLA.US --format json
```
