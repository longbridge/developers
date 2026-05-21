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

获取个股每日沽空成交量数据，支持美股（FINRA）和港股（HKEX）。美股数据每两周更新一次，港股数据每个交易日更新。

<CliCommand>
longbridge short-trades TSLA.US
longbridge short-trades 700.HK --count 30
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="short_trades" />


## Parameters

> **SDK 方法参数。**

| Name   | Type    | Required | Description                                               |
| ------ | ------- | -------- | --------------------------------------------------------- |
| symbol | string  | YES      | 证券代码，支持美股（如 `TSLA.US`）和港股（如 `700.HK`）  |
| count  | integer | NO       | 返回记录数（1–100，默认 20）                              |

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

美股（`.US` 后缀）：

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "timestamp": "2026-05-15T04:00:00Z",
      "nus_amount": "5748485",
      "ny_amount": "0",
      "total_amount": "15778974",
      "rate": "0.3643",
      "close": "300.230"
    }
  ]
}
```

港股（`.HK` 后缀）：

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "timestamp": "2026-05-17T16:00:00Z",
      "amount": "2926000",
      "balance": "1318056100.00",
      "total_amount": "29497076",
      "rate": "0.0992",
      "close": "449.2"
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [ShortTradesResponse](#ShortTradesResponse) |
| 400    | 请求错误    | None   |

## Schemas

### US Response（`.US` 代码）

<a id="ShortTradesResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| data | object[] | 否 | 每日沽空成交量列表 |
| ∟ timestamp | string | 否 | 交易日期（RFC 3339 格式，例如 `2026-05-15T04:00:00Z`） |
| ∟ nus_amount | string | 否 | 纳斯达克沽空成交量（股） |
| ∟ ny_amount | string | 否 | 纽交所沽空成交量（股） |
| ∟ total_amount | string | 否 | 当日总成交量 |
| ∟ rate | string | 否 | 沽空比率（沽空量 ÷ 总成交量） |
| ∟ close | string | 否 | 当日收盘价 |

### HK Response（`.HK` 代码）

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| data | object[] | 否 | 每日沽空成交量列表 |
| ∟ timestamp | string | 否 | 交易日期（RFC 3339 格式，例如 `2026-05-15T04:00:00Z`） |
| ∟ amount | string | 否 | 当日沽空成交金额（港元） |
| ∟ balance | string | 否 | 沽空持仓余额 |
| ∟ total_amount | string | 否 | 当日总成交金额 |
| ∟ rate | string | 否 | 沽空比率（沽空金额 ÷ 总成交金额） |
| ∟ close | string | 否 | 当日收盘价 |
