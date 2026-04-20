---
id: changelog
title: Changelog
slug: changelog
sidebar_position: 7
sidebar_icon: newspaper
---

## 2026-04-20

### CLI v0.17.1

- **`completion` command** — shell tab-completion for bash, zsh, fish, elvish, and powershell
- Sets `User-Agent: longbridge-cli/<version>` and adds `x-cli-cmd` header on all API requests

## 2026-04-17

### CLI v0.17.0

- **`dca`** — full recurring investment lifecycle: create plans (daily/weekly/fortnightly/monthly), pause/resume/stop, view trade history, check symbol eligibility, and calculate next trade date
- **`sharelist`** — browse and manage community stock lists; discover trending sharelists with `popular`
- **`short-positions`** — US stock short interest data: short ratio, days-to-cover, and share counts (FINRA bi-monthly)
- **`option volume`** — real-time call/put volume and put/call ratio; `daily` subcommand for historical data
- **`option chain`** fix: without `--date` now lists expiry dates (not strikes)

## 2026-04-16

### CLI v0.16.3

- **`auth` subcommand group** — `longbridge auth login` / `auth logout` / `auth status`; new `auth status` shows token validity, expiry, and account info locally without network
- **`alert enable` / `alert disable`** — toggle alerts on/off without deleting them
- **Fix: US index symbols** — `.DJI.US`, `.VIX.US` now parse correctly; US indexes require a leading dot
- **"Did you mean?" hints** — symbol format suggestions when a query returns no data

## 2026-04-13

### CLI v0.16.0

- **21+ new commands** — `company`, `executive`, `industry-valuation`, `operating`, `corp-action`, `invest-relation`, `constituent`, `market-status`, `broker-holding`, `ah-premium`, `trade-stats`, `anomaly`, `alert`, `profit-analysis`
- **`profit-analysis`** — full P&L analysis: summary, per-stock breakdown, individual stock detail with transaction flows, and market-filtered views
- **`update`** — cross-platform self-update with Windows support and CDN acceleration; `--release-notes` to view changelog
- **`intraday --date`** — historical intraday data for a past date

## 2026-04-09

### CLI v0.15.0

- **`portfolio` command** — total P/L, asset distribution by market, holdings, and cash balances
- **`investors` command** — active fund manager rankings from SEC 13F data; view any investor's holdings by CIK with live prices

  ```
  $ longbridge investors
  | #  | name                                        | AUM      | period      | cik        |
  |----|---------------------------------------------|----------|-------------|------------|
  | 1  | Capital International Investors             | $637.97B | 31-DEC-2025 | 0001562230 |
  | 2  | Capital Research Global Investors           | $541.73B | 31-DEC-2025 | 0001422848 |
  | 3  | CTC LLC                                     | $404.44B | 31-DEC-2025 | 0001445893 |
  | 4  | BERKSHIRE HATHAWAY INC                      | $274.16B | 31-DEC-2025 | 0001067983 |
  | 5  | DODGE & COX                                 | $185.26B | 31-DEC-2025 | 0000200217 |

  $ longbridge investors 0001067983
  Period: 2025-12-31  (filed: 2026-02-17)

  BERKSHIRE HATHAWAY INC (period: 2025-12-31)

  Portfolio: 42 positions, total value ~$274.16B

  | company                      | value    | shares  | weight |
  |------------------------------|----------|---------|--------|
  | APPLE INC                    | $61.96B  | 227.92M | 22.6%  |
  | AMERICAN EXPRESS CO          | $56.09B  | 151.61M | 20.5%  |
  | BANK AMERICA CORP            | $28.45B  | 517.30M | 10.4%  |
  | COCA COLA CO                 | $27.96B  | 400.00M | 10.2%  |
  | CHEVRON CORP NEW             | $19.84B  | 130.16M | 7.2%   |
  | MOODYS CORP                  | $12.60B  | 24.67M  | 4.6%   |
  | OCCIDENTAL PETE CORP         | $10.89B  | 264.94M | 4.0%   |
  | CHUBB LIMITED                | $10.69B  | 34.25M  | 3.9%   |
  | KRAFT HEINZ CO               | $7.90B   | 325.63M | 2.9%   |
  | ALPHABET INC                 | $5.59B   | 17.85M  | 2.0%   |
  ```

- **`insider-trades`** — SEC Form 4 insider transaction history for any symbol

  ```
  $ longbridge insider-trades TSLA.US
  Fetching 20 Form 4 filings...

  | date       | filer        | title         | type     | shares | price   | value    | owned_after |
  |------------|--------------|---------------|----------|--------|---------|----------|-------------|
  | 2026-03-31 | Zhu Xiaotong | SVP           | EXERCISE | 20.00K | $20.57  | $411.40K | 20.00K      |
  | 2025-09-11 | Zhu Xiaotong | SVP, APAC and | SELL     | 20.00K | $363.75 | $7.28M   | 47.60K      |
  | 2025-06-12 | Zhu Xiaotong | SVP, APAC     | EXERCISE | 15.00K | $20.57  | $308.55K | 82.60K      |
  | 2025-06-12 | Zhu Xiaotong | SVP, APAC     | SELL     | 15.00K | $323.81 | $4.86M   | 67.60K      |

  Source: SEC EDGAR Form 4 — TSLA
  ```

- **`watchlist pin/unpin`** — pin securities to the top of a watchlist group
- **`assets` command** — renamed from `balance`; full asset overview: net assets, buying power, margin, risk level, and per-currency cash breakdown

## 2026-04-08

### CLI v0.14.2

- **`--lang` flag** — set content language (`zh-CN`, `zh-HK`, `en`) for all commands; falls back to system `LANG` env var

## 2026-04-02

### CLI v0.14.1

- **CN region login** — `longbridge auth login` now supports China region routing
- **`-v` flag** — quick version check

### CLI v0.14.0

- **Device auth** — the Longbridge Developers platform now supports OAuth Device Authorization Flow; `longbridge auth login` displays a verification URL and code to authorize from any device, including SSH and headless environments
- **Order enhancements** — trailing stop and AO order types; `--expire-date`, `--outside-rth`, `--remark` added to order commands
- **Fix** — prebuilt Linux binary now uses musl to fix segfault on some distributions

## 2026-04-01

### CLI v0.13.0

- Add **Fundamentals & Analysis** commands:
  - `financial-report` — financial statements with period and type filters
  - `valuation` — P/E, P/B, P/S, dividend yield snapshot with peer comparison and history mode
  - `forecast-eps` — analyst EPS forecast consensus
  - `consensus` — revenue/profit/EPS consensus with beat/miss annotations
  - `institution-rating` / `institution-rating detail` — rating distribution and monthly trends
  - `shareholder` — institutional shareholders with change tracking and sort options
  - `fund-holder` — funds and ETFs holding a symbol
  - `dividend` / `dividend detail` — dividend history and distribution plan
  - `finance-calendar` — financial calendar by event type (financial, report, dividend, ipo, macrodata, closed)
  - `exchange-rate` — exchange rates for all supported currencies
- Refactor CLI commands with domain-grouped naming convention

## 2026-03-30

- Add Statement API:
  - `GET /v1/statement/list` — list daily or monthly account statements
  - `GET /v1/statement/download` — get presigned download URL for a statement file

## 2026-03-25

- Add Community API:
  - `GET /content/topics/mine` — list my published topics
  - `POST /content/topics` — create a new community topic
  - `GET /content/topics/{id}` — get topic detail
  - `GET /content/topics/{topic_id}/comments` — list topic replies
  - `POST /content/topics/{topic_id}/comments` — create a topic reply

## 2025-06-17

- Update the interface for Get Account Balance
  - `GET /v1/asset/account` Add response field (frozen_transaction_fees)

## 2024-10-09

### SDK 2.0.0

- Print the opened quote packages when connected to the server.
- The quantity type in the trading API has changed from `int` to `Decimal`.

## 2024-09-11

- Updated Get Security List API
  - The `GET /v1/quote/get_security_list` now returns the name in the corresponding language based on the `accept-language` request header, instead of returning all three languages at once.

## 2024-08-28

- Change the `Depth.price` field in the SDK from `Decimal` type to `Optional[Decimal]` type

## 2024-05-17

- Expand `outside_rth` field to support overnight trading in order placement and query APIs

## 2024-05-06

- Update the interface for Get Account Balance
  - `GET /v1/asset/account` Add response field (buy_power)

## 2024-04-29

- Remove `TSMPCT`, `TSMAMT` Order type

## 2024-04-15

- Add `last_share`, `last_price` field to [Trade push](https://open.longbridge.com/en/docs/trade/trade-definition#websocket-notification).

## 2024-04-13

- Add `remark` field to [Trade push](https://open.longbridge.com/en/docs/trade/trade-definition#websocket-notification).

## 2023-11-03

- Add quote history candlestick interface
  - Long connection `Business Command：27`, obtain the history candlestick of security

## 2023-08-17

- Update the interface for Get Account Balance
  - `GET /v1/asset/account` Add parameter (currency)

## 2023-04-12

- Update the interface for Get Stock Positions
  - `GET /v1/asset/stock` Add response field (init_quantity)

## 2023-04-11

- Added order details query interface
  - 'GET /v1/trade/order' Get the order details
- Added the Estimate Maximum Purchase Quantity interface
  - 'GET /v1/trade/estimate/buy_limit' Get the estimated maximum purchase quantity
- U.S. stock options add market order and condition order support

## 2022-07-18

- Update security static info interface
  - Long connection `Business Command：10`, response add `board` fields

## 2022-07-14

- Add get stock margin ratio interface
  - `GET /v1/risk/margin-ratio` Get stock margin ratio

## 2022-06-30

- Add get watched groups interface
  - `GET /v1/watchlist/groups` Get watched groups

## 2022-06-20

- Update account balance interface
  - `GET /v1/asset/account` Response to increase the net assets (net_assets), initial margin (init_margin), maintenance margin (maintenance_margin) fields
- Update position interface
  - `GET /v1/asset/stock` Support users to obtain option positions

## 2022-06-15

- Add quote capital interface
  - Long connection `Business Command:24`, obtain the daily capital distribution of security
  - Long connection `Business Command:25`, obtain the daily capital flow intraday of security
