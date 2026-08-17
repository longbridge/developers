---
slug: ah-premium-intraday
title: A/H 溢價盤中數據
sidebar_position: 9
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取兩地上市證券的盤中 A/H 溢價時間序列數據。

<CliCommand>
longbridge ah-premium intraday 939.HK
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="ah_premium_intraday" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 兩地上市股票的港股代碼，例如 `939.HK` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.ah_premium_intraday("939.HK")
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

    resp = await ctx.ah_premium_intraday("939.HK")
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
  const resp = await ctx.ahPremiumIntraday('939.HK')
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
            var resp = ctx.getAhPremiumIntraday("939.HK").get();
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
    let resp = ctx.ah_premium_intraday("939.HK").await?;
    println!("{:?}", resp);
    Ok(())
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
	resp, err := c.AhPremiumIntraday(context.Background(), "939.HK")
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
    "klines": [
      {
        "ahpremium_rate": "0.1523",
        "apreclose": "24.80",
        "aprice": "25.10",
        "currency_rate": "0.8920",
        "hpreclose": "19.20",
        "hprice": "19.50",
        "price_spread": "1.23",
        "timestamp": "1778198400"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [AhPremiumIntradayResponse](#AhPremiumIntradayResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### AhPremiumIntradayResponse

<a id="AhPremiumIntradayResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| klines | object[] | true | Intraday A/H premium kline data, see [AhPremiumKline](#AhPremiumKline) |
| ∟ timestamp | string | false | Unix 時間戳 |
| ∟ ahpremium_rate | string | false | A/H premium rate |
| ∟ aprice | string | false | A-share price (CNY) |
| ∟ apreclose | string | false | A-share previous close (CNY) |
| ∟ hprice | string | false | H-share price (HKD) |
| ∟ hpreclose | string | false | H-share previous close (HKD) |
| ∟ currency_rate | string | false | CNH/HKD exchange rate |
| ∟ price_spread | string | false | Price spread |
