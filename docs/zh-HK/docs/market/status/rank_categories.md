---
slug: /market/rank-categories
title: 人氣排行分類
sidebar_position: 8
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取人氣排行榜的標籤分類配置，`second_tags[].key` 可傳入 `rank_list`。

<CliCommand>
longbridge rank
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="rank_categories" />


## Parameters

> **SDK 方法參數。**

此方法無參數。

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.rank_categories()
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

    resp = await ctx.rank_categories()
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
  const resp = await ctx.rankCategories()
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
            var resp = ctx.getRankCategories().get();
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
    let resp = ctx.rank_categories().await?;
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
            ctx.rank_categories([](auto resp) {
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
	resp, err := c.RankCategories(context.Background())
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
    "first_tags": [
      {
        "key": "ib_hot",
        "name": "熱度排行",
        "second_tags": [
          { "key": "ib_hot_all-us", "name": "美股總熱度", "market": "US" },
          { "key": "ib_hot_all-hk", "name": "港股總熱度", "market": "HK" },
          { "key": "ib_hot_all-cn", "name": "A 股總熱度", "market": "CN" }
        ]
      },
      {
        "key": "ib_change",
        "name": "漲跌排行",
        "second_tags": [
          { "key": "ib_change_top-us", "name": "美股漲幅榜", "market": "US" },
          { "key": "ib_change_top-hk", "name": "港股漲幅榜", "market": "HK" }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [RankCategoriesResponse](#RankCategoriesResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### RankCategoriesResponse

<a id="RankCategoriesResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| first_tags | object[] | false | 一級分類列表 |
| ∟ key | string | false | 一級分類鍵值 |
| ∟ name | string | false | 一級分類名稱 |
| ∟ second_tags | object[] | false | 二級分類列表 |
| ∟ ∟ key | string | false | 二級分類鍵值，可傳入 `rank_list` 的 `key` 參數 |
| ∟ ∟ name | string | false | 二級分類名稱 |
| ∟ ∟ market | string | false | 所屬市場：`US`、`HK`、`CN`、`SG` |
