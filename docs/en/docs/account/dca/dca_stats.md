---
slug: dca-stats
title: DCA Statistics
sidebar_position: 8
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get DCA statistics summary including total invested amount and profit/loss.

<CliCommand>
longbridge dca stats
</CliCommand>

<SDKLinks module="dca" klass="DCAContext" method="stats" />


## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | NO | Filter by symbol |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import DCAContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = DCAContext(config)

resp = ctx.stats()
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncDCAContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncDCAContext.create(config)

    resp = await ctx.stats()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, DCAContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = DCAContext.new(config)
  const resp = await ctx.stats()
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.dca.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             DCAContext ctx = DCAContext.create(config)) {
            var resp = ctx.stats(null).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, dca::DCAContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = DCAContext::new(config);
    let resp = ctx.stats(None).await?;
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
	"github.com/longbridge/openapi-go/dca"
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
	c, err := dca.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.Stats(context.Background(), nil)
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
    "active_count": "2",
    "finished_count": "1",
    "suspended_count": "0",
    "rest_days": "3",
    "total_amount": "5400",
    "total_profit": "120.50",
    "nearest_plans": [
      {
        "plan_id": "1239402174908207104",
        "symbol": "AAPL.US",
        "stock_name": "Apple Inc.",
        "market": "US",
        "status": "Active",
        "per_invest_amount": "100",
        "invest_frequency": "Monthly",
        "invest_day_of_month": "15",
        "next_trd_date": "1778853600",
        "cum_amount": "0",
        "cum_profit": "0"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [DcaStats](#DcaStats) |
| 400    | Bad request | None   |

## Schemas

### DcaStatsResponse

<a id="DcaStatsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| active_count | string | false | Number of active plans |
| finished_count | string | false | Number of finished plans |
| suspended_count | string | false | Number of suspended plans |
| rest_days | string | false | Days until next investment |
| total_amount | string | false | Total invested amount |
| total_profit | string | false | Total profit/loss |
| nearest_plans | object[] | false | Nearest upcoming DCA plans (same structure as DcaPlan) |

> `nearest_plans` items use the same `DcaPlan` structure as [List DCA Plans](./list-dca).