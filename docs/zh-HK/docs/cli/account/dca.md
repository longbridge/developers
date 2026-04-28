---
title: 'dca'
sidebar_label: 'dca'
sidebar_position: 10
---

# longbridge dca

定期定額——按固定金額定期自動買入。支援按日、週、雙週、月頻率建立定投計劃，管理計劃狀態，查看交易記錄，並監控累計收益。

不帶子指令時，列出所有定投計劃。

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

### 查看計劃列表

```bash
longbridge dca
longbridge dca --status Active
longbridge dca --symbol AAPL.US
```

按狀態（`Active`、`Suspended`、`Finished`）或標的篩選計劃。

### 建立計劃

```bash
# 每月 15 日
longbridge dca create AAPL.US --amount 500 --frequency monthly --day-of-month 15

# 每週一
longbridge dca create TSLA.US --amount 200 --frequency weekly --day-of-week mon

# 每兩週的週三
longbridge dca create 700.HK --amount 1000 --frequency fortnightly --day-of-week wed
```

建立計劃前，CLI 會展示條款與條件連結並提示確認。可加 `--agree-terms` 跳過互動提示：

```bash
longbridge dca create AAPL.US --amount 500 --frequency monthly --day-of-month 15 --agree-terms
```

### 管理計劃

```bash
longbridge dca pause 1225781523156889600
longbridge dca resume 1225781523156889600
longbridge dca stop 1225781523156889600
```

`stop` 永久終止計劃，不可撤銷。

### 查看交易記錄

```bash
longbridge dca history 1225781523156889600
```

展示指定計劃的交易執行記錄——交易日期、金額、價格和數量。

### 統計概覽

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

### 確認標的是否支援定投

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

### 計算下次交易日

```bash
longbridge dca calc-date --frequency weekly --day-of-week wed
longbridge dca calc-date --frequency monthly --day-of-month 15
```

根據給定參數計算下一個計劃交易日，不會建立實際計劃。

### 設定交易前提醒

```bash
longbridge dca set-reminder --hours 1
```

設定每次交易執行前提前幾小時發送提醒通知。

## 權限要求

需要已開通定投功能的 Longbridge 帳戶。港股及新加坡帳戶在建立計劃前須同意對應的條款與條件。參見[交易權限](/zh-HK/docs/trade/)了解帳戶設定。
