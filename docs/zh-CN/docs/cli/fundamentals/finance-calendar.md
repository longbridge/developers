---
title: 'finance-calendar'
sidebar_label: 'finance-calendar'
sidebar_position: 6
---

# longbridge finance-calendar

浏览即将到来的财经事件——财报发布、股息派发、IPO 及宏观经济数据发布，支持按标的、市场或事件类型过滤。

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

### 查看某股票的即将财报

```bash
longbridge finance-calendar financial --symbol TSLA.US
```

显示特斯拉即将到来的财报日期及分析师对 EPS 和营收的预测。使用 `--symbol` 缩小到特定股票。

### 查看美股今日股息事件

```bash
longbridge finance-calendar dividend --market US
```

列出所有美股今日股息相关事件（除息日、派息日）。适用于追踪哪些股票即将除息。

### 高重要性宏观事件

```bash
longbridge finance-calendar macrodata --star 3
```

只显示高重要性宏观经济数据发布（三星级），涵盖 CPI、非农就业、美联储利率决议等市场重要事件。

### IPO 日历

```bash
longbridge finance-calendar ipo
```

显示各支持市场即将到来的 IPO。可结合 `--market` 按交易所过滤。
