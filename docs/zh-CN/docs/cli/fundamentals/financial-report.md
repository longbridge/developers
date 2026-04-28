---
title: 'financial-report'
sidebar_label: 'financial-report'
sidebar_position: 1
---

# longbridge financial-report

获取任意上市公司的利润表、资产负债表及现金流量表。

## 基本用法

```bash
longbridge financial-report TSLA.US --kind IS
```

```
── IS ──
| metric              | Q4 2025 | Q3 2025 | Q2 2025 | Q1 2025 | Q4 2024 |
|---------------------|---------|---------|---------|---------|---------|
| EPS (USD)           | 0.2404  | 0.3900  | 0.3300  | 0.1200  | 0.6104  |
| ROE                 | 4.15%   | 6.98%   | 6.17%   | 2.22%   | 11.90%  |
| Revenue (USD)       | 24.90B  | 28.09B  | 22.50B  | 19.34B  | 25.71B  |
| Net Income (USD)    | 840.00M | 1.37B   | 1.17B   | 409.00M | 2.12B   |
| Gross Margin        | 20.12%  | 17.99%  | 17.24%  | 16.31%  | 16.26%  |
| Net Margin          | 3.37%   | 4.89%   | 5.21%   | 2.12%   | 8.28%   |
```

## 示例

### 获取最新利润表

```bash
longbridge financial-report TSLA.US --kind IS
```

返回最新报告期的利润表，包含 EPS、营收及其他盈利项目。

### 获取三张报表

```bash
longbridge financial-report TSLA.US
```

同时获取利润表、资产负债表和现金流量表，等同于 `--kind ALL`。

### 获取现金流量表

```bash
longbridge financial-report TSLA.US --kind CF
```

返回现金流量表，涵盖经营、投资及融资活动。

### 年度资产负债表

```bash
longbridge financial-report 700.HK --kind BS --report af
```

获取腾讯的年度资产负债表。使用 `--report` 选择报告周期：`af`（年报）、`saf`（半年报）、`q1`、`3q` 或 `qf`（季报）。
