---
slug: broker-holding-detail
title: Broker Holding Detail
sidebar_position: 7
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Not for Longbridge US Accounts
This method requires an AP data-center account (HK / SG). US data-center accounts will receive a region restriction error. AP accounts can call this method with any supported symbol, including US stocks.
:::

Get full broker holding detail list for an HK-listed security (all brokers and their positions).

<CliCommand>
longbridge broker-holding detail 700.HK
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="broker_holding_detail" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | HK security symbol, e.g. `700.HK` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.broker_holding_detail("700.HK")
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

    resp = await ctx.broker_holding_detail("700.HK")
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
  const resp = await ctx.brokerHoldingDetail('700.HK')
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
            var resp = ctx.getBrokerHoldingDetail("700.HK").get();
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
    let resp = ctx.broker_holding_detail("700.HK").await?;
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
	resp, err := c.BrokerHoldingDetail(context.Background(), "700.HK")
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
    "updated_at": "2026.05.13",
    "list": [
      {
        "parti_number": "B01224",
        "name": "HSBC Securities",
        "strong": false,
        "shares": {
          "value": "25100",
          "chg_1": "4000.0000",
          "chg_5": "6100.0000",
          "chg_20": "12600.0000",
          "chg_60": "8800.0000"
        },
        "ratio": {
          "value": "0.0025",
          "chg_1": "0.0004",
          "chg_5": "0.0006",
          "chg_20": "0.0012",
          "chg_60": "0.0009"
        }
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [BrokerHoldingDetailResponse](#BrokerHoldingDetailResponse) |
| 400    | Bad request | None   |

## Schemas

### BrokerHoldingDetailResponse

<a id="BrokerHoldingDetailResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| updated_at | string | false | Last update date |
| list | object[] | true | Broker holding detail records, see [BrokerHoldingItem](#BrokerHoldingItem) |

### BrokerHoldingItem

<a id="BrokerHoldingItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| parti_number | string | true | Broker participant number |
| name | string | false | Broker name |
| strong | boolean | false | Whether marked as strong holder |
| shares | object | false | Holding share counts |
| shares.value | string | false | Current shares held |
| shares.chg_1 | string | false | 1-day change |
| shares.chg_5 | string | false | 5-day change |
| shares.chg_20 | string | false | 20-day change |
| shares.chg_60 | string | false | 60-day change |
| ratio | object | false | Holding ratio |
| ratio.value | string | false | Current ratio |
| ratio.chg_1 | string | false | 1-day ratio change |
| ratio.chg_5 | string | false | 5-day ratio change |
| ratio.chg_20 | string | false | 20-day ratio change |
| ratio.chg_60 | string | false | 60-day ratio change |