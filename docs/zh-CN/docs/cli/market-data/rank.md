---
title: 'rank'
sidebar_label: 'rank'
sidebar_position: 20
---

# longbridge rank

LB 人气排行榜，综合交易热度、社区讨论、关注度等多维指标。不传 `--key` 时列出所有排行榜分类；传入 `--key` 时显示该榜单的股票排名。

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

### 查看美股总热度排行

```bash
longbridge rank --key hot_all-us
```

`--key` 值为上表中的 sub-key（如 `hot_all-us`）。

```
Rank — hot_all-us

| rank | symbol  | name  | price   | chg%    | pre/post | pre/post chg% |
|------|---------|-------|---------|---------|----------|---------------|
| 1    | NVDA.US | 英伟达 | 215.330 | -0.0190 | 214.297  | -0.0048       |
| 2    | AAPL.US | 苹果  | 205.100 | -0.42%  | 204.800  | -0.0015       |
```

### 查看港股总热度排行

```bash
longbridge rank --key hot_all-hk
```

### 查看热度上升榜（前 20）

```bash
longbridge rank --key hot_up-us --count 20
```

### 查看所有分类

```bash
longbridge rank
```

不传 `--key` 时以表格形式显示所有可用的排行榜分类和对应 sub-key。

### JSON 输出——传入 `--key`

```bash
longbridge rank --key hot_all-us --format json
```

```json
{
  "bmp": false,
  "lists": [
    {
      "symbol": "NVDA.US",
      "name": "英伟达",
      "last_done": "215.330",
      "chg": "-0.0190",
      "pre_post_price": "214.297",
      "pre_post_chg": "-0.0048",
      "inflow": "-750205778"
    }
  ]
}
```

JSON 字段说明：

| 字段 | 说明 |
|------|------|
| `bmp` | 是否为盘前/盘后行情 |
| `lists[].symbol` | `CODE.MARKET` 格式的标的代码 |
| `lists[].name` | 股票名称 |
| `lists[].last_done` | 最新价 |
| `lists[].chg` | 涨跌幅（小数形式） |
| `lists[].pre_post_price` | 盘前/盘后价格 |
| `lists[].pre_post_chg` | 盘前/盘后涨跌幅（小数形式） |
| `lists[].inflow` | 资金净流入（负数为净流出，单位：分） |

### JSON 输出——不传 `--key`

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

## 参数

| 参数 | 说明 |
|------|------|
| `--key` | 排行榜 sub-key（来自无参数时的表格，如 `hot_all-us`） |
| `--count` | 返回条数（默认：20） |
| `--format` | 输出格式：`table`（默认）或 `json` |

## 注意事项

- 人气排行综合考量交易热度、社区讨论量、关注数等多维指标，与纯价格涨跌排行不同
