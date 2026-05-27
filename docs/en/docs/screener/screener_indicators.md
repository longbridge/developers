---
slug: screener-indicators
title: Screener Indicators
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get all indicator definitions supported by the stock screener, including keys, names, units, and available ranges. Use these to build custom filter conditions.

Endpoint: `GET /v1/quote/ai/screener/indicators`

> **SDK response:** The `data` field contains a grouped structure `{"groups": [{...}]}`. The CLI `screener indicators --format json` flattens this to a flat array for convenience.

<CliCommand>
longbridge screener indicators
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_indicators" />


## Parameters

> **SDK method parameters.**

This method takes no parameters.

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ScreenerContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ScreenerContext(config)

resp = ctx.screener_indicators()
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

    resp = await ctx.screener_indicators()
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
  const resp = await ctx.screenerIndicators()
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
            var resp = ctx.getScreenerIndicators().get();
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
    let resp = ctx.screener_indicators().await?;
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
            ctx.screener_indicators([](auto resp) {
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
	resp, err := c.ScreenerIndicators(context.Background())
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
        "group_name": "公司规模与财务",
        "indicators": [
          { "id": "1", "key": "marketcap", "name": "市值", "unit": "亿", "min": null, "max": null }
        ]
      }
    ]
  }
}
```

> The `filter_` prefix is stripped from all `key` values. The `id` field is a string.

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [ScreenerIndicatorsResponse](#ScreenerIndicatorsResponse) |
| 400    | Bad request | None   |

## Schemas

### ScreenerIndicatorsResponse

<a id="ScreenerIndicatorsResponse"></a>

The SDK response `data` is a grouped structure. The CLI `--format json` output flattens it to a flat array. The `filter_` prefix is stripped from all `key` values.

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| groups | object[] | false | Indicator groups |
| ∟ group_name | string | false | Group name |
| ∟ indicators | object[] | false | Indicators in this group |
| ∟ ∟ id | string | false | Indicator ID (string) |
| ∟ ∟ key | string | false | Indicator key for building filter conditions (no `filter_` prefix) |
| ∟ ∟ name | string | false | Indicator display name |
| ∟ ∟ unit | string | false | Unit (e.g. `%`, `亿`) |
| ∟ ∟ min | string | false | Global lower bound; null means no lower bound |
| ∟ ∟ max | string | false | Global upper bound; null means no upper bound |
