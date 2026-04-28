---
title: 'finance-calendar'
sidebar_label: 'finance-calendar'
sidebar_position: 6
---

# longbridge finance-calendar

瀏覽即將到來的財經事件——財報發布、股息派發、IPO 及宏觀經濟數據發布，支持按標的、市場或事件類型篩選。

## 基本用法

```bash
longbridge finance-calendar financial --symbol TSLA.US
```

```
2026.01.28 (ET)  [Financials]  US  Tesla (TSLA.US)
  Q4 FY2025 Earnings Release
  EPS: Est 0.3466 / Act 0.24  |  Revenue: Est $24.8B / Act $24.9B
```

## 示例

### 查看某股票的即將財報

```bash
longbridge finance-calendar financial --symbol TSLA.US
```

顯示特斯拉即將到來的財報日期及分析師對 EPS 和營收的預測。使用 `--symbol` 縮小到特定股票。

### 查看美股今日股息事件

```bash
longbridge finance-calendar dividend --market US
```

列出所有美股今日股息相關事件（除息日、派息日）。適用於追蹤哪些股票即將除息。

### 高重要性宏觀事件

```bash
longbridge finance-calendar macrodata --star 3
```

只顯示高重要性宏觀經濟數據發布（三星級），涵蓋 CPI、非農就業、美聯儲利率決議等市場重要事件。

### IPO 日曆

```bash
longbridge finance-calendar ipo
```

顯示各支持市場即將到來的 IPO。可結合 `--market` 按交易所篩選。
