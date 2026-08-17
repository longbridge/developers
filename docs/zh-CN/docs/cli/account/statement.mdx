---
title: 'statement'
sidebar_label: 'statement'
sidebar_position: 7
---

# longbridge statement

下载和导出账户结算单——每日结算摘要或月度报告。

## 基本用法

```bash
longbridge statement
```

```
| date       | file_key                             |
|------------|--------------------------------------|
| 2026-04-10 | stmt_daily_20260410_abc123           |
| 2026-04-09 | stmt_daily_20260409_def456           |
| 2026-04-08 | stmt_daily_20260408_ghi789           |
...
```

## 示例

### 查看近期日结算单

```bash
longbridge statement
# 指定起始日期和数量
longbridge statement --start-date 20260401 --limit 10
```

列出可用的日结算单及其日期和文件 key。文件 key 用于 `export` 子命令。

### 查看月结算单

```bash
longbridge statement --type monthly
# 仅查看近 6 个月
longbridge statement --type monthly --limit 6
```

返回月度汇总结算单。

### 列出结算单（子命令形式）

```bash
longbridge statement list
longbridge statement list --type daily --start-date 20260401
```

与 `longbridge statement` 等效——`list` 子命令使意图更明确。

### 导出结算单到终端

```bash
longbridge statement export --file-key stmt_daily_20260410_abc123
```

将结算单所有非空板块以 Markdown 格式输出到终端。`file_key` 来自 `longbridge statement list`。

### 导出指定板块

```bash
# 仅导出持仓和股票交易
longbridge statement export --file-key stmt_daily_20260410_abc123 --section equity_holdings --section stock_trades
```

可用板块包括：`asset`、`account_balances`、`equity_holdings`、`account_balance_changes`、`stock_trades`、`equity_holding_changes`、`option_trades`、`fund_trades` 等。

### 导出为 CSV 文件

```bash
# 导出全部板块到目录（CSV 格式）
longbridge statement export --file-key stmt_daily_20260410_abc123 -o ./statements/
# 导出指定板块为 CSV
longbridge statement export --file-key stmt_daily_20260410_abc123 --section equity_holdings --export-format csv -o ./statements/
```

提供 `-o` 时默认导出格式为 CSV。每个板块保存为输出目录下的独立文件。

## 前置条件

需要有效的 OAuth 登录。如未认证请先执行 `longbridge auth login`。
