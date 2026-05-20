---
slug: screener-search
title: Screener Search
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Filter stocks by strategy ID or custom indicator conditions, with pagination support.

<CliCommand>
longbridge screener search --strategy-id 42
longbridge screener search --market HK --filter filter_marketcap:100:1000
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_search" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| market | string | YES | Market: `US`, `HK`, `CN`, `SG` |
| strategy_id | integer | NO | Strategy ID; use alone or combined with custom filters |
| page | integer | NO | Page number starting from 1, default 1 |
| size | integer | NO | Page size, default 20 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ScreenerContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ScreenerContext(config)

# Filter by strategy ID
resp = ctx.screener_search("US", strategy_id=42)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncScreenerContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncScreenerContext.create(config)

    resp = await ctx.screener_search("US", strategy_id=42, page=1, size=20)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, ScreenerContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = ScreenerContext.new(config)
  const resp = await ctx.screenerSearch('US', { strategyId: 42, page: 1, size: 20 })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.screener.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             ScreenerContext ctx = ScreenerContext.create(config)) {
            var resp = ctx.screenerSearch("US", 42L, 1, 20).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, screener::ScreenerContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ScreenerContext::new(config);
    let resp = ctx.screener_search("US", Some(42), 1, 20).await?;
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
using namespace longbridge::screener;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            ScreenerContext ctx = ScreenerContext::create(config);
            ctx.screener_search("US", 42, 1, 20, [](auto resp) {
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
	"github.com/longbridge/openapi-go/screener"
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
	c, err := screener.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.ScreenerSearch(context.Background(), "US", 42, 1, 20)
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
    "total": 87,
    "page": 1,
    "size": 20,
    "stocks": [
      {
        "symbol": "AAPL.US",
        "name": "Apple Inc.",
        "last_done": "213.49",
        "chg": "+0.62%",
        "market_cap": "3241500000000",
        "pe": "32.15",
        "pb": "50.21",
        "ps": "8.04",
        "roe": "147.25"
      },
      {
        "symbol": "MSFT.US",
        "name": "Microsoft",
        "last_done": "415.32",
        "chg": "+1.05%",
        "market_cap": "3085000000000",
        "pe": "35.42",
        "pb": "12.87",
        "ps": "12.61",
        "roe": "36.52"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [ScreenerSearchResponse](#ScreenerSearchResponse) |
| 400    | Bad request | None   |

## Schemas

### ScreenerSearchResponse

<a id="ScreenerSearchResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| total | integer | false | Total number of matching stocks |
| page | integer | false | Current page number |
| size | integer | false | Number of results on the current page |
| stocks | object[] | false | Filtered stock list |
| ∟ symbol | string | false | Security symbol |
| ∟ name | string | false | Security name |
| ∟ last_done | string | false | Latest trade price |
| ∟ chg | string | false | Price change |
| ∟ market_cap | string | false | Market capitalisation |
| ∟ pe | string | false | P/E ratio |
| ∟ pb | string | false | P/B ratio |
| ∟ ps | string | false | P/S ratio |
| ∟ roe | string | false | Return on equity (%) |
