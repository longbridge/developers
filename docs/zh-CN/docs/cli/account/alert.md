---
title: 'alert'
sidebar_label: 'alert'
sidebar_position: 8
---

# longbridge alert

管理价格提醒——列出、添加和删除任意标的的价格提醒。

## 基本用法

```bash
longbridge alert
```

```
| id     | symbol  | price   | alert            | enabled | frequency |
|--------|---------|---------|------------------|---------|-----------|
| 112326 | TSLA.US | 348.950 | 价格跌到 239.000 | ✓       | every     |
| 179741 | NVDA.US | 188.630 | 价格跌到 130.000 |         | once      |
| 118486 | DAL.US  | 67.820  | 价格跌到 35.000  | ✓       | every     |
...
```

## 示例

### 列出所有提醒

```bash
longbridge alert
longbridge alert --format json
```

展示所有标的的活跃价格提醒。

### 按标的筛选

```bash
longbridge alert TSLA.US
longbridge alert QQQ.US
```

### 添加价格提醒

```bash
# TSLA 涨到 $300 时提醒
longbridge alert add TSLA.US --price 300 --direction rise
# AAPL 跌到 $150 时提醒
longbridge alert add AAPL.US --price 150 --direction fall
```

### 启用 / 停用提醒

```bash
# 停用提醒（保留设置，不删除）
longbridge alert disable 112326
# 重新启用已停用的提醒
longbridge alert enable 112326
```

### 删除提醒

```bash
# 按 ID 删除提醒（ID 来自提醒列表）
longbridge alert delete 486469
```

## 权限要求

需要 OAuth 账户权限。参见[账户权限设置](/zh-CN/docs/trade/)。
