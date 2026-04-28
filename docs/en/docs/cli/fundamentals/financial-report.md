---
title: 'financial-report'
sidebar_label: 'financial-report'
sidebar_position: 1
---

# longbridge financial-report

Fetch income statements, balance sheets, and cash flow statements for any public company.

## Basic Usage

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

## Examples

### Get the latest income statement

```bash
longbridge financial-report TSLA.US --kind IS
```

Returns the income statement for the most recent reporting period, including EPS, revenue, and other earnings line items.

### Get all three statements

```bash
longbridge financial-report TSLA.US
```

Fetches the income statement, balance sheet, and cash flow statement together. Equivalent to `--kind ALL`.

### Get the cash flow statement

```bash
longbridge financial-report TSLA.US --kind CF
```

Returns the cash flow statement, covering operating, investing, and financing activities.

### Annual balance sheet

```bash
longbridge financial-report 700.HK --kind BS --report af
```

Retrieves the annual balance sheet for Tencent. Use `--report` to choose the reporting period: `af` (annual), `saf` (semi-annual), `q1`, `3q`, or `qf` (quarterly).
