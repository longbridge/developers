---
slug: us_company_overview
title: US Company Overview
sidebar_position: 30
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

Get company overview for a US stock — introduction, market cap, ranking tags, and detail URL.

<CliCommand>
# US company overview
longbridge company AAPL.US
longbridge company TSLA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_company_overview" />

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
resp = ctx.us_company_overview("AAPL.US")
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
    resp = await ctx.us_company_overview("AAPL.US")
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
  const resp = await ctx.usCompanyOverview("AAPL.US")
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
            var resp = ctx.getUsCompanyOverview("AAPL.US").get();
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
    let resp = ctx.us_company_overview("AAPL.US").await?;
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
    resp, err := c.CompanyOverview(context.Background(), "AAPL.US")
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
  "intro": "Apple Inc. designs, manufactures, and markets smartphones, personal computers...",
  "market_cap": "3150000000000",
  "ccy_symbol": "USD",
  "top_rank_tags": [
    {
      "key": "sp500",
      "title": "S&P 500",
      "text": "S&P 500",
      "rank_type": 1
    }
  ],
  "detail_url": "https://longbridge.com/stocks/AAPL.US",
  "sharelist": []
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UsCompanyOverview](#UsCompanyOverview) |
| 400    | Bad request | None   |


## Schemas

### UsCompanyOverview

<a id="UsCompanyOverview"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| intro | string | true | Company introduction |
| market_cap | string | true | Market capitalization |
| ccy_symbol | string | true | Currency symbol |
| top_rank_tags | USRankTag[] | false | Ranking tag labels |
| detail_url | string | false | Link to full company detail page |
| sharelist | USSharelistItem[] | false | Related sharelist items |

### USRankTag

<a id="USRankTag"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| key | string | Tag key identifier |
| title | string | Tag title |
| text | string | Tag display text |
| rank_type | int | Ranking type |
| highlight_text | string | Highlight display text |


### USSharelistItem

<a id="USSharelistItem"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | Sharelist ID |
| name | string | Sharelist name |
| chg | string | Change value |
