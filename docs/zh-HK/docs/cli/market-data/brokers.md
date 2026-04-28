---
title: 'brokers'
sidebar_label: 'brokers'
sidebar_position: 3
---

# longbridge brokers

查看港股盤口各價位的券商 ID 分佈，適合識別機構資金的委託流向。

## 基本用法

```bash
longbridge brokers 700.HK
```

```
Symbol: 700.HK

Ask Brokers:
| Position | Broker IDs    |
|----------|---------------|
| 1        | 3014, 6409    |
| 2        | 7707, 724     |
| 3        | 1142          |

Bid Brokers:
| Position | Broker IDs    |
|----------|---------------|
| 1        | 5428, 3423    |
| 2        | 3506, 3507    |
| 3        | 4482, 4483    |
```

## 示例

### 查看券商分佈

```bash
longbridge brokers 700.HK
longbridge brokers 700.HK --format json
```

顯示港股盤口各價位及在該價位掛單的券商 ID。

## 權限要求

需要 Level 2 行情訂閱，僅支援港股市場。詳見 [行情訂閱](/zh-HK/docs/quote/) 中的訂閱選項。

## 說明

使用 `longbridge participants` 可按 ID 查詢券商名稱。`brokers` 輸出中的券商 ID 與 participants 列表中的 `broker_id` 欄位直接對應。
