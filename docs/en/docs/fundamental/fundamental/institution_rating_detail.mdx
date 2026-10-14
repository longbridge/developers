---
slug: institution-rating-detail
title: Institution Rating Detail
sidebar_position: 11
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get historical analyst rating and target price details.

<CliCommand>
longbridge institution-rating detail TSLA.US
longbridge institution-rating detail AAPL.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="institution_rating_detail" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol, e.g. `TSLA.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.institution_rating_detail("TSLA.US")
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

    resp = await ctx.institution_rating_detail("TSLA.US")
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
  const resp = await ctx.institutionRatingDetail('TSLA.US')
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
            var resp = ctx.getInstitutionRatingDetail("TSLA.US").get();
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
    let resp = ctx.institution_rating_detail("TSLA.US").await?;
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
            ctx.institution_rating_detail("TSLA.US", [](auto resp) {
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
	resp, err := c.InstitutionRatingDetail(context.Background(), "TSLA.US")
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
    "ccy_symbol": "$",
    "evaluate": {
      "list": [
        {
          "date": "2021/05/14",
          "buy": 3,
          "hold": 11,
          "sell": 2,
          "strong_buy": 9,
          "under": 6
        }
      ]
    },
    "target": {
      "list": [
        {
          "broker_name": "Goldman Sachs",
          "date": "2026-04-30",
          "rating": "Buy",
          "target_price": "250.00"
        }
      ]
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [InstitutionRatingDetail](#InstitutionRatingDetail) |
| 400    | Bad request | None   |

## Schemas

### InstitutionRatingDetail

<a id="InstitutionRatingDetail"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| ccy_symbol | string | false | Currency symbol |
| evaluate | object | false | Rating distribution history |
| evaluate.list | object[] | false | List of historical rating snapshots |
| target | object | false | Target price history |
| target.list | object[] | false | List of historical target price data |
| target.data_percent | string | false | Data coverage percentage |
| target.prediction_accuracy | string | false | Prediction accuracy percentage |
| target.updated_at | string | false | Last update date string |

### EvaluateHistoryItem

<a id="EvaluateHistoryItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| date | string | false | Date |
| buy | integer | false | Buy count |
| strong_buy | integer | false | Strong buy count |
| hold | integer | false | Hold count |
| sell | integer | false | Sell count |
| no_opinion | integer | false | No opinion count |
| under | integer | false | Underperform count |

### TargetHistoryItem

<a id="TargetHistoryItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| date | string | false | Date |
| avg_target | string | false | Average target price |
| max_target | string | false | Highest target price |
| min_target | string | false | Lowest target price |
| price | string | false | Closing price on that date |
| meet | boolean | false | Whether price met target |
| timestamp | string | false | Unix timestamp |
