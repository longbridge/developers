---
title: 'institution-rating'
sidebar_label: 'institution-rating'
sidebar_position: 2
---

# longbridge institution-rating

查看華爾街分析師的一致性評級——買入/持有/賣出分佈、目標價區間及行業排名。

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

### 查看分析師一致性評級

```bash
longbridge institution-rating TSLA.US
```

展示分析師評級分佈（買入、持有、賣出及細分類別）、一致性目標價區間及行業同類排名。

### 查看歷史評級變化

```bash
# 展示逐周評級數量歷史及各分析師目標價
longbridge institution-rating detail TSLA.US
```

`detail` 子命令列出按周統計的歷史評級分佈及各分析師目標價，便於追蹤情緒隨時間的變化趨勢。

### JSON 輸出用於監控

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

`evaluate` 對象包含 52 位覆蓋分析師的各評級數量；`target` 對象顯示最高和最低目標價，以及上一收盤價供參考。
