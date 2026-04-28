---
title: 'market-status'
sidebar_label: 'market-status'
sidebar_position: 14
---

# longbridge market-status

查看各交易所当前的开市/休市状态。

## 基本用法

```bash
longbridge market-status
```

```
| market | status     |
|--------|------------|
| US     | Pre-Market |
| HK     | Closed     |
| CN     | Closed     |
| SG     | Closed     |
```

## 示例

### 查看所有市场状态

```bash
longbridge market-status
longbridge market-status --format json
```

展示各交易所（美股、港股、A 股、新加坡等）当前是否开市、休市，或处于盘前/盘后交易时段。
