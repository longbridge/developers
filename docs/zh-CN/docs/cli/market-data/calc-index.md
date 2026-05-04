---
title: 'calc-index'
sidebar_label: 'calc-index'
sidebar_position: 8
---

# longbridge calc-index

计算任意标的的财务指标——市盈率、市净率、股息率、换手率、期权希腊值等。

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

### 查看市盈率和市净率

```bash
longbridge calc-index TSLA.US NVDA.US --fields pe,pb
longbridge calc-index TSLA.US NVDA.US --fields pe,pb --format json
```

计算每个标的的指定指标。一次调用可同时请求多个标的和多个指标。JSON 输出中仅包含有数据的指标，无数据的指标会被省略。

### 默认指标（市盈率、市净率、股息率、换手率、市值）

```bash
longbridge calc-index TSLA.US
```

省略 `--fields` 时，返回默认指标集：`pe`、`pb`、`dps_rate`、`turnover_rate`、`mktcap`。

### 衍生品的期权希腊值

```bash
longbridge calc-index 24760.HK --fields delta,gamma,vega,theta
```

对于期权和权证，可直接请求希腊值。输出中仅包含适用于该品种类型的指标。希腊值仅对期权/权证标的有意义——普通股票标的不会返回希腊值数据。

## 说明

支持的字段名称完整列表：

**通用：** `last_done`、`change_value`、`change_rate`、`vol`、`turnover`、`ytd_change_rate`、`turnover_rate`、`mktcap`、`capital_flow`、`amplitude`、`volume_ratio`、`pe`、`pb`、`dps_rate`、`five_day_change_rate`、`ten_day_change_rate`、`half_year_change_rate`、`five_minutes_change_rate`

**期权 / 权证：** `iv`、`delta`、`gamma`、`theta`、`vega`、`rho`、`oi`、`exp`、`strike`、`upper_strike_price`、`lower_strike_price`、`outstanding_qty`、`outstanding_ratio`、`premium`、`itm_otm`、`warrant_delta`、`call_price`、`to_call_price`、`effective_leverage`、`leverage_ratio`、`conversion_ratio`、`balance_point`

未知字段名称会被静默忽略——若预期字段在输出中缺失，请检查拼写是否正确。
