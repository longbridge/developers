---
title: 'trading'
sidebar_label: 'trading'
sidebar_position: 11
---

# longbridge trading

查詢任意市場的交易時段安排和交易日曆。

## 基本用法

```bash
longbridge trading session
```

```
| Market | Session  | Open     | Close    |
|--------|----------|----------|----------|
| US     | Pre      | 04:00:00 | 09:30:00 |
| US     | Intraday | 09:30:00 | 16:00:00 |
| US     | Post     | 16:00:00 | 20:00:00 |
| HK     | Intraday | 09:30:00 | 12:00:00 |
| HK     | Intraday | 13:00:00 | 16:00:00 |
```

## 示例

### 查看所有市場的交易時段

```bash
longbridge trading session --format json
```

```json
[
  {
    "market": "US",
    "sessions": [
      { "close": "9:30:00.0", "open": "4:00:00.0", "session": "Pre" },
      { "close": "16:00:00.0", "open": "9:30:00.0", "session": "Intraday" },
      { "close": "20:00:00.0", "open": "16:00:00.0", "session": "Post" }
    ]
  },
  {
    "market": "HK",
    "sessions": [
      { "close": "12:00:00.0", "open": "9:30:00.0", "session": "Intraday" },
      { "close": "16:00:00.0", "open": "13:00:00.0", "session": "Intraday" }
    ]
  }
]
```

美股有三個交易時段（盤前、盤中、盤後）；港股有兩個盤中時段，中間有午休間隔。

### 查詢日期範圍內的交易日曆

```bash
longbridge trading days HK --start 2026-04-01 --end 2026-04-10 --format json
```

```json
{
  "half_trading_days": [],
  "trading_days": ["2026-04-01", "2026-04-02", "2026-04-08", "2026-04-09", "2026-04-10"]
}
```

返回指定範圍內的完整交易日列表及半日市列表，公眾假期自動排除。

### 查看今天是否為交易日

```bash
longbridge trading days US
```

省略 `--start` 和 `--end` 返回今日交易狀態。若今天是交易日，則出現在 `trading_days` 列表中。
