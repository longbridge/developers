---
title: 'screener'
sidebar_label: 'screener'
sidebar_position: 4
---

# longbridge screener

股票筛选工具，通过预设策略或自定义指标条件筛选股票。

## 基本用法

```bash
longbridge screener strategies
```

```
Preset Strategies

| id | name              | market | description                   |
|----|-------------------|--------|-------------------------------|
| 1  | 高股息防御型       | HK     | 股息率 > 5%，PE < 15          |
| 2  | 成长加速型         | US     | 营收增速 > 30%，ROE > 20%     |
| 42 | 低估值蓝筹         | HK     | PB < 1.5，市值 > 100 亿港元   |
```

## 示例

### 工作流 A — 使用预设策略

**第一步：获取策略列表**

```bash
longbridge screener strategies
```

**第二步：查看策略筛选条件**

```bash
longbridge screener strategies --id 42
```

```
Strategy #42: 低估值蓝筹

Filters:
  filter_pb: 0 ~ 1.5
  filter_marketcap: 100 ~ (unlimited)
  filter_divyld: 2 ~ (unlimited)
```

**第三步：执行筛选**

```bash
longbridge screener search --strategy-id 42
```

### 工作流 B — 自定义条件

**第一步：查看可用指标**

```bash
longbridge screener indicators
```

```
Available Indicators

Valuation:
  filter_pe          市盈率 (PE)
  filter_pb          市净率 (PB)
  filter_ps          市销率 (PS)
  filter_marketcap   市值（亿）
  filter_divyld      股息率 (%)

Growth:
  filter_rev_growth  营收增速 (%)
  filter_roe         净资产收益率 (%)
  ...
```

**第二步：执行自定义筛选**

```bash
longbridge screener search --market HK --filter filter_marketcap:100:1000 --filter filter_divyld:3:
```

指标格式：`<key>:<min>:<max>`，省略 `min` 或 `max` 表示不限下/上限。

### 查看我的策略

```bash
longbridge screener strategies --mine
```

显示已保存的自定义策略列表。

## 子命令

| 子命令 | 说明 |
|--------|------|
| `strategies` | 列出预设策略（加 `--mine` 显示自定义策略） |
| `strategies --id <id>` | 查看特定策略的筛选条件 |
| `search` | 执行筛选（`--strategy-id` 或 `--filter`） |
| `indicators` | 列出所有可用筛选指标 |

## 参数

| 参数 | 说明 |
|------|------|
| `--mine` | 显示我保存的策略（配合 `strategies` 使用） |
| `--id` | 查看指定策略的条件（配合 `strategies` 使用） |
| `--strategy-id` | 执行指定策略的筛选（配合 `search` 使用） |
| `--market` | 筛选市场：`HK`、`US`、`CN`、`SG`（配合 `search` 使用） |
| `--filter` | 自定义筛选条件，格式 `<key>:<min>:<max>`，可多次使用 |
| `--format` | 输出格式：`table`（默认）或 `json` |
