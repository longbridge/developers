---
title: 'constituent'
sidebar_label: 'constituent'
sidebar_position: 13
---

# longbridge constituent

查看指数或 ETF 的成分股——支持排序选项和涨跌统计。

## 基本用法

```bash
longbridge constituent HSI.HK
```

```
Constituents (90 total)  Rise: 0  Fall: 0  Flat: 0

| symbol  | name             | price   | prev_close | change% | volume    | turnover   |
|---------|------------------|---------|------------|---------|-----------|------------|
| 1211.HK | 比亚迪股份       | 110.300 | 105.100    | 0.0495  | 50148879  | 5500136961 |
| 322.HK  | 康师傅控股       | 13.230  | 12.990     | 0.0185  | 11929280  | 156922125  |
| 857.HK  | 中国石油股份     | 10.970  | 10.800     | 0.0157  | 96106689  | 1052688828 |
...
```

## 示例

### 查看指数成分股

```bash
longbridge constituent HSI.HK
longbridge constituent DJI.US
```

默认按涨跌幅排序，列出成分股及其价格和行情数据。

### 按不同指标排序

```bash
# 按成交额排序
longbridge constituent HSI.HK --sort turnover
# 按市值排序，升序
longbridge constituent DJI.US --sort market-cap --order asc
```

支持的排序字段：`change`、`price`、`turnover`、`inflow`、`turnover-rate`、`market-cap`。

### 限制结果数量

```bash
longbridge constituent HSI.HK --limit 10
longbridge constituent SPX.US --limit 20 --sort inflow
```

### JSON 输出

```bash
longbridge constituent HSI.HK --format json
```
