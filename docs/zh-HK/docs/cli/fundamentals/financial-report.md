---
title: 'financial-report'
sidebar_label: 'financial-report'
sidebar_position: 1
---

# longbridge financial-report

取得任意上市公司的利潤表、資產負債表及現金流量表。

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

### 取得最新利潤表

```bash
longbridge financial-report TSLA.US --kind IS
```

返回最新報告期的利潤表，包含 EPS、營收及其他盈利項目。

### 取得三張報表

```bash
longbridge financial-report TSLA.US
```

同時取得利潤表、資產負債表和現金流量表，等同於 `--kind ALL`。

### 取得現金流量表

```bash
longbridge financial-report TSLA.US --kind CF
```

返回現金流量表，涵蓋經營、投資及融資活動。

### 年度資產負債表

```bash
longbridge financial-report 700.HK --kind BS --report af
```

取得騰訊的年度資產負債表。使用 `--report` 選擇報告周期：`af`（年報）、`saf`（半年報）、`q1`、`3q` 或 `qf`（季報）。
