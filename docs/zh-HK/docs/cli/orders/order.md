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

### 查看今日委託

```bash
longbridge order
```

列出今日所有委託及其狀態、標的代碼、數量、價格和委託 ID。

### 查詢指定標的的歷史委託

```bash
longbridge order --history --start 2026-01-01 --symbol TSLA.US
```

按標的和日期範圍篩選歷史委託。使用 `--start` 和 `--end` 設定日期窗口。

### 提交限價買入委託

```bash
longbridge order buy TSLA.US 10 --price 340.00
```

以 340.00 美元的價格對 TSLA 提交 10 股限價買入委託。命令在提交前會提示確認。

### 提交限價賣出委託

```bash
longbridge order sell TSLA.US 5 --price 360.00
```

以 360.00 美元的價格對 TSLA 提交 5 股限價賣出委託。命令在提交前會提示確認。

### 賣空（無持倉做空）

```bash
longbridge order sell META.US 1 --price 620.00
```

對沒有持倉的標的提交賣出委託即可開空，無需任何額外參數。平倉時對相同標的和數量提交買入委託即可。

**市場支援情況：**

**美股**無需額外開通，直接可以賣空。

**港股**賣空需要開通：在 Longbridge 手機客戶端發起首筆港股賣空委託，下單過程中會觸發「證券借貸協議（SBL）」簽署流程，完成簽署後等待審核通過即可。注意：港股賣空需繳納由香港稅務局徵收的相關稅費，具體以應用內協議說明為準。未簽署協議時 API 返回錯誤 `602301`。

**A 股（SH/SZ）**暫不支援賣空，CLI 不支援北向通（滬深港通）交易。

### 查看成交記錄

```bash
longbridge order executions
```

列出當日所有已成交的委託，包括成交價格、數量和時間。

### 查看委託詳情

```bash
# 查詢指定委託的完整詳情
longbridge order detail 701276261045858304
```

返回該委託的成交明細、時間戳和成交資訊。

### 撤銷待成交委託

```bash
# 撤單前會提示確認
longbridge order cancel 701276261045858304
```

僅接受處於可撤狀態的委託（New、PartialFilled 等）。在腳本中使用 `-y` 跳過確認提示。

### 修改未成交委託

```bash
# 修改待成交委託的數量或價格
longbridge order replace 701276261045858304 --qty 5 --price 350.00
```

`--qty` 為必填項。省略 `--price` 則保持當前限價不變。在腳本中使用 `-y` 跳過確認提示。

## 權限要求

提交、撤銷或修改委託需要 OAuth 交易權限。詳見 [交易權限設定](/zh-HK/docs/trade/) 指南以開啟交易存取。

## 說明

`buy` 和 `sell` 在提交前始終提示確認。在腳本場景中使用 `cancel` 和 `replace` 時，可加 `-y` 跳過確認。
