---
title: 'finance-calendar'
sidebar_label: 'finance-calendar'
sidebar_position: 6
---

# longbridge finance-calendar

Browse upcoming financial events — earnings reports, dividend payments, stock splits, IPOs, and macroeconomic releases — filtered by symbol, watchlist, market, or event type.

## Subcommands

| Subcommand  | Description                                 |
| ----------- | ------------------------------------------- |
| `report`    | Earnings reports (upcoming and recent)      |
| `dividend`  | Dividend announcements                      |
| `split`     | Stock splits and merges                     |
| `ipo`       | IPO listings                                |
| `macrodata` | Macroeconomic data releases                 |
| `closed`    | Market closure days                         |

## Examples

### Upcoming earnings reports

```bash
longbridge finance-calendar report
```

Shows upcoming earnings events from today. Displays EPS and revenue estimates alongside actual results for recently reported quarters.

### Earnings for watchlist stocks

```bash
longbridge finance-calendar report --filter watchlist --market US
```

Scopes the earnings calendar to US stocks in your watchlist. Use `--filter positions` to limit to your current holdings instead.

### Dividends for held positions

```bash
longbridge finance-calendar dividend --filter positions
```

Lists dividend events only for stocks you currently hold. Useful for tracking upcoming ex-dividend and payment dates.

### Stock splits and merges in HK market

```bash
longbridge finance-calendar split --market HK
```

Shows both split and merge events for Hong Kong-listed stocks.

### High-importance macro events

```bash
longbridge finance-calendar macrodata --star 3
```

Filters macroeconomic events to only show high-importance releases (3-star). Covers data like CPI, NFP, Fed rate decisions, and similar market-moving events.

### IPO calendar

```bash
longbridge finance-calendar ipo
```

Shows upcoming IPOs across supported markets. Combine with `--market` to filter by a specific exchange.
