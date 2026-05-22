---
title: 'top-movers'
sidebar_label: 'top-movers'
sidebar_position: 19
---

# longbridge top-movers

價格波動超過近 20 日標準差的異動股票。系統自動關聯相關新聞解讀異動原因，與 `anomaly` 命令（純技術信號）不同，`top-movers` 側重於有新聞背景的價格波動。

<QuotePermission command="top-movers" />

## 基本用法

```bash
longbridge top-movers
```

```
Top Movers — US

TSLA  特斯拉  -3.88%  [汽車製造商]
  Alert: 波動超 20 日均值
  Related news: "Tesla Q1 deliveries miss estimates..."

NVDA  英偉達  +4.21%  [半導體廠商]
  Alert: 波動超 20 日均值
  Related news: "NVIDIA announces next-gen GPU architecture..."
```

## 示例

### 查看美股異動

```bash
longbridge top-movers
longbridge top-movers --market US
```

預設顯示美股異動股票，按熱度排序。

### 查看港股異動

```bash
longbridge top-movers --market HK
```

### 按時間排序並增加返回數量

```bash
longbridge top-movers --market US --sort time --count 50
```

### 按漲跌幅排序

```bash
longbridge top-movers --market US --sort change
```

## 參數

| 參數 | 說明 |
|------|------|
| `--market` | 市場：`HK`、`US`、`CN`、`SG`（預設：`US`） |
| `--sort` | 排序方式：`hot`（熱度，預設）、`time`（時間）、`change`（漲跌幅） |
| `--count` | 返回筆數（預設：20） |
| `--format` | 輸出格式：`table`（預設）或 `json` |

## 注意事項

- `top-movers` 關聯新聞，適合理解異動背景；`anomaly` 側重純技術信號
- 波動判斷基於近 20 日歷史波動標準差
