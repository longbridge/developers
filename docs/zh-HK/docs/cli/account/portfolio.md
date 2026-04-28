---
title: 'portfolio'
sidebar_label: 'portfolio'
sidebar_position: 1
---

# longbridge portfolio

取得完整投資組合概覽——總盈虧、總資產、各市場（美股/港股/A 股/新加坡）市值，以及現金餘額。

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

### 查看投資組合摘要

```bash
longbridge portfolio
longbridge portfolio --format json
```

展示總資產價值、總盈虧及今日盈虧，以及各市場市值分佈。

## 權限要求

需要 OAuth 帳戶權限。參見[帳戶權限設置](/zh-HK/docs/trade/)。
