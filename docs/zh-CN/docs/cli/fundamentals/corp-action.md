---
title: 'corp-action'
sidebar_label: 'corp-action'
sidebar_position: 12
---

# longbridge corp-action

查看股票的公司行动——拆股、分红、配股等。

## 基本用法

```bash
longbridge corp-action 700.HK
```

```
| date     | date_type  | action       | description                      |
|----------|------------|--------------|----------------------------------|
| 20260601 | 派息日     | 分配方案     | 每股派息 5.3 HKD                 |
| 20260518 | 登记日     | 分配方案     | 每股派息 5.3 HKD                 |
| 20260515 | 除权日     | 分配方案     | 每股派息 5.3 HKD                 |
| 20260318 |            | 业绩披露     | 2025 财年四季报 营收 2161 亿     |
...
```

默认返回最近 30 条记录。使用 `--all` 可获取完整历史。

## 示例

### 查看公司行动

```bash
longbridge corp-action 700.HK
longbridge corp-action AAPL.US
```

列出最近 30 条公司行动，包括股票拆分、股息分配和配股发行。

### 查看完整历史

```bash
longbridge corp-action 700.HK --all
```

返回所有可用的公司行动记录。

### JSON 输出

```bash
longbridge corp-action TSLA.US --format json
longbridge corp-action TSLA.US --all --format json
```
