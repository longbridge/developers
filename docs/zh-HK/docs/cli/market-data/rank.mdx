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
Ranking Categories (use second-level key with --key)

| key            | name   | sub-key           | market |
|----------------|--------|-------------------|--------|
| hot_all        | 总热度 | hot_all-us        | US     |
| hot_all        | 总热度 | hot_all-hk        | HK     |
| hot_up         | 热度上升 | hot_up-us       | US     |
| hot_up         | 热度上升 | hot_up-hk       | HK     |
| trade_heat     | 热门交易 | trade_heat-us   | US     |
| trade_heat     | 热门交易 | trade_heat-hk   | HK     |
| discuss_heat   | 热议   | discuss_heat-us   | US     |
| discuss_heat   | 热议   | discuss_heat-hk   | HK     |
| discuss_heat   | 热议   | discuss_heat-cn   | CN     |
| discuss_heat   | 热议   | discuss_heat-sg   | SG     |
| watchlist_heat | 关注度 | watchlist_heat-us | US     |
| watchlist_heat | 关注度 | watchlist_heat-hk | HK     |
| watchlist_heat | 关注度 | watchlist_heat-cn | CN     |
| watchlist_heat | 关注度 | watchlist_heat-sg | SG     |
```

## 示例

### 查看美股總熱度排行

```bash
longbridge rank --key hot_all-us
```

`--key` 值為上表中的 sub-key（如 `hot_all-us`）。

```
Rank — hot_all-us

| rank | symbol  | name  | price   | chg%    | pre/post | pre/post chg% |
|------|---------|-------|---------|---------|----------|---------------|
| 1    | NVDA.US | 英偉達 | 215.330 | -0.0190 | 214.297  | -0.0048       |
| 2    | AAPL.US | 蘋果  | 205.100 | -0.42%  | 204.800  | -0.0015       |
```

### 查看港股總熱度排行

```bash
longbridge rank --key hot_all-hk
```

### 查看熱度上升榜（前 20）

```bash
longbridge rank --key hot_up-us --count 20
```

### 查看所有分類

```bash
longbridge rank
```

不傳 `--key` 時以表格形式顯示所有可用的排行榜分類和對應 sub-key。

### JSON 輸出——傳入 `--key`

```bash
longbridge rank --key hot_all-us --format json
```

```json
{
  "bmp": false,
  "lists": [
    {
      "symbol": "NVDA.US",
      "name": "英偉達",
      "last_done": "215.330",
      "chg": "-0.0190",
      "pre_post_price": "214.297",
      "pre_post_chg": "-0.0048",
      "inflow": "-750205778"
    }
  ]
}
```

JSON 欄位說明：

| 欄位 | 說明 |
|------|------|
| `bmp` | 是否為盤前/盤後行情 |
| `lists[].symbol` | `CODE.MARKET` 格式的標的代碼 |
| `lists[].name` | 股票名稱 |
| `lists[].last_done` | 最新價 |
| `lists[].chg` | 漲跌幅（小數形式） |
| `lists[].pre_post_price` | 盤前/盤後價格 |
| `lists[].pre_post_chg` | 盤前/盤後漲跌幅（小數形式） |
| `lists[].inflow` | 資金淨流入（負數為淨流出，單位：分） |

### JSON 輸出——不傳 `--key`

```bash
longbridge rank --format json
```

```json
{
  "first_tags": [
    {
      "key": "hot_all",
      "name": "总热度",
      "second_tags": [
        { "key": "hot_all-us", "market": "US", "name": "美股" },
        { "key": "hot_all-hk", "market": "HK", "name": "港股" }
      ]
    }
  ]
}
```

## 參數

| 參數 | 說明 |
|------|------|
| `--key` | 排行榜 sub-key（來自無參數時的表格，如 `hot_all-us`） |
| `--count` | 返回筆數（預設：20） |
| `--format` | 輸出格式：`table`（預設）或 `json` |

## 注意事項

- 人氣排行綜合考量交易熱度、社群討論量、關注數等多維指標，與純價格漲跌排行不同
