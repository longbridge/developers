---
title: '选股器'
sidebar_label: '选股器'
sidebar_position: 4
slug: '/cli/quant/screener'
---

# 选股器

`screener` 命令可用于列出已保存的策略、执行策略筛选股票、应用临时筛选条件，以及浏览所有可用指标定义。

<TipContainer type="tip">

**在网页端体验** —— 下方展示的所有策略与筛选条件，也可在 [选股器](https://longbridge.com/screener) 中交互式使用。建议先在那里搭建筛选条件，再用 CLI 自动化执行。

</TipContainer>

## screener strategies

列出平台推荐的或你自己保存的选股策略。

```bash
# 美股（默认）推荐策略
longbridge screener strategies

# 港股推荐策略
longbridge screener strategies --market HK

# 我的自定义策略
longbridge screener strategies --mine
```

| 参数 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `--market US\|HK\|CN\|SG` | `US` | 要列出策略的市场 |
| `--mine` | — | 显示自己的策略，而非推荐策略 |
| `--format json` | — | 输出原始 JSON |

## screener run \<ID\>

执行已保存的策略，列出满足条件的股票。

```bash
# 以默认参数运行策略 42
longbridge screener run 42

# 分页：第二页，每页 50 条
longbridge screener run 42 --page 1 --count 50

# 显示指定列
longbridge screener run 42 --show pettm --show pbmrq
```

| 参数 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `--page N` | `0` | 从零开始的页码 |
| `--count N` | `20` | 每页记录数 |
| `--sort KEY` | `prevchg` | 排序字段 |
| `--order asc\|desc` | `desc` | 排序方向 |
| `--show KEY` | — | 额外显示的列（可重复使用） |
| `--format json` | — | 输出原始 JSON |

默认输出列：`prevclose`、`prevchg`、`marketcap`、`salesgrowthyoy`、`pettm`、`pbmrq`、`industry`。

默认按 `prevchg` 降序排序（涨幅最大的排在前面）。

**JSON 输出格式**（数值类型，键名不含 `filter_` 前缀）：

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

无需已保存的策略，直接在命令行指定筛选条件进行临时选股。

```bash
# 港股中市盈率 10~50、ROE 大于 5% 的股票
longbridge screener filter pettm:10:50 roe:5: --market HK

# 美股中市值大于 1000 亿美元的股票，第二页
longbridge screener filter marketcap:100: --market US --page 1 --count 50

# 港股中 MACD 金叉股票（技术指标，附加参数）
longbridge screener filter 'macd_day:::category=goldenfork,period=day' --market HK
```

**条件格式：** `KEY:MIN:MAX` 或 `KEY:MIN:MAX:k=v,k=v`（用于技术指标）。

- `KEY` — 来自 `screener indicators` 的指标键值（不含 `filter_` 前缀）
- `MIN` — 下限（为空表示无下限）
- `MAX` — 上限（为空表示无上限）
- `k=v,...` — 技术指标的附加键值参数

| 参数 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `--market US\|HK\|CN` | `US` | 筛选市场 |
| `--sort KEY` | `prevchg` | 排序字段 |
| `--order asc\|desc` | `desc` | 排序方向 |
| `--show KEY` | — | 额外显示的列（可重复使用） |
| `--page N` | `0` | 从零开始的页码 |
| `--count N` | `20` | 每页记录数 |
| `--format json` | — | 输出原始 JSON |

## screener indicators

列出选股器支持的所有指标定义。

```bash
longbridge screener indicators
longbridge screener indicators --format json
```

**JSON 输出**为扁平数组（无嵌套分组），键名已去除 `filter_` 前缀：

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
