---
title: 'compare'
sidebar_label: 'compare'
sidebar_position: 18
---

# longbridge compare

多股估值横向对比（PE/PB/PS/市值/收盘价/ROE）。不传对比股票时，服务端自动选取同行业标的。

## 基本用法

```bash
longbridge compare AAPL.US
```

```
Valuation Comparison

| symbol  | name   | market_value | close    | pe    | pb    | ps    | roe    |
|---------|--------|--------------|----------|-------|-------|-------|--------|
| AAPL.US | 苹果   | $3.01T       | 205.10   | 31.2  | 45.2  | 7.8   | 136.5% |
| MSFT.US | 微软   | $3.12T       | 420.30   | 35.8  | 12.1  | 12.3  | 35.2%  |
```

不指定对比标的时，系统自动从同行业中选取代表性标的进行对比。

## 示例

### 自动选取同行业标的

```bash
longbridge compare AAPL.US
```

系统根据行业归属自动选取同行业股票作为对比组，无需手动指定。

### 指定对比标的

```bash
longbridge compare AAPL.US MSFT.US GOOGL.US
```

最多支持 5 只股票（含主标的）的横向对比。

### 港股对比并指定货币

```bash
longbridge compare 700.HK 9988.HK --currency HKD
```

使用 `--currency` 统一市值、收盘价等货币单位，避免跨市场汇率干扰。

### JSON 输出

```bash
longbridge compare TSLA.US RIVN.US --format json
```

## 参数

| 参数 | 说明 |
|------|------|
| `symbol` | 主标的（必填） |
| `[others...]` | 对比标的（可选，最多 4 个） |
| `--currency` | 统一货币单位：`USD`、`HKD`、`CNY` |
| `--format` | 输出格式：`table`（默认）或 `json` |

## 注意事项

- 跨市场对比（如美股 vs 港股）时，建议指定 `--currency` 统一单位
- PE、PB、PS 为 TTM（过去 12 个月）数据
- ROE 为最新报告期数据
