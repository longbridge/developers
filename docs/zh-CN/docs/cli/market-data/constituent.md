---
title: 'constituent'
sidebar_label: 'constituent'
sidebar_position: 13
---

# longbridge constituent

查看指数或 ETF 的成分股——支持排序选项和涨跌统计。

<QuotePermission command="constituent" />

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

### 查看 ETF 持仓

```bash
longbridge constituent IVV.US
longbridge constituent QQQ.US --limit 20
```

对于 ETF 标的，`constituent` 会切换为展示持仓组合，而非指数成分股：

- **美股 ETF** — 默认从 SEC EDGAR N-PORT 文件获取完整持仓组合，包含每只持仓的名称、CUSIP、权重、股数和市值：

```
ETF Holdings — IVV.US (iShares Core S&P 500 ETF)
Source: SEC N-PORT, report period 2026-03-31, filed 2026-05-28, 507 holdings

| #  | name           | cusip     | weight | shares      | value(USD)     |
|----|----------------|-----------|--------|-------------|----------------|
| 1  | NVIDIA Corp.   | 67066G104 | 7.564% | 312,526,688 | 54,504,654,387 |
| 2  | Apple, Inc.    | 037833100 | 6.650% | 188,816,321 | 47,919,694,106 |
...
... and 457 more (use --limit 0 for all)
```

- **其他 ETF**（或 SEC 数据不可用时，如 UIT 结构基金 `SPY.US`）— 回退到平台的资产分布数据，按持仓、地区、资产类别、行业四组表格展示。

注意：

- N-PORT 数据为财季末快照，申报最长可延迟约 60 天——是权威的完整持仓列表，但非实时数据
- `--limit` 控制持仓行数；`--limit 0` 展示全部；对预先排序的持仓数据，`--sort` / `--order` 不生效
- 指数标的（如 `HSI.HK`、`.SPX.US`）行为完全不变

### JSON 输出

```bash
longbridge constituent HSI.HK --format json
# ETF 持仓以结构化 JSON 输出（完整列表，不截断）
longbridge constituent IVV.US --format json
```
