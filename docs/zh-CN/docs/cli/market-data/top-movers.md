---
title: 'top-movers'
sidebar_label: 'top-movers'
sidebar_position: 19
---

# longbridge top-movers

价格波动超过近 20 日标准差的异动股票。系统自动关联相关新闻解读异动原因，与 `anomaly` 命令（纯技术信号）不同，`top-movers` 侧重于有新闻背景的价格波动。

<QuotePermission command="top-movers" />

## 基本用法

```bash
longbridge top-movers
```

```
| time                 | symbol  | change% | reason           | tags             |
|----------------------|---------|---------|------------------|------------------|
| 2026-05-22T17:44:45Z | TSLA.US | +3.24%  | 波动超 20 日均值 | 汽车制造商       |
| 2026-05-22T14:42:36Z | RKLB.US | +11.32% | 波动超 20 日均值 | 航空航天与国防   |
```

## 示例

### 查看全市场异动

```bash
longbridge top-movers
```

不传 `--market` 时返回所有市场的异动股票。

### 查看美股异动

```bash
longbridge top-movers --market US
```

### 查看港股异动

```bash
longbridge top-movers --market HK
```

### 按时间排序并增加返回数量

```bash
longbridge top-movers --market US --sort time --count 50
```

### 按涨跌幅排序

```bash
longbridge top-movers --market US --sort change
```

### JSON 输出

```bash
longbridge top-movers --market US --format json
```

```json
{
  "events": [
    {
      "alert_reason": "波动超 20 日均值",
      "alert_type": 11,
      "timestamp": "1779471885",
      "stock": {
        "symbol": "TSLA.US",
        "code": "TSLA",
        "market": "US",
        "name": "特斯拉",
        "change": "0.0324",
        "last_done": "426.010",
        "labels": ["汽车制造商"]
      }
    }
  ],
  "updated_at": 1779471885
}
```

JSON 字段说明：

| 字段 | 说明 |
|------|------|
| `events[].alert_reason` | 异动原因描述 |
| `events[].alert_type` | 异动类型编码 |
| `events[].timestamp` | 异动时间（Unix 时间戳，秒） |
| `events[].stock.symbol` | `CODE.MARKET` 格式的标的代码（如 `TSLA.US`） |
| `events[].stock.code` | 股票代码（不含市场后缀） |
| `events[].stock.market` | 市场（`US`、`HK`、`CN`、`SG`） |
| `events[].stock.name` | 股票名称 |
| `events[].stock.change` | 涨跌幅（小数形式） |
| `events[].stock.last_done` | 最新价 |
| `events[].stock.labels` | 行业/标签列表 |
| `updated_at` | 数据更新时间（Unix 时间戳，秒） |

## 参数

| 参数 | 说明 |
|------|------|
| `--market` | 市场：`HK`、`US`、`CN`、`SG`。可选，不传时返回所有市场。 |
| `--sort` | 排序方式：`hot`（热度，默认）、`time`（时间）、`change`（涨跌幅） |
| `--count` | 返回条数（默认：20） |
| `--format` | 输出格式：`table`（默认）或 `json` |

## 注意事项

- `top-movers` 关联新闻，适合理解异动背景；`anomaly` 侧重纯技术信号
- 波动判断基于近 20 日历史波动标准差
