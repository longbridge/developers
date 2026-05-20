---
slug: /market/stock-events
title: 異動股票
sidebar_position: 7
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取價格波動超過近 20 個交易日標準差的異動股票，系統自動關聯相關新聞解讀異動原因。

<CliCommand>
longbridge top-movers
longbridge top-movers --market HK --sort time
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="stock_events" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| markets | string[] | 否 | 市場列表：`HK`、`US`、`CN`、`SG`；不傳返回所有市場 |
| sort | integer | 否 | 排序方式：`0`=時間（最新優先），`1`=漲跌幅，`2`=熱度（默認） |
| date | string | 否 | 指定日期，格式 `YYYY-MM-DD`；不傳返回最新數據 |
| limit | integer | 否 | 返回條數，默認 20 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.stock_events(markets=["HK", "US"], sort=2, limit=20)
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

    resp = await ctx.stock_events(markets=["HK", "US"], sort=2, limit=20)
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
  const resp = await ctx.stockEvents({ markets: ['HK', 'US'], sort: 2, limit: 20 })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.market.*;
import java.util.Arrays;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             MarketContext ctx = MarketContext.create(config)) {
            var resp = ctx.getStockEvents(Arrays.asList("HK", "US"), 2, null, 20).get();
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
    let resp = ctx.stock_events(Some(vec!["HK", "US"]), Some(2), None, Some(20)).await?;
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
            ctx.stock_events({"HK", "US"}, 2, "", 20, [](auto resp) {
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
	resp, err := c.StockEvents(context.Background(), []string{"HK", "US"}, 2, "", 20)
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
    "events": [
      {
        "stock": {
          "symbol": "9988.HK",
          "name": "阿里巴巴",
          "change": "+4.82%",
          "labels": ["港股", "科技"]
        },
        "timestamp": 1747728600000,
        "alert_reason": "財報超預期，營收增長 8%",
        "alert_type": "earnings_beat",
        "post": {
          "id": "post_abc123",
          "title": "阿里巴巴 Q4 財報解讀：雲業務強勁增長",
          "url": "https://longbridge.com/news/post_abc123"
        }
      },
      {
        "stock": {
          "symbol": "NVDA.US",
          "name": "英偉達",
          "change": "+3.21%",
          "labels": ["美股", "半導體"]
        },
        "timestamp": 1747725000000,
        "alert_reason": "大宗買入，成交量放大 3 倍",
        "alert_type": "volume_spike",
        "post": null
      }
    ],
    "next_params": "eyJvZmZzZXQiOjIwfQ=="
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [StockEventsResponse](#StockEventsResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### StockEventsResponse

<a id="StockEventsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| events | object[] | false | 異動股票列表 |
| ∟ stock | object | false | 股票基本信息 |
| ∟ ∟ symbol | string | false | 證券代碼 |
| ∟ ∟ name | string | false | 證券名稱 |
| ∟ ∟ change | string | false | 漲跌幅（含符號，如 `+4.82%`） |
| ∟ ∟ labels | string[] | false | 標籤列表（市場、行業等） |
| ∟ timestamp | integer | false | 異動時間（Unix 毫秒時間戳） |
| ∟ alert_reason | string | false | 異動原因描述 |
| ∟ alert_type | string | false | 異動類型標識符 |
| ∟ post | object | false | 關聯新聞/文章；無關聯時為 `null` |
| ∟ ∟ id | string | false | 文章 ID |
| ∟ ∟ title | string | false | 文章標題 |
| ∟ ∟ url | string | false | 文章鏈接 |
| next_params | string | false | 翻頁參數（Base64 編碼），傳入下次請求以獲取下一頁 |
