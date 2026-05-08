---
title: 'institution-rating'
sidebar_label: 'institution-rating'
sidebar_position: 2
---

# longbridge institution-rating

查看华尔街分析师的一致性评级——买入/持有/卖出分布、目标价区间及行业排名。

## 基本用法

```bash
longbridge institution-rating TSLA.US
```

```
Consensus:
| recommend | target | change | updated_at  |
|-----------|--------|--------|-------------|
| buy       | 415.78 | 20.30% | 2026-04-09  |

Rating breakdown:
| strong_buy | buy | hold | sell | under | no_opinion | total |
|------------|-----|------|------|-------|------------|-------|
| 18         | 5   | 17   | 6    | 2     | 4          | 52    |

Target price range:
| lowest_price | highest_price | prev_close |
|--------------|---------------|------------|
| 125.000      | 600.000       | 345.62     |
```

## 示例

### 查看分析师一致性评级

```bash
longbridge institution-rating TSLA.US
```

展示分析师评级分布（买入、持有、卖出及细分类别）、一致性目标价区间及行业同类排名。

### 查看历史评级变化

```bash
# 展示逐周评级数量历史及各分析师目标价
longbridge institution-rating detail TSLA.US
```

`detail` 子命令列出按周统计的历史评级分布及各分析师目标价，便于追踪情绪随时间的变化趋势。

### 评级及目标价历史

```bash
longbridge institution-rating TSLA.US --history
```

展示分析师评级分布与一致性目标价随时间的变化情况，便于追踪分析师情绪的转变。

### 行业排名

```bash
longbridge institution-rating TSLA.US --industry-rank
# 翻页
longbridge institution-rating TSLA.US --industry-rank --page 2 --limit 20
```

```
| key             | value      |
|-----------------|------------|
| industry_name   | 汽车制造商 |
| industry_rank   | 1          |
| industry_mean   | 10         |
| industry_total  | 30         |

items:
| symbol   | name   | buy | hold | sell | total | rank |
|----------|--------|-----|------|------|-------|------|
| TSLA.US  | 特斯拉 | 23  | 17   | 10   | 51    | 1    |
| GM.US    | 通用汽车| 20 | 5    | 1    | 27    | 2    |
...
```

将同行业所有股票按分析师覆盖数量排名，直观了解你的持仓在行业内的研究关注度。

### JSON 输出用于监控

```bash
longbridge institution-rating TSLA.US --format json
```

```json
{
  "analyst": {
    "evaluate": {
      "buy": 18,
      "hold": 17,
      "no_opinion": 4,
      "over": 5,
      "sell": 6,
      "under": 2,
      "total": 52
    },
    "target": {
      "highest_price": "600.000",
      "lowest_price": "125.000",
      "prev_close": "345.62"
    }
  }
}
```

`evaluate` 对象包含 52 位覆盖分析师的各评级数量；`target` 对象显示最高和最低目标价，以及上一收盘价供参考。
