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

仅接受处于可撤状态的委托（New、PartialFilled 等）。在脚本中使用 `-y` 跳过确认提示。

### 修改未成交委托

```bash
# 修改待成交委托的数量或价格
longbridge order replace 701276261045858304 --qty 5 --price 350.00
```

`--qty` 为必填项。省略 `--price` 则保持当前限价不变。在脚本中使用 `-y` 跳过确认提示。

## 选项

| 选项 | 描述 | 默认值 |
| ---- | ---- | ------ |
| `--action` | 方向筛选：`buy` \| `sell`（美股账户） | — |
| `--attached` | 在 `order detail` 中显示关联子委托（美股账户） | false |

## 权限要求

提交、撤销或修改委托需要 OAuth 交易权限。详见 [交易权限设置](/zh-CN/docs/trade/) 指南以开启交易访问。

## 说明

`buy` 和 `sell` 在提交前始终提示确认。在脚本场景中使用 `cancel` 和 `replace` 时，可加 `-y` 跳过确认。
