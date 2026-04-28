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
