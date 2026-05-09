---
sidebar_position: 0
id: fundamental_overview
title: Overview
slug: overview
---

# Fundamental API Overview

Research and market data APIs covering company fundamentals, market structure, and financial calendars. All methods are read-only and available through the SDK.

## FundamentalContext

Company-level financial data and corporate information.

| Method | Description |
|---|---|
| [company_profile](./fundamental/company-profile) | Company overview, industry, and key facts |
| [financial_report](./fundamental/financial-report) | Income statement, balance sheet, and cash flow |
| [valuations](./fundamental/valuations) | PE, PB, PS, EV/EBITDA and other valuation metrics |
| [ratings](./fundamental/ratings) | Analyst ratings and price targets |
| [dividends](./fundamental/dividends) | Historical dividend records |
| [fund_holdings](./fundamental/fund-holdings) | Institutional and fund ownership |
| [shareholders](./fundamental/shareholders) | Major shareholders |
| [executives](./fundamental/executives) | Executive team and board members |
| [corporate_actions](./fundamental/corporate-actions) | Splits, bonus issues, rights offerings |

## MarketContext

Market-level data including index components, broker positions, and anomaly scanning.

| Method | Description |
|---|---|
| [market_status](./market/market-status) | Current trading session status for each market |
| [trading_stats](./market/trading-stats) | Intraday trading statistics for a symbol |
| [index_components](./market/index-components) | Constituents of a market index |
| [ah_premium](./market/ah-premium) | A/H share premium ratio for dual-listed stocks |
| [broker_positions](./market/broker-positions) | HK broker participant holdings (CCASS) |
| [unusual_items](./market/unusual-items) | Unusual price or volume movements |

## CalendarContext

Financial event calendars for planning around earnings, dividends, and macro releases.

| Method | Description |
|---|---|
| [earnings_calendar](./calendar/earnings-calendar) | Upcoming and recent earnings release dates |
| [dividend_calendar](./calendar/dividend-calendar) | Ex-dividend and payment dates |
| [ipo_calendar](./calendar/ipo-calendar) | IPO subscription and listing dates |
| [split_calendar](./calendar/split-calendar) | Stock split effective dates |
| [macro_calendar](./calendar/macro-calendar) | Economic data release schedule |
