---
slug: trading-stats
title: Trading Stats
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get trade statistics showing price distribution by volume for a security.

<CliCommand>
longbridge trade-stats 700.HK
longbridge trade-stats TSLA.US
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="trading_stats" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol, e.g. `700.HK` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.trading_stats("AAPL.US")
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

    resp = await ctx.trading_stats("AAPL.US")
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
  const resp = await ctx.trading_stats('AAPL.US')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.market.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             MarketContext ctx = MarketContext.create(config)) {
            var resp = ctx.getTradingStats("AAPL.US").get();
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
    let resp = ctx.trading_stats("AAPL.US").await?;
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
            ctx.trading_stats("AAPL.US", [](auto resp) {
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
	resp, err := c.TradingStats(context.Background(), "AAPL.US")
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
    "statistics": {
      "avgprice": "210.50",
      "buy": "45000000",
      "sell": "38000000",
      "neutral": "12000000",
      "total_amount": "95000000",
      "trades_count": "125000",
      "preclose": "208.20",
      "timestamp": "1778198400",
      "trade_date": [
        "2026-05-13"
      ]
    },
    "trades": [
      {
        "price": "210.00",
        "buy_amount": "5000000",
        "sell_amount": "4000000",
        "neutral_amount": "1000000"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [TradeStatsResponse](#TradeStatsResponse) |
| 400    | Bad request | None   |

## Schemas

### TradeStatsResponse

<a id="TradeStatsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| statistics | object | true | Aggregate trade statistics |
| statistics.avgprice | string | false | Average trade price |
| statistics.buy | string | false | Total buy volume |
| statistics.sell | string | false | Total sell volume |
| statistics.neutral | string | false | Total neutral volume |
| statistics.total_amount | string | false | Total traded amount |
| statistics.trades_count | string | false | Total trade count |
| statistics.preclose | string | false | Previous close price |
| statistics.timestamp | string | false | Statistics timestamp |
| statistics.trade_date | string[] | false | Trading dates included |
| trades | object[] | false | Price-level trade distribution |
| ∟ price | string | true | Price level |
| ∟ buy_amount | string | false | Buy amount at this price |
| ∟ sell_amount | string | false | Sell amount at this price |
| ∟ neutral_amount | string | false | Neutral amount at this price |
