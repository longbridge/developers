# US Market APIs Documentation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document 14 new US-market SDK methods and corresponding CLI updates from CLI PR #262, OpenAPI PR #555, and openapi-go PR #106.

**Architecture:** All changes are purely documentation — new/updated Markdown files. SDK docs go under `docs/{lang}/docs/fundamental/fundamental/` (and trade/quote sections if needed); CLI docs go under `docs/{lang}/docs/cli/`. Three languages: en / zh-CN / zh-HK. All US-only methods must include a US-account restriction note.

**Tech Stack:** VitePress Markdown, `<CliCommand>`, `<SDKLinks>`, `<Tabs>/<TabItem>` components. No tests — visual review via dev server.

## Global Constraints

- Working directory: `/Users/hogan/work/longbridge/developers`
- Branch: `docs/cli-openapi-update` (already created)
- Three languages required: en, zh-CN, zh-HK
- All US-only SDK methods use `:::warning` admonition: "This method is only available for US data-center accounts (`DcRegion::Us`)."
- CLI commands with US routing: add `:::info` note: "For US accounts, this command routes to the US data-center API automatically."
- New CLI files follow pattern: `docs/{lang}/docs/cli/{section}/{command}.md`
- SDK docs follow pattern: `docs/{lang}/docs/fundamental/fundamental/{method}.md`
- `SDKLinks` tag format: `<SDKLinks module="fundamental" klass="FundamentalContext" method="us_company_overview" />`
- No build commands during AI session

## Source PRs

- **CLI #262** (`longbridge-terminal`): 14 US APIs, 3 new commands, 7+ updated commands
- **SDK #555** (`longbridge/openapi`): 14 new methods (Rust/Python/Node.js/Java)
- **SDK #106** (`longbridge/openapi-go`): Same 14 methods for Go

## Files to Create/Modify

### New CLI docs (3 new files × 3 langs = 9 files)
| File | Command |
|------|---------|
| `docs/{lang}/docs/cli/fundamentals/etf-docs.md` | `longbridge etf-docs <SYMBOL>` |

### Updated CLI docs (7 files × 3 langs = 21 files)
| File | Change |
|------|--------|
| `docs/{lang}/docs/cli/orders/order.md` | Add `--status`, `--action` flags; US routing note |
| `docs/{lang}/docs/cli/fundamentals/company.md` | US routing note |
| `docs/{lang}/docs/cli/fundamentals/valuation.md` | US routing note |
| `docs/{lang}/docs/cli/fundamentals/financial-report.md` | US routing + `key-metrics` subcommand; `--kind` default change |
| `docs/{lang}/docs/cli/fundamentals/consensus.md` | US routing note |
| `docs/{lang}/docs/cli/fundamentals/dividend.md` | US routing (ETF vs stock) |
| `docs/{lang}/docs/cli/account/profit-analysis.md` | Add `realized` subcommand |

### New SDK docs (14 files × 3 langs = 42 files)
Grouped into 3 pages per lang (US Fundamental, US Trade, US Quote):
| File | Methods covered |
|------|----------------|
| `docs/{lang}/docs/fundamental/fundamental/us_company_overview.md` | `us_company_overview` |
| `docs/{lang}/docs/fundamental/fundamental/us_valuation_overview.md` | `us_valuation_overview` |
| `docs/{lang}/docs/fundamental/fundamental/us_financial_overview.md` | `us_financial_overview` |
| `docs/{lang}/docs/fundamental/fundamental/us_financial_statement.md` | `us_financial_statement` |
| `docs/{lang}/docs/fundamental/fundamental/us_key_financial_metrics.md` | `us_key_financial_metrics` |
| `docs/{lang}/docs/fundamental/fundamental/us_analyst_consensus.md` | `us_analyst_consensus` |
| `docs/{lang}/docs/fundamental/fundamental/us_etf_dividend_info.md` | `us_etf_dividend_info` |
| `docs/{lang}/docs/fundamental/fundamental/us_company_dividends.md` | `us_company_dividends` |
| `docs/{lang}/docs/fundamental/fundamental/us_etf_files.md` | `us_etf_files` |

---

## Task 1: New CLI command — `etf-docs` (3 languages)

**Files:**
- Create: `docs/en/docs/cli/fundamentals/etf-docs.md`
- Create: `docs/zh-CN/docs/cli/fundamentals/etf-docs.md`
- Create: `docs/zh-HK/docs/cli/fundamentals/etf-docs.md`

**Command:** `longbridge etf-docs <SYMBOL> [--limit 10]`
- US-only command (only works for US ETF accounts)
- Returns ETF document files (prospectus, factsheets, etc.)
- `--limit`: max files to return (default: 10)

- [ ] **Step 1: Create EN file**

```markdown
---
title: 'etf-docs'
sidebar_label: 'etf-docs'
sidebar_position: 21
---

# longbridge etf-docs

List regulatory documents for a US ETF — prospectus, fact sheets, and filings.

:::warning US Only
This command is only available for US data-center accounts.
:::

## Basic Usage

```bash
longbridge etf-docs IVV.US
```

```
Name
----
iShares Core S&P 500 ETF Prospectus
iShares Core S&P 500 ETF SAI
...
```

## Examples

### List ETF documents

<CliCommand>
longbridge etf-docs IVV.US
longbridge etf-docs SPY.US
</CliCommand>

### Limit results

```bash
longbridge etf-docs IVV.US --limit 5
```

## Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--limit` | Max number of documents to return | 10 |
```

- [ ] **Step 2: Create zh-CN file**

```markdown
---
title: 'etf-docs'
sidebar_label: 'etf-docs'
sidebar_position: 21
---

# longbridge etf-docs

列出美股 ETF 的监管文件，包括招股书、事实说明书及申报文件。

:::warning Longbridge US 账户
此命令仅适用于美国数据中心账户。
:::

## 基本用法

```bash
longbridge etf-docs IVV.US
```

## 示例

### 列出 ETF 文件

<CliCommand>
longbridge etf-docs IVV.US
longbridge etf-docs SPY.US
</CliCommand>

### 限制返回数量

```bash
longbridge etf-docs IVV.US --limit 5
```

## 选项

| 选项 | 描述 | 默认值 |
| ---- | ---- | ------ |
| `--limit` | 返回文件数量上限 | 10 |
```

- [ ] **Step 3: Create zh-HK file** (same as zh-CN with Traditional Chinese)

```markdown
---
title: 'etf-docs'
sidebar_label: 'etf-docs'
sidebar_position: 21
---

# longbridge etf-docs

列出美股 ETF 的監管文件，包括招股書、事實說明書及申報文件。

:::warning 僅限美股賬戶
此命令僅適用於美國數據中心賬戶。
:::

## 基本用法

```bash
longbridge etf-docs IVV.US
```

## 示例

### 列出 ETF 文件

<CliCommand>
longbridge etf-docs IVV.US
longbridge etf-docs SPY.US
</CliCommand>

### 限制返回數量

```bash
longbridge etf-docs IVV.US --limit 5
```

## 選項

| 選項 | 描述 | 默認值 |
| ---- | ---- | ------ |
| `--limit` | 返回文件數量上限 | 10 |
```

- [ ] **Step 4: Commit**
```bash
git add docs/en/docs/cli/fundamentals/etf-docs.md docs/zh-CN/docs/cli/fundamentals/etf-docs.md docs/zh-HK/docs/cli/fundamentals/etf-docs.md
git commit -m "docs(cli): add etf-docs command (US only)"
```

---

## Task 2: Update CLI `order` command — US flags (3 languages)

**Files:**
- Modify: `docs/en/docs/cli/orders/order.md`
- Modify: `docs/zh-CN/docs/cli/orders/order.md`
- Modify: `docs/zh-HK/docs/cli/orders/order.md`

**Changes:**
- Add `--status {pending|history|all}` flag (US accounts; default: all)
- Add `--action {buy|sell}` flag (US accounts; filter by side)
- Add US routing note: for US accounts, `order` routes to `us_query_orders()`
- Add `order detail --attached` flag: shows attached child order

- [ ] **Step 1: Read existing file and add new Options rows and a US note**

Append to the Options table in each file:
```
| `--status` | Filter orders: `pending` \| `history` \| `all` (US accounts only) | all |
| `--action` | Filter by side: `buy` \| `sell` (US accounts only) | — |
```

Add before the Options section:
```markdown
:::info US Accounts
For US data-center accounts, `order` routes to the US API automatically. Use `--status` and `--action` to filter US order history.
:::
```

Add `--attached` to `order detail` section:
```markdown
### View attached child order (US accounts)

```bash
longbridge order detail 701276261045858304 --attached
```
```

- [ ] **Step 2: Apply same changes to zh-CN** (translate notes and option descriptions)
- [ ] **Step 3: Apply same changes to zh-HK** (Traditional Chinese)
- [ ] **Step 4: Commit**
```bash
git add docs/en/docs/cli/orders/order.md docs/zh-CN/docs/cli/orders/order.md docs/zh-HK/docs/cli/orders/order.md
git commit -m "docs(cli): update order command with US flags (--status, --action, --attached)"
```

---

## Task 3: Update CLI `financial-report` — US routing + `key-metrics` subcommand (3 langs)

**Files:**
- Modify: `docs/en/docs/cli/fundamentals/financial-report.md`
- Modify: `docs/zh-CN/docs/cli/fundamentals/financial-report.md`
- Modify: `docs/zh-HK/docs/cli/fundamentals/financial-report.md`

**Changes:**
- Add US routing note: `.US` symbols without `--kind` route to `us_financial_overview()`; with `--kind IS|BS|CF` route to `us_financial_statement()`
- Add note: `--kind` default changed to empty string (breaking for US; was "ALL")
- Add `key-metrics` subcommand:
  - `longbridge financial-report key-metrics <SYMBOL> [--report annual|quarterly]`
  - US-only subcommand

- [ ] **Step 1: Add US routing section and key-metrics subcommand to EN file**

Add after existing subcommands section:
```markdown
### Key financial metrics (US accounts)

```bash
longbridge financial-report key-metrics AAPL.US
longbridge financial-report key-metrics AAPL.US --report quarterly
```

Returns key financial indicators for US stocks: revenue, net income, EPS, margins, etc.

:::warning US Only
`financial-report key-metrics` is only available for US data-center accounts.
:::

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--report` | Period: `annual` \| `quarterly` | annual |
```

Add US routing note near `--kind` option:
```markdown
:::info US Accounts
For `.US` symbols on US accounts: omitting `--kind` returns a financial overview (`us_financial_overview`); specifying `--kind IS|BS|CF` returns the detailed statement (`us_financial_statement`). Note: `--kind` default is now empty string (not `ALL`) to enable this routing.
:::
```

- [ ] **Step 2: Apply to zh-CN, Step 3: Apply to zh-HK**
- [ ] **Step 4: Commit**
```bash
git add docs/en/docs/cli/fundamentals/financial-report.md docs/zh-CN/docs/cli/fundamentals/financial-report.md docs/zh-HK/docs/cli/fundamentals/financial-report.md
git commit -m "docs(cli): add US routing and key-metrics subcommand to financial-report"
```

---

## Task 4: Update CLI `profit-analysis` — `realized` subcommand (3 langs)

**Files:**
- Modify: `docs/en/docs/cli/account/profit-analysis.md`
- Modify: `docs/zh-CN/docs/cli/account/profit-analysis.md`
- Modify: `docs/zh-HK/docs/cli/account/profit-analysis.md`

**Changes:**
- Add `realized` subcommand:
  - `longbridge profit-analysis realized [--category all|stock|option|crypto] [--currency USD]`
  - US-only subcommand for realized P&L breakdown

- [ ] **Step 1: Add realized subcommand section to EN file**

```markdown
## Subcommands

### `realized` — Realized P&L (US accounts)

```bash
longbridge profit-analysis realized
longbridge profit-analysis realized --category stock
longbridge profit-analysis realized --category option --currency USD
```

Returns realized profit and loss breakdown by asset category for US accounts.

:::warning US Only
`profit-analysis realized` is only available for US data-center accounts.
:::

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--category` | Asset category: `all` \| `stock` \| `option` \| `crypto` | all |
| `--currency` | Settlement currency | USD |
```

- [ ] **Step 2: Apply to zh-CN, Step 3: Apply to zh-HK**
- [ ] **Step 4: Commit**
```bash
git add docs/en/docs/cli/account/profit-analysis.md docs/zh-CN/docs/cli/account/profit-analysis.md docs/zh-HK/docs/cli/account/profit-analysis.md
git commit -m "docs(cli): add realized subcommand to profit-analysis (US only)"
```

---

## Task 5: Update CLI `company`, `valuation`, `consensus`, `dividend` — US routing (3 langs)

**Files (6 files × 3 langs = 18 files):**
- Modify: `docs/{lang}/docs/cli/fundamentals/company.md` — add US routing note
- Modify: `docs/{lang}/docs/cli/fundamentals/valuation.md` — add US routing note
- Modify: `docs/{lang}/docs/cli/fundamentals/consensus.md` — add US routing note
- Modify: `docs/{lang}/docs/cli/fundamentals/dividend.md` — add US routing note (ETF vs stock)

**Change pattern** — add this note to each file:
```markdown
:::info US Accounts
For `.US` symbols on US data-center accounts, this command routes to the US API automatically.
:::
```

For `dividend.md` specifically:
```markdown
:::info US Accounts
For US accounts: `.US` ETF symbols route to `us_etf_dividend_info`; `.US` stock symbols route to `us_company_dividends`.
:::
```

- [ ] **Step 1–4:** Add US routing notes to all 6 files in 3 languages (18 edits)
- [ ] **Step 5: Commit**
```bash
git add docs/en/docs/cli/fundamentals/company.md docs/zh-CN/docs/cli/fundamentals/company.md docs/zh-HK/docs/cli/fundamentals/company.md \
  docs/en/docs/cli/fundamentals/valuation.md docs/zh-CN/docs/cli/fundamentals/valuation.md docs/zh-HK/docs/cli/fundamentals/valuation.md \
  docs/en/docs/cli/fundamentals/consensus.md docs/zh-CN/docs/cli/fundamentals/consensus.md docs/zh-HK/docs/cli/fundamentals/consensus.md \
  docs/en/docs/cli/fundamentals/dividend.md docs/zh-CN/docs/cli/fundamentals/dividend.md docs/zh-HK/docs/cli/fundamentals/dividend.md
git commit -m "docs(cli): add US account routing notes to company/valuation/consensus/dividend"
```

---

## Task 6: New SDK docs — US Fundamental methods (3 langs × 9 files = 27 files)

**Methods covered:**
1. `us_company_overview(counter_id)` → GET `/v1/stock-info/company-overview`
2. `us_valuation_overview(counter_id)` → GET `/v1/stock-info/valuation-overview`
3. `us_financial_overview(counter_id, report)` → GET `/v1/stock-info/finn-overview`
4. `us_financial_statement(counter_id, kind, report)` → GET `/v1/us/quote/financials/statements`
5. `us_key_financial_metrics(counter_id, report)` → GET `/v1/stock-info/fin-keyfactor`
6. `us_analyst_consensus(counter_id, report)` → GET `/v1/stock-info/fin-consensus`
7. `us_etf_dividend_info(counter_id)` → GET `/v1/stock-info/etf-dividend-info`
8. `us_company_dividends(counter_id)` → GET `/v1/stock-info/company-dividends`
9. `us_etf_files(counter_id, size?)` → GET `/v1/stock-info/etf-files`

**Template for each SDK doc:**
```markdown
---
slug: {method_name}
title: {Title}
sidebar_position: {N}
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning US Only
This method is only available for US data-center accounts.
:::

{One-sentence description}

<SDKLinks module="fundamental" klass="FundamentalContext" method="{method_name}" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| counter_id | string | YES | Stock symbol, e.g. `AAPL.US` |
{additional params}

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.{method_name}("{example_symbol}")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/longbridge/openapi-go/config"
    "github.com/longbridge/openapi-go/oauth"
    "github.com/longbridge/openapi-go/fundamental"
)

func main() {
    o := oauth.New("your-client-id").
        OnOpenURL(func(url string) { fmt.Println("Open:", url) })
    if err := o.Build(context.Background()); err != nil {
        log.Fatal(err)
    }
    conf, _ := config.New(config.WithOAuthClient(o))
    c, _ := fundamental.NewFromCfg(conf)
    defer c.Close()
    resp, err := c.{GoMethod}(context.Background(), "{example_symbol}")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>
```

- [ ] **Step 1: Create all 9 EN SDK docs** with correct method names and examples
- [ ] **Step 2: Create all 9 zh-CN SDK docs** (Chinese descriptions)
- [ ] **Step 3: Create all 9 zh-HK SDK docs** (Traditional Chinese)
- [ ] **Step 4: Commit**
```bash
git add docs/en/docs/fundamental/fundamental/us_*.md docs/zh-CN/docs/fundamental/fundamental/us_*.md docs/zh-HK/docs/fundamental/fundamental/us_*.md
git commit -m "docs(fundamental): add US market SDK docs (9 FundamentalContext methods)"
```

---

## Task 7: Changelog update (3 langs)

**Files:**
- Modify: `docs/en/docs/changelog.md`
- Modify: `docs/zh-CN/docs/changelog.md`
- Modify: `docs/zh-HK/docs/changelog.md`

Prepend entry at top (after frontmatter):

```markdown
## 2026-07-07

### SDK v{version}

- **US market APIs** — 14 new methods across `FundamentalContext` (9), `QuoteContext` (1), `TradeContext` (4); all US data-center only (`DcRegion::Us`)

### CLI v{version}

- **US market routing** — `company`, `valuation`, `financial-report`, `consensus`, `dividend`, `order`, `positions` now route to US APIs automatically for US accounts
- **New `etf-docs` command** — list regulatory documents for US ETFs
- **New `financial-report key-metrics` subcommand** — key financial metrics for US stocks
- **New `profit-analysis realized` subcommand** — realized P&L by asset category (US only)
```

- [ ] **Step 1: Add EN changelog entry**
- [ ] **Step 2: Add zh-CN changelog entry**
- [ ] **Step 3: Add zh-HK changelog entry**
- [ ] **Step 4: Commit and push**
```bash
git add docs/en/docs/changelog.md docs/zh-CN/docs/changelog.md docs/zh-HK/docs/changelog.md
git commit -m "docs: add US market APIs changelog entry"
git push -u origin docs/cli-openapi-update
```

---

## Task 8: New SDK docs — US Trade + Quote methods (3 langs × 5 files = 15 files)

**Methods and target directories:**

| Method | Context | Directory | File |
|--------|---------|-----------|------|
| `us_query_orders(opts)` | TradeContext | `docs/{lang}/docs/trade/order/` | `us_query_orders.md` |
| `us_order_detail(order_id, is_attached)` | TradeContext | `docs/{lang}/docs/trade/order/` | `us_order_detail.md` |
| `us_asset_overview()` | TradeContext | `docs/{lang}/docs/trade/asset/` | `us_asset_overview.md` |
| `us_realized_pl(currency, category?)` | TradeContext | `docs/{lang}/docs/trade/asset/` | `us_realized_pl.md` |
| `us_crypto_overview(counter_id)` | QuoteContext | `docs/{lang}/docs/quote/stocks/` | `us_crypto_overview.md` |

**Method details:**

**`us_query_orders`** — POST `/v1/orders/query`
- `opts.symbol` (optional): e.g. `"AAPL.US"` or `"DOGEUSD.BKKT"`
- `opts.side` (optional): Buy/Sell; omit for all
- `opts.start_at` (optional): unix seconds
- `opts.end_at` (optional): unix seconds
- `opts.query_type` (optional): 0=all, 1=pending, 2=filled (default: 0)
- `opts.page` (optional): 1-based (default: 1)
- `opts.limit` (optional): page size (default: 20)
- Returns: `QueryUSOrdersResponse { orders: [USOrder], total_count: int }`

**`us_order_detail`** — GET `/v3/orders/{order_id}`
- `order_id` (required): string
- `is_attached` (optional): bool — include child order (default: false)
- Returns: `USOrderDetailResponse { order, order_histories, current_attached_order }`

**`us_asset_overview`** — GET `/v1/us/assets/overview`
- No parameters
- Returns: `USAssetOverview { account_type, asset_timestamp, cash_buy_power, cash_list, crypto_list }`

**`us_realized_pl`** — GET `/v1/us/assets/pl/realized`
- `currency` (required): string e.g. `"USD"`
- `category` (optional): `"ALL"` | `"STOCK"` | `"OPTION"` | `"CRYPTO"` (default: ALL)
- Returns: `USRealizedPL { realized_pl_list: [USRealizedPLEntry] }`

**`us_crypto_overview`** — GET `/v1/gemini/crypto-overview`
- `counter_id` (required): string e.g. `"DOGEUSD.BKKT"`
- Returns: `CryptoOverview { symbol, name, ticker, base_asset, currency, all_time_high, all_time_low, ... }`

**Template for each file** (same pattern as Task 6 but with correct module/klass):
- Trade methods: `<SDKLinks module="trade" klass="TradeContext" method="{method}" />`
- Quote method: `<SDKLinks module="quote" klass="QuoteContext" method="us_crypto_overview" />`

- [ ] **Step 1: Create 5 EN SDK docs**

`docs/en/docs/trade/order/us_query_orders.md`:
```markdown
---
slug: us_query_orders
title: US Order History
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning US Only
This method is only available for US data-center accounts.
:::

Query historical and pending orders for US accounts.

<SDKLinks module="trade" klass="TradeContext" method="us_query_orders" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | NO | Filter by symbol, e.g. `AAPL.US` |
| side | OrderSide | NO | Filter by side: Buy or Sell |
| start_at | int64 | NO | Start time (Unix seconds) |
| end_at | int64 | NO | End time (Unix seconds) |
| query_type | int32 | NO | 0=all, 1=pending, 2=filled (default: 0) |
| page | int32 | NO | Page number, 1-based (default: 1) |
| limit | int32 | NO | Page size (default: 20) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.query_us_orders()
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.QueryUSOrders(ctx, &trade.GetUSHistoryOrders{Page: 1, Limit: 20})
```

  </TabItem>
</Tabs>
```

`docs/en/docs/trade/order/us_order_detail.md`:
```markdown
---
slug: us_order_detail
title: US Order Detail
sidebar_position: 11
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning US Only
This method is only available for US data-center accounts.
:::

Get details for a specific US order, including history and optionally the attached child order.

<SDKLinks module="trade" klass="TradeContext" method="us_order_detail" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| order_id | string | YES | Order ID |
| is_attached | bool | NO | Include attached child order (default: false) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
resp = ctx.us_order_detail("701276261045858304", is_attached=False)
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.USOrderDetail(ctx, "701276261045858304")
```

  </TabItem>
</Tabs>
```

`docs/en/docs/trade/asset/us_asset_overview.md`:
```markdown
---
slug: us_asset_overview
title: US Asset Overview
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning US Only
This method is only available for US data-center accounts.
:::

Get an overview of US account assets — cash, stocks, options, and crypto.

<SDKLinks module="trade" klass="TradeContext" method="us_asset_overview" />

## Parameters

No parameters required.

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
resp = ctx.us_asset_overview()
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.USAssetOverview(ctx)
```

  </TabItem>
</Tabs>
```

`docs/en/docs/trade/asset/us_realized_pl.md`:
```markdown
---
slug: us_realized_pl
title: US Realized P&L
sidebar_position: 11
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning US Only
This method is only available for US data-center accounts.
:::

Get realized profit and loss breakdown for a US account, filtered by asset category.

<SDKLinks module="trade" klass="TradeContext" method="us_realized_pl" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | YES | Settlement currency, e.g. `USD` |
| category | string | NO | Asset category: `ALL` \| `STOCK` \| `OPTION` \| `CRYPTO` (default: `ALL`) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
resp = ctx.us_realized_pl("USD", category="STOCK")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
cat := "STOCK"
resp, err := c.USRealizedPL(ctx, &trade.GetUSRealizedPL{Currency: "USD", Category: &cat})
```

  </TabItem>
</Tabs>
```

`docs/en/docs/quote/stocks/us_crypto_overview.md`:
```markdown
---
slug: us_crypto_overview
title: US Crypto Overview
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning US Only
This method is only available for US data-center accounts.
:::

Get overview data for a US crypto trading pair — price history highs/lows, asset info.

<SDKLinks module="quote" klass="QuoteContext" method="us_crypto_overview" />

## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| counter_id | string | YES | Crypto symbol, e.g. `DOGEUSD.BKKT` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
resp = ctx.us_crypto_overview("DOGEUSD.BKKT")
print(resp)
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.CryptoOverview(ctx, "DOGEUSD.BKKT")
```

  </TabItem>
</Tabs>

## Response Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| symbol | string | Trading-pair symbol |
| name | string | Asset name |
| ticker | string | Short ticker |
| base_asset | string | Base asset code |
| currency | string | Quote currency |
| all_time_high | string | All-time high price |
| all_time_high_date | string | Date of all-time high |
| all_time_low | string | All-time low price |
| all_time_low_date | string | Date of all-time low |
```

- [ ] **Step 2: Create 5 zh-CN SDK docs** (translate descriptions and comments)
- [ ] **Step 3: Create 5 zh-HK SDK docs** (Traditional Chinese)
- [ ] **Step 4: Commit**
```bash
git add \
  docs/en/docs/trade/order/us_query_orders.md \
  docs/en/docs/trade/order/us_order_detail.md \
  docs/en/docs/trade/asset/us_asset_overview.md \
  docs/en/docs/trade/asset/us_realized_pl.md \
  docs/en/docs/quote/stocks/us_crypto_overview.md \
  docs/zh-CN/docs/trade/order/us_query_orders.md \
  docs/zh-CN/docs/trade/order/us_order_detail.md \
  docs/zh-CN/docs/trade/asset/us_asset_overview.md \
  docs/zh-CN/docs/trade/asset/us_realized_pl.md \
  docs/zh-CN/docs/quote/stocks/us_crypto_overview.md \
  docs/zh-HK/docs/trade/order/us_query_orders.md \
  docs/zh-HK/docs/trade/order/us_order_detail.md \
  docs/zh-HK/docs/trade/asset/us_asset_overview.md \
  docs/zh-HK/docs/trade/asset/us_realized_pl.md \
  docs/zh-HK/docs/quote/stocks/us_crypto_overview.md
git commit -m "docs(trade/quote): add US market SDK docs (4 TradeContext + 1 QuoteContext methods)"
```
