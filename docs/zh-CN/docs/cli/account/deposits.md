---
title: 'deposits'
sidebar_label: 'deposits'
sidebar_position: 22
---

# longbridge deposits

查看入金历史记录，支持按状态和货币筛选。

## 基本用法

```bash
longbridge deposits
```

```
Total: 3

| id      | date                 | amount   | currency | type | state  |
|---------|----------------------|----------|----------|------|--------|
| 2096375 | 2026-04-30T07:57:49Z | 3000.00  | USD      | 电汇 | 已入账 |
| 2036889 | 2026-03-27T02:54:49Z | 10000.00 | USD      | 电汇 | 已入账 |
| 1980183 | 2026-03-02T02:32:11Z | 3132.60  | USD      | 电汇 | 已入账 |
```

## 示例

### 查看全部入金记录

```bash
longbridge deposits
```

### 按状态筛选

```bash
# 0=待处理, 1=已入账, 2=失败
longbridge deposits --states 1
```

### 按货币筛选

```bash
longbridge deposits --currencies HKD,USD
```

### 翻页

```bash
longbridge deposits --page 2 --count 50
```

## 权限要求

需要 OAuth 账户权限。参见[账户权限设置](/zh-CN/docs/trade/)。
