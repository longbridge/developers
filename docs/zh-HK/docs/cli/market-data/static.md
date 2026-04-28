---
title: 'static'
sidebar_label: 'static'
sidebar_position: 7
---

# longbridge static

取得任意標的的靜態基本資料——名稱、交易所、貨幣、手數、總股本、EPS、BPS 和股息率。

## 基本用法

```bash
longbridge static TSLA.US
```

```
| Symbol  | Name        | Exchange | Currency | Lot Size | Total Shares | Circ. Shares | EPS    | EPS TTM | BPS    | Dividend |
|---------|-------------|----------|----------|----------|--------------|--------------|--------|---------|--------|----------|
| TSLA.US | Tesla, Inc. | NASD     | USD      | 1        | 3752431984   | 2812676349   | 1.0111 | 1.0111  | 21.889 | 0        |
```

## 示例

### 同時查詢多個標的

```bash
longbridge static NVDA.US TSLA.US
longbridge static NVDA.US TSLA.US --format json
```

一次調用返回所有請求標的的基本資料，適合快速對比基礎屬性。

### 交易前確認標的資訊

```bash
longbridge static 700.HK
```

確認標的有效，並查看其交易所、貨幣、手數及當前股本——下單前的便捷校驗工具。
