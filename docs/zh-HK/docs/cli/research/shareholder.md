---
title: 'shareholder'
sidebar_label: 'shareholder'
sidebar_position: 1
---

# longbridge shareholder

查看公司主要股東——機構和個人——及其持股比例和最新持股變動。

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

### 查看主要股東

```bash
longbridge shareholder TSLA.US
longbridge shareholder TSLA.US --format json
```

按持股比例列出最大股東，包括機構投資者和個人內部人士。

### 查看前 20 大股東（--top）

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

`--top` 模式覆蓋多個報告期，包含機構、個人及內部人士，並顯示股東類型（Institution / Individual / Insider）。

### 查看特定股東持股詳情（--object-id）

```bash
longbridge shareholder AAPL.US --object-id 148057
```

```
Shareholder Detail: The Vanguard Group, Inc.

Trading History:

Period: Past 1 Year
  accum_buy: 0.00  accum_sell: 0.00
```

`--object-id` 接受 `--top` 輸出中的股東 ID，返回該股東歷史持倉變化和買賣記錄。

## 參數

| 參數 | 說明 |
|------|------|
| `--top` | 顯示前 20 大股東，含機構和個人，跨多個報告期 |
| `--object-id` | 查看特定股東持倉詳情（ID 從 `--top` 輸出獲取） |
| `--format` | 輸出格式：`table`（預設）或 `json` |
