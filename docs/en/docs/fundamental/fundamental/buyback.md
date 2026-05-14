---
slug: buyback
title: Buyback
sidebar_position: 20
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get share buyback data including historical buyback amounts and ratios.

<SDKLinks module="fundamental" klass="FundamentalContext" method="buyback" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol, e.g. `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.buyback("AAPL.US")
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

    resp = await ctx.buyback("AAPL.US")
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
  const resp = await ctx.buyback('AAPL.US')
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
            var resp = ctx.getBuyback("AAPL.US").get();
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
    let resp = ctx.buyback("AAPL.US").await?;
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
using namespace longbridge::fundamental;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            FundamentalContext ctx = FundamentalContext::create(config);
            ctx.buyback("AAPL.US", [](auto resp) {
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
	resp, err := c.Buyback(context.Background(), "AAPL.US")
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
    "buyback_history": [
      {
        "fiscal_year": "FY2024",
        "fiscal_year_range": "2024-01-01~2024-12-31",
        "net_buyback": "94949000000",
        "net_buyback_yield": "0.0241",
        "net_buyback_growth_rate": "-0.1233"
      }
    ],
    "buyback_ratios": [
      {
        "net_buyback_payout_ratio": "0.9502",
        "net_buyback_to_cashflow_ratio": "0.8821"
      }
    ],
    "recent_buybacks": {
      "currency": "USD",
      "net_buyback_ttm": "94949000000",
      "net_buyback_yield_ttm": "0.0241"
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [BuybackDataResponse](#BuybackDataResponse) |
| 400    | Bad request | None   |

## Schemas

### BuybackDataResponse

<a id="BuybackDataResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| buyback_history | object[] | false | Annual buyback history, see [BuybackHistoryItem](#BuybackHistoryItem) |
| buyback_ratios | object[] | false | Buyback ratio history, see [BuybackRatios](#BuybackRatios) |
| recent_buybacks | object | false | Trailing 12-month buyback summary |

### BuybackHistoryItem

<a id="BuybackHistoryItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| fiscal_year | string | false | Fiscal year |
| fiscal_year_range | string | false | Fiscal year date range |
| currency | string | false | Currency |
| net_buyback | string | false | Net buyback amount |
| net_buyback_growth_rate | string | false | Buyback growth rate |
| net_buyback_yield | string | false | Buyback yield |

### BuybackRatios

<a id="BuybackRatios"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| net_buyback_payout_ratio | string | false | Buyback payout ratio |
| net_buyback_to_cashflow_ratio | string | false | Buyback to free cash flow ratio |

### RecentBuybacks

<a id="RecentBuybacks"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | false | Currency |
| net_buyback_ttm | string | false | Net buyback (trailing 12 months) |
| net_buyback_yield_ttm | string | false | Buyback yield (trailing 12 months) |
