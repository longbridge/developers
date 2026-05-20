---
slug: /market/stock-events
title: Top Movers
sidebar_position: 7
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get stocks whose price movement exceeds the 20-trading-day standard deviation, with automatically correlated news to explain the move.

<CliCommand>
longbridge top-movers
longbridge top-movers --market HK --sort time
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="stock_events" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| markets | string[] | NO | Market list: `HK`, `US`, `CN`, `SG`; returns all markets if omitted |
| sort | integer | NO | Sort order: `0`=time (newest first), `1`=price change, `2`=hotness (default) |
| date | string | NO | Target date in `YYYY-MM-DD` format; returns latest data if omitted |
| limit | integer | NO | Number of results to return, default 20 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.stock_events(markets=["HK", "US"], sort=2, limit=20)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncMarketContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncMarketContext.create(config)

    resp = await ctx.stock_events(markets=["HK", "US"], sort=2, limit=20)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, MarketContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = MarketContext.new(config)
  const resp = await ctx.stockEvents({ markets: ['HK', 'US'], sort: 2, limit: 20 })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.market.*;
import java.util.Arrays;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             MarketContext ctx = MarketContext.create(config)) {
            var resp = ctx.getStockEvents(Arrays.asList("HK", "US"), 2, null, 20).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, market::MarketContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = MarketContext::new(config);
    let resp = ctx.stock_events(Some(vec!["HK", "US"]), Some(2), None, Some(20)).await?;
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
using namespace longbridge::market;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            MarketContext ctx = MarketContext::create(config);
            ctx.stock_events({"HK", "US"}, 2, "", 20, [](auto resp) {
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
	"github.com/longbridge/openapi-go/market"
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
	c, err := market.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.StockEvents(context.Background(), []string{"HK", "US"}, 2, "", 20)
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
    "events": [
      {
        "stock": {
          "symbol": "9988.HK",
          "name": "Alibaba",
          "change": "+4.82%",
          "labels": ["HK", "Technology"]
        },
        "timestamp": 1747728600000,
        "alert_reason": "Earnings beat: revenue up 8%",
        "alert_type": "earnings_beat",
        "post": {
          "id": "post_abc123",
          "title": "Alibaba Q4 Earnings: Cloud Business Surges",
          "url": "https://longbridge.com/news/post_abc123"
        }
      },
      {
        "stock": {
          "symbol": "NVDA.US",
          "name": "NVIDIA",
          "change": "+3.21%",
          "labels": ["US", "Semiconductor"]
        },
        "timestamp": 1747725000000,
        "alert_reason": "Block buy: volume up 3x",
        "alert_type": "volume_spike",
        "post": null
      }
    ],
    "next_params": "eyJvZmZzZXQiOjIwfQ=="
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [StockEventsResponse](#StockEventsResponse) |
| 400    | Bad request | None   |

## Schemas

### StockEventsResponse

<a id="StockEventsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| events | object[] | false | List of moving stocks |
| ∟ stock | object | false | Basic stock information |
| ∟ ∟ symbol | string | false | Security symbol |
| ∟ ∟ name | string | false | Security name |
| ∟ ∟ change | string | false | Price change with sign, e.g. `+4.82%` |
| ∟ ∟ labels | string[] | false | Tags (market, industry, etc.) |
| ∟ timestamp | integer | false | Event time (Unix milliseconds) |
| ∟ alert_reason | string | false | Description of the move reason |
| ∟ alert_type | string | false | Move type identifier |
| ∟ post | object | false | Associated news/article; `null` if none |
| ∟ ∟ id | string | false | Article ID |
| ∟ ∟ title | string | false | Article title |
| ∟ ∟ url | string | false | Article URL |
| next_params | string | false | Pagination cursor (Base64 encoded); pass to the next request to get the next page |
