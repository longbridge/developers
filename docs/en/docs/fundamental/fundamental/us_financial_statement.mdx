---
slug: us_financial_statement
title: US Financial Statement
sidebar_position: 33
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

Get a specific financial statement (income statement, balance sheet, or cash flow) for a US stock.

<CliCommand>
# Income statement
longbridge financial-statement AAPL.US --kind IS
# Balance sheet
longbridge financial-statement AAPL.US --kind BS
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_financial_statement" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Stock symbol, e.g. `AAPL.US` |
| kind | string | YES | Statement type: `IS` (income), `BS` (balance sheet), `CF` (cash flow) |
| report | string | YES | Period: `af` (annual), `saf` (semi-annual), `qf` (quarterly), `q1` (Q1), `3q` (Q3) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_financial_statement("AAPL.US", "IS", "af")
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
    resp = await ctx.us_financial_statement("AAPL.US", "IS", "af")
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
  const resp = await ctx.usFinancialStatement("AAPL.US", "IS", "af")
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
            var resp = ctx.getUsFinancialStatementV3("AAPL.US", "IS", "af").get();
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
    let resp = ctx.us_financial_statement("AAPL.US", "IS", "af").await?;
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
    resp, err := c.FinancialStatement(context.Background(), "AAPL.US", "IS", "af")
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
        {
          "id": "revenue",
          "name": "Total Revenue",
          "value": "391035000000",
          "yoy": "0.0198",
          "level": 1,
          "display_order": 1,
          "field": "revenue",
          "value_type": "amount"
        }
      ]
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UsFinancialStatement](#UsFinancialStatement) |
| 400    | Bad request | None   |

## Schemas

### UsFinancialStatement

<a id="UsFinancialStatement"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | true | Currency code (e.g. `USD`) |
| report | string | true | Report period type (e.g. `annual`, `quarterly`) |
| empty_fields | string[] | false | Fields with no data for this period |
| list | USFinancialStatementPeriod[] | true | Statement data by period |

### USFinancialStatementPeriod

<a id="USFinancialStatementPeriod"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| ff_period | string | true | Period type code (e.g. `A`=annual, `Q`=quarterly) |
| ff_year | int | true | Fiscal year |
| fp_end | string | true | Period end date (YYYY-MM-DD) |
| report_txt | string | true | Period label (e.g. `FY2024`) |
| rpt_date | string | true | Report release date (YYYY-MM-DD) |
| fields | USFinancialStatementField[] | true | Financial line items |

### USFinancialStatementField

<a id="USFinancialStatementField"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | string | true | Field identifier |
| name | string | true | Field display name |
| value | string | true | Field value |
| yoy | string | false | Year-over-year change rate |
| level | int | true | Hierarchy level (1=top level) |
| display_order | int | true | Display order |
| field | string | true | Field key name |
| value_type | string | true | Value type (e.g. `amount`, `ratio`) |
