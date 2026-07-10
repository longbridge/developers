---
slug: us_crypto_overview
title: US Crypto Overview
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

Get overview data for a US crypto trading pair — all-time highs/lows, asset info, and currency details.

<CliCommand>
# US crypto overview
longbridge static DOGEUSD.BKKT
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="us_crypto_overview" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Crypto symbol, e.g. `DOGEUSD.BKKT` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
resp = ctx.us_crypto_overview("DOGEUSD.BKKT")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)
    resp = await ctx.us_crypto_overview("DOGEUSD.BKKT")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.usCryptoOverview("DOGEUSD.BKKT")
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            var resp = ctx.getUsCryptoOverview("DOGEUSD.BKKT").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = QuoteContext::new(config);
    let resp = ctx.us_crypto_overview("DOGEUSD.BKKT").await?;
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
	"github.com/longbridge/openapi-go/quote"
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
	c, err := quote.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.CryptoOverview(context.Background(), "DOGEUSD.BKKT")
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
  "symbol": "DOGEUSD.BKKT",
  "name": "Dogecoin",
  "ticker": "DOGE",
  "base_asset": "DOGE",
  "currency": "USD",
  "all_time_high": "0.7376",
  "all_time_high_date": "2021-05-08",
  "all_time_low": "0.0000869",
  "all_time_low_date": "2015-05-06",
  "ipo_date": "2013-12-06",
  "issue_price": "0.00026",
  "shares": "147000000000",
  "official_web_address": "https://dogecoin.com",
  "wiki_url": "https://en.wikipedia.org/wiki/Dogecoin",
  "profile": "{...}"
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [CryptoOverview](#CryptoOverview) |
| 400    | Bad request | None   |

## Schemas

### CryptoOverview

<a id="CryptoOverview"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | true | Trading-pair symbol (e.g. `DOGEUSD.BKKT`) |
| name | string | true | Asset name |
| ticker | string | true | Short ticker |
| base_asset | string | true | Base asset code (e.g. `DOGE`) |
| currency | string | true | Quote currency (e.g. `USD`) |
| all_time_high | string | true | All-time high price |
| all_time_high_date | string | true | Date of all-time high |
| all_time_low | string | true | All-time low price |
| all_time_low_date | string | true | Date of all-time low |
| ipo_date | string | false | Initial listing date |
| issue_price | string | false | Initial issue price |
| shares | string | false | Total circulating supply |
| official_web_address | string | false | Official website URL |
| logo | string | false | Asset logo URL |
| wiki_url | string | false | Wikipedia URL |
| profile | string | false | Asset profile description (JSON string) |
