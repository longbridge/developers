---
slug: profit-analysis-flows
title: Profit Analysis Flows
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Query account cash flow history including deposits, withdrawals, dividends, and settlements.

<CliCommand>
longbridge cash-flow
longbridge cash-flow --format json
</CliCommand>

<SDKLinks module="portfolio" klass="PortfolioContext" method="profit_analysis_flows" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol |
| page | integer | NO | Page number (default: 1) |
| size | integer | NO | Page size (default: 20) |
| derivative | boolean | NO | Include derivative positions |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import PortfolioContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = PortfolioContext(config)

resp = ctx.profit_analysis_flows()
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncPortfolioContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncPortfolioContext.create(config)

    resp = await ctx.profit_analysis_flows()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, PortfolioContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = PortfolioContext.new(config)
  const resp = await ctx.profit_analysis_flows()
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.portfolio.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             PortfolioContext ctx = PortfolioContext.create(config)) {
            var resp = ctx.getProfitAnalysisFlows().get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, portfolio::PortfolioContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = PortfolioContext::new(config);
    let resp = ctx.profit_analysis_flows().await?;
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
using namespace longbridge::portfolio;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            PortfolioContext ctx = PortfolioContext::create(config);
            ctx.profit_analysis_flows([](auto resp) {
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
	"github.com/longbridge/openapi-go/portfolio"
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
	c, err := portfolio.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.ProfitAnalysisFlows(context.Background())
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
    "has_more": false,
    "flows_list": [
      {
        "code": "AAPL",
        "symbol": "AAPL.US",
        "direction": "In",
        "executed_date": "2025-11-22",
        "executed_timestamp": "1763769600",
        "executed_quantity": "10",
        "executed_price": "180.50",
        "executed_cost": "1805.00",
        "describe": "Buy AAPL.US"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [ProfitAnalysisFlowsResponse](#ProfitAnalysisFlowsResponse) |
| 400    | Bad request | None   |

## Schemas

### ProfitAnalysisFlowsResponse

<a id="ProfitAnalysisFlowsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| flows_list | object[] | true | Paginated list of flow items |
| ∟ executed_date | string | true | Execution date (e.g. `2024-01-15`) |
| ∟ executed_timestamp | string | false | Execution timestamp |
| ∟ code | string | false | Security code |
| ∟ direction | string | false | Direction: `In` or `Out` |
| ∟ executed_quantity | string | false | Executed quantity |
| ∟ executed_price | string | false | Executed price |
| ∟ executed_cost | string | false | Executed cost |
| ∟ describe | string | false | Human-readable description |
| has_more | boolean | false | Whether there are more pages |
