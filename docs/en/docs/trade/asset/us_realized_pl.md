---
slug: us_realized_pl
title: US Realized P&L
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

Get realized profit and loss for a US account, broken down by asset category.

<CliCommand>
# US realized P&L
longbridge profit-analysis realized
# Filter by stock
longbridge profit-analysis realized --category stock
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_realized_pl" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | YES | Settlement currency, e.g. `USD` |
| category | string | NO | Asset category: `ALL` \| `STOCK` \| `OPTION` \| `CRYPTO` (default: `ALL`) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_realized_pl("USD", category="STOCK")
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
    resp = await ctx.us_realized_pl("USD", category="STOCK")
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
  const resp = await ctx.usRealizedPl("USD", "STOCK")
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
            var resp = ctx.getUsRealizedPl("USD", "STOCK").get();
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
    let opts = longbridge::trade::GetUSRealizedPLOptions {
        currency: "USD".to_string(),
        category: "STOCK".to_string(),
    };
    let resp = ctx.us_realized_pl(opts).await?;
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
	cat := "STOCK"
	resp, err := c.USRealizedPL(context.Background(), &trade.GetUSRealizedPL{Currency: "USD", Category: &cat})
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
  "realized_pl_list": [
    {
      "category": 1,
      "currency": "USD",
      "metrics": [
        {"amount": "1250.50", "period": 1, "rate": "0.0312"}
      ]
    },
    {
      "category": 3,
      "currency": "USD",
      "metrics": [
        {"amount": "-85.20", "period": 1, "rate": "-0.0215"}
      ]
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [USRealizedPL](#USRealizedPL) |
| 400    | Bad request | None   |

## Schemas

### USRealizedPL

<a id="USRealizedPL"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| realized_pl_list | USRealizedPLEntry[] | true | P&L breakdown by asset category |

### USRealizedPLEntry

<a id="USRealizedPLEntry"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| category | int | true | Asset category: `1`=stock, `2`=option, `3`=crypto |
| currency | string | true | Currency code (e.g. `USD`) |
| metrics | USRealizedPLMetric[] | true | P&L metrics by time period |

### USRealizedPLMetric

<a id="USRealizedPLMetric"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| amount | string | true | Realized P&L amount |
| period | int | true | Time period |
| rate | string | true | Return rate (%) |
