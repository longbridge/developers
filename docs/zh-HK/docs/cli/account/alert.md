---
title: 'alert'
sidebar_label: 'alert'
sidebar_position: 8
---

# longbridge alert

管理到價提醒——列出、新增和刪除任意標的的價格提醒。

## 基本用法

```bash
longbridge alert
```

```
| id     | symbol  | price   | alert            | enabled | frequency |
|--------|---------|---------|------------------|---------|-----------|
| 112326 | TSLA.US | 348.950 | 價格跌到 239.000 | ✓       | every     |
| 179741 | NVDA.US | 188.630 | 價格跌到 130.000 |         | once      |
| 118486 | DAL.US  | 67.820  | 價格跌到 35.000  | ✓       | every     |
...
```

## 示例

### 列出所有提醒

```bash
longbridge alert
longbridge alert --format json
```

展示所有標的的有效價格提醒。

### 按標的篩選

```bash
longbridge alert TSLA.US
longbridge alert QQQ.US
```

### 新增價格提醒

```bash
# 當 TSLA 升至 $300 時提醒
longbridge alert add TSLA.US --price 300 --direction rise
# 當 AAPL 跌至 $150 時提醒
longbridge alert add AAPL.US --price 150 --direction fall
```

### 啟用 / 停用提醒

```bash
# 停用提醒（保留設定，不刪除）
longbridge alert disable 112326
# 重新啟用已停用的提醒
longbridge alert enable 112326
```

### 刪除提醒

```bash
# 按 ID 刪除提醒（ID 從提醒列表中取得）
longbridge alert delete 486469
```

## 權限要求

需要 OAuth 帳戶權限。參見[帳戶權限設置](/zh-HK/docs/trade/)。
