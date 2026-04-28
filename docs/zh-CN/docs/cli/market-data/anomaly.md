---
title: 'anomaly'
sidebar_label: 'anomaly'
sidebar_position: 18
---

# longbridge anomaly

检测异常市场波动和行情异动——价格急涨急跌、成交量异常放大等异常活动。

## 基本用法

```bash
longbridge anomaly
```

```
| time       | symbol   | name              | alert    | emotion |
|------------|----------|-------------------|----------|---------|
| 1775850599 | LRCX.US  | 泛林集团          | 大笔卖出 | Bear    |
| 1775850599 | VST.US   | Vistra            | 大笔买入 | Bull    |
| 1775850599 | LPCN.US  | Lipocine          | 急速拉升 | Bull    |
| 1775850598 | C.US     | 花旗              | 大笔卖出 | Bear    |
...
```

## 示例

### 查看港股市场异动

```bash
longbridge anomaly
longbridge anomaly --market HK
```

默认市场为港股。列出近期异常的价格和成交量波动。

### 查看美股市场异动

```bash
longbridge anomaly --market US
longbridge anomaly --market US --count 20
```

### 按标的筛选

```bash
longbridge anomaly --market US --symbol TSLA.US
```

### JSON 输出

```bash
longbridge anomaly --market HK --format json
```

## 备注

支持的市场：`HK`、`US`、`CN`、`SG`。每次请求最多返回 100 条结果。
