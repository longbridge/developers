---
slug: index-components
title: 指數成分股
sidebar_position: 6
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取指數或 ETF 的成分股列表，支持排序並顯示漲跌統計。

<CliCommand>
longbridge constituent HSI.HK
longbridge constituent SPY.US
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="index_components" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 指數或 ETF 代碼，例如 `HSI.HK`、`SPY.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.index_components("AAPL.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncMarketContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncMarketContext.create(config)

    resp = await ctx.index_components("AAPL.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, MarketContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = MarketContext.new(config)
  const resp = await ctx.index_components('AAPL.US')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.market.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             MarketContext ctx = MarketContext.create(config)) {
            var resp = ctx.getIndexComponents("AAPL.US").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, market::MarketContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = MarketContext::new(config);
    let resp = ctx.index_components("AAPL.US").await?;
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
using namespace longbridge::market;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            MarketContext ctx = MarketContext::create(config);
            ctx.index_components("AAPL.US", [](auto resp) {
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
	"github.com/longbridge/openapi-go/market"
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
	c, err := market.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.IndexComponents(context.Background(), "AAPL.US")
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
    "fall_num": 10,
    "flat_num": 3,
    "rise_num": 7,
    "stocks": [
      {
        "symbol": "9988.HK",
        "name": "BABA-W",
        "market": "HK",
        "last_done": "140.90",
        "prev_close": "132.80",
        "chg": "0.0610",
        "amount": "93828577",
        "inflow": "18483450",
        "balance": "13320299492",
        "circulating_shares": "19192403958",
        "total_shares": "19192403958",
        "trade_status": 105,
        "intro": "China's largest e-commerce platform",
        "delay": false,
        "tags": [
          "Top gainers"
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功     | [IndexConstituentsResponse](#IndexConstituentsResponse) |
| 400    | 請求錯誤 | None   |

## Schemas

### IndexConstituentsResponse

<a id="IndexConstituentsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| rise_num | integer | 否 | 上漲數量 |
| fall_num | integer | 否 | 下跌數量 |
| flat_num | integer | 否 | 平盤數量 |
| stocks | object[] | 是 | 成分股列表， |
| ∟ symbol | string | 是 | 證券代碼 |
| ∟ name | string | 是 | 證券名稱 |
| ∟ market | string | 否 | 市場 |
| ∟ last_done | string | 否 | 最新價 |
| ∟ prev_close | string | 否 | 前收盤價 |
| ∟ chg | string | 否 | 漲跌幅 |
| ∟ amount | string | 否 | 成交額 |
| ∟ inflow | string | 否 | 資金淨流入 |
| ∟ circulating_shares | string | 否 | 流通股數 |
| ∟ total_shares | string | 否 | 總股數 |
| ∟ balance | string | 否 | 市值 |
| ∟ trade_status | integer | 否 | 交易狀態碼 |
| ∟ intro | string | 否 | 簡介 |
| ∟ delay | boolean | 否 | 是否為延遲數據 |
| ∟ tags | string[] | 否 | 標籤 |
