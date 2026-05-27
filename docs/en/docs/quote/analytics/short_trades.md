---
slug: /quote/pull/short-trades
title: Daily Short Sale Volume
sidebar_position: 27
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get daily short sale volume data for a security. Supports US stocks (FINRA/NASDAQ) and HK stocks (HKEX). US data is updated bi-weekly; HK data is updated each trading day.

<CliCommand>
longbridge short-trades TSLA.US
longbridge short-trades 700.HK --count 30
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="short_trades" />


## Parameters

> **SDK method parameters.**

| Name   | Type    | Required | Description                                                     |
| ------ | ------- | -------- | --------------------------------------------------------------- |
| symbol | string  | YES      | Security symbol; supports US (e.g. `TSLA.US`) and HK (e.g. `700.HK`) |
| count  | integer | NO       | Number of records to return (1–100, default 20)                 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.short_trades("TSLA.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.short_trades("TSLA.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.shortTrades('TSLA.US')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            var resp = ctx.getShortTrades("TSLA.US").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.short_trades("TSLA.US").await?;
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
using namespace longbridge::quote;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            QuoteContext ctx = QuoteContext::create(config);
            ctx.short_trades("TSLA.US", [](auto resp) {
                if (resp) std::cout << resp->size() << std::endl;
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
	"github.com/longbridge/openapi-go/quote"
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
	qctx, err := quote.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer qctx.Close()
	resp, err := qctx.ShortTrades(context.Background(), "TSLA.US")
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

US stocks (`.US` suffix):

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "timestamp": "2026-05-15T04:00:00Z",
      "nus_amount": "5748485",
      "ny_amount": "0",
      "total_amount": "15778974",
      "rate": "0.3643",
      "close": "300.230"
    }
  ]
}
```

HK stocks (`.HK` suffix):

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "timestamp": "2026-05-17T16:00:00Z",
      "amount": "2926000",
      "balance": "1318056100.00",
      "total_amount": "29497076",
      "rate": "0.0992",
      "close": "449.2"
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [ShortTradesResponse](#ShortTradesResponse) |
| 400    | Bad request | None   |

## Schemas

### US Response (`.US` symbols)

<a id="ShortTradesResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| data | object[] | false | Daily short trade volume records |
| ∟ timestamp | string | false | Trading date (RFC 3339, e.g. `2026-05-15T04:00:00Z`) |
| ∟ nus_amount | string | false | NASDAQ short sale volume (shares) |
| ∟ ny_amount | string | false | NYSE short sale volume (shares) |
| ∟ total_amount | string | false | Total trading volume for the day |
| ∟ rate | string | false | Short ratio (short volume ÷ total volume) |
| ∟ close | string | false | Closing price |

### HK Response (`.HK` symbols)

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| data | object[] | false | Daily short trade volume records |
| ∟ timestamp | string | false | Trading date (RFC 3339, e.g. `2026-05-15T04:00:00Z`) |
| ∟ amount | string | false | Short sale turnover amount (HKD) |
| ∟ balance | string | false | Short position balance |
| ∟ total_amount | string | false | Total trading turnover for the day |
| ∟ rate | string | false | Short ratio (short turnover ÷ total turnover) |
| ∟ close | string | false | Closing price |
