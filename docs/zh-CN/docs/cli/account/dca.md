---
title: 'dca'
sidebar_label: 'dca'
sidebar_position: 10
---

# longbridge dca

定投——按固定金额定期自动买入。支持按日、周、双周、月频率创建定投计划，管理计划状态，查看交易历史，并监控累计收益。

不带子命令时，列出所有定投计划。

## 基本用法

```bash
longbridge dca
```

```
| Plan ID             | Symbol  | Status   | Amount | Frequency   | Day of Week | Next Trade Date      | Cum Amount | Cum Profit | Avg Cost |
|---------------------|---------|----------|--------|-------------|-------------|----------------------|------------|------------|----------|
| 1225781523156889600 | SPY.US  | Finished | 750    | Fortnightly | Wed         | 2026-04-08T14:00:00Z | 0          | 0          | 0        |
| 1225781323482853376 | QQQ.US  | Finished | 750    | Fortnightly | Tue         | 2026-04-07T14:00:00Z | 0          | 0          | 0        |
```

## 示例

### 查看计划列表

```bash
longbridge dca
longbridge dca --status Active
longbridge dca --symbol AAPL.US
```

按状态（`Active`、`Suspended`、`Finished`）或标的筛选计划。

### 创建计划

```bash
# 每月 15 日
longbridge dca create AAPL.US --amount 500 --frequency monthly --day-of-month 15

# 每周一
longbridge dca create TSLA.US --amount 200 --frequency weekly --day-of-week mon

# 每两周的周三
longbridge dca create 700.HK --amount 1000 --frequency fortnightly --day-of-week wed
```

创建计划前，CLI 会展示条款与条件链接并提示确认。可加 `--agree-terms` 跳过交互提示：

```bash
longbridge dca create AAPL.US --amount 500 --frequency monthly --day-of-month 15 --agree-terms
```

### 管理计划

```bash
longbridge dca pause 1225781523156889600
longbridge dca resume 1225781523156889600
longbridge dca stop 1225781523156889600
```

`stop` 永久终止计划，不可撤销。

### 查看交易历史

```bash
longbridge dca history 1225781523156889600
```

展示指定计划的交易执行记录——交易日期、金额、价格和数量。

### 统计概览

```bash
longbridge dca stats
```

```
| Field           | Value |
|-----------------|-------|
| active_count    | 2     |
| finished_count  | 3     |
| suspended_count | 0     |
| total_amount    | 1500  |
| total_profit    | 243   |
```

### 检查标的是否支持定投

```bash
longbridge dca check AAPL.US TSLA.US 700.HK
```

```
| Symbol  | Supports Recurring Investment |
|---------|-------------------------------|
| AAPL.US | yes                           |
| TSLA.US | yes                           |
| 700.HK  | yes                           |
```

### 计算下次交易日

```bash
longbridge dca calc-date --frequency weekly --day-of-week wed
longbridge dca calc-date --frequency monthly --day-of-month 15
```

根据给定参数计算下一个计划交易日，不会创建实际计划。

### 设置交易前提醒

```bash
longbridge dca set-reminder --hours 1
```

设置每次交易执行前提前几小时发送提醒通知。

## 权限要求

需要已开通定投功能的 Longbridge 账户。港股及新加坡账户在创建计划前须同意对应的条款与条件。参见[交易权限](/zh-CN/docs/trade/)了解账户设置。
