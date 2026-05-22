---
title: 'shareholder'
sidebar_label: 'shareholder'
sidebar_position: 1
---

# longbridge shareholder

查看公司主要股东——机构和个人——及其持股比例和最新持股变动。

## 基本用法

```bash
longbridge shareholder TSLA.US
```

```
| shareholder                        | symbol | % shares | chg shares | report_date |
|------------------------------------|--------|----------|------------|-------------|
| Elon R. Musk                       | -      | 24.86%   | +423.53M   | 2025-12-30  |
| The Vanguard Group, Inc.           | -      | 6.90%    | +6.54M     | 2025-12-31  |
| BlackRock, Inc.                    | BLK.US | 5.57%    | +2.81M     | 2025-12-31  |
| State Street Global Advisors, Inc. | -      | 3.06%    | +1.08M     | 2025-12-31  |
| Geode Capital Management, LLC      | -      | 1.75%    | +375.95K   | 2025-12-31  |
```

## 示例

### 查看主要股东

```bash
longbridge shareholder TSLA.US
longbridge shareholder TSLA.US --format json
```

按持股比例列出最大股东，包括机构投资者和个人内部人士。

### 查看前 20 大股东（--top）

```bash
longbridge shareholder AAPL.US --top
```

```
Top 20 Shareholders — AAPL.US

Period: Latest

| shareholder                    | type        | % shares | chg shares | filing_date |
|--------------------------------|-------------|----------|------------|-------------|
| The Vanguard Group, Inc.       | Institution | 9.71%    | +0.01%     | 2025/12/31  |
| BlackRock, Inc.                | Institution | 7.75%    | -0.06%     | 2026/03/31  |
| ...

Use --object-id <id> to view holding detail for a specific shareholder.
```

`--top` 模式覆盖多个报告期，包含机构、个人及内部人士，并显示股东类型（Institution / Individual / Insider）。

### 查看特定股东持股详情（--object-id）

```bash
longbridge shareholder AAPL.US --object-id 148057
```

```
Shareholder Detail: The Vanguard Group, Inc.

Trading History:

Period: Past 1 Year
  accum_buy: 0.00  accum_sell: 0.00
```

`--object-id` 接受 `--top` 输出中的股东 ID，返回该股东历史持仓变化和买卖记录。

## 参数

| 参数 | 说明 |
|------|------|
| `--top` | 显示前 20 大股东，含机构和个人，跨多个报告期 |
| `--object-id` | 查看特定股东持仓详情（ID 从 `--top` 输出获取） |
| `--format` | 输出格式：`table`（默认）或 `json` |
