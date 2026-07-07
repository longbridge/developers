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
resp, err := c.USOrderDetail(ctx, "701276261045858304")
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>


## Response

Returns `USOrderDetailResponse` with the following fields:

| Field | Type | Description |
| ----- | ---- | ----------- |
| order | USOrder | Full order detail with status and fill information |
| order_histories | USOrderHistory[] | Historical status changes for the order |
| current_attached_order | USOrder \| null | Attached child order (bracket/OCO), null if none |

Each `USOrder` contains:

| Field | Type | Description |
| ----- | ---- | ----------- |
| order_id | string | Unique order ID |
| symbol | string | Trading symbol (e.g. `AAPL.US`) |
| side | string | `Buy` or `Sell` |
| status | string | Order status |
| qty | string | Order quantity |
| price | string | Order price |
| executed_qty | string | Executed quantity |
| executed_price | string | Executed price |
| created_at | int64 | Creation time (Unix seconds) |

Each `USOrderHistory` contains:

| Field | Type | Description |
| ----- | ---- | ----------- |
| status | string | Order status at this point |
| done_at | int64 | Timestamp (Unix seconds) |
