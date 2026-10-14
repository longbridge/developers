---
slug: /market/top-movers
title: 異動股票（Top Movers）
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

<SDKLinks module="market" klass="MarketContext" method="top_movers" />


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

resp = ctx.top_movers(markets=["HK", "US"], sort=2, limit=20)
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

    resp = await ctx.top_movers(markets=["HK", "US"], sort=2, limit=20)
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
  const resp = await ctx.topMovers({ markets: ['HK', 'US'], sort: 2, limit: 20 })
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
            var resp = ctx.getTopMovers(new TopMoversOptions() {{ markets = new String[]{"HK", "US"}; sort = 2; limit = 20; }}).get();
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
    let resp = ctx.top_movers(Some(vec!["HK", "US"]), Some(2), None, Some(20)).await?;
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
            ctx.top_movers({"HK", "US"}, 2, "", 20, [](auto resp) {
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
	resp, err := c.TopMovers(context.Background(), []string{"HK", "US"}, 2, "", 20)
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
          "code": "TSLA",
          "counter_id": "ST/US/TSLA",
          "name": "特斯拉",
          "change": "-0.0388",
          "last_done": "404.110",
          "market": "US",
          "labels": ["汽車製造商"],
          "logo": "https://assets.lbkrs.com/ticker/ST/US/TSLA.png",
          "trade_status": 0
        },
        "timestamp": "1779202097",
        "alert_reason": "波動超 20 日均值",
        "alert_type": 11,
        "post": null
      }
    ],
    "next_params": {
      "visited": ["11098290", "11098478", "11099705"]
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [TopMoversResponse](#TopMoversResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### TopMoversResponse

<a id="TopMoversResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| events | object[] | false | 異動股票列表 |
| ∟ stock | object | false | 股票基本信息 |
| ∟ ∟ code | string | false | 股票代碼（如 `TSLA`） |
| ∟ ∟ counter_id | string | false | Counter ID（如 `ST/US/TSLA`） |
| ∟ ∟ name | string | false | 證券名稱 |
| ∟ ∟ change | string | false | 漲跌幅（如 `-0.0388`） |
| ∟ ∟ last_done | string | false | 最新成交價 |
| ∟ ∟ market | string | false | 市場：`US`、`HK`、`CN`、`SG` |
| ∟ ∟ labels | string[] | false | 行業 / 主題標籤 |
| ∟ ∟ logo | string | false | Logo 圖片 URL |
| ∟ ∟ trade_status | integer | false | 交易狀態碼 |
| ∟ timestamp | string | false | 異動時間（Unix 秒，字符串格式） |
| ∟ alert_reason | string | false | 異動原因描述 |
| ∟ alert_type | integer | false | 異動類型代碼 |
| ∟ post | object | false | 關聯新聞文章（複雜對象，包含 `title`、`description_html`、`published_at` 等字段；無關聯新聞時為 `null`） |
| next_params | object | false | 翻頁參數對象，傳入下次請求以獲取下一頁 |
