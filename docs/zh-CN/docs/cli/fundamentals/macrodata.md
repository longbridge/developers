---
title: 'macrodata'
sidebar_label: 'macrodata'
sidebar_position: 5
---

# longbridge macrodata

按指标查询宏观经济数据，是 `finance-calendar macrodata` 的指标维度版本：同一数据源，但按指标组织而非按发布日期组织。

## 基本用法

```bash
# 列出所有指标
longbridge macrodata

# 按国家和关键词筛选
longbridge macrodata --country US --keyword CPI

# 查询单个指标的历史数据
longbridge macrodata US00175 --start 2024-01-01 --limit 12
```

## 示例

### 列出所有宏观经济指标

```bash
longbridge macrodata
longbridge macrodata --country US
longbridge macrodata --keyword CPI --country US
```

输出包含指标代码、名称、分类、国家/地区、发布周期与重要性等级（1–3 星）。

### 查询历史发布值

```bash
longbridge macrodata 61744 --start 2024-01-01 --limit 12 --format json
```

返回该指标每次发布时的实际值、预测值和前值。

## 常用选项

| 选项 | 说明 |
| ---- | ---- |
| `--country HK\|CN\|US\|EU\|JP\|SG` | 仅列出指定国家/地区的指标 |
| `--keyword <KEYWORD>` | 按指标名称关键词筛选 |
| `--start` / `--end` | 历史数据日期范围（YYYY-MM-DD） |
| `--limit` / `--page` | 分页，默认每页 20 条 |
| `--lang zh-CN\|en` | 指标名称与描述的语言 |
| `--format json` | 结构化输出，便于脚本或 AI Agent 使用 |
