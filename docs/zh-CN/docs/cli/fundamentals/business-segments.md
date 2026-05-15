---
title: 'business-segments'
sidebar_label: 'business-segments'
sidebar_position: 15
---

# longbridge business-segments

Show revenue breakdown by business segment for a company — current period totals or historical trends across reporting periods.

## Basic Usage

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

## Examples

### Current period breakdown

```bash
longbridge business-segments AAPL.US
```

Shows each business segment's revenue and its share of total revenue for the most recent reporting period.

### Historical segment trends

```bash
longbridge business-segments AAPL.US --history
```

Returns segment revenue across multiple reporting periods so you can track how the revenue mix has shifted over time.

### Filter by report type

```bash
longbridge business-segments AAPL.US --history --report af
```

Use `--report` to scope the history to a specific period type: `af` (annual), `saf` (semi-annual), `qf` (quarterly).

## Options

| Flag | Description |
|------|-------------|
| `--history` | Show historical segment data across multiple periods |
| `--report <TYPE>` | Period type filter: `af` (annual), `saf` (semi-annual), `qf` (quarterly) |
| `--format json` | Output raw JSON |
