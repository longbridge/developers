---
title: 'Release Notes'
sidebar_label: 'Release Notes'
sidebar_position: 100
sidebar_icon: newspaper
---

# Release Notes

### [v0.19.2](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.19.2)

- **`finance-calendar` revamp** — restructured into subcommands (`report`, `dividend`, `split`, `ipo`, `macrodata`, `closed`); new `--filter watchlist|positions` scopes events to your watchlist or holdings
- **`quote`** — new "Last Chg%" column showing price change vs previous close
- **`corp-action`** — defaults to 30 items; add `--all` to retrieve all records
- **`update --force`** — skip version check and force reinstall; auto-retries with `sudo` on permission error
- **TUI** — full mouse support; chart type toggle (line / candlestick) in stock detail view

### [v0.19.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.19.0)

- **TUI: History orders tab** — press `Tab` on the Orders page to switch between Today and History; History mode fetches the last 30 days by default; press `f` to open a date-range filter popup
- **TUI: Cancel and modify orders** — press `c` to cancel or `m` to modify an active today order directly from the orders table; a confirmation step is shown before submitting
- **`auth status` quote packages** — displays a formatted table of subscribed quote packages (market, name, validity period) and prints a QR code to open the quote mall in the Longbridge App
- **`calc-index` field aliases** — short aliases for common fields: `iv` (implied_volatility), `oi` (open_interest), `vol` (volume), `mktcap` (total_market_value), `exp` (expiry_date), `strike` (strike_price); `--help` now groups fields into General and Options/Warrants sections
- **`quant run` command** — run a quant indicator script server-side against historical K-line data; supply the script inline with `--script` or pipe via stdin; outputs computed plot values as JSON
- **`update` release notes** — only the 10 most recent entries are shown after `longbridge update` completes; `sudo` is suggested when the binary lives in `/usr/local/bin`

### [v0.18.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.18.0)

- **TUI: Orders page** — interactive orders table with trading shortcuts and an order entry dialog for placing trades without leaving the terminal
- **`dividend --page` / `--year`** — paginate through large dividend histories and filter by year; fetches 50 records per page (up from 30)

### [v0.17.4](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.4)

- **`--limit` alias for `--count`** — all commands that accept `--count` now also accept `--limit` as an alias, improving compatibility for AI agent tool-calling
- **Fix: Unix self-update ETXTBUSY** — `longbridge update` no longer fails with "Text file busy" on Unix; the update now uses a staged temp file and atomic rename instead of writing directly to the running binary

### [v0.17.3](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.3)

- **Fix: token refresh hang** — when the access token expired on a flaky network, the CLI no longer waits 5 minutes before failing; it now fails immediately with a clear error and preserves the token file for the next retry
- **`auth status` accuracy** — now shows three states: `valid` (green), `refresh pending` (yellow, access token expired but refresh token valid — next command auto-refreshes with no user action needed), `expired` (red, re-login required); previously `refresh pending` was incorrectly shown as `expired`
- **Fix: `--auth-code` login** — browser OAuth flow now triggers correctly when no token file exists
- **Fix: Windows browser launch** — OAuth URLs containing `&` parameters no longer get truncated on Windows; switched to the `open` crate for cross-platform browser launching

### [v0.17.1](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.1)

- **`completion` command** — generate shell tab-completion scripts for bash, zsh, fish, elvish, and powershell; redirect stdout to the appropriate file then reload your shell to activate (e.g. `longbridge completion zsh > ~/.zfunc/_longbridge`)
- Sets `User-Agent: longbridge-cli/<version>` on all HTTP and WebSocket requests
- Adds `x-cli-cmd` request header identifying the active subcommand on every API call

### [v0.17.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.17.0)

- **`dca` command** — recurring investment plans: create, update, pause, resume, stop, view trade history, stats summary, check symbol eligibility, and calculate next trade date; HK/SG accounts must agree to Terms and Conditions before creating a plan (`--agree-terms` to skip the interactive prompt)
- **`sharelist` command** — community stock lists: list own and subscribed sharelists, browse trending lists (`popular`), create/delete sharelists, and add/remove/reorder constituent stocks
- **`short-positions`** — US stock short selling data: short ratio, short shares, average daily volume, days-to-cover, and close price; updated bi-monthly by FINRA; `--count` 1–100
- **`option volume`** — real-time call/put volume snapshot with put/call ratio; `daily` subcommand for historical call/put volume and open interest
- **`option chain`** — without `--date` now returns expiry dates only; pass `--date` to see strikes for a specific expiry
- **`profit-analysis`** — added `--start`/`--end` date filtering for the summary command; Simple Yield and TWR now shown as percentages; breakdown renamed from "Stock P&L Breakdown" to "P&L Breakdown" (includes funds and MMF)

### v0.16.3

- **`auth` subcommand group** — `longbridge auth login`, `auth logout`, `auth status`; `auth status` shows token validity, expiry, account info, and quote level locally without network
- **`alert enable` / `alert disable`** — toggle price alerts on/off without deleting them
- **Fix: US index symbols** — `.DJI.US`, `.VIX.US` and other US index symbols now parse correctly; US indexes require a leading dot (e.g. `.DJI.US`, not `DJI.US`)
- **"Did you mean?" hints** — when a query returns no data, the CLI suggests the correct symbol format: missing market suffix → `TSLA.US` / `700.HK`; missing leading dot → `.DJI.US`

### v0.16.1

**Enhancements**

- `option quote` — now returns all fields from the OptionQuote API (added `timestamp`, `trade_status`, `open_interest`, `historical_volatility`, `contract_multiplier`, `contract_size`, `direction`, `underlying_symbol`); JSON output uses proper typed values instead of table-column strings
- `calc-index` — Theta, Vega, and Rho values are now normalized (÷100) to standard per-share conventions; auto-detects option symbols and switches to Greeks default fields when stock defaults return empty
- `capital` — improved argument handling
- `market-status` — fixed incorrect `trade_status` mapping (105 = afternoon trading session); JSON output now returns human-readable market and status labels instead of raw API codes
- Parameter standardization: `--adjust none/forward` (was `no_adjust/forward_adjust`), `--tif day/gtc/gtd` (was `Day/GoodTilCanceled/GoodTilDate`), `--format table` as default name (alias: `pretty`), `finance-calendar --start/--end` (was `--date/--end-date`), `statement --start-date` now accepts `YYYY-MM-DD` format
- TUI: fixed watchlist sort jumping and made scrollbar more subtle

### [v0.16.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.16.0)

21 new commands covering company fundamentals, market data, and account features.

**New: Company & Fundamentals**

- `company` — company overview (founding date, employees, IPO price, address)
- `executive` — company executives and key personnel
- `industry-valuation` — industry valuation comparison with peers (PE/PB/EPS/DY); `dist` subcommand for percentile ranking
- `operating` — operating reviews: financial indicators table + management review
- `corp-action` — corporate actions (splits, dividends, rights, etc.)
- `invest-relation` — investment relations (subsidiary/parent companies)

**New: Market & Quotes**

- `constituent` — index/ETF constituent stocks with sorting + rise/fall stats
- `market-status` — market open/close status for each exchange
- `broker-holding` — broker holding positions for HK stocks (top/detail/daily)
- `ah-premium` — A/H premium ratio kline and intraday data for dual-listed stocks
- `trade-stats` — trade statistics (price distribution by volume)
- `anomaly` — quote anomalies / unusual market movements

**New: Account**

- `alert` — price alerts (list/add/delete)
- `profit-analysis` — P&L summary + per-stock breakdown; `detail` for individual stock P&L with transaction flows; `by-market` for market-filtered view

**Enhancements**

- `update` — cross-platform self-update with Windows support and CDN acceleration; `--release-notes` to view changelog; auto-shows release notes on version change
- `intraday --date` — retrieve historical intraday data for a past date
- TUI: press `/` to search watchlist or type a symbol to jump directly to any stock
- `BROWSER` env var support for custom browser selection during login

### [v0.15.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.15.0)

- **New: `portfolio` command** — total P/L, asset distribution by market (US/HK/CN/SG/Cash), holdings, and cash balances
- **New: `investors` command** — SEC 13F-based active fund manager rankings; view any investor's holdings by CIK with live prices
- **New: `insider-trades`** — SEC Form 4 insider transaction history for any symbol
- **New: `watchlist pin/unpin`** — pin securities to the top of a watchlist group
- **Enhanced: `assets`** — renamed from `balance`; now shows full asset overview: net assets, buying power, margin, risk level, and per-currency cash breakdown

### [v0.14.2](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.2)

- **New: `--lang` global flag** — set content language (`zh-CN`, `zh-HK`, `en`) for all commands; falls back to system `LANG` env var then `en`

### [v0.14.1](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.1)

- **New: CN region login** — `longbridge auth login` now supports China region routing
- **New: `-v` flag** — show version without entering the full command

### [v0.14.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.14.0)

- **New: Device auth login** — `longbridge auth login` now uses OAuth device flow; displays a URL and code to authorize on any device, works in SSH and headless environments; `--headless` flag removed
- **New: Order enhancements** — trailing stop and AO order types; `--expire-date`, `--outside-rth`, `--remark` added to order commands
- **Fix: Linux segfault** — prebuilt Linux binary now uses musl to fix crash on some distributions

### [v0.13.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.13.0)

- **New: Fundamentals & analysis commands** — `financial-report`, `valuation`, `forecast-eps`, `consensus`, `institution-rating`, `shareholder`, `fund-holder`, `dividend`, `finance-calendar`, `exchange-rate`
- **Breaking: command restructure** — 19 flat commands moved into subcommand trees (e.g. `news-detail` → `news detail`, `kline-history` → `kline history`, `warrant-list` → `warrant list`)
- **CN region support** — set `LONGBRIDGE_REGION=cn` to route through the China endpoint

### [v0.12.0](https://github.com/longbridge/longbridge-terminal/releases/tag/v0.12.0)

- **New: `statement` commands** — list and export daily/monthly account statements
- **TUI** — fixed `q` quit; added news list and detail views inside watchlist

---

Full changelog: [github.com/longbridge/longbridge-terminal/releases](https://github.com/longbridge/longbridge-terminal/releases)
