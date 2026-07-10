---
slug: us_order_detail
title: US Order Detail
sidebar_position: 11
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

Get detail for a specific US order — execution history, order status, and any attached child orders.


<CliCommand>
# View US order detail
longbridge order detail 701276261045858304
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_order_detail" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| order_id | string | YES | Order ID |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_order_detail("701276261045858304")
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
    resp = await ctx.us_order_detail("701276261045858304")
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
  const resp = await ctx.usOrderDetail("701276261045858304")
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
            var resp = ctx.getUsOrderDetail("701276261045858304").get();
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
    let resp = ctx.us_order_detail("701276261045858304").await?;
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
	resp, err := c.USOrderDetail(context.Background(), "701276261045858304")
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
  "order": {
    "id": "701276261045858304",
    "symbol": "AAPL.US",
    "action": "Buy",
    "order_type": "LO",
    "status": "Filled",
    "price": "185.00",
    "quantity": "10",
    "executed_qty": "10",
    "executed_price": "184.95",
    "executed_amount": "1849.50",
    "currency": "USD",
    "submitted_at": "1751866334",
    "done_at": "1751866400",
    "time_in_force": 0,
    "msg": ""
  },
  "current_attached_order": null,
  "current_millisecond": "1751866400000"
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [USOrderDetailResponse](#USOrderDetailResponse) |
| 400    | Bad request | None   |



### USOrderDetailResponse

<a id="USOrderDetailResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| order | USOrderDetail \| null | true | Full order detail, null if not found |
| current_attached_order | USOrderDetail \| null | false | Attached child order (bracket/OCO) |
| current_millisecond | string | false | Server timestamp (milliseconds) |

### USOrderDetail

<a id="USOrderDetail"></a>

Core fields (the full response contains 50+ fields for fees, triggers, and settlement details):

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | string | Order ID |
| symbol | string | Trading symbol (e.g. `AAPL.US`) |
| action | int | Direction: 1=Buy, 2=Sell |
| order_type | string | Order type |
| status | string | Order status |
| price | string | Order price |
| quantity | string | Order quantity |
| executed_qty | string | Executed quantity |
| executed_price | string | Average executed price |
| executed_amount | string | Total executed amount |
| currency | string | Currency code |
| submitted_at | string | Submission time |
| done_at | string | Completion time |
| time_in_force | int | Time-in-force type |
| trigger_price | string | Trigger price (stop orders) |
| msg | string | Status message |
| order_histories | USOrderHistory[] | Order state-transition history |
| attached_orders | USAttachedOrder[] | Attached child orders |
| button_control | USButtonControl | Available action buttons |
| charge_detail | USChargeDetail \| null | Fee breakdown |

### USOrderHistory

<a id="USOrderHistory"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| exec_type | int | Execution type |
| status | string | Order status at this point |
| price | string | Price |
| qty | string | Quantity |
| time | string | Timestamp |
| msg | string | Message |
