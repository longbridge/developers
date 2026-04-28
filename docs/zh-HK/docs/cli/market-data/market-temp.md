---
title: 'market-temp'
sidebar_label: 'market-temp'
sidebar_position: 10
---

# longbridge market-temp

取得 Longbridge 市場溫度指數——結合估值與市場情緒的綜合 0–100 情緒量表。數值越高表示市場越偏多頭。

## 基本用法

```bash
longbridge market-temp US
```

```
| Field       | Value                                 |
|-------------|---------------------------------------|
| Market      | US                                    |
| Temperature | 64                                    |
| Description | Temp Comfortable & Gradually Dropping |
| Valuation   | 83                                    |
| Sentiment   | 45                                    |
```

## 示例

### 查看當前市場溫度

```bash
# 港股市場
longbridge market-temp HK
# 美股市場
longbridge market-temp US
# 中國 A 股
longbridge market-temp CN
# JSON 輸出，適合腳本或監控
longbridge market-temp US --format json
```

支援的市場：`HK`（默認）、`US`、`CN`（別名：`SH`、`SZ`）、`SG`。不帶參數運行默認為 `HK`。

### 歷史溫度趨勢

```bash
longbridge market-temp US --history --start 2026-04-01 --end 2026-04-09 --format json
```

```json
[
  { "description": "", "sentiment": "70", "temperature": "67", "time": "2026-04-01 04:00:00", "valuation": "64" },
  { "description": "", "sentiment": "34", "temperature": "50", "time": "2026-04-02 04:00:00", "valuation": "67" },
  { "description": "", "sentiment": "56", "temperature": "61", "time": "2026-04-06 04:00:00", "valuation": "67" }
]
```

返回指定範圍內每個交易日的一條記錄，適合在市場事件前後對情緒變化進行可視化分析。
