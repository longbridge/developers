---
slug: financial-report-snapshot
title: Financial Report Snapshot
sidebar_position: 26
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get an AI-generated earnings summary, revenue/EBIT/EPS forecast vs actual (beat/miss analysis), and key financial ratios.

<CliCommand>
longbridge financial-report snapshot AAPL.US
longbridge financial-report snapshot AAPL.US --report qf --year 2024 --period 4
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="financial_report_snapshot" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol, e.g. `AAPL.US` |
| report | string | NO | Report type: `qf` (quarterly) / `saf` (semi-annual) / `af` (annual) |
| fiscal_year | uint32 | NO | Fiscal year, e.g. `2024` |
| fiscal_period | string | NO | Fiscal period, e.g. `1` / `2` / `3` / `4` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.financial_report_snapshot("AAPL.US", report="qf", fiscal_year=2024, fiscal_period="4")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncFundamentalContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncFundamentalContext.create(config)

    resp = await ctx.financial_report_snapshot("AAPL.US", report="qf", fiscal_year=2024, fiscal_period="4")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.financialReportSnapshot('AAPL.US', { report: 'qf', fiscalYear: 2024, fiscalPeriod: '4' })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.fundamental.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             FundamentalContext ctx = FundamentalContext.create(config)) {
            var resp = ctx.getFinancialReportSnapshot("AAPL.US", "qf", 2024, "4").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, fundamental::FundamentalContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.financial_report_snapshot("AAPL.US", Some("qf"), Some(2024), Some("4")).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

using namespace longbridge;
using namespace longbridge::fundamental;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            FundamentalContext ctx = FundamentalContext::create(config);
            ctx.financial_report_snapshot("AAPL.US", "qf", 2024, "4", [](auto resp) {
                if (resp) std::cout << "OK" << std::endl;
            });
        });
    std::cin.get();
}
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
		OnOpenURL(func(url string) { fmt.Println("Open this URL to authorize:", url) })
	if err := o.Build(context.Background()); err != nil {
		log.Fatal(err)
	}
	conf, err := config.New(config.WithOAuthClient(o))
	if err != nil {
		log.Fatal(err)
	}
	c, err := fundamental.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.FinancialReportSnapshot(context.Background(), "AAPL.US", "qf", 2024, "4")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response


### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "Apple Inc.",
    "ticker": "AAPL.US",
    "fp_start": "2024-10-01",
    "fp_end": "2024-12-31",
    "currency": "USD",
    "report_desc": "Apple delivered record revenue of $124.3B in Q1 FY2025...",
    "fo_revenue": {"value": "124300000000", "yoy": "0.0407", "cmp_desc": "beat by 1.2%", "est_value": "123800000000"},
    "fo_ebit": {"value": "42800000000", "yoy": "0.0520", "cmp_desc": "beat by 0.8%", "est_value": "42500000000"},
    "fo_eps": {"value": "2.40", "yoy": "0.0870", "cmp_desc": "beat by 2.1%", "est_value": "2.35"},
    "fr_revenue": {"value": "124300000000", "yoy": "0.0407"},
    "fr_profit": {"value": "36330000000", "yoy": "0.0710"},
    "fr_roe_ttm": "0.1570",
    "fr_profit_margin": "0.2923",
    "fr_debt_assets_ratio": "0.8120"
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [FinancialReportSnapshotResponse](#FinancialReportSnapshotResponse) |
| 400    | Bad request | None   |

## Schemas

### FinancialReportSnapshotResponse

<a id="FinancialReportSnapshotResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | string | false | Company name |
| ticker | string | false | Security ticker |
| fp_start | string | false | Fiscal period start date |
| fp_end | string | false | Fiscal period end date |
| currency | string | false | Currency code |
| report_desc | string | false | AI-generated earnings summary text |
| fo_revenue | object | false | Revenue forecast comparison |
| fo_revenue.value | string | false | Actual revenue |
| fo_revenue.yoy | string | false | Year-over-year growth rate (decimal) |
| fo_revenue.cmp_desc | string | false | Beat/miss description |
| fo_revenue.est_value | string | false | Consensus estimate value |
| fo_ebit | object | false | EBIT forecast comparison (same fields as fo_revenue) |
| fo_eps | object | false | EPS forecast comparison (same fields as fo_revenue) |
| fr_revenue | object | false | Revenue financial data |
| fr_revenue.value | string | false | Revenue value |
| fr_revenue.yoy | string | false | Year-over-year growth rate |
| fr_profit | object | false | Net profit financial data (same fields as fr_revenue) |
| fr_operate_cash | object | false | Operating cash flow (same fields as fr_revenue) |
| fr_invest_cash | object | false | Investing cash flow (same fields as fr_revenue) |
| fr_finance_cash | object | false | Financing cash flow (same fields as fr_revenue) |
| fr_total_assets | object | false | Total assets (same fields as fr_revenue) |
| fr_total_liability | object | false | Total liabilities (same fields as fr_revenue) |
| fr_roe_ttm | string | false | Return on equity TTM (decimal) |
| fr_profit_margin | string | false | Net profit margin (decimal) |
| fr_profit_margin_ttm | string | false | Net profit margin TTM (decimal) |
| fr_asset_turn_ttm | string | false | Asset turnover rate TTM (decimal) |
| fr_leverage_ttm | string | false | Leverage ratio TTM (decimal) |
| fr_debt_assets_ratio | string | false | Debt-to-assets ratio (decimal) |
