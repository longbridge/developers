---
title: 'grid'
sidebar_label: 'grid'
sidebar_position: 1.5
---

# longbridge grid

在終端管理網格交易策略訂單——提交網格、查看運行中的網格及其觸發記錄，並掛起、重啟、修改或取消網格。

## 基本用法

```bash
# 列出你的網格訂單
longbridge grid
```

```
| 訂單 ID            | 標的    | 狀態       | 基準價 | 區間          | 觸發      | 數量 | 觸發次數 | 幣種 |
|--------------------|---------|------------|--------|---------------|-----------|------|----------|------|
| 764609681686573056 | 700.HK  | Performing | 300.00 | 240.00–360.00 | ±2%       | 100  | 3        | HKD  |
```

## 示例

### 準備

```bash
# 記錄一次性的策略風險揭示確認（網格交易前必須執行一次）
longbridge grid questionnaire
# 查看標的的網格信息：每手股數、最新價、授權狀態、幣種
longbridge grid info 700.HK
```

### 提交網格

```bash
# 在 700.HK 上按百分比觸發的網格
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# 只校驗規則，不實際提交
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc --dry-run
```

### 查看

```bash
# 按標的 / 狀態篩選列表
longbridge grid --symbol 700.HK --status Performing
# 按 ID 查詢指定網格
longbridge grid --ids 764609681686573056 764609681686573057
# 網格詳情：規則、子訂單與生命週期歷史
longbridge grid detail 764609681686573056
# 某網格的觸發歷史
longbridge grid triggers 764609681686573056
```

### 管理運行中的網格

```bash
# 修改網格規則（flag 與 submit 相同）
longbridge grid replace 764609681686573056 --base-price 305 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# 掛起運行中的網格（保留，可重啟）
longbridge grid suspend 764609681686573056
# 重啟已掛起的網格
longbridge grid restart 764609681686573056
# 取消網格（不可恢復）
longbridge grid cancel 764609681686573056
```

## 選項

| 選項 | 說明 | 默認值 |
| ---- | ---- | ------ |
| `--symbol` | 按標的代碼篩選列表（如 `700.HK`） | — |
| `--status` | 按狀態篩選列表，多個用逗號連接（如 `Performing,Suspended`） | — |
| `--market` | 按市場篩選列表：`US` \| `HK` \| `CN` \| `SG` | — |
| `--ids` | 按 ID 查詢指定網格訂單 | — |
| `--currency` | `submit` 的結算幣種（如 `HKD`） | — |
| `--base-price` / `--upper-price` / `--lower-price` | 網格基準價與上/下限 | — |
| `--trigger-type` | 觸發方式：`percent`（百分比）\| `spread`（價差） | — |
| `--trigger-up` / `--trigger-down` | 上/下觸發值，按 `--trigger-type` 解釋為百分比或價差 | — |
| `--quantity` | 每次觸發數量 | — |
| `--upper-quantity` / `--lower-quantity` | 到達上/下限時處理的數量 | — |
| `--order-type` | 雙邊訂單類型：`GMO` \| `GLO` \| `GTG`（`--order-type-up` / `--order-type-down` 可分別覆蓋） | — |
| `--tif` | 有效期：`day` \| `gtc` \| `gtd` | — |
| `--dry-run` | 只校驗並打印規則，不實際提交 | false |

## 前置條件

提交或管理網格訂單需要 OAuth 交易權限。首次下網格前，先執行一次 `longbridge grid questionnaire` 記錄策略風險揭示確認（在 `longbridge grid info` 中可見授權狀態）。完整規則與欄位定義見[網格交易](/zh-HK/docs/trade/grid/overview)參考文檔。

## 說明

`submit`、`replace`、`cancel` 會影響真實資金，執行前會要求確認。可用 `submit --dry-run` 安全校驗規則。
