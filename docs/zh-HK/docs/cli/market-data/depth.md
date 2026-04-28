---
title: 'depth'
sidebar_label: 'depth'
sidebar_position: 2
---

# longbridge depth

查看某標的的 Level 2 盤口——買賣雙方前 10 檔價位的委託單數量和掛單量。

## 基本用法

```bash
longbridge depth TSLA.US
```

```
Symbol: TSLA.US

Asks (Sell):
| Position | Price   | Volume | Orders |
|----------|---------|--------|--------|
| 1        | 344.990 | 200    | 3      |
| 2        | 345.000 | 500    | 8      |
| 3        | 345.010 | 300    | 4      |

Bids (Buy):
| Position | Price   | Volume | Orders |
|----------|---------|--------|--------|
| 1        | 344.980 | 400    | 6      |
| 2        | 344.970 | 600    | 9      |
| 3        | 344.960 | 250    | 3      |
```

## 示例

### 查看盤口

```bash
longbridge depth 700.HK
longbridge depth 700.HK --format json
```

顯示 700.HK 當前的買賣盤檔位，包括各檔價格、掛單量和委託單數量。市場開盤期間每側最多返回 10 檔。

## 權限要求

需要 Level 2 行情訂閱。詳見 [行情訂閱](/zh-HK/docs/quote/) 中的訂閱選項。
