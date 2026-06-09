---
title: '選股器'
sidebar_label: '選股器'
sidebar_position: 4
slug: '/cli/quant/screener'
---

# 選股器

`screener` 命令可用於列出已保存的策略、執行策略篩選股票、應用臨時篩選條件，以及瀏覽所有可用指標定義。

<TipContainer type="tip">

**在網頁端體驗** —— 下方展示的所有策略與篩選條件，亦可在 [選股器](https://longbridge.com/screener) 中互動式使用。建議先在那裡搭建篩選條件，再用 CLI 自動化執行。

</TipContainer>

## screener strategies

列出平台推薦的或你自己保存的選股策略。

```bash
# 美股（默認）推薦策略
longbridge screener strategies

# 港股推薦策略
longbridge screener strategies --market HK

# 我的自定義策略
longbridge screener strategies --mine
```

| 參數 | 默認值 | 說明 |
| ---- | ------ | ---- |
| `--market US\|HK\|CN\|SG` | `US` | 要列出策略的市場 |
| `--mine` | — | 顯示自己的策略，而非推薦策略 |
| `--format json` | — | 輸出原始 JSON |

## screener run \<ID\>

執行已保存的策略，列出滿足條件的股票。

```bash
# 以默認參數運行策略 42
longbridge screener run 42

# 分頁：第二頁，每頁 50 條
longbridge screener run 42 --page 1 --count 50

# 顯示指定列
longbridge screener run 42 --show pettm --show pbmrq
```

| 參數 | 默認值 | 說明 |
| ---- | ------ | ---- |
| `--page N` | `0` | 從零開始的頁碼 |
| `--count N` | `20` | 每頁記錄數 |
| `--sort KEY` | `prevchg` | 排序字段 |
| `--order asc\|desc` | `desc` | 排序方向 |
| `--show KEY` | — | 額外顯示的列（可重複使用） |
| `--format json` | — | 輸出原始 JSON |

默認輸出列：`prevclose`、`prevchg`、`marketcap`、`salesgrowthyoy`、`pettm`、`pbmrq`、`industry`。

默認按 `prevchg` 降序排序（漲幅最大的排在前面）。

**JSON 輸出格式**（數值類型，鍵名不含 `filter_` 前綴）：

```json
{
  "total": 87,
  "page": 0,
  "items": [
    {
      "symbol": "AAPL.US",
      "name": "Apple Inc.",
      "prevchg": 1.24,
      "pettm": 28.5,
      "pbmrq": 45.2,
      "marketcap": 3241500000000
    }
  ]
}
```

## screener filter

無需已保存的策略，直接在命令行指定篩選條件進行臨時選股。

```bash
# 港股中市盈率 10~50、ROE 大於 5% 的股票
longbridge screener filter pettm:10:50 roe:5: --market HK

# 美股中市值大於 1000 億美元的股票，第二頁
longbridge screener filter marketcap:100: --market US --page 1 --count 50

# 港股中 MACD 金叉股票（技術指標，附加參數）
longbridge screener filter 'macd_day:::category=goldenfork,period=day' --market HK
```

**條件格式：** `KEY:MIN:MAX` 或 `KEY:MIN:MAX:k=v,k=v`（用於技術指標）。

- `KEY` — 來自 `screener indicators` 的指標鍵值（不含 `filter_` 前綴）
- `MIN` — 下限（為空表示無下限）
- `MAX` — 上限（為空表示無上限）
- `k=v,...` — 技術指標的附加鍵值參數

| 參數 | 默認值 | 說明 |
| ---- | ------ | ---- |
| `--market US\|HK\|CN` | `US` | 篩選市場 |
| `--sort KEY` | `prevchg` | 排序字段 |
| `--order asc\|desc` | `desc` | 排序方向 |
| `--show KEY` | — | 額外顯示的列（可重複使用） |
| `--page N` | `0` | 從零開始的頁碼 |
| `--count N` | `20` | 每頁記錄數 |
| `--format json` | — | 輸出原始 JSON |

## screener indicators

列出選股器支持的所有指標定義。

```bash
longbridge screener indicators
longbridge screener indicators --format json
```

**JSON 輸出**為扁平數組（無嵌套分組），鍵名已去除 `filter_` 前綴：

```json
[
  {
    "id": 1,
    "key": "marketcap",
    "name": "市值",
    "unit": "bn",
    "min": "0",
    "max": "",
    "tech_values": {}
  },
  {
    "id": 29,
    "key": "divyld",
    "name": "股息率 (TTM)",
    "unit": "%",
    "min": "0",
    "max": "100",
    "tech_values": {}
  }
]
```
