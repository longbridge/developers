---
title: 'business-segments'
sidebar_label: 'business-segments'
sidebar_position: 15
---

# longbridge business-segments

显示公司各业务分部的营收拆解——当期合计或跨报告期的历史趋势。

## 基本用法

```bash
longbridge business-segments AAPL.US
```

```
Period: Q1 FY2026    Total: 124,300,000,000    Currency: USD

| segment           | amount          | share  |
|-------------------|-----------------|--------|
| iPhone            | 69,140,000,000  | 55.62% |
| Services          | 26,340,000,000  | 21.19% |
| Mac               | 7,940,000,000   | 6.39%  |
| iPad              | 8,090,000,000   | 6.51%  |
| Wearables & Other | 12,790,000,000  | 10.29% |
```

## 示例

### 当期业务分部拆解

```bash
longbridge business-segments AAPL.US
```

展示最新报告期内各业务分部的营收金额及其在总营收中的占比。

### 历史分部趋势

```bash
longbridge business-segments AAPL.US --history
```

返回多个报告期的分部营收数据，便于追踪营收结构随时间的变化。

### 按报告类型筛选

```bash
longbridge business-segments AAPL.US --history --report af
```

使用 `--report` 将历史数据限定为特定周期类型：`af`（年报）、`saf`（半年报）、`qf`（季报）。

## 选项

| 参数 | 说明 |
|------|------|
| `--history` | 显示多期历史分部数据 |
| `--report <TYPE>` | 周期类型筛选：`af`（年报）、`saf`（半年报）、`qf`（季报） |
| `--format json` | 输出原始 JSON |
