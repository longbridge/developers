---
title: 'rank'
sidebar_label: 'rank'
sidebar_position: 20
---

# longbridge rank

LB 人氣排行榜，綜合交易熱度、社群討論、關注度等多維指標。不傳 `--key` 時列出所有排行榜分類；傳入 `--key` 時顯示該榜單的股票排名。

<QuotePermission command="rank" />

## 基本用法

```bash
longbridge rank
```

```
Rank Categories

Total Heat:
  ib_hot_all-us   美股
  ib_hot_all-hk   港股
  ib_hot_all-cn   A 股

Heat Rising:
  ib_hot_up-us    美股
  ib_hot_up-hk    港股
  ib_hot_up-cn    A 股

Heat Falling:
  ib_hot_down-us  美股
  ib_hot_down-hk  港股
  ib_hot_down-cn  A 股
```

## 示例

### 查看美股總熱度排行

```bash
longbridge rank --key ib_hot_all-us
```

```
Rank — ib_hot_all-us

| # | symbol  | name    | last_done | chg     | inflow          |
|---|---------|---------|-----------|---------|-----------------|
| 1 | MU.US   | 美光科技 | 698.74    | +4.76%  | -347,041,642    |
| 2 | NVDA.US | 英偉達   | 131.80    | +3.21%  | +1,234,567,890  |
| 3 | AAPL.US | 蘋果     | 205.10    | -0.42%  | +567,890,123    |
```

### 查看港股總熱度排行

```bash
longbridge rank --key ib_hot_all-hk
```

### 查看熱度上升榜（前 20）

```bash
longbridge rank --key ib_hot_up-us --count 20
```

### 查看所有分類

```bash
longbridge rank
```

不傳 `--key` 時列出所有可用的排行榜 key，可直接複製用於 `--key` 參數。

## 參數

| 參數 | 說明 |
|------|------|
| `--key` | 排行榜 key（從無參數調用的輸出中獲取） |
| `--market` | 市場篩選，用於無參數時的分類清單（預設：`US`） |
| `--count` | 返回筆數（預設：20） |
| `--format` | 輸出格式：`table`（預設）或 `json` |

## 注意事項

- 人氣排行綜合考量交易熱度、社群討論量、關注數等多維指標，與純價格漲跌排行不同
- `inflow` 為當日資金淨流入（正值流入，負值流出）
