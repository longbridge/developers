---
slug: valuation-history
title: 估值歷史
sidebar_position: 15
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取歷史估值指標時間序列（市盈率、市淨率、市銷率、股息率）。

<SDKLinks module="fundamental" klass="FundamentalContext" method="valuation_history" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 證券代碼，例如 `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.valuation_history("AAPL.US")
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

    resp = await ctx.valuation_history("AAPL.US")
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
  const resp = await ctx.valuationHistory('AAPL.US')
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
            var resp = ctx.getValuationHistory("AAPL.US").get();
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
    let resp = ctx.valuation_history("AAPL.US").await?;
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
            ctx.valuation_history("AAPL.US", [](auto resp) {
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
	resp, err := c.ValuationHistory(context.Background(), "AAPL.US")
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
    "history": {
      "metrics": {
        "pe": {
          "desc": "P/E Ratio",
          "high": "35.2",
          "low": "18.1",
          "median": "26.5",
          "list": [
            {
              "timestamp": "1622520000",
              "value": "28.5"
            }
          ]
        },
        "pb": null,
        "ps": null
      }
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [ValuationHistoryResponse](#ValuationHistoryResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### ValuationHistoryResponse

<a id="ValuationHistoryResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 證券代碼 |
| list | object[] | 是 | 歷史估值數據點列表，見 [ValuationMetric](#ValuationMetric) |
| list[].date | string | 否 | 日期（YYYY-MM-DD） |
| list[].pe | double | 否 | 市盈率（PE） |
| list[].pb | double | 否 | 市淨率（PB） |
| list[].ps | double | 否 | 市銷率（PS） |
| list[].dividend_yield | double | 否 | 股息率（%） |
