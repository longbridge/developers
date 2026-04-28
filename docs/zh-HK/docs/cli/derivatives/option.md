---
title: 'option'
sidebar_label: 'option'
sidebar_position: 1
---

# longbridge option

查詢美股期權合約的即時行情、瀏覽完整期權鏈，以及查看認購/認沽成交量統計。

## 基本用法

```bash
longbridge option chain AAPL.US
```

```
| Expiry Date |
|-------------|
| 2026-04-17  |
| 2026-04-22  |
| 2026-04-24  |
| 2026-05-01  |
| 2026-05-15  |
| 2026-06-18  |
| 2026-07-17  |
| 2026-09-18  |
...
```

## 示例

### 瀏覽股票期權鏈

不加 `--date` 時，返回該標的所有可用到期日。選擇到期日後，使用 `--date` 參數查看對應的行使價列表。

### 查看指定到期日的行使價

```bash
longbridge option chain AAPL.US --date 2026-04-17 --format json
```

```json
[
  { "call_symbol": "AAPL260417C110000.US", "put_symbol": "AAPL260417P110000.US", "standard": "true", "strike": "110" },
  { "call_symbol": "AAPL260417C115000.US", "put_symbol": "AAPL260417P115000.US", "standard": "true", "strike": "115" },
  { "call_symbol": "AAPL260417C120000.US", "put_symbol": "AAPL260417P120000.US", "standard": "true", "strike": "120" }
]
```

每行展示該行使價對應的認購和認沽合約代碼。從 `call_symbol` 或 `put_symbol` 複製合約代碼即可取得即時行情。

### 取得期權合約即時行情

```bash
longbridge option quote AAPL260417C190000.US --format json
```

```json
[
  {
    "symbol": "AAPL260417C190000.US",
    "last": "12.35",
    "bid": "12.30",
    "ask": "12.40",
    "open_interest": "4821",
    "implied_volatility": "0.2341",
    "delta": "0.4812",
    "gamma": "0.0231",
    "theta": "-0.0512",
    "vega": "0.1843"
  }
]
```

返回該合約的最新買賣價、最新成交價、隱含波動率及希臘值（delta、gamma、theta、vega）。

### 期權成交量

查看今日即時認購/認沽成交量快照：

```bash
longbridge option volume AAPL.US
```

```
Option Volume Stats — AAPL.US

| call_vol | put_vol | pc_ratio |
|----------|---------|----------|
| 910,397  | 296,578 | 0.3258   |
```

查看歷史每日認購/認沽成交量及持倉量：

```bash
longbridge option volume daily AAPL.US
longbridge option volume daily AAPL.US --count 60
```

```
Option Volume Daily — AAPL.US

| date       | total_vol | call_vol | put_vol | pc_vol   | call_oi   | put_oi    | pc_oi    |
|------------|-----------|----------|---------|----------|-----------|-----------|----------|
| 2026-04-16 | 1,205,125 | 909,133  | 295,992 | 0.325576 | 2,719,025 | 1,913,086 | 0.703593 |
| 2026-04-15 | 1,611,875 | 1,250,894| 360,981 | 0.288578 | 2,684,251 | 1,914,190 | 0.713119 |
```

`pc_vol` 為認沽/認購成交量比；`pc_oi` 為認沽/認購持倉量比。

## 權限要求

`option quote` 需要期權帳戶及期權行情權限；`option chain` 和 `option volume` 需要一級行情權限。參見[行情訂閱](/zh-HK/docs/quote/)了解權限詳情。

## 說明

期權代碼格式：`AAPL260417C190000.US`——標的 AAPL，到期日 2026-04-17，認購（Call），行使價 $190.00。價格部分以 $0.001 為單位，因此 190000 = $190.00。
