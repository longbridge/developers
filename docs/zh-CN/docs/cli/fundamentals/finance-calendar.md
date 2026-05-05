---
title: 'finance-calendar'
sidebar_label: 'finance-calendar'
sidebar_position: 6
---

# longbridge finance-calendar

浏览即将到来的财经事件——财报发布、股息派发、拆合股、IPO 及宏观经济数据，支持按标的、自选股、市场或事件类型过滤。

## 子命令

| 子命令      | 说明                       |
| ----------- | -------------------------- |
| `report`    | 财报日历（即将和最新发布） |
| `dividend`  | 股息公告                   |
| `split`     | 拆股与合股                 |
| `ipo`       | IPO 上市                   |
| `macrodata` | 宏观经济数据发布           |
| `closed`    | 市场休市日                 |

## 示例

### 即将发布的财报

```bash
longbridge finance-calendar report
```

显示从今天起即将发布的财报事件，同时展示近期已发布季度的 EPS 和营收预估值与实际值。

### 自选股中的美股财报

```bash
longbridge finance-calendar report --filter watchlist --market US
```

将财报日历限定为自选股中的美股。使用 `--filter positions` 则限定为当前持仓。

### 持仓股票的分红事件

```bash
longbridge finance-calendar dividend --filter positions
```

只显示当前持仓股票的股息事件，适合追踪即将到来的除息日和派息日。

### 港股拆合股事件

```bash
longbridge finance-calendar split --market HK
```

显示港股的拆股和合股事件。

### 高重要性宏观事件

```bash
longbridge finance-calendar macrodata --star 3
```

只显示高重要性宏观经济数据发布（三星级），涵盖 CPI、非农就业、美联储利率决议等市场重要事件。

### IPO 日历

```bash
longbridge finance-calendar ipo
```

显示各支持市场即将到来的 IPO。可结合 `--market` 按交易所过滤。
