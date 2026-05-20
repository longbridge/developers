---
slug: /quote/pull/short-trades
title: 每日沽空成交量
sidebar_position: 27
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取個股每日沽空成交量數據，支持美股（FINRA）和港股（HKEX）。美股數據每兩週更新一次，港股數據每個交易日更新。

<CliCommand>
longbridge short-trades TSLA.US
longbridge short-trades 700.HK --count 30
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="short_trades" />


## Parameters

> **SDK 方法參數。**

| Name   | Type    | Required | Description                                               |
| ------ | ------- | -------- | --------------------------------------------------------- |
| symbol | string  | YES      | 證券代碼，支持美股（如 `TSLA.US`）和港股（如 `700.HK`）  |
| count  | integer | NO       | 返回記錄數（1–100，默認 20）                              |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.short_trades("TSLA.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.short_trades("TSLA.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.shortTrades('TSLA.US')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            var resp = ctx.getShortTrades("TSLA.US").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.short_trades("TSLA.US").await?;
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
using namespace longbridge::quote;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            QuoteContext ctx = QuoteContext::create(config);
            ctx.short_trades("TSLA.US", [](auto resp) {
                if (resp) std::cout << resp->size() << std::endl;
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
	"github.com/longbridge/openapi-go/quote"
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
	qctx, err := quote.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer qctx.Close()
	resp, err := qctx.ShortTrades(context.Background(), "TSLA.US")
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
    "list": [
      {
        "date": "2026-05-15",
        "short_vol": "8452310",
        "total_vol": "62345200",
        "short_ratio": "0.1356",
        "close": "342.15"
      },
      {
        "date": "2026-05-14",
        "short_vol": "7831040",
        "total_vol": "58921000",
        "short_ratio": "0.1329",
        "close": "338.72"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [short_trades_rsp](#short_trades_rsp) |
| 400    | 請求錯誤    | None   |

## Schemas

### short_trades_rsp

<a id="short_trades_rsp"></a>

| Name         | Type     | Required | Description                                   |
| ------------ | -------- | -------- | --------------------------------------------- |
| list         | object[] | true     | 每日沽空成交量記錄                            |
| ∟ date       | string   | true     | 交易日期，格式 `YYYY-MM-DD`                   |
| ∟ short_vol  | string   | true     | 當日沽空成交量（股數）                        |
| ∟ total_vol  | string   | true     | 當日總成交量（股數）                          |
| ∟ short_ratio | string  | true     | 沽空比率（沽空量 ÷ 總成交量）                 |
| ∟ close      | string   | true     | 當日收盤價                                    |
