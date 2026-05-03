---
title: 'corp-action'
sidebar_label: 'corp-action'
sidebar_position: 12
---

# longbridge corp-action

查看股票的公司行動——拆股、派息、供股等。

## 基本用法

```bash
longbridge corp-action 700.HK
```

```
| date     | date_type  | action       | description                      |
|----------|------------|--------------|----------------------------------|
| 20260601 | 派息日     | 分配方案     | 每股派息 5.3 HKD                 |
| 20260518 | 登記日     | 分配方案     | 每股派息 5.3 HKD                 |
| 20260515 | 除權日     | 分配方案     | 每股派息 5.3 HKD                 |
| 20260318 |            | 業績披露     | 2025 財年四季報 營收 2161 億     |
...
```

預設返回最近 30 條記錄。使用 `--all` 可獲取完整歷史。

## 示例

### 查看公司行動

```bash
longbridge corp-action 700.HK
longbridge corp-action AAPL.US
```

列出最近 30 條公司行動，包括股份拆細、股息分派和供股配售。

### 查看完整歷史

```bash
longbridge corp-action 700.HK --all
```

返回所有可用的公司行動記錄。

### JSON 輸出

```bash
longbridge corp-action TSLA.US --format json
longbridge corp-action TSLA.US --all --format json
```
