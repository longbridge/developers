---
slug: consensus
title: Financial Consensus
sidebar_position: 14
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get financial consensus estimates including revenue, EPS, and net income forecasts.

<CliCommand>
longbridge consensus TSLA.US
longbridge consensus AAPL.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="consensus" />


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

resp = ctx.consensus("TSLA.US")
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

    resp = await ctx.consensus("TSLA.US")
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
  const resp = await ctx.consensus('TSLA.US')
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
            var resp = ctx.getConsensus("TSLA.US").get();
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
    let resp = ctx.consensus("TSLA.US").await?;
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
            ctx.consensus("TSLA.US", [](auto resp) {
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
	resp, err := c.Consensus(context.Background(), "TSLA.US")
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
    "currency": "USD",
    "current_index": 3,
    "current_period": "qf",
    "opt_periods": [
      "qf",
      "af",
      "saf"
    ],
    "list": [
      {
        "fiscal_year": 2026,
        "fiscal_period": "Q2 FY2026",
        "period_text": "Q2 FY2026",
        "details": [
          {
            "key": "revenue",
            "name": "Revenue",
            "estimate": "95000000000",
            "actual": "",
            "comp": "",
            "comp_value": null,
            "comp_desc": "",
            "description": "",
            "is_released": false
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
| 200    | Success     | [FinancialConsensus](#FinancialConsensus) |
| 400    | Bad request | None   |

## Schemas

### FinancialConsensus

<a id="FinancialConsensus"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | false | Reporting currency |
| current_index | integer | false | Index of the current period in opt_periods |
| current_period | string | false | Current period code (e.g. `qf`) |
| list | object[] | true | List of consensus forecast periods, see [ConsensusListItem](#ConsensusListItem) |
| opt_periods | string[] | false | Available period options |

### ConsensusListItem

<a id="ConsensusListItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| fiscal_period | string | false | Fiscal period number within the fiscal year |
| fiscal_year | integer | false | Fiscal year |
| period_text | string | false | Display period label (e.g. Q1 2027) |
| details | object[] | false | List of financial indicator details, see [ConsensusDetail](#ConsensusDetail) |

### ConsensusDetail

<a id="ConsensusDetail"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| key | string | false | Indicator key (e.g. `eps`, `revenue`) |
| name | string | false | Indicator display name |
| description | string | false | Full description |
| actual | string | false | Actual reported value |
| estimate | string | false | Consensus estimate |
| comp | string | false | Comparison result (e.g. `beat`, `miss`) |
| comp_desc | string | false | Comparison description |
| comp_value | string | false | Comparison percentage value |
| is_released | boolean | false | Whether actual has been released |
