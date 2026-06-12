---
title: 'macrodata'
sidebar_label: 'macrodata'
sidebar_position: 20
---

# longbridge macrodata

浏览宏观经济指标及其历史发布数据，覆盖美国、香港、中国大陆、欧元区、日本和新加坡市场。

## 模式

| 模式 | 用法 | 描述 |
| ---- | ---- | ---- |
| 列表 | `longbridge macrodata` | 列出全部可用指标 |
| 历史 | `longbridge macrodata <CODE>` | 查询指定指标的历史数据 |

## 示例

### 列出全部指标

```bash
longbridge macrodata
```

```
Total: 619
Code     Name          Category    Country   Frequency   Source
US00175  非农就业人数  Employment  US        Monthly     Bureau of Labor Statistics
...
```

### 按国家/地区筛选

```bash
longbridge macrodata --country US
longbridge macrodata --country HK
longbridge macrodata --country CN
```

支持的国家代码：`HK`、`CN`、`US`、`EU`、`JP`、`SG`。

### 分页查看

```bash
longbridge macrodata --country US --limit 50 --page 2
```

### 查看某个指标的历史发布数据

```bash
longbridge macrodata US00175
```

```
Non-Farm Payroll  [Employment | Bureau of Labor Statistics · Monthly]

Period      Actual   Forecast  Previous  Revised   Unit
2026-05-01  272000   250000    265000    263500    Thousand
2026-04-01  228000   137000    228000    228000    Thousand
...
```

### 按日期范围筛选历史数据

```bash
longbridge macrodata US00175 --start 2024-01-01 --end 2024-12-31
```

### JSON 输出（适合 AI / 脚本）

```bash
longbridge macrodata --format json
longbridge macrodata US00175 --format json
```

## 选项

| 选项 | 描述 | 默认值 |
| ---- | ---- | ------ |
| `--country` | 筛选列表：`HK` \| `CN` \| `US` \| `EU` \| `JP` \| `SG` | 全部 |
| `--start` | 历史开始日期 `YYYY-MM-DD` | — |
| `--end` | 历史结束日期 `YYYY-MM-DD` | — |
| `--limit` | 最大条数（列表最大 1000，历史最大 100） | 1000（列表）/ 20（历史） |
| `--page` | 页码，从 1 开始 | 1 |
| `--format` | `table` 或 `json` | `table` |
