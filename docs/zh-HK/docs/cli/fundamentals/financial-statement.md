---
title: 'financial-statement'
sidebar_label: 'financial-statement'
sidebar_position: 3
---

# longbridge financial-statement

獲取上市公司完整的逐行財務報表——損益表、資產負債表或現金流量表。

## 基本用法

```bash
longbridge financial-statement TSLA.US --kind IS
```

```
  (in USD)
                                 Q1 2026     Q4 2025     Q3 2025     Q2 2025     Q1 2025      YoY
─────────────────────────────────────────────────────────────────────────────────────────────────

收入
  總營業收入                      22.39B      24.90B      28.09B      22.50B      19.34B   -10.1%
    主營業務收入                  22.39B      24.90B      28.09B      22.50B      19.34B   -10.1%

成本
  營業成本                        17.67B      19.89B      23.04B      18.62B      16.18B   -11.2%
  毛利潤                           4.72B       5.01B       5.05B       3.88B       3.15B    -5.8%
...
```

## 示例

### 季度損益表

```bash
longbridge financial-statement TSLA.US --kind IS --report qf
longbridge financial-statement AAPL.US --kind IS --report qf
```

返回帶 YoY 對比的季度損益表。

### 年度資產負債表

```bash
longbridge financial-statement TSLA.US --kind BS --report af
longbridge financial-statement 700.HK --kind BS --report af
```

返回含資產、負債、股東權益明細的完整年度資產負債表。

### 現金流量表

```bash
longbridge financial-statement NVDA.US --kind CF
```

返回經營、投資和融資活動的現金流量。

### 獲取全部三張報表

```bash
longbridge financial-statement AAPL.US
```

一次性獲取三張報表，等同於 `--kind ALL`。

### 累計期間

```bash
longbridge financial-statement TSLA.US --kind IS --report cumul
```

返回年初至今的累計損益表。

### 報告期選項

| `--report` | 說明 |
|---|---|
| `af` | 年度（預設） |
| `saf` | 半年度 |
| `qf` | 季度 |
| `cumul` | 累計（年初至今） |
