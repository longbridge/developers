---
title: 'exchange-rate'
sidebar_label: 'exchange-rate'
sidebar_position: 4
---

# longbridge exchange-rate

取得 Longbridge 帳戶中所有貨幣對的當前匯率。

## 基本用法

```bash
longbridge exchange-rate
```

```
| pair      | average_rate | bid_rate | offer_rate |
|-----------|--------------|----------|------------|
| HKD → CNH | 1.1465       | 1.1465   | 1.1465     |
| HKD → HKD | 1            | 1        | 1          |
| HKD → USD | 7.7925       | 7.7925   | 7.7925     |
| HKD → CNY | 1.1465       | 1.1465   | 1.1465     |
```

## 示例

### 查看所有匯率

```bash
longbridge exchange-rate
longbridge exchange-rate --format json
```

顯示帳戶中所有可用貨幣對（如 HKD/USD、HKD/CNH）的買入價、賣出價和中間價。所有匯率以港幣（HKD）為基準貨幣報價。

## 權限要求

無需登錄，此命令無需鑑權即可使用。
