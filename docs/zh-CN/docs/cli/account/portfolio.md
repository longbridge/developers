---
title: 'portfolio'
sidebar_label: 'portfolio'
sidebar_position: 1
---

# longbridge portfolio

获取完整投资组合概览——总盈亏、总资产、各市场（美股/港股/A 股/新加坡）市值，以及现金余额。

## 基本用法

```bash
longbridge portfolio
```

```
| Field             | Value     |
|-------------------|-----------|
| Currency          | USD       |
| Total Asset       | 125422.43 |
| Market Cap        | 66783.59  |
| Total Cash        | 58638.84  |
| P/L               | 140473.44 |
| Intraday P/L      | 14637.05  |
| Margin Call       | 0         |
| Risk Level        | Safe      |
| Credit Limit      | 410651.27 |

| Market | Value (USD) | %       |
|--------|-------------|---------|
| US     | 58659.65    | 46.76%  |
| HK     | 493265.25   | 393.28% |
| Cash   | 58638.84    | 46.75%  |
```

## 示例

### 查看投资组合摘要

```bash
longbridge portfolio
longbridge portfolio --format json
```

展示总资产价值、总盈亏及今日盈亏，以及各市场市值分布。

## 权限要求

需要 OAuth 账户权限。参见[账户权限设置](/zh-CN/docs/trade/)。
