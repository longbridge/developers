---
title: 'constituent'
sidebar_label: 'constituent'
sidebar_position: 13
---

# longbridge constituent

查看指數或 ETF 的成份股——支援排序選項和升跌統計。

<QuotePermission command="constituent" />

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

### 查看 ETF 持倉

```bash
longbridge constituent IVV.US
longbridge constituent QQQ.US --limit 20
```

對於 ETF 標的，`constituent` 會切換為展示持倉組合，而非指數成份股：

- **美股 ETF** — 默認從 SEC EDGAR N-PORT 文件獲取完整持倉組合，包含每隻持倉的名稱、CUSIP、權重、股數和市值：

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

- **其他 ETF**（或 SEC 數據不可用時，如 UIT 結構基金 `SPY.US`）— 回退到平台的資產分佈數據，按持倉、地區、資產類別、行業四組表格展示。

注意：

- N-PORT 數據為財季末快照，申報最長可延遲約 60 天——是權威的完整持倉列表，但非實時數據
- `--limit` 控制持倉行數；`--limit 0` 展示全部；對預先排序的持倉數據，`--sort` / `--order` 不生效
- 指數標的（如 `HSI.HK`、`.SPX.US`）行為完全不變

### JSON 輸出

```bash
longbridge constituent HSI.HK --format json
# ETF 持倉以結構化 JSON 輸出（完整列表，不截斷）
longbridge constituent IVV.US --format json
```
