---
title: 'finance-calendar'
sidebar_label: 'finance-calendar'
sidebar_position: 6
---

# longbridge finance-calendar

Browse upcoming financial events — earnings reports, dividend payments, IPOs, and macroeconomic releases — filtered by symbol, market, or event type.

## Basic Usage

```bash
longbridge finance-calendar financial --symbol TSLA.US
```

```
2026.01.28 (ET)  [Financials]  US  Tesla (TSLA.US)
  Q4 FY2025 Earnings Release
  EPS: Est 0.3466 / Act 0.24  |  Revenue: Est $24.8B / Act $24.9B
```

## Examples

### Upcoming earnings for a stock

```bash
longbridge finance-calendar financial --symbol TSLA.US
```

Shows Tesla's upcoming earnings dates along with analyst estimates for EPS and revenue. Use `--symbol` to narrow down to a specific stock.

### Today's dividend events for the US market

```bash
longbridge finance-calendar dividend --market US
```

Lists all dividend-related events (ex-dividend dates, payment dates) scheduled for US-listed stocks. Useful for tracking which stocks are going ex-dividend.

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
