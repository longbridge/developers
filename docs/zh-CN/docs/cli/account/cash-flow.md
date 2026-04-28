---
title: 'cash-flow'
sidebar_label: 'cash-flow'
sidebar_position: 4
---

# longbridge cash-flow

查看资金流水历史——入金、出金、股息到账、交易结算及其他账户变动。

## 基本用法

```bash
longbridge cash-flow
```

```
| Flow Name | Symbol | Business Type | Balance | Currency | Time | Description |
|-----------|--------|---------------|---------|----------|------|-------------|
```

## 示例

### 查看最近 30 天的资金流水

```bash
longbridge cash-flow
```

列出过去 30 天内所有资金变动，包括流水类型、关联标的、余额、币种及时间戳。

### 按日期范围过滤

```bash
longbridge cash-flow --start 2026-01-01 --end 2026-03-31
```

获取指定日期范围内的资金流水记录。适用于季度对账或税务报告。

## 权限要求

需要 OAuth 账户权限。参见[账户权限设置](/zh-CN/docs/trade/)。
