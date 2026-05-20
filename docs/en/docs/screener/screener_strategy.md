---
slug: screener-strategy
title: Screener Strategy Detail
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the full configuration of a single stock screener strategy by strategy ID, including all indicator groups and the filter range for each indicator.

<CliCommand>
longbridge screener strategies --id 42
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_strategy" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | integer | YES | Strategy ID from `screener_recommend_strategies` or `screener_user_strategies` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ScreenerContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ScreenerContext(config)

resp = ctx.screener_strategy(42)
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

    resp = await ctx.screener_strategy(42)
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
  const resp = await ctx.screenerStrategy(42)
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
            var resp = ctx.getScreenerStrategy(42L).get();
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
    let resp = ctx.screener_strategy(42).await?;
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
            ctx.screener_strategy(42, [](auto resp) {
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
	resp, err := c.ScreenerStrategy(context.Background(), 42)
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
    "groups": [
      {
        "group_name": "Range",
        "group_type": "range",
        "indicators": [
          {
            "id": -1,
            "key": "filter_market",
            "name": "HK",
            "unit": "",
            "min": "",
            "max": "",
            "value": "HK",
            "tech_data": []
          }
        ]
      },
      {
        "group_name": "Quote Indicators",
        "group_type": "Quotes",
        "indicators": [
          {
            "id": 1,
            "key": "filter_marketcap",
            "name": "Market Cap",
            "unit": "bn",
            "min": "100",
            "max": "",
            "value": "",
            "tech_data": []
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
| 200    | Success     | [ScreenerStrategyDetail](#ScreenerStrategyDetail) |
| 400    | Bad request | None   |

## Schemas

### ScreenerStrategyDetail

<a id="ScreenerStrategyDetail"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| groups | object[] | false | Indicator group list |
| ∟ group_name | string | false | Group name |
| ∟ group_type | string | false | Group type (e.g. `range`, `Quotes`, `DividendIndex`) |
| ∟ indicators | object[] | false | Indicator conditions in this group |
| ∟ ∟ id | integer | false | Indicator ID |
| ∟ ∟ key | string | false | Indicator key |
| ∟ ∟ name | string | false | Indicator display name |
| ∟ ∟ unit | string | false | Indicator unit (e.g. `%`, `bn`) |
| ∟ ∟ min | string | false | Minimum value; empty string means no lower bound |
| ∟ ∟ max | string | false | Maximum value; empty string means no upper bound |
| ∟ ∟ value | string | false | Fixed value (used for non-range indicators such as market selector) |
| ∟ ∟ tech_data | array | false | Technical indicator data array |
