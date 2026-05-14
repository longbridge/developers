---
slug: broker-holding-detail
title: 经纪商持仓详情
sidebar_position: 7
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取港股上市证券的完整经纪商持仓详情列表（所有经纪商及其持仓数量）。

<CliCommand>
longbridge broker-holding detail 700.HK
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="broker_holding_detail" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 港股代码，例如 `700.HK` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.broker_holding_detail("700.HK")
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

    resp = await ctx.broker_holding_detail("700.HK")
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
  const resp = await ctx.brokerHoldingDetail('700.HK')
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
            var resp = ctx.getBrokerHoldingDetail("700.HK").get();
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
    let resp = ctx.broker_holding_detail("700.HK").await?;
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
	resp, err := c.BrokerHoldingDetail(context.Background(), "700.HK")
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
    "updated_at": "2026.05.13",
    "list": [
      {
        "parti_number": "B01224",
        "name": "HSBC Securities",
        "strong": false,
        "shares": {
          "value": "25100",
          "chg_1": "4000.0000",
          "chg_5": "6100.0000",
          "chg_20": "12600.0000",
          "chg_60": "8800.0000"
        },
        "ratio": {
          "value": "0.0025",
          "chg_1": "0.0004",
          "chg_5": "0.0006",
          "chg_20": "0.0012",
          "chg_60": "0.0009"
        }
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [BrokerHoldingDetailResponse](#BrokerHoldingDetailResponse) |
| 400    | 请求错误    | None   |

## Schemas

### BrokerHoldingDetailResponse

<a id="BrokerHoldingDetailResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| updated_at | string | false | 最后更新日期 |
| list | object[] | true | 经纪商持仓明细，见 [BrokerHoldingItem](#BrokerHoldingItem) |

### BrokerHoldingItem

<a id="BrokerHoldingItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| parti_number | string | true | 经纪商参与者编号 |
| name | string | false | 经纪商名称 |
| strong | boolean | false | 是否为主要持仓者 |
| shares | object | false | 持股数量 |
| shares.value | string | false | 当前持股数 |
| shares.chg_1 | string | false | 1 日变动 |
| shares.chg_5 | string | false | 5 日变动 |
| shares.chg_20 | string | false | 20 日变动 |
| shares.chg_60 | string | false | 60 日变动 |
| ratio | object | false | 持仓比率 |
| ratio.value | string | false | 当前比率 |
| ratio.chg_1 | string | false | 1 日比率变动 |
| ratio.chg_5 | string | false | 5 日比率变动 |
| ratio.chg_20 | string | false | 20 日比率变动 |
| ratio.chg_60 | string | false | 60 日比率变动 |