---
slug: us_etf_dividend_info
title: US ETF Dividend Info
sidebar_position: 36
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

Get dividend information for a US ETF — TTM dividend yield, payout frequency, and fiscal year breakdown.

<CliCommand>
# ETF dividend info (US accounts)
longbridge dividend IVV.US
longbridge dividend SPY.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_etf_dividend_info" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | ETF symbol, e.g. `IVV.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_etf_dividend_info("IVV.US")
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
    resp = await ctx.us_etf_dividend_info("IVV.US")
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
  const resp = await ctx.usEtfDividendInfo("IVV.US")
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
            var resp = ctx.getUsEtfDividendInfo("IVV.US").get();
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
    let resp = ctx.us_etf_dividend_info("IVV.US").await?;
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
    resp, err := c.ETFDividendInfo(context.Background(), "IVV.US")
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
  "dividend_ttm": "6.84",
  "dividend_yield_ttm": "0.0134",
  "dividend_frequency": "Quarterly",
  "currency": "USD",
  "fiscal_year_info": [
    {
      "fiscal_year": "2025",
      "fiscal_year_range": "2025-01-01 ~ 2025-12-31",
      "dividend": "6.52",
      "dividend_yield": "0.0134",
      "currency": "USD"
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UsETFDividendInfo](#UsETFDividendInfo) |
| 400    | Bad request | None   |


## Schemas

### UsETFDividendInfo

<a id="UsETFDividendInfo"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| dividend_ttm | string | true | TTM dividend per share |
| dividend_yield_ttm | string | true | TTM dividend yield (%) |
| dividend_frequency | string | true | Payout frequency (e.g. `Quarterly`) |
| currency | string | true | Currency code (e.g. `USD`) |
| fiscal_year_info | USFiscalYearDividend[] | false | Annual dividend breakdown by fiscal year |

### USFiscalYearDividend

<a id="USFiscalYearDividend"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| fiscal_year | string | Fiscal year |
| fiscal_year_range | string | Fiscal year date range |
| dividend | string | Total dividend for the year |
| dividend_yield | string | Dividend yield for the year |
| currency | string | Currency code |
