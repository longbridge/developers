---
title: 'calc-index'
sidebar_label: 'calc-index'
sidebar_position: 8
---

# longbridge calc-index

計算任意標的的財務指標——市盈率、市淨率、股息率、換手率、期權希臘值等。

## 基本用法

```bash
longbridge calc-index TSLA.US
```

```
| Symbol  | PE TTM | PB    | DPS Rate | Turnover Rate | Total Market Value  |
|---------|--------|-------|----------|---------------|---------------------|
| TSLA.US | 341.83 | 15.79 | -        | 2.21          | 1296915542310.08    |
```

## 示例

### 查看市盈率和市淨率

```bash
longbridge calc-index TSLA.US NVDA.US --fields pe,pb
longbridge calc-index TSLA.US NVDA.US --fields pe,pb --format json
```

計算每個標的的指定指標。一次調用可同時請求多個標的和多個指標。JSON 輸出中僅包含有數據的指標，無數據的指標會被省略。

### 默認指標（市盈率、市淨率、股息率、換手率、市值）

```bash
longbridge calc-index TSLA.US
```

省略 `--fields` 時，返回默認指標集：`pe`、`pb`、`dps_rate`、`turnover_rate`、`mktcap`。

### 衍生品的期權希臘值

```bash
longbridge calc-index 24760.HK --fields delta,gamma,vega,theta
```

對於期權和權證，可直接請求希臘值。輸出中僅包含適用於該品種類型的指標。希臘值僅對期權/權證標的有意義——普通股票標的不會返回希臘值數據。

## 說明

支援的字段名稱完整列表：

**通用：** `last_done`、`change_value`、`change_rate`、`vol`、`turnover`、`ytd_change_rate`、`turnover_rate`、`mktcap`、`capital_flow`、`amplitude`、`volume_ratio`、`pe`、`pb`、`dps_rate`、`five_day_change_rate`、`ten_day_change_rate`、`half_year_change_rate`、`five_minutes_change_rate`

**期權 / 權證：** `iv`、`delta`、`gamma`、`theta`、`vega`、`rho`、`oi`、`exp`、`strike`、`upper_strike_price`、`lower_strike_price`、`outstanding_qty`、`outstanding_ratio`、`premium`、`itm_otm`、`warrant_delta`、`call_price`、`to_call_price`、`effective_leverage`、`leverage_ratio`、`conversion_ratio`、`balance_point`

未知字段名稱會被靜默忽略——若預期欄位在輸出中缺失，請檢查拼寫是否正確。
