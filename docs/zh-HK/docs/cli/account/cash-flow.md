---
title: 'cash-flow'
sidebar_label: 'cash-flow'
sidebar_position: 4
---

# longbridge cash-flow

查看資金流水歷史——入金、出金、股息到帳、交易結算及其他帳戶變動。

## 基本用法

```bash
longbridge cash-flow
```

```
| Flow Name | Symbol | Business Type | Balance | Currency | Time | Description |
|-----------|--------|---------------|---------|----------|------|-------------|
```

## 示例

### 查看最近 30 天的資金流水

```bash
longbridge cash-flow
```

列出過去 30 天內所有資金變動，包括流水類型、關聯標的、餘額、幣種及時間戳。

### 按日期範圍篩選

```bash
longbridge cash-flow --start 2026-01-01 --end 2026-03-31
```

取得指定日期範圍內的資金流水記錄。適用於季度對帳或稅務報告。

## 權限要求

需要 OAuth 帳戶權限。參見[帳戶權限設置](/zh-HK/docs/trade/)。
