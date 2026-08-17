---
title: 'compare'
sidebar_label: 'compare'
sidebar_position: 18
---

# longbridge compare

多股估值橫向對比（PE/PB/PS/市值/收盤價/ROE）。不傳對比股票時，服務端自動選取同行業標的。

## 基本用法

```bash
longbridge compare AAPL.US
```

```
Valuation Comparison

| symbol  | name   | market_value | close    | pe    | pb    | ps    | roe    |
|---------|--------|--------------|----------|-------|-------|-------|--------|
| AAPL.US | 蘋果   | $3.01T       | 205.10   | 31.2  | 45.2  | 7.8   | 136.5% |
| MSFT.US | 微軟   | $3.12T       | 420.30   | 35.8  | 12.1  | 12.3  | 35.2%  |
```

不指定對比標的時，系統自動從同行業中選取代表性標的進行對比。

## 示例

### 自動選取同行業標的

```bash
longbridge compare AAPL.US
```

系統根據行業歸屬自動選取同行業股票作為對比組，無需手動指定。

### 指定對比標的

```bash
longbridge compare AAPL.US MSFT.US GOOGL.US
```

最多支援 5 隻股票（含主標的）的橫向對比。

### 港股對比並指定貨幣

```bash
longbridge compare 700.HK 9988.HK --currency HKD
```

使用 `--currency` 統一市值、收盤價等貨幣單位，避免跨市場匯率干擾。

### JSON 輸出

```bash
longbridge compare TSLA.US RIVN.US --format json
```

## 參數

| 參數 | 說明 |
|------|------|
| `symbol` | 主標的（必填） |
| `[others...]` | 對比標的（可選，最多 4 個） |
| `--currency` | 統一貨幣單位：`USD`、`HKD`、`CNY` |
| `--format` | 輸出格式：`table`（預設）或 `json` |

## 注意事項

- 跨市場對比（如美股 vs 港股）時，建議指定 `--currency` 統一單位
- PE、PB、PS 為 TTM（過去 12 個月）數據
- ROE 為最新報告期數據
