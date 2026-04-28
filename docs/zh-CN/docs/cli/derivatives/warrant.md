---
title: 'warrant'
sidebar_label: 'warrant'
sidebar_position: 2
---

# longbridge warrant

浏览港股窝轮——列出某标的的所有窝轮、获取单只窝轮的实时行情，或查询发行商信息。

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

### 列出某股票的所有窝轮

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

返回该标的所有上市窝轮，包括类型（认购/认沽）、最新价、杠杆比率及到期日。使用 `symbol` 字段可获取详细行情。

### 获取单只窝轮行情

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

返回包含隐含波动率、最新价及昨收价的实时行情。

### 查询窝轮发行商

```bash
longbridge warrant issuers --format json
```

```json
[
  { "id": "1", "name_cn": "瑞信", "name_en": "CS" },
  { "id": "3", "name_cn": "摩通", "name_en": "JP" },
  { "id": "4", "name_cn": "麦银", "name_en": "MB" },
  { "id": "8", "name_cn": "法兴", "name_en": "SG" }
]
```

列出港股市场所有活跃窝轮发行商及其 ID 和名称。

## 权限要求

需要窝轮行情权限。窝轮数据仅覆盖港股市场。参见[行情订阅](/zh-CN/docs/quote/)了解权限详情。
