---
slug: us_company_dividends
title: US Company Dividends
sidebar_position: 37
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US Accounts
This method is only available for US data-center accounts.
:::

Get dividend history for a US stock — TTM yield, payout count, and individual dividend records.

<CliCommand>
# Company dividends (US accounts)
longbridge dividend AAPL.US
longbridge dividend MSFT.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_company_dividends" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Stock symbol, e.g. `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_company_dividends("AAPL.US")
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
    resp = await ctx.us_company_dividends("AAPL.US")
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
  const resp = await ctx.usCompanyDividends("AAPL.US")
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
            var resp = ctx.getUsCompanyDividends("AAPL.US").get();
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
    let resp = ctx.us_company_dividends("AAPL.US").await?;
    println!("{:?}", resp);
    Ok(())
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
    resp, err := c.CompanyDividends(context.Background(), "AAPL.US")
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
  "recent_dividends": {
    "dividend_ttm": "1.00",
    "dividend_yield_ttm": "0.0053",
    "payouts": "4",
    "currency": "USD"
  },
  "dividend_history": [
    {
      "fiscal_year": "2024",
      "fiscal_year_range": "2024-01-01 ~ 2024-12-31",
      "dividend": "1.00",
      "dividend_yield": "0.0053",
      "dividend_growth_rate": "0.0408",
      "dividend_payout_ratio": "0.1497",
      "total_shareholder_yield": "0.0163",
      "currency": "USD"
    }
  ],
  "payout_ratios": [
    {
      "fiscal_year": "2024",
      "fiscal_year_range": "2024-01-01 ~ 2024-12-31",
      "dividend_payout_ratio": "0.1497",
      "currency": "USD"
    }
  ],
  "dividend_payout_history": [
    {
      "dividend": "0.25",
      "dividend_type": "Cash",
      "currency": "USD",
      "ex_date": "2024-11-08",
      "payment_date": "2024-11-14",
      "record_date": "2024-11-11",
      "title": "Q4 FY2024 Dividend",
      "start_time_unix": "1730000000"
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UsCompanyDividends](#UsCompanyDividends) |
| 400    | Bad request | None   |


## Schemas

### UsCompanyDividends

<a id="UsCompanyDividends"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| recent_dividends | USRecentDividend | true | Recent dividend summary |
| dividend_history | USDividendHistoryItem[] | false | Annual dividend history |
| payout_ratios | USDividendHistoryItem[] | false | Payout ratio history |
| dividend_payout_history | USDividendPayoutRecord[] | false | Individual payout records |

### USRecentDividend

<a id="USRecentDividend"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| dividend_ttm | string | TTM dividend per share |
| dividend_yield_ttm | string | TTM dividend yield (%) |
| payouts | string | Number of payouts in past year |
| currency | string | Currency code |

### USDividendHistoryItem

<a id="USDividendHistoryItem"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| fiscal_year | string | Fiscal year |
| fiscal_year_range | string | Fiscal year date range |
| dividend | string | Total dividend per share |
| dividend_yield | string | Dividend yield |
| dividend_growth_rate | string | YoY dividend growth rate |
| dividend_payout_ratio | string | Dividend payout ratio |
| dividend_to_cashflow_ratio | string | Dividend-to-cashflow ratio |
| total_shareholder_yield | string | Total shareholder yield |
| net_buyback | string | Net buyback amount |
| net_buyback_yield | string | Net buyback yield |
| net_buyback_growth_rate | string | Net buyback growth rate |
| net_buyback_payout_ratio | string | Net buyback payout ratio |
| net_buyback_to_cashflow_ratio | string | Net buyback-to-cashflow ratio |
| currency | string | Currency code |

