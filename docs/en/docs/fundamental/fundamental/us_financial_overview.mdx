---
slug: us_financial_overview
title: US Financial Overview
sidebar_position: 32
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

Get financial overview for a US stock by reporting period — income, balance sheet, and cash flow summary.

<CliCommand>
# US financial overview
longbridge financial-report AAPL.US
longbridge financial-report TSLA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_financial_overview" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Stock symbol, e.g. `AAPL.US` |
| report | string | YES | Period: `annual` or `quarterly` (default: annual) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_financial_overview("AAPL.US", report="annual")
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
    resp = await ctx.us_financial_overview("AAPL.US", report="annual")
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
  const resp = await ctx.usFinancialOverview("AAPL.US", "annual")
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
            var resp = ctx.getUsFinancialOverview("AAPL.US", "annual").get();
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
    let resp = ctx.us_financial_overview("AAPL.US", "annual").await?;
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
    resp, err := c.FinancialOverview(context.Background(), "AAPL.US", "annual")
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
  "ccy_symbol": "USD",
  "report_type": "annual",
  "is_list": [
    {
      "revenue": "391035000000",
      "net_income": "93736000000",
      "net_margin": "0.2397",
      "report": {
        "start_date": "2023-10-01",
        "end_date": "2024-09-28",
        "report_txt": "FY2024"
      }
    }
  ],
  "bs_list": [
    {
      "debt_assets_ratio": "0.8193",
      "total_assets": "364840000000",
      "total_liabilities": "308927000000",
      "report": {
        "start_date": "2023-10-01",
        "end_date": "2024-09-28",
        "report_txt": "FY2024"
      }
    }
  ],
  "cf_list": [
    {
      "operating": "118254000000",
      "investing": "-21013000000",
      "financing": "-89831000000",
      "report": {
        "start_date": "2023-10-01",
        "end_date": "2024-09-28",
        "report_txt": "FY2024"
      }
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UsFinancialOverview](#UsFinancialOverview) |
| 400    | Bad request | None   |

## Schemas

### UsFinancialOverview

<a id="UsFinancialOverview"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| ccy_symbol | string | true | Currency symbol |
| report_type | string | true | Report type (e.g. `annual`, `quarterly`) |
| is_list | USFinancialISItem[] | true | Income statement items |
| bs_list | USFinancialBSItem[] | true | Balance sheet items |
| cf_list | USFinancialCFItem[] | true | Cash flow items |

### USFinancialISItem

<a id="USFinancialISItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| revenue | string | true | Total revenue |
| net_income | string | true | Net income |
| net_margin | string | true | Net profit margin |
| report | USReportPeriod | true | Reporting period info |

### USFinancialBSItem

<a id="USFinancialBSItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| debt_assets_ratio | string | true | Debt-to-assets ratio |
| total_assets | string | true | Total assets |
| total_liabilities | string | true | Total liabilities |
| report | USReportPeriod | true | Reporting period info |

### USFinancialCFItem

<a id="USFinancialCFItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| operating | string | true | Operating cash flow |
| investing | string | true | Investing cash flow |
| financing | string | true | Financing cash flow |
| report | USReportPeriod | true | Reporting period info |

### USReportPeriod

<a id="USReportPeriod"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| start_date | string | true | Period start date (YYYY-MM-DD) |
| end_date | string | true | Period end date (YYYY-MM-DD) |
| report_txt | string | true | Period label (e.g. `FY2024`, `Q1 2024`) |
