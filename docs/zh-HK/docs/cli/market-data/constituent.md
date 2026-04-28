---
title: 'constituent'
sidebar_label: 'constituent'
sidebar_position: 13
---

# longbridge constituent

查看指數或 ETF 的成份股——支援排序選項和升跌統計。

## 基本用法

```bash
longbridge constituent HSI.HK
```

```
Constituents (90 total)  Rise: 0  Fall: 0  Flat: 0

| symbol  | name             | price   | prev_close | change% | volume    | turnover   |
|---------|------------------|---------|------------|---------|-----------|------------|
| 1211.HK | 比亞迪股份       | 110.300 | 105.100    | 0.0495  | 50148879  | 5500136961 |
| 322.HK  | 康師傅控股       | 13.230  | 12.990     | 0.0185  | 11929280  | 156922125  |
| 857.HK  | 中國石油股份     | 10.970  | 10.800     | 0.0157  | 96106689  | 1052688828 |
...
```

## 示例

### 查看指數成份股

```bash
longbridge constituent HSI.HK
longbridge constituent DJI.US
```

列出成份股，預設按升跌幅排序，包含價格和行情數據。

### 按不同指標排序

```bash
# 按成交額排序
longbridge constituent HSI.HK --sort turnover
# 按市值排序，升序
longbridge constituent DJI.US --sort market-cap --order asc
```

支援的排序欄位：`change`、`price`、`turnover`、`inflow`、`turnover-rate`、`market-cap`。

### 限制結果數量

```bash
longbridge constituent HSI.HK --limit 10
longbridge constituent SPX.US --limit 20 --sort inflow
```

### JSON 輸出

```bash
longbridge constituent HSI.HK --format json
```
