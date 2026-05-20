---
slug: screener-search
title: 選股篩選
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

按策略 ID 或自定義指標條件篩選股票，支持分頁。

<CliCommand>
longbridge screener search --strategy-id 42
longbridge screener search --market HK --filter filter_marketcap:100:1000
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_search" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| market | string | 是 | 市場：`US`、`HK`、`CN`、`SG` |
| strategy_id | integer | 否 | 策略 ID；與自定義 filter 二選一，或同時使用 |
| page | integer | 否 | 頁碼，從 1 開始，默認 1 |
| size | integer | 否 | 每頁條數，默認 20 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ScreenerContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ScreenerContext(config)

# 按策略 ID 篩選
resp = ctx.screener_search("US", strategy_id=42)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncScreenerContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncScreenerContext.create(config)

    resp = await ctx.screener_search("US", strategy_id=42, page=1, size=20)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, ScreenerContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = ScreenerContext.new(config)
  const resp = await ctx.screenerSearch('US', { strategyId: 42, page: 1, size: 20 })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.screener.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             ScreenerContext ctx = ScreenerContext.create(config)) {
            var resp = ctx.screenerSearch("US", 42L, 1, 20).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, screener::ScreenerContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ScreenerContext::new(config);
    let resp = ctx.screener_search("US", Some(42), 1, 20).await?;
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
using namespace longbridge::screener;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            ScreenerContext ctx = ScreenerContext::create(config);
            ctx.screener_search("US", 42, 1, 20, [](auto resp) {
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
	"github.com/longbridge/openapi-go/screener"
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
	c, err := screener.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.ScreenerSearch(context.Background(), "US", 42, 1, 20)
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
    "total": 87,
    "page": 1,
    "size": 20,
    "stocks": [
      {
        "symbol": "AAPL.US",
        "name": "蘋果公司",
        "last_done": "213.49",
        "chg": "+0.62%",
        "market_cap": "3241500000000",
        "pe": "32.15",
        "pb": "50.21",
        "ps": "8.04",
        "roe": "147.25"
      },
      {
        "symbol": "MSFT.US",
        "name": "微軟",
        "last_done": "415.32",
        "chg": "+1.05%",
        "market_cap": "3085000000000",
        "pe": "35.42",
        "pb": "12.87",
        "ps": "12.61",
        "roe": "36.52"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [ScreenerSearchResponse](#ScreenerSearchResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### ScreenerSearchResponse

<a id="ScreenerSearchResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| total | integer | false | 滿足條件的股票總數 |
| page | integer | false | 當前頁碼 |
| size | integer | false | 當前頁條數 |
| stocks | object[] | false | 篩選結果股票列表 |
| ∟ symbol | string | false | 證券代碼 |
| ∟ name | string | false | 證券名稱 |
| ∟ last_done | string | false | 最新成交價 |
| ∟ chg | string | false | 漲跌幅 |
| ∟ market_cap | string | false | 市值 |
| ∟ pe | string | false | 市盈率 |
| ∟ pb | string | false | 市淨率 |
| ∟ ps | string | false | 市銷率 |
| ∟ roe | string | false | 淨資產收益率（%） |
