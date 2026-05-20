---
slug: shareholder-detail
title: Shareholder Detail
sidebar_position: 28
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get holding history and trade details for a specific shareholder. The `object_id` comes from the `shareholder_top` response.

<CliCommand>
longbridge shareholder AAPL.US --object-id 19463
longbridge shareholder 700.HK --object-id 20181
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="shareholder_detail" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol, e.g. `AAPL.US` |
| object_id | integer | YES | Shareholder ID from `shareholder_top` `object_id` field |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.shareholder_detail("AAPL.US", 19463)
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

    resp = await ctx.shareholder_detail("AAPL.US", 19463)
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
  const resp = await ctx.shareholderDetail('AAPL.US', 19463)
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
            var resp = ctx.getShareholderDetail("AAPL.US", 19463L).get();
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
    let resp = ctx.shareholder_detail("AAPL.US", 19463).await?;
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
            ctx.shareholder_detail("AAPL.US", 19463, [](auto resp) {
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
	resp, err := c.ShareholderDetail(context.Background(), "AAPL.US", 19463)
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
    "owner_source": "Institution",
    "holding_summary": [
      {
        "period": "2025-12-31",
        "accum_buy": "8500000",
        "accum_sell": "2687264",
        "stock_price": "243.08"
      }
    ],
    "tradings": [
      {
        "period": "2025-12-31",
        "trading_details": [
          {
            "trading_date": "2025-12-18",
            "trading_shares": "5200000",
            "trading_price": "248.12",
            "trading_type": "Buy"
          }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [ShareholderDetailResponse](#ShareholderDetailResponse) |
| 400    | Bad request | None   |

## Schemas

### ShareholderDetailResponse

<a id="ShareholderDetailResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| owner_source | string | false | Shareholder type: `Company`, `Institution`, `Person`, `Insider` |
| holding_summary | object[] | false | Holding summary per reporting period |
| ∟ period | string | false | Reporting period in `YYYY-MM-DD` format |
| ∟ accum_buy | string | false | Cumulative shares bought this period |
| ∟ accum_sell | string | false | Cumulative shares sold this period |
| ∟ stock_price | string | false | Closing price at end of period |
| tradings | object[] | false | Trade details per reporting period |
| ∟ period | string | false | Reporting period in `YYYY-MM-DD` format |
| ∟ trading_details | object[] | false | Individual transactions within the period |
| ∟ ∟ trading_date | string | false | Trade date in `YYYY-MM-DD` format |
| ∟ ∟ trading_shares | string | false | Number of shares traded |
| ∟ ∟ trading_price | string | false | Trade price |
| ∟ ∟ trading_type | string | false | Trade direction: `Buy` or `Sell` |
