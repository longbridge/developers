---
title: 'withdrawals'
sidebar_label: 'withdrawals'
sidebar_position: 21
---

# longbridge withdrawals

查看出金历史记录。

## 基本用法

```bash
longbridge withdrawals
```

```
Total: 5

| id      | date                 | amount   | currency | type | state  |
|---------|----------------------|----------|----------|------|--------|
| 2096375 | 2026-04-30T07:57:49Z | 3000.00  | USD      | 电汇 | 已入账 |
| 2036889 | 2026-03-27T02:54:49Z | 10000.00 | USD      | 电汇 | 已入账 |
```

## 示例

### 查看出金记录

```bash
longbridge withdrawals
```

### 翻页

```bash
longbridge withdrawals --page 2 --count 50
```

## 权限要求

需要 OAuth 账户权限。参见[账户权限设置](/zh-CN/docs/trade/)。
