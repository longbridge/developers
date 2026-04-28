---
title: 'market-temp'
sidebar_label: 'market-temp'
sidebar_position: 10
---

# longbridge market-temp

获取 Longbridge 市场温度指数——结合估值与市场情绪的综合 0–100 情绪量表。数值越高表示市场越偏多头。

## 基本用法

```bash
longbridge market-temp US
```

```
| Field       | Value                                 |
|-------------|---------------------------------------|
| Market      | US                                    |
| Temperature | 64                                    |
| Description | Temp Comfortable & Gradually Dropping |
| Valuation   | 83                                    |
| Sentiment   | 45                                    |
```

## 示例

### 查看当前市场温度

```bash
# 港股市场
longbridge market-temp HK
# 美股市场
longbridge market-temp US
# 中国 A 股
longbridge market-temp CN
# JSON 输出，适合脚本或监控
longbridge market-temp US --format json
```

支持的市场：`HK`（默认）、`US`、`CN`（别名：`SH`、`SZ`）、`SG`。不带参数运行默认为 `HK`。

### 历史温度趋势

```bash
longbridge market-temp US --history --start 2026-04-01 --end 2026-04-09 --format json
```

```json
[
  { "description": "", "sentiment": "70", "temperature": "67", "time": "2026-04-01 04:00:00", "valuation": "64" },
  { "description": "", "sentiment": "34", "temperature": "50", "time": "2026-04-02 04:00:00", "valuation": "67" },
  { "description": "", "sentiment": "56", "temperature": "61", "time": "2026-04-06 04:00:00", "valuation": "67" }
]
```

返回指定范围内每个交易日的一条记录，适合在市场事件前后对情绪变化进行可视化分析。
