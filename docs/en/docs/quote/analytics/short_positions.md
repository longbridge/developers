---
slug: /quote/pull/short-positions
title: Short Positions (US & HK)
sidebar_position: 25
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

# Short Positions (US & HK)

Get short interest data for US or HK securities. Market is auto-detected from the symbol suffix: `.HK` → HKEX short position data (daily); others → US FINRA short interest data (bi-monthly).

<CliCommand>
longbridge short-positions TSLA.US
longbridge short-positions 700.HK
longbridge short-positions AAPL.US --count 50
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="short_positions" />

## Parameters

> **SDK method parameters.**

| Name   | Type    | Required | Description                                                       |
| ------ | ------- | -------- | ----------------------------------------------------------------- |
| symbol | string  | YES      | Security symbol, e.g. `TSLA.US` or `700.HK`                      |
| count  | integer | NO       | Number of records to return (1–100, default: 20)                  |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

<CliCommand>
longbridge short-positions TSLA.US
longbridge short-positions 700.HK
longbridge short-positions AAPL.US --count 50
</CliCommand>

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

# US example
resp = ctx.short_positions("TSLA.US", 20)
print(resp)

# HK example
resp = ctx.short_positions("700.HK", 20)
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

    # US example
    resp = await ctx.short_positions("TSLA.US", 20)
    print(resp)

    # HK example
    resp = await ctx.short_positions("700.HK", 20)
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
  const resp = await ctx.shortPositions('TSLA.US', 20)
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
            var resp = ctx.getShortPositions("TSLA.US", 20).get();
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
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.short_positions("TSLA.US", 20).await?;
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
using namespace longbridge::quote;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            QuoteContext ctx = QuoteContext::create(config);
            ctx.short_positions("TSLA.US", 20, [](auto resp) {
                if (resp) std::cout << resp->size() << std::endl;
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
	qctx, err := quote.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer qctx.Close()
	resp, err := qctx.ShortPositions(context.Background(), "TSLA.US", 20)
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

<Tabs groupId="response-example">
  <TabItem value="us" label="US (.US symbols)" default>

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "timestamp": 1743379200,
        "current_shares_short": "65598603",
        "rate": "0.0175",
        "avg_daily_share_volume": "62121644",
        "days_to_cover": "1.06",
        "close": "371.750"
      }
    ]
  }
}
```

  </TabItem>
  <TabItem value="hk" label="HK (.HK symbols)">

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "timestamp": 1747353600,
      "amount": "2148600000",
      "balance": "6200000",
      "close": "418.20",
      "rate": "0.0182",
      "total_amount": "118120000000"
    }
  ]
}
```

  </TabItem>
</Tabs>

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | See schemas below |
| 400    | Bad request | None   |

## Schemas

### US Response (`.US` symbols)

| Name                    | Type     | Required | Description                                        |
| ----------------------- | -------- | -------- | -------------------------------------------------- |
| list                    | object[] | false    | Short position records                             |
| ∟ timestamp             | integer  | false    | Settlement date (Unix timestamp)                   |
| ∟ current_shares_short  | string   | false    | Number of short shares                             |
| ∟ rate                  | string   | false    | Short ratio                                        |
| ∟ avg_daily_share_volume | string  | false    | Average daily volume                               |
| ∟ days_to_cover         | string   | false    | Days-to-cover ratio                                |
| ∟ close                 | string   | false    | Closing price                                      |

### HK Response (`.HK` symbols)

| Name          | Type     | Required | Description                                      |
| ------------- | -------- | -------- | ------------------------------------------------ |
| data          | object[] | false    | Short position records                           |
| ∟ timestamp   | integer  | false    | Date (Unix timestamp)                            |
| ∟ amount      | string   | false    | Short selling amount (HKD)                       |
| ∟ balance     | string   | false    | Net short position balance                       |
| ∟ close       | string   | false    | Closing price                                    |
| ∟ rate        | string   | false    | Short ratio (short amount ÷ total turnover)      |
| ∟ total_amount | string  | false    | Total turnover                                   |
