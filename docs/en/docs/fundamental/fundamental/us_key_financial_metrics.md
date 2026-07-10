---
slug: us_key_financial_metrics
title: US Key Financial Metrics
sidebar_position: 34
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

Get key financial metrics for a US stock — revenue, net income, EPS, margins, and growth rates.

<CliCommand>
# Key financial metrics (US accounts)
longbridge financial-report key-metrics AAPL.US
longbridge financial-report key-metrics AAPL.US --report quarterly
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_key_financial_metrics" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Stock symbol, e.g. `AAPL.US` |
| report | string | NO | Period: `af` (annual), `saf` (semi-annual), `qf` (quarterly), `q1` (Q1), `3q` (Q3) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_key_financial_metrics("AAPL.US", "af")
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
    resp = await ctx.us_key_financial_metrics("AAPL.US", "af")
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
  const resp = await ctx.usKeyFinancialMetrics("AAPL.US", "af")
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
            var resp = ctx.getUsKeyFinancialMetrics("AAPL.US", "af").get();
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
    let resp = ctx.us_key_financial_metrics("AAPL.US", "af").await?;
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
    resp, err := c.KeyFinancialMetrics(context.Background(), "AAPL.US", "af")
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
  "currency": "USD",
  "report": "af",
  "empty_fields": [],
  "list": [
    {
      "ff_period": "A",
      "ff_year": 2024,
      "fp_end": "2024-09-28",
      "report_txt": "FY2024",
      "rpt_date": "2024-11-01",
      "fields": [
        {"key": "revenue", "value": "391035000000"},
        {"key": "gross_margin", "value": "0.4621"},
        {"key": "net_margin", "value": "0.2397"},
        {"key": "eps", "value": "6.07"}
      ]
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UsKeyFinancialMetrics](#UsKeyFinancialMetrics) |
| 400    | Bad request | None   |

## Schemas

### UsKeyFinancialMetrics

<a id="UsKeyFinancialMetrics"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | true | Currency code (e.g. `USD`) |
| report | string | true | Report period type (e.g. `annual`, `quarterly`) |
| empty_fields | string[] | false | Fields with no data for this period |
| list | USKeyMetricItem[] | true | Key metric records by period |

### USKeyMetricItem

<a id="USKeyMetricItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| ff_period | string | true | Period type code (e.g. `A`=annual, `Q`=quarterly) |
| ff_year | int | true | Fiscal year |
| fp_end | string | true | Period end date (YYYY-MM-DD) |
| report_txt | string | true | Period label (e.g. `FY2024`) |
| rpt_date | string | true | Report release date (YYYY-MM-DD) |
| fields | object[] | true | Key financial metric values (structure varies by company) |
