---
slug: industry-rank
title: Industry Ranking
sidebar_position: 24
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the industry ranking list by market and indicator. The returned Counter ID can be passed directly to `industry_peers` to explore the sub-sector hierarchy.

<CliCommand>
longbridge industry-rank --market US
longbridge industry-rank --market HK --indicator market-cap
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="industry_rank" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| market | string | YES | Market code: `US` / `HK` / `CN` / `SG` |
| indicator | string | YES | Ranking indicator: `leading-gainer` / `today-trend` / `popularity` / `market-cap` / `revenue` / `revenue-growth` / `net-profit` / `net-profit-growth` |
| sort_type | string | YES | Sort mode: `single` / `multi` |
| limit | uint32 | YES | Number of results to return, default 20 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.industry_rank("US", "leading-gainer", "single", 20)
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

    resp = await ctx.industry_rank("US", "leading-gainer", "single", 20)
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
  const resp = await ctx.industryRank('US', 'leading-gainer', 'single', 20)
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
            var resp = ctx.getIndustryRank("US", "leading-gainer", "single", 20).get();
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
    let resp = ctx.industry_rank("US", "leading-gainer", "single", 20).await?;
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
            ctx.industry_rank("US", "leading-gainer", "single", 20, [](auto resp) {
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
	resp, err := c.IndustryRank(context.Background(), "US", "leading-gainer", "single", 20)
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
    "items": [
      {
        "lists": [
          {
            "name": "Technology",
            "counter_id": "BK/US/IN00258",
            "chg": "0.0231",
            "leading_name": "NVIDIA",
            "leading_ticker": "NVDA.US",
            "leading_chg": "0.0512",
            "value_name": "",
            "value_data": ""
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
| 200    | Success     | [IndustryRankResponse](#IndustryRankResponse) |
| 400    | Bad request | None   |

## Schemas

### IndustryRankResponse

<a id="IndustryRankResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| items | object[] | false | Ranked group list |
| ∟ lists | object[] | false | Industry item list |
| ∟ ∟ name | string | false | Industry name |
| ∟ ∟ counter_id | string | false | Industry counter ID (`BK/MARKET/ID` format), usable in `industry_peers` |
| ∟ ∟ chg | string | false | Daily change (decimal) |
| ∟ ∟ leading_name | string | false | Leading stock name |
| ∟ ∟ leading_ticker | string | false | Leading stock ticker |
| ∟ ∟ leading_chg | string | false | Leading stock daily change (decimal) |
| ∟ ∟ value_name | string | false | Indicator label (may be empty depending on indicator type) |
| ∟ ∟ value_data | string | false | Indicator value (may be empty) |
