---
title: 'statement'
sidebar_label: 'statement'
sidebar_position: 7
---

# longbridge statement

Download and export account statements — daily settlement summaries or monthly reports.

## Basic Usage

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

## Examples

### List recent daily statements

```bash
longbridge statement
# Specify a start date and limit
longbridge statement --start-date 20260401 --limit 10
```

Lists available daily statements with their dates and file keys. File keys are used with the `export` subcommand.

### List monthly statements

```bash
longbridge statement --type monthly
# Limit to last 6 months
longbridge statement --type monthly --limit 6
```

Returns monthly summary statements instead of daily ones.

### List statements (subcommand form)

```bash
longbridge statement list
longbridge statement list --type daily --start-date 20260401
```

Equivalent to `longbridge statement` — the `list` subcommand makes the intent explicit.

### Export a statement to terminal

```bash
longbridge statement export --file-key stmt_daily_20260410_abc123
```

Prints all non-empty sections of the statement as Markdown to stdout. Use a `file_key` from `longbridge statement list`.

### Export specific sections

```bash
# Export only equity holdings and stock trades
longbridge statement export --file-key stmt_daily_20260410_abc123 --section equity_holdings --section stock_trades
```

Available sections include: `asset`, `account_balances`, `equity_holdings`, `account_balance_changes`, `stock_trades`, `equity_holding_changes`, `option_trades`, `fund_trades`, and more.

### Export as CSV files

```bash
# Export all sections to a directory as CSV
longbridge statement export --file-key stmt_daily_20260410_abc123 -o ./statements/
# Export specific sections as CSV
longbridge statement export --file-key stmt_daily_20260410_abc123 --section equity_holdings --export-format csv -o ./statements/
```

When `-o` is provided, the default export format switches to CSV. Each section is saved as a separate file in the output directory.

## Requirements

A valid OAuth login is required. Run `longbridge auth login` if you have not yet authenticated.
