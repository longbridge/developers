---
title: 'quote'
sidebar_label: 'quote'
sidebar_position: 1
---

# longbridge quote

取得一個或多個標的代碼的即時行情——價格、成交量、較前收盤的漲跌幅，以及美股的盤前盤後數據。

## 基本用法

```bash
longbridge quote TSLA.US NVDA.US
```

```
| Symbol  | Last    | Prev Close | Open    | High    | Low     | Volume    | Turnover        | Status |
|---------|---------|------------|---------|---------|---------|-----------|-----------------|--------|
| TSLA.US | 345.620 | 343.250    | 343.150 | 348.880 | 337.250 | 62164016  | 21375312140.000 | Normal |
| NVDA.US | 183.910 | 182.080    | 181.840 | 184.080 | 180.620 | 116428523 | 21303315176.000 | Normal |

Extended Hours:
| Symbol  | Session | Last    | High    | Low     | Volume  | Prev Close | Time                |
|---------|---------|---------|---------|---------|---------|------------|---------------------|
| TSLA.US | Pre     | 343.100 | 346.450 | 339.695 | 945393  | 343.250    | 2026-04-09 13:30:00 |
| TSLA.US | Post    | 344.930 | 346.260 | 344.820 | 1348872 | 345.620    | 2026-04-09 23:59:59 |
| NVDA.US | Pre     | 181.990 | 182.080 | 180.000 | 1116645 | 182.080    | 2026-04-09 13:30:00 |
| NVDA.US | Post    | 183.020 | 183.950 | 182.900 | 6021581 | 183.910    | 2026-04-09 23:59:58 |
```

## 示例

### 查看單隻股票

```bash
longbridge quote TSLA.US
```

顯示 TSLA 的最新價、開盤價、最高價、最低價、成交量、成交額及前收盤價。

### 跨市場對比多個標的

```bash
longbridge quote TSLA.US NVDA.US 700.HK
longbridge quote TSLA.US NVDA.US 700.HK --format json
```

在一次調用中傳入多個標的代碼，可並排對比行情。支援不同市場的標的（US、HK、CN）。有盤前盤後數據時，美股輸出中會包含 `pre_market_quote` 和 `post_market_quote` 欄位。

### 取得盤前和盤後數據

```bash
# pre_market_quote 和 post_market_quote 欄位出現在美股 JSON 輸出中
longbridge quote TSLA.US --format json
```

對於美股，當有盤前盤後數據時，JSON 輸出中包含 `pre_market_quote` 和 `post_market_quote` 物件。在美股正常交易時段內，這兩個欄位為 `null`。
