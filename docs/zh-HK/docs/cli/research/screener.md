---
title: 'screener'
sidebar_label: 'screener'
sidebar_position: 4
---

# longbridge screener

股票篩選工具，透過預設策略或自訂指標條件篩選股票。

## 基本用法

```bash
longbridge screener strategies
```

```
Preset Strategies

| id | name              | market | description                   |
|----|-------------------|--------|-------------------------------|
| 1  | 高股息防禦型       | HK     | 股息率 > 5%，PE < 15          |
| 2  | 成長加速型         | US     | 營收增速 > 30%，ROE > 20%     |
| 42 | 低估值藍籌         | HK     | PB < 1.5，市值 > 100 億港元   |
```

## 示例

### 工作流 A — 使用預設策略

**第一步：取得策略清單**

```bash
longbridge screener strategies
```

**第二步：查看策略篩選條件**

```bash
longbridge screener strategies --id 42
```

```
Strategy #42: 低估值藍籌

Filters:
  filter_pb: 0 ~ 1.5
  filter_marketcap: 100 ~ (unlimited)
  filter_divyld: 2 ~ (unlimited)
```

**第三步：執行篩選**

```bash
longbridge screener search --strategy-id 42
```

### 工作流 B — 自訂條件

**第一步：查看可用指標**

```bash
longbridge screener indicators
```

```
Available Indicators

Valuation:
  filter_pe          市盈率 (PE)
  filter_pb          市淨率 (PB)
  filter_ps          市銷率 (PS)
  filter_marketcap   市值（億）
  filter_divyld      股息率 (%)

Growth:
  filter_rev_growth  營收增速 (%)
  filter_roe         淨資產收益率 (%)
  ...
```

**第二步：執行自訂篩選**

```bash
longbridge screener search --market HK --filter filter_marketcap:100:1000 --filter filter_divyld:3:
```

指標格式：`<key>:<min>:<max>`，省略 `min` 或 `max` 表示不限下/上限。

### 查看我的策略

```bash
longbridge screener strategies --mine
```

顯示已儲存的自訂策略清單。

## 子命令

| 子命令 | 說明 |
|--------|------|
| `strategies` | 列出預設策略（加 `--mine` 顯示自訂策略） |
| `strategies --id <id>` | 查看特定策略的篩選條件 |
| `search` | 執行篩選（`--strategy-id` 或 `--filter`） |
| `indicators` | 列出所有可用篩選指標 |

## 參數

| 參數 | 說明 |
|------|------|
| `--mine` | 顯示我儲存的策略（配合 `strategies` 使用） |
| `--id` | 查看指定策略的條件（配合 `strategies` 使用） |
| `--strategy-id` | 執行指定策略的篩選（配合 `search` 使用） |
| `--market` | 篩選市場：`HK`、`US`、`CN`、`SG`（配合 `search` 使用） |
| `--filter` | 自訂篩選條件，格式 `<key>:<min>:<max>`，可多次使用 |
| `--format` | 輸出格式：`table`（預設）或 `json` |
