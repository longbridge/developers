---
title: 'warrant'
sidebar_label: 'warrant'
sidebar_position: 2
---

# longbridge warrant

瀏覽港股窩輪——列出某標的的所有窩輪、取得單只窩輪的即時行情，或查詢發行商資訊。

## 基本用法

```bash
longbridge warrant 700.HK
```

```
| Symbol   | Name            | Last | Leverage Ratio | Expiry     | Type |
|----------|-----------------|------|----------------|------------|------|
| 24760.HK | UBTENCT@EP2606B | 0.66 | 7.65           | 2026-06-30 | Call |
| 25228.HK | GJTENCT@EP2606B | 0.65 | 7.77           | 2026-06-30 | Call |
| 24687.HK | JPTENCT@EP2606A | 0.65 | 7.77           | 2026-06-30 | Call |
| 24880.HK | CITENCT@EP2606B | 0.64 | 7.89           | 2026-06-30 | Call |
...
```

## 示例

### 列出某股票的所有窩輪

```bash
longbridge warrant 700.HK --format json
```

```json
[
  {
    "expiry": "2026-06-30",
    "last": "0.65",
    "leverage_ratio": "7.7846153846153845",
    "name": "UBTENCT@EP2606B",
    "symbol": "24760.HK",
    "type": "Put"
  },
  {
    "expiry": "2026-06-30",
    "last": "0.65",
    "leverage_ratio": "7.7846153846153845",
    "name": "JPTENCT@EP2606A",
    "symbol": "24687.HK",
    "type": "Put"
  },
  {
    "expiry": "2026-06-30",
    "last": "0.64",
    "leverage_ratio": "7.90625",
    "name": "GJTENCT@EP2606B",
    "symbol": "25228.HK",
    "type": "Put"
  }
]
```

返回該標的所有上市窩輪，包括類型（認購/認沽）、最新價、槓桿比率及到期日。使用 `symbol` 字段可取得詳細行情。

### 取得單只窩輪行情

```bash
longbridge warrant quote 24760.HK --format json
```

```json
[
  {
    "expiry": "2026-06-30",
    "implied_vol": "0.344",
    "last": "0.650",
    "prev_close": "0.640",
    "symbol": "24760.HK",
    "type": "Put"
  }
]
```

返回包含隱含波動率、最新價及昨收價的即時行情。

### 查詢窩輪發行商

```bash
longbridge warrant issuers --format json
```

```json
[
  { "id": "1", "name_cn": "瑞信", "name_en": "CS" },
  { "id": "3", "name_cn": "摩通", "name_en": "JP" },
  { "id": "4", "name_cn": "麥銀", "name_en": "MB" },
  { "id": "8", "name_cn": "法興", "name_en": "SG" }
]
```

列出港股市場所有活躍窩輪發行商及其 ID 和名稱。

## 權限要求

需要窩輪行情權限。窩輪數據僅覆蓋港股市場。參見[行情訂閱](/zh-HK/docs/quote/)了解權限詳情。
