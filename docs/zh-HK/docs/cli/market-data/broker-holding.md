---
title: 'broker-holding'
sidebar_label: 'broker-holding'
sidebar_position: 15
---

# longbridge broker-holding

查看港股經紀商持倉——最大買入/賣出經紀商、完整持倉明細，以及指定經紀商的逐日變動。

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

### 主要經紀商持倉

```bash
longbridge broker-holding 700.HK
longbridge broker-holding 9988.HK --period rct_5
```

展示主要買入和賣出經紀商。時間範圍選項：`rct_1`（1 日，預設）、`rct_5`（5 日）、`rct_20`（20 日）、`rct_60`（60 日）。

### 完整經紀商明細

```bash
longbridge broker-holding detail 700.HK
longbridge broker-holding detail 9988.HK
```

列出所有經紀商及其持倉數據。

### 指定經紀商的逐日變動

```bash
longbridge broker-holding daily 700.HK --broker B01224
```

展示特定經紀商（以參與者編號標識）的每日持倉變動。

### JSON 輸出

```bash
longbridge broker-holding 700.HK --format json
```

## 備註

僅支援港股市場，不支援美股及其他市場。
