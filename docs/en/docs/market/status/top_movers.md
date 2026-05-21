---
slug: /market/top-movers
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

<SDKLinks module="market" klass="MarketContext" method="top_movers" />


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

resp = ctx.top_movers(markets=["HK", "US"], sort=2, limit=20)
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

    resp = await ctx.top_movers(markets=["HK", "US"], sort=2, limit=20)
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
  const resp = await ctx.topMovers({ markets: ['HK', 'US'], sort: 2, limit: 20 })
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
            var resp = ctx.getTopMovers(new TopMoversOptions() {{ markets = new String[]{"HK", "US"}; sort = 2; limit = 20; }}).get();
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
    let resp = ctx.top_movers(Some(vec!["HK", "US"]), Some(2), None, Some(20)).await?;
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
            ctx.top_movers({"HK", "US"}, 2, "", 20, [](auto resp) {
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
	resp, err := c.TopMovers(context.Background(), []string{"HK", "US"}, 2, "", 20)
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
          "code": "TSLA",
          "counter_id": "ST/US/TSLA",
          "name": "特斯拉",
          "change": "-0.0388",
          "last_done": "404.110",
          "market": "US",
          "labels": ["汽车制造商"],
          "logo": "https://assets.lbkrs.com/ticker/ST/US/TSLA.png",
          "trade_status": 0
        },
        "timestamp": "1779202097",
        "alert_reason": "波动超 20 日均值",
        "alert_type": 11,
        "post": null
      }
    ],
    "next_params": {
      "visited": ["11098290", "11098478", "11099705"]
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [TopMoversResponse](#TopMoversResponse) |
| 400    | Bad request | None   |

## Schemas

### TopMoversResponse

<a id="TopMoversResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| events | object[] | false | List of moving stocks |
| ∟ stock | object | false | Basic stock information |
| ∟ ∟ code | string | false | Ticker code (e.g. `TSLA`) |
| ∟ ∟ counter_id | string | false | Counter ID (e.g. `ST/US/TSLA`) |
| ∟ ∟ name | string | false | Security name |
| ∟ ∟ change | string | false | Price change ratio (e.g. `-0.0388`) |
| ∟ ∟ last_done | string | false | Latest trade price |
| ∟ ∟ market | string | false | Market: `US`, `HK`, `CN`, `SG` |
| ∟ ∟ labels | string[] | false | Industry / theme tags |
| ∟ ∟ logo | string | false | Logo image URL |
| ∟ ∟ trade_status | integer | false | Trading status code |
| ∟ timestamp | string | false | Event time (Unix seconds as string) |
| ∟ alert_reason | string | false | Description of the move reason |
| ∟ alert_type | integer | false | Move type code |
| ∟ post | object | false | Associated news article (complex object with `title`, `description_html`, `published_at` and other fields; `null` when no article is linked) |
| next_params | object | false | Pagination cursor object; pass to the next request to get the next page |
