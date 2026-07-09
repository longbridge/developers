---
title: 'order'
sidebar_label: 'order'
sidebar_position: 1
---

# longbridge order

查看委託記錄和成交明細，或直接在終端提交買入/賣出委託。

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

僅接受處於可撤狀態的委託（New、PartialFilled 等）。在腳本中使用 `-y` 跳過確認提示。

### 修改未成交委託

```bash
# 修改待成交委託的數量或價格
longbridge order replace 701276261045858304 --qty 5 --price 350.00
```

`--qty` 為必填項。省略 `--price` 則保持當前限價不變。在腳本中使用 `-y` 跳過確認提示。

## 選項

| 選項 | 描述 | 默認值 |
| ---- | ---- | ------ |
| `--action` | 方向篩選：`buy` \| `sell`（美股賬戶） | — |
| `--attached` | 在 `order detail` 中顯示關聯子委託（美股賬戶） | false |

## 權限要求

提交、撤銷或修改委託需要 OAuth 交易權限。詳見 [交易權限設定](/zh-HK/docs/trade/) 指南以開啟交易存取。

## 說明

`buy` 和 `sell` 在提交前始終提示確認。在腳本場景中使用 `cancel` 和 `replace` 時，可加 `-y` 跳過確認。
