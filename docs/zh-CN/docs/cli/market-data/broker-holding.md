---
title: 'broker-holding'
sidebar_label: 'broker-holding'
sidebar_position: 15
---

# longbridge broker-holding

查看港股经纪商持仓——买卖方排行、完整持仓明细，以及指定经纪商的每日持仓变化。

## 基本用法

```bash
longbridge broker-holding 700.HK
```

```
Broker Holding Top (updated: 2026.04.10)

Buy:
| broker                              | parti_no | change(shares) |
|-------------------------------------|----------|----------------|
| ABN AMRO Clearing Hong Kong Limited | B01555   | +1,481,964     |
| Merrill Lynch Far East Limited      | B01224   | +1,145,214     |
| UBS Securities Hong Kong Limited    | B01161   | +903,134       |
...
```

## 示例

### 经纪商持仓排行

```bash
longbridge broker-holding 700.HK
longbridge broker-holding 9988.HK --period rct_5
```

展示买入和卖出排名靠前的经纪商。周期选项：`rct_1`（1 天，默认）、`rct_5`（5 天）、`rct_20`（20 天）、`rct_60`（60 天）。

### 完整经纪商明细

```bash
longbridge broker-holding detail 700.HK
longbridge broker-holding detail 9988.HK
```

列出所有经纪商及其持仓信息。

### 指定经纪商的每日持仓变化

```bash
longbridge broker-holding daily 700.HK --broker B01224
```

展示指定经纪商（按参与者编号识别）的每日持仓变动。

### JSON 输出

```bash
longbridge broker-holding 700.HK --format json
```

## 备注

仅支持港股市场。不支持美股及其他市场。
