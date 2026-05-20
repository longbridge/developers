---
slug: shareholder-top
title: Top Shareholders
sidebar_position: 27
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the top 20 major shareholders (institutional, individual, and insider) for a listed company, with support for multi-period comparison. `object_id` can be passed to `shareholder_detail` to retrieve full holding history.

<CliCommand>
longbridge shareholder AAPL.US --top
longbridge shareholder 700.HK --top
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="shareholder_top" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol, e.g. `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.shareholder_top("AAPL.US")
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

    resp = await ctx.shareholder_top("AAPL.US")
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
  const resp = await ctx.shareholderTop('AAPL.US')
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
            var resp = ctx.getShareholderTop("AAPL.US").get();
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
    let resp = ctx.shareholder_top("AAPL.US").await?;
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
            ctx.shareholder_top("AAPL.US", [](auto resp) {
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
	resp, err := c.ShareholderTop(context.Background(), "AAPL.US")
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
    "info": [
      {
        "period": "Latest",
        "share_holders": [
          {
            "object_id": "148057",
            "name": "The Vanguard Group, Inc.",
            "title": "",
            "shares_held": "1426283914.00",
            "percent_shares_held": "9.71%",
            "percent_shares_changed": "0.01%",
            "shares_changed": "0.00",
            "period": "Latest",
            "filing_date": "2025/12/31"
          },
          {
            "object_id": "452583",
            "name": "BlackRock, Inc.",
            "title": "",
            "shares_held": "1138572603.00",
            "percent_shares_held": "7.75%",
            "percent_shares_changed": "-0.06%",
            "shares_changed": "-10565359.00",
            "period": "Latest",
            "filing_date": "2026/03/31"
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
| 200    | Success     | [ShareholderTopResponse](#ShareholderTopResponse) |
| 400    | Bad request | None   |

## Schemas

### ShareholderTopResponse

<a id="ShareholderTopResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| info | object[] | false | Shareholder data per reporting period |
| ∟ period | string | false | Reporting period label (e.g. `Latest`) |
| ∟ share_holders | object[] | false | List of shareholders (up to 20) |
| ∟ ∟ object_id | string | false | Unique shareholder ID; pass to `shareholder_detail` |
| ∟ ∟ name | string | false | Shareholder name |
| ∟ ∟ title | string | false | Shareholder type (Institution / Individual / Insider) |
| ∟ ∟ shares_held | string | false | Number of shares held |
| ∟ ∟ percent_shares_held | string | false | Ownership percentage, including `%` sign (e.g. `9.71%`) |
| ∟ ∟ percent_shares_changed | string | false | Change in ownership percentage, including `%` sign |
| ∟ ∟ shares_changed | string | false | Net share count change (positive = bought, negative = sold) |
| ∟ ∟ period | string | false | Period label for this entry |
| ∟ ∟ filing_date | string | false | Filing date |
