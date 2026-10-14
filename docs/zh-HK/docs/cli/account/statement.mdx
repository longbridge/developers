---
title: 'statement'
sidebar_label: 'statement'
sidebar_position: 7
---

# longbridge statement

下載和匯出賬戶結算單——每日結算摘要或月度報告。

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

### 查看近期日結算單

```bash
longbridge statement
# 指定起始日期和數量
longbridge statement --start-date 20260401 --limit 10
```

列出可用的日結算單及其日期和檔案 key。檔案 key 用於 `export` 子命令。

### 查看月結算單

```bash
longbridge statement --type monthly
# 僅查看近 6 個月
longbridge statement --type monthly --limit 6
```

返回月度匯總結算單。

### 列出結算單（子命令形式）

```bash
longbridge statement list
longbridge statement list --type daily --start-date 20260401
```

與 `longbridge statement` 等效——`list` 子命令使意圖更明確。

### 匯出結算單到終端

```bash
longbridge statement export --file-key stmt_daily_20260410_abc123
```

將結算單所有非空板塊以 Markdown 格式輸出到終端。`file_key` 來自 `longbridge statement list`。

### 匯出指定板塊

```bash
# 僅匯出持倉和股票交易
longbridge statement export --file-key stmt_daily_20260410_abc123 --section equity_holdings --section stock_trades
```

可用板塊包括：`asset`、`account_balances`、`equity_holdings`、`account_balance_changes`、`stock_trades`、`equity_holding_changes`、`option_trades`、`fund_trades` 等。

### 匯出為 CSV 檔案

```bash
# 匯出全部板塊到目錄（CSV 格式）
longbridge statement export --file-key stmt_daily_20260410_abc123 -o ./statements/
# 匯出指定板塊為 CSV
longbridge statement export --file-key stmt_daily_20260410_abc123 --section equity_holdings --export-format csv -o ./statements/
```

提供 `-o` 時預設匯出格式為 CSV。每個板塊儲存為輸出目錄下的獨立檔案。

## 前置條件

需要有效的 OAuth 登入。如未認證請先執行 `longbridge auth login`。
