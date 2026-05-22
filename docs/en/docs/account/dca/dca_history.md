---
slug: dca-history
title: DCA Trade History
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the execution history for a specific DCA plan including trade dates, amounts, and prices.

<CliCommand>
longbridge dca history 1225781523156889600
</CliCommand>

<SDKLinks module="dca" klass="DCAContext" method="history" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | string | YES | Plan ID (path parameter) |
| page | integer | NO | Page number (1-based, default: 1) |
| size | integer | NO | Records per page (default: 20) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import DCAContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = DCAContext(config)

resp = ctx.dca_history("1225781523156889600")
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

    resp = await ctx.dca_history("1225781523156889600")
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
  const resp = await ctx.dca_history()
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
            var resp = ctx.getDcaHistory().get();
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
    let resp = ctx.dca_history().await?;
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
using namespace longbridge::dca;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            DCAContext ctx = DCAContext::create(config);
            ctx.dca_history([](auto resp) {
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
	resp, err := c.DcaHistory(context.Background())
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
    "has_more": false,
    "records": [
      {
        "symbol": "AAPL.US",
        "order_id": "123456",
        "status": "Filled",
        "action": "Buy",
        "order_type": "Market",
        "executed_qty": "1",
        "executed_price": "180.50",
        "executed_amount": "180.50",
        "created_at": "1763769600",
        "rejected_reason": ""
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [DcaHistoryResponse](#DcaHistoryResponse) |
| 400    | Bad request | None   |

## Schemas

### DcaHistoryResponse

<a id="DcaHistoryResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| records | object[] | true | List of execution records |
| ∟ symbol | string | true | Security symbol |
| ∟ order_id | string | false | Associated order ID |
| ∟ status | string | false | Execution status |
| ∟ action | string | false | Action type (e.g. `buy`) |
| ∟ order_type | string | false | Order type (e.g. `market`) |
| ∟ executed_qty | string | false | Executed quantity |
| ∟ executed_price | string | false | Executed price |
| ∟ executed_amount | string | false | Executed cost amount |
| ∟ rejected_reason | string | false | Rejection reason if failed |
| ∟ created_at | string | false | Creation Unix timestamp |
| ∟ created_at | string | false | Execution time |
| ∟ rejected_reason | string | false | Rejection reason (if any) |
| has_more | boolean | false | Whether more records exist |
