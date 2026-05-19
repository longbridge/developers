---
title: 'order'
sidebar_label: 'order'
sidebar_position: 1
---

# longbridge order

查看委托记录和成交明细，或直接在终端提交买入/卖出委托。

## 基本用法

```bash
longbridge order
```

```
| Order ID           | Symbol  | Side | Order Type | Status        | Qty | Price  | Exec Qty | Exec Price | Created At          |
|--------------------|---------|------|------------|---------------|-----|--------|----------|------------|---------------------|
| 701276261045858304 | TSLA.US | Buy  | LO         | Filled        | 10  | 340.00 | 10       | 339.85     | 2026-04-10 09:32:14 |
| 701276261045858305 | NVDA.US | Sell | LO         | PartialFilled | 20  | 185.00 | 12       | 185.00     | 2026-04-10 09:45:01 |
| 701276261045858306 | AAPL.US | Buy  | MO         | New           | 5   | -      | 0        | -          | 2026-04-10 10:01:33 |
```

## 示例

### 查看今日委托

```bash
longbridge order
```

列出今日所有委托及其状态、标的代码、数量、价格和委托 ID。

### 查询指定标的的历史委托

```bash
longbridge order --history --start 2026-01-01 --symbol TSLA.US
```

按标的和日期范围筛选历史委托。使用 `--start` 和 `--end` 设置日期窗口。

### 提交限价买入委托

```bash
longbridge order buy TSLA.US 10 --price 340.00
```

以 340.00 美元的价格对 TSLA 提交 10 股限价买入委托。命令在提交前会提示确认。

### 提交限价卖出委托

```bash
longbridge order sell TSLA.US 5 --price 360.00
```

以 360.00 美元的价格对 TSLA 提交 5 股限价卖出委托。命令在提交前会提示确认。

### 卖空（无持仓做空）

```bash
longbridge order sell META.US 1 --price 620.00
```

对没有持仓的标的提交卖出委托即可开空，无需任何额外参数。平仓时对相同标的和数量提交买入委托即可。

**市场支持情况：**

**美股**无需额外开通，直接可以卖空。

**港股**卖空需要开通：在 Longbridge 手机客户端发起首笔港股卖空委托，下单过程中会触发「证券借贷协议（SBL）」签署流程，完成签署后等待审核通过即可。注意：港股卖空需缴纳由香港税务局征收的相关税费，具体以应用内协议说明为准。未签署协议时 API 返回错误 `602301`。

**A 股（SH/SZ）**暂不支持卖空，CLI 不支持北向通（沪深港通）交易。

### 查看成交记录

```bash
longbridge order executions
```

列出当日所有已成交的委托，包括成交价格、数量和时间。

### 查看委托详情

```bash
# 查询指定委托的完整详情
longbridge order detail 701276261045858304
```

返回该委托的成交明细、时间戳和成交信息。

### 撤销待成交委托

```bash
# 撤单前会提示确认
longbridge order cancel 701276261045858304
```

仅接受处于可撤状态的委托（New、PartialFilled 等）。在脚本中使用 `-y` 跳过确认提示。

### 修改未成交委托

```bash
# 修改待成交委托的数量或价格
longbridge order replace 701276261045858304 --qty 5 --price 350.00
```

`--qty` 为必填项。省略 `--price` 则保持当前限价不变。在脚本中使用 `-y` 跳过确认提示。

## 权限要求

提交、撤销或修改委托需要 OAuth 交易权限。详见 [交易权限设置](/zh-CN/docs/trade/) 指南以开启交易访问。

## 说明

`buy` 和 `sell` 在提交前始终提示确认。在脚本场景中使用 `cancel` 和 `replace` 时，可加 `-y` 跳过确认。
