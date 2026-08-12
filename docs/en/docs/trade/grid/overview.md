---
slug: overview
sidebar_position: 0
title: Grid Trading Overview
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Grid trading is an automated strategy that buys as the price falls and sells as it rises within a price band anchored to a base price. It profits from oscillation: each downward step places a buy, each upward step places a sell, and the accumulated spread becomes realized profit. The Grid Trading API lets you submit, monitor, adjust, and cancel grid strategies programmatically.

## How it works

A grid is defined by a base price and a price band, plus rules for when and how much to trade at each step.

- **Base price** — `submitted_base_price` is the anchor the grid is centered on. Trigger levels are measured relative to this price.
- **Upper / lower bounds** — `upper_limit_price` and `lower_limit_price` mark the top and bottom of the band. The grid runs only inside `[lower_limit_price, upper_limit_price]`.
- **Trigger by percent vs. spread** — `trigger_price_type` decides how the step size is interpreted: `1` = spread (an absolute price difference, `trigger_spread_up` / `trigger_spread_down`), `2` = percent (a percentage of the base price, `trigger_percent_up` / `trigger_percent_down`).
- **Per-trigger quantity** — `trigger_quantity` is the amount bought or sold each time a level triggers. `upper_limit_quantity` and `lower_limit_quantity` are the amounts handled when the band's upper or lower bound is reached.
- **Upper / lower limit events** — `upper_limit_event` and `lower_limit_event` decide what happens at the bounds: `1` = ignore (keep the grid running), `2` = close the position at the last price.
- **Grid order types** — when the corresponding order-book depth (`trigger_sell_depth` / `trigger_buy_depth`) is `0`, `grid_order_type_up` / `grid_order_type_down` decide the order type: `GMO` (grid market order), `GLO` (grid limit order), `GTG` (grid touch-to-go).
- **Time in force** — `time_in_force` controls how long the grid stays active: `0` = Day, `1` = GTC (Good-Til-Canceled), `6` = GTD (Good-Til-Date, paired with `expire_time`).

## Prerequisites

::: tip Prerequisites
Grid trading requires the **Trade** permission on your access token. You must also record the strategy risk-disclosure consent **once** before submitting any grid order — see [Submit Strategy Questionnaire](./questionnaire). You can check whether the consent has been recorded via the `strategy_granted` field on [Grid Symbol Info](./symbol_info).
:::

## Typical workflow

1. Record the risk-disclosure consent once — [Submit Strategy Questionnaire](./questionnaire).
2. Fetch the security's grid info (lot size, last price, authorization) — [Grid Symbol Info](./symbol_info).
3. Submit the grid strategy — [Submit Grid Order](./submit).
4. List and inspect running grids — [List Grid Orders](./list) and [Grid Order Detail](./detail).
5. Review what the grid has triggered — [Trigger History](./trigger_history).
6. Adjust or stop the grid — [Suspend](./suspend), [Restart](./restart), [Replace](./replace), or [Cancel](./cancel).

## Grid endpoints

| Method | Path | Page | Purpose |
| ------ | ---- | ---- | ------- |
| POST | `/v1/gridtrading/submit` | [Submit Grid Order](./submit) | Submit a grid strategy order |
| POST | `/v1/gridtrading/replace` | [Replace Grid Order](./replace) | Modify an existing grid order's rule |
| GET | `/v1/gridtrading/list` | [List Grid Orders](./list) | Paged list of grid orders (with filters) |
| POST | `/v1/gridtrading/list` | [List Grid Orders by IDs](./list_by_ids) | Query specific grid orders by IDs |
| GET | `/v1/gridtrading/detail` | [Grid Order Detail](./detail) | Grid order detail with sub-orders and history |
| GET | `/v1/gridtrading/trigger_history_list` | [Trigger History](./trigger_history) | Paged trigger history for one grid order |
| POST | `/v1/gridtrading/cancel` | [Cancel Grid Order](./cancel) | Cancel a grid order |
| POST | `/v1/gridtrading/suspend` | [Suspend Grid Order](./suspend) | Suspend a running grid order |
| POST | `/v1/gridtrading/restart` | [Restart Grid Order](./restart) | Restart a suspended grid order |
| POST | `/v1/record/questionnaire` | [Submit Strategy Questionnaire](./questionnaire) | Record strategy risk-disclosure consent |
| GET | `/v1/orders/info` | [Grid Symbol Info](./symbol_info) | Security info for building a grid order |

## Quickstart (CLI)

<CliCommand>
# Record the one-time strategy risk-disclosure consent
longbridge grid questionnaire
# Check the security's grid info (lot size, last price, authorization)
longbridge grid info 700.HK
# Submit a percent-triggered grid on 700.HK
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 --trigger-type percent --trigger-up 2 --trigger-down 2 --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# List your grid orders
longbridge grid
</CliCommand>

<aside className="success">
</aside>
