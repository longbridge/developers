---
title: 'screener'
sidebar_label: 'screener'
sidebar_position: 4
---

# longbridge screener

Stock screener — filter stocks using preset strategies or custom indicator conditions.

## Basic Usage

```bash
longbridge screener strategies
```

```
Preset Strategies

| id | name                    | market | description                              |
|----|-------------------------|--------|------------------------------------------|
| 1  | High-Yield Defensive    | HK     | Dividend yield > 5%, PE < 15             |
| 2  | Accelerating Growth     | US     | Revenue growth > 30%, ROE > 20%          |
| 42 | Undervalued Blue Chips  | HK     | PB < 1.5, market cap > HKD 10B           |
```

## Examples

### Workflow A — Use a preset strategy

**Step 1: List available strategies**

```bash
longbridge screener strategies
```

**Step 2: Inspect a strategy's filter conditions**

```bash
longbridge screener strategies --id 42
```

```
Strategy #42: Undervalued Blue Chips

Filters:
  filter_pb: 0 ~ 1.5
  filter_marketcap: 100 ~ (unlimited)
  filter_divyld: 2 ~ (unlimited)
```

**Step 3: Run the strategy**

```bash
longbridge screener search --strategy-id 42
```

### Workflow B — Custom filter conditions

**Step 1: List available indicators**

```bash
longbridge screener indicators
```

```
Available Indicators

Valuation:
  filter_pe          P/E ratio
  filter_pb          P/B ratio
  filter_ps          P/S ratio
  filter_marketcap   Market cap (100M)
  filter_divyld      Dividend yield (%)

Growth:
  filter_rev_growth  Revenue growth (%)
  filter_roe         Return on equity (%)
  ...
```

**Step 2: Run a custom screen**

```bash
longbridge screener search --market HK --filter filter_marketcap:100:1000 --filter filter_divyld:3:
```

Filter format: `<key>:<min>:<max>`. Omit `min` or `max` to leave that side unbounded.

### View my saved strategies

```bash
longbridge screener strategies --mine
```

Lists your saved custom strategies.

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `strategies` | List preset strategies (add `--mine` for custom strategies) |
| `strategies --id <id>` | Show filter conditions for a specific strategy |
| `search` | Run a screen (`--strategy-id` or `--filter`) |
| `indicators` | List all available filter indicators |

## Options

| Flag | Description |
|------|-------------|
| `--mine` | Show my saved strategies (with `strategies`) |
| `--id` | View filter conditions for a specific strategy (with `strategies`) |
| `--strategy-id` | Run the specified strategy (with `search`) |
| `--market` | Target market: `HK`, `US`, `CN`, `SG` (with `search`) |
| `--filter` | Custom filter condition, format `<key>:<min>:<max>`, repeatable |
| `--format` | Output format: `table` (default) or `json` |
