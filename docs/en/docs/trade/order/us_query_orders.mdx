---
slug: us_query_orders
title: US Order History
sidebar_position: 10
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

Query historical and pending orders for US accounts with pagination and filtering.

<CliCommand>
# List US orders
longbridge order
# Filter pending orders
longbridge order --status pending
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_query_orders" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | NO | Filter by symbol, e.g. `AAPL.US` |
| action | int | NO | Direction filter: `0`=all, `1`=buy, `2`=sell (default: `0`) |
| start_at | int64 | NO | Start time (Unix seconds); `0` = last 90 days |
| end_at | int64 | NO | End time (Unix seconds); `0` = now |
| query_type | int | NO | `0`=all (incl. rejected), `1`=pending, `2`=filled only (default: `0`) |
| page | int | NO | Page number, 1-based (default: `1`) |
| limit | int | NO | Page size (default: `20`) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
# List all orders (all defaults)
resp = ctx.us_query_orders()
# Filter: buy orders for AAPL.US
resp = ctx.us_query_orders(symbol="AAPL.US", action=1)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.us_query_orders()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.usQueryOrders(null, 0, 0, 0, 0, 1, 20)
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.trade.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            var resp = ctx.getUsQueryOrders("", 0, 0L, 0L, 0, 1, 20).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = TradeContext::new(config);
    let opts = longbridge::trade::GetUSHistoryOrders {
        symbol: None,
        side: longbridge::trade::OrderSide::Unknown,
        start_at: 0,
        end_at: 0,
    };
    let resp = ctx.us_query_orders(opts).await?;
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
	"github.com/longbridge/openapi-go/trade"
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
	c, err := trade.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	page := int32(1)
	limit := int32(20)
	resp, err := c.QueryUSOrders(context.Background(), &trade.GetUSHistoryOrders{Page: page, Limit: limit})
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
  "orders": [
    {
      "id": "701276261045858304",
      "symbol": "AAPL.US",
      "action": "Buy",
      "order_type": "LO",
      "status": "Filled",
      "price": "185.00",
      "quantity": "10",
      "submitted_at": 1751866334,
      "updated_at": 1751866400
    }
  ],
  "total_count": 1
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [QueryUSOrdersResponse](#QueryUSOrdersResponse) |
| 400    | Bad request | None   |


## Schemas

### QueryUSOrdersResponse

<a id="QueryUSOrdersResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| orders | USOrder[] | true | List of orders matching the filter |
| total_count | int | true | Total number of matching orders |

### USOrder

<a id="USOrder"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | Order ID |
| symbol | string | Trading symbol (e.g. `AAPL.US`) |
| action | string | Direction: `Buy` or `Sell` |
| order_type | string | Order type |
| status | string | Order status |
| price | string | Order price |
| quantity | string | Order quantity |
| submitted_at | int64 | Submission time (Unix seconds) |
| updated_at | int64 | Last update time (Unix seconds) |
