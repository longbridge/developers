---
title: 'quote'
sidebar_label: 'quote'
sidebar_position: 1
---

# longbridge quote

获取一个或多个标的代码的实时行情——价格、成交量、较前收盘的涨跌幅，以及美股的盘前盘后数据。

## 基本用法

```bash
longbridge quote TSLA.US NVDA.US
```

```
| Symbol  | Last    | Prev Close | Open    | High    | Low     | Volume    | Turnover        | Status |
|---------|---------|------------|---------|---------|---------|-----------|-----------------|--------|
| TSLA.US | 345.620 | 343.250    | 343.150 | 348.880 | 337.250 | 62164016  | 21375312140.000 | Normal |
| NVDA.US | 183.910 | 182.080    | 181.840 | 184.080 | 180.620 | 116428523 | 21303315176.000 | Normal |

Extended Hours:
| Symbol  | Session | Last    | High    | Low     | Volume  | Prev Close | Time                |
|---------|---------|---------|---------|---------|---------|------------|---------------------|
| TSLA.US | Pre     | 343.100 | 346.450 | 339.695 | 945393  | 343.250    | 2026-04-09 13:30:00 |
| TSLA.US | Post    | 344.930 | 346.260 | 344.820 | 1348872 | 345.620    | 2026-04-09 23:59:59 |
| NVDA.US | Pre     | 181.990 | 182.080 | 180.000 | 1116645 | 182.080    | 2026-04-09 13:30:00 |
| NVDA.US | Post    | 183.020 | 183.950 | 182.900 | 6021581 | 183.910    | 2026-04-09 23:59:58 |
```

## 示例

### 查看单只股票

```bash
longbridge quote TSLA.US
```

显示 TSLA 的最新价、开盘价、最高价、最低价、成交量、成交额及前收盘价。

### 跨市场对比多个标的

```bash
longbridge quote TSLA.US NVDA.US 700.HK
longbridge quote TSLA.US NVDA.US 700.HK --format json
```

在一次调用中传入多个标的代码，可并排对比行情。支持不同市场的标的（US、HK、CN）。有盘前盘后数据时，美股输出中会包含 `pre_market_quote` 和 `post_market_quote` 字段。

### 获取盘前和盘后数据

```bash
# pre_market_quote 和 post_market_quote 字段出现在美股 JSON 输出中
longbridge quote TSLA.US --format json
```

对于美股，当有盘前盘后数据时，JSON 输出中包含 `pre_market_quote` 和 `post_market_quote` 对象。在美股正常交易时段内，这两个字段为 `null`。
