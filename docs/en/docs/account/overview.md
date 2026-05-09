---
sidebar_position: 0
id: account_overview
title: Overview
slug: overview
---

# Account API Overview

Account management APIs covering portfolio analysis, price alerts, recurring investment plans, and share lists. Most methods require Trade-level authentication.

## PortfolioContext

Portfolio profit/loss analysis and currency exchange rates.

| Method | Description |
|---|---|
| [profit_analysis_summary](./portfolio/profit-analysis-summary) | Overall portfolio P&L summary |
| [profit_analysis_detail](./portfolio/profit-analysis-detail) | Per-position P&L breakdown |
| [profit_analysis_by_market](./portfolio/profit-analysis-by-market) | P&L grouped by market |
| [capital_flow](./portfolio/capital-flow) | Account capital flow history |
| [exchange_rates](./portfolio/exchange-rates) | Current exchange rates for supported currencies |

## AlertContext

Create and manage price alerts for securities.

| Method | Description |
|---|---|
| [list_alerts](./alert/list-alerts) | List all active price alerts |
| [create_alert](./alert/create-alert) | Create a new price alert |
| [update_alert](./alert/update-alert) | Update an existing alert |
| [delete_alert](./alert/delete-alert) | Delete a price alert |

## DCAContext

Manage dollar-cost averaging (recurring investment) plans.

| Method | Description |
|---|---|
| [list_dca](./dca/list-dca) | List all DCA plans |
| [create_dca](./dca/create-dca) | Create a new DCA plan |
| [dca_history](./dca/dca-history) | View execution history for a DCA plan |
| [delete_dca](./dca/delete-dca) | Cancel a DCA plan |

## SharelistContext

Create and manage community share lists (watchlists shared with others).

| Method | Description |
|---|---|
| [list_sharelist](./sharelist/list-sharelist) | List all share lists |
| [create_sharelist](./sharelist/create-sharelist) | Create a new share list |
| [update_sharelist](./sharelist/update-sharelist) | Update a share list |
| [delete_sharelist](./sharelist/delete-sharelist) | Delete a share list |
