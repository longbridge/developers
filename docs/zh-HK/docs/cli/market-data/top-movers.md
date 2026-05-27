---
title: 'top-movers'
sidebar_label: 'top-movers'
sidebar_position: 19
---

# longbridge top-movers

價格波動超過近 20 日標準差的異動股票。系統自動關聯相關新聞解讀異動原因，與 `anomaly` 命令（純技術信號）不同，`top-movers` 側重於有新聞背景的價格波動。

<QuotePermission command="top-movers" />

## 基本用法

```bash
longbridge top-movers
```

```
| time                 | symbol  | change% | reason           | tags             |
|----------------------|---------|---------|------------------|------------------|
| 2026-05-22T17:44:45Z | TSLA.US | +3.24%  | 波動超 20 日均值 | 汽車製造商       |
| 2026-05-22T14:42:36Z | RKLB.US | +11.32% | 波動超 20 日均值 | 航空航天與國防   |
```

## 示例

### 查看全市場異動

```bash
longbridge top-movers
```

不傳 `--market` 時返回所有市場的異動股票。

### 查看美股異動

```bash
longbridge top-movers --market US
```

### 查看港股異動

```bash
longbridge top-movers --market HK
```

### 按時間排序並增加返回數量

```bash
longbridge top-movers --market US --sort time --count 50
```

### 按漲跌幅排序

```bash
longbridge top-movers --market US --sort change
```

### JSON 輸出

```bash
longbridge top-movers --market US --format json
```

```json
{
  "events": [
    {
      "alert_reason": "波動超 20 日均值",
      "alert_type": 11,
      "timestamp": "1779471885",
      "stock": {
        "symbol": "TSLA.US",
        "code": "TSLA",
        "market": "US",
        "name": "特斯拉",
        "change": "0.0324",
        "last_done": "426.010",
        "labels": ["汽車製造商"]
      }
    }
  ],
  "updated_at": 1779471885
}
```

JSON 欄位說明：

| 欄位 | 說明 |
|------|------|
| `events[].alert_reason` | 異動原因描述 |
| `events[].alert_type` | 異動類型編碼 |
| `events[].timestamp` | 異動時間（Unix 時間戳，秒） |
| `events[].stock.symbol` | `CODE.MARKET` 格式的標的代碼（如 `TSLA.US`） |
| `events[].stock.code` | 股票代碼（不含市場後綴） |
| `events[].stock.market` | 市場（`US`、`HK`、`CN`、`SG`） |
| `events[].stock.name` | 股票名稱 |
| `events[].stock.change` | 漲跌幅（小數形式） |
| `events[].stock.last_done` | 最新價 |
| `events[].stock.labels` | 行業/標籤列表 |
| `updated_at` | 資料更新時間（Unix 時間戳，秒） |

## 參數

| 參數 | 說明 |
|------|------|
| `--market` | 市場：`HK`、`US`、`CN`、`SG`。可選，不傳時返回所有市場。 |
| `--sort` | 排序方式：`hot`（熱度，預設）、`time`（時間）、`change`（漲跌幅） |
| `--count` | 返回筆數（預設：20） |
| `--format` | 輸出格式：`table`（預設）或 `json` |

## 注意事項

- `top-movers` 關聯新聞，適合理解異動背景；`anomaly` 側重純技術信號
- 波動判斷基於近 20 日歷史波動標準差
