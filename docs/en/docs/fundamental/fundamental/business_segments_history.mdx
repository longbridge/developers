---
slug: business-segments-history
title: Business Segments History
sidebar_position: 22
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get historical business segment revenue trends across reporting periods.

<CliCommand>
longbridge business-segments AAPL.US --history
longbridge business-segments AAPL.US --history --report qf
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="business_segments_history" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol, e.g. `AAPL.US` |
| report | string | NO | Report type: `qf` (quarterly) / `saf` (semi-annual) / `af` (annual) |
| cate | string | NO | Segment category filter |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.business_segments_history("AAPL.US", report="qf")
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

    resp = await ctx.business_segments_history("AAPL.US", report="qf")
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
  const resp = await ctx.businessSegmentsHistory('AAPL.US', { report: 'qf' })
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
            var resp = ctx.getBusinessSegmentsHistory("AAPL.US", "qf", null).get();
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
    let resp = ctx.business_segments_history("AAPL.US", Some("qf"), None).await?;
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
            ctx.business_segments_history("AAPL.US", "qf", "", [](auto resp) {
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
	resp, err := c.BusinessSegmentsHistory(context.Background(), "AAPL.US", "qf", "")
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
    "historical": [
      {
        "date": "20260331",
        "total": "124300000000",
        "currency": "USD",
        "business": [
          {"name": "美洲", "percent": "40.80", "value": "31968000000"},
          {"name": "欧洲", "percent": "23.64", "value": "18521000000"},
          {"name": "大中华区", "percent": "20.72", "value": "16233000000"}
        ],
        "regionals": []
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [BusinessSegmentsHistoryResponse](#BusinessSegmentsHistoryResponse) |
| 400    | Bad request | None   |

## Schemas

### BusinessSegmentsHistoryResponse

<a id="BusinessSegmentsHistoryResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| historical | object[] | false | Historical period snapshots |
| ∟ date | string | false | Report period in YYYYMMDD format, e.g. `20260331` |
| ∟ total | string | false | Total revenue for the period |
| ∟ currency | string | false | Currency code |
| ∟ business | object[] | false | Business segment list |
| ∟ ∟ name | string | false | Segment name |
| ∟ ∟ percent | string | false | Revenue share percentage, e.g. `40.80` |
| ∟ ∟ value | string | false | Absolute revenue value |
| ∟ regionals | object[] | false | Regional segment list (typically empty) |
| ∟ ∟ name | string | false | Region name |
| ∟ ∟ percent | string | false | Revenue share percentage |
| ∟ ∟ value | string | false | Absolute revenue value |
