---
title: 'static'
sidebar_label: 'static'
sidebar_position: 7
---

# longbridge static

获取任意标的的静态基本资料——名称、交易所、货币、手数、总股本、EPS、BPS 和股息率。

## 基本用法

```bash
longbridge static TSLA.US
```

```
| Symbol  | Name        | Exchange | Currency | Lot Size | Total Shares | Circ. Shares | EPS    | EPS TTM | BPS    | Dividend |
|---------|-------------|----------|----------|----------|--------------|--------------|--------|---------|--------|----------|
| TSLA.US | Tesla, Inc. | NASD     | USD      | 1        | 3752431984   | 2812676349   | 1.0111 | 1.0111  | 21.889 | 0        |
```

## 示例

### 同时查询多个标的

```bash
longbridge static NVDA.US TSLA.US
longbridge static NVDA.US TSLA.US --format json
```

一次调用返回所有请求标的的基本资料，适合快速对比基础属性。

### 交易前确认标的信息

```bash
longbridge static 700.HK
```

确认标的有效，并查看其交易所、货币、手数及当前股本——下单前的便捷校验工具。
