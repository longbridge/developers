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

### 查看美股总热度排行

```bash
longbridge rank --key ib_hot_all-us
```

```
Rank — ib_hot_all-us

| # | symbol  | name    | last_done | chg     | inflow          |
|---|---------|---------|-----------|---------|-----------------|
| 1 | MU.US   | 美光科技 | 698.74    | +4.76%  | -347,041,642    |
| 2 | NVDA.US | 英伟达   | 131.80    | +3.21%  | +1,234,567,890  |
| 3 | AAPL.US | 苹果     | 205.10    | -0.42%  | +567,890,123    |
```

### 查看港股总热度排行

```bash
longbridge rank --key ib_hot_all-hk
```

### 查看热度上升榜（前 20）

```bash
longbridge rank --key ib_hot_up-us --count 20
```

### 查看所有分类

```bash
longbridge rank
```

不传 `--key` 时列出所有可用的排行榜 key，可直接复制用于 `--key` 参数。

## 参数

| 参数 | 说明 |
|------|------|
| `--key` | 排行榜 key（从无参数调用的输出中获取） |
| `--market` | 市场筛选，用于无参数时的分类列表（默认：`US`） |
| `--count` | 返回条数（默认：20） |
| `--format` | 输出格式：`table`（默认）或 `json` |

## 注意事项

- 人气排行综合考量交易热度、社区讨论量、关注数等多维指标，与纯价格涨跌排行不同
- `inflow` 为当日资金净流入（正值流入，负值流出）
