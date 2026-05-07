---
title: 'finance-calendar'
sidebar_label: 'finance-calendar'
sidebar_position: 6
---

# longbridge finance-calendar

瀏覽即將到來的財經事件——財報發布、股息派發、拆合股、IPO 及宏觀經濟數據，支援按標的、自選股、市場或事件類型篩選。

## 子命令

| 子命令      | 說明                         |
| ----------- | ---------------------------- |
| `report`    | 財報日曆（即將和最新發布）   |
| `dividend`  | 股息公告                     |
| `split`     | 拆股與合股                   |
| `ipo`       | IPO 上市                     |
| `macrodata` | 宏觀經濟數據發布             |
| `closed`    | 市場休市日                   |

## 示例

### 即將發布的財報

```bash
longbridge finance-calendar report
```

顯示從今天起即將發布的財報事件，同時展示近期已發布季度的 EPS 和營收預估值與實際值。

### 自選股中的美股財報

```bash
longbridge finance-calendar report --filter watchlist --market US
```

將財報日曆限定為自選股中的美股。使用 `--filter positions` 則限定為當前持倉。

### 持倉股票的派息事件

```bash
longbridge finance-calendar dividend --filter positions
```

只顯示當前持倉股票的股息事件，適合追蹤即將到來的除息日和派息日。

### 港股拆合股事件

```bash
longbridge finance-calendar split --market HK
```

顯示港股的拆股和合股事件。

### 高重要性宏觀事件

```bash
longbridge finance-calendar macrodata --star 3
```

只顯示高重要性宏觀經濟數據發布（三星級），涵蓋 CPI、非農就業、美聯儲利率決議等市場重要事件。

### IPO 日曆

```bash
longbridge finance-calendar ipo
```

顯示各支持市場即將到來的 IPO。可結合 `--market` 按交易所篩選。
