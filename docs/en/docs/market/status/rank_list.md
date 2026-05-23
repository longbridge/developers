---
slug: /market/rank-list
title: Popularity Leaderboard
sidebar_position: 9
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the stock ranking for a given leaderboard tag key. The key comes from `rank_categories` `second_tags[].key`, e.g. `hot_all-us` (US total hotness).

<CliCommand>
longbridge rank --key hot_all-us
longbridge rank --key hot_all-hk
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="rank_list" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| key | string | YES | Leaderboard tag key from `rank_categories` `second_tags[].key` |
| need_article | boolean | NO | Whether to return associated articles, default `false` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.rank_list("hot_all-us")
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

    resp = await ctx.rank_list("hot_all-us", need_article=False)
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
  const resp = await ctx.rankList('hot_all-us', false)
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
            var resp = ctx.getRankList("hot_all-us", false).get();
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
    let resp = ctx.rank_list("hot_all-us", false).await?;
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
            ctx.rank_list("hot_all-us", false, [](auto resp) {
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
	resp, err := c.RankList(context.Background(), "hot_all-us", false)
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
    "bmp": false,
    "lists": [
      {
        "code": "MU",
        "symbol": "MU.US",
        "name": "Micron Technology",
        "last_done": "698.740",
        "chg": "0.0252",
        "change": "17.200",
        "inflow": "-347041642",
        "market_cap": "787992890796",
        "industry": "Semiconductor Manufacturers",
        "pre_post_price": "726.600",
        "pre_post_chg": "0.0399",
        "amplitude": "0.1082",
        "five_day_chg": "-0.0885",
        "turnover_rate": "0.0550",
        "volume_rate": "1.11",
        "pb_ttm": "32.68"
      }
    ]
  }
}
```

> Note: The response contains many additional fields; the above are the main ones.

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [RankListResponse](#RankListResponse) |
| 400    | Bad request | None   |

## Schemas

### RankListResponse

<a id="RankListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| bmp | boolean | false | Whether the response is a market preview (before open) |
| lists | object[] | false | Leaderboard stock list |
| ∟ code | string | false | Ticker code (e.g. `MU`) |
| ∟ symbol | string | false | Symbol in `CODE.MARKET` format (e.g. `MU.US`) |
| ∟ name | string | false | Security name |
| ∟ last_done | string | false | Latest trade price |
| ∟ chg | string | false | Price change ratio as decimal (e.g. `0.0252` = 2.52%) |
| ∟ change | string | false | Absolute price change (e.g. `17.200`) |
| ∟ inflow | string | false | Net capital inflow (in the market's currency) |
| ∟ market_cap | string | false | Market capitalisation |
| ∟ industry | string | false | Industry classification |
| ∟ pre_post_price | string | false | Pre/post-market price |
| ∟ pre_post_chg | string | false | Pre/post-market price change ratio (decimal) |
| ∟ amplitude | string | false | Amplitude / intraday range ratio (decimal) |
| ∟ five_day_chg | string | false | 5-day price change ratio (decimal) |
| ∟ turnover_rate | string | false | Turnover rate (decimal) |
| ∟ volume_rate | string | false | Volume ratio (vs average) |
| ∟ pb_ttm | string | false | Price-to-book ratio (TTM) |

> Note: The response contains many additional fields; the above are the main ones.
