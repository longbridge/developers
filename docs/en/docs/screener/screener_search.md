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

Endpoint: `POST /v1/quote/ai/screener/search`

> **Note on JSON output format:** The response uses a flat `items[]` array (not `stocks[]`), all numeric fields are JSON numbers (not strings), and indicator keys do not carry the `filter_` prefix.

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
| strategy_id | integer | NO | Strategy ID; use alone or combined with custom conditions |
| conditions | ScreenerCondition[] | NO | Custom filter conditions (Mode B, when strategy_id is omitted) |
| show | string[] | NO | Extra indicator keys to include in the response beyond the 7 default columns |
| page | integer | NO | 0-based page number, default 0 |
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
            var resp = ctx.screenerSearch("US", 19L, null, List.of(), 0, 20).get();
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
    // Mode A: run a strategy
    let resp = ctx.screener_search("", Some(19), vec![], vec![], 0, 20).await?;
    println!("{:?}", resp);
    // Mode B: custom conditions
    use longbridge::screener::ScreenerCondition;
    let conditions = vec![ScreenerCondition { key: "pettm".into(), min: "10".into(), max: "50".into(), tech_values: serde_json::json!({}) }];
    let resp = ctx.screener_search("HK", None, conditions, vec![], 0, 20).await?;
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
	// Mode A: run a strategy
	stratID := int64(19)
	resp, err := c.ScreenerSearch(context.Background(), "", &stratID, nil, nil, 0, 20)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)

	// Mode B: custom conditions
	conditions := []screener.ScreenerCondition{
		{Key: "pettm", Min: "10", Max: "50"},
		{Key: "roe", Min: "5"},
	}
	resp2, err := c.ScreenerSearch(context.Background(), "HK", nil, conditions, []string{"roe"}, 0, 20)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp2)
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
    "total": 88,
    "page": 0,
    "market": "US",
    "items": [
      {
        "symbol": "AAPL.US",
        "name": "Apple Inc.",
        "prevchg": 0.62,
        "marketcap": 3241500000000,
        "pettm": 32.15,
        "pbmrq": 50.21,
        "salesgrowthyoy": 8.04
      },
      {
        "symbol": "MSFT.US",
        "name": "Microsoft",
        "prevchg": 1.05,
        "marketcap": 3085000000000,
        "pettm": 35.42,
        "pbmrq": 12.87,
        "salesgrowthyoy": 12.61
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
| page | integer | false | Current page number (zero-based) |
| market | string | false | Market of the result set |
| items | object[] | false | Filtered stock list |
| ∟ symbol | string | false | Security symbol |
| ∟ name | string | false | Security name |
| ∟ prevchg | number | false | Previous day price change ratio (e.g. `1.24` = 1.24%) |
| ∟ marketcap | number | false | Market capitalisation (numeric) |
| ∟ pettm | number | false | P/E ratio (TTM, numeric) |
| ∟ pbmrq | number | false | P/B ratio (MRQ, numeric) |
| ∟ salesgrowthyoy | number | false | Revenue growth YoY (%) |
| ∟ industry | string | false | Industry classification |

> All numeric indicator fields are JSON numbers. Additional indicator fields depend on the strategy or filter used. Indicator keys do not carry the `filter_` prefix.
