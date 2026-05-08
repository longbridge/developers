---
title: 'withdrawals'
sidebar_label: 'withdrawals'
sidebar_position: 21
---

# longbridge withdrawals

查看出金歷史記錄。

## 基本用法

```bash
longbridge withdrawals
```

```
Total: 5

| id      | date                 | amount   | currency | type | state  |
|---------|----------------------|----------|----------|------|--------|
| 2096375 | 2026-04-30T07:57:49Z | 3000.00  | USD      | 電匯 | 已入賬 |
| 2036889 | 2026-03-27T02:54:49Z | 10000.00 | USD      | 電匯 | 已入賬 |
```

## 示例

### 查看出金記錄

```bash
longbridge withdrawals
```

### 翻頁

```bash
longbridge withdrawals --page 2 --count 50
```

## 權限要求

需要 OAuth 賬戶權限。參見[賬戶權限設置](/zh-HK/docs/trade/)。
