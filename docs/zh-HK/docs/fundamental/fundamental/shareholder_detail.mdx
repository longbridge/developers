---
slug: shareholder-detail
title: 股東持倉詳情
sidebar_position: 28
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取單個股東的持倉歷史及交易明細。`object_id` 來自 `shareholder_top` 返回結果。

<CliCommand>
longbridge shareholder AAPL.US --object-id 19463
longbridge shareholder 700.HK --object-id 20181
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="shareholder_detail" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 證券代碼，例如 `AAPL.US` |
| object_id | integer | 是 | 股東 ID，來自 `shareholder_top` 的 `object_id` 字段 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.shareholder_detail("AAPL.US", 19463)
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

    resp = await ctx.shareholder_detail("AAPL.US", 19463)
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
  const resp = await ctx.shareholderDetail('AAPL.US', 19463)
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
            var resp = ctx.getShareholderDetail("AAPL.US", 19463L).get();
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
    let resp = ctx.shareholder_detail("AAPL.US", 19463).await?;
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
            ctx.shareholder_detail("AAPL.US", 19463, [](auto resp) {
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
	resp, err := c.ShareholderDetail(context.Background(), "AAPL.US", 19463)
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
    "name": "The Vanguard Group, Inc.",
    "title": "",
    "avatar": "",
    "owner_source": "Institution",
    "holding_periods": [],
    "holding_details": [],
    "holding_summary": [],
    "trading_periods": ["Past 1 Month", "Past 3 Months", "Past 1 Year", "Past 3 Years"],
    "tradings": [
      {
        "period": "Past 1 Month",
        "accum_buy": "8500000.00",
        "accum_sell": "2687264.00",
        "net_buy": "5812736.00",
        "trading_details": [
          {
            "trading_date": "2025-12-18",
            "trading_shares": "5200000",
            "trading_price": "248.12",
            "trading_type": "Buy"
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
| 200    | 成功        | [ShareholderDetailResponse](#ShareholderDetailResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### ShareholderDetailResponse

<a id="ShareholderDetailResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | string | false | 股東名稱 |
| title | string | false | 股東頭銜 / 類型 |
| avatar | string | false | 頭像 URL |
| owner_source | string | false | 股東類型：`Company`、`Institution`、`Person`、`Insider` |
| holding_periods | string[] | false | 可用的持倉報告期列表 |
| holding_details | object[] | false | 持倉明細記錄 |
| holding_summary | object[] | false | 持倉匯總記錄 |
| trading_periods | string[] | false | 可用的交易統計區間（如 `Past 1 Month`、`Past 3 Months`） |
| tradings | object[] | false | 各區間交易匯總 |
| ∟ period | string | false | 區間標籤（如 `Past 1 Month`） |
| ∟ accum_buy | string | false | 該區間累計買入股數 |
| ∟ accum_sell | string | false | 該區間累計賣出股數 |
| ∟ net_buy | string | false | 該區間淨買入股數（買入減賣出） |
| ∟ trading_details | object[] | false | 該區間內的具體交易記錄 |
| ∟ ∟ trading_date | string | false | 交易日期 |
| ∟ ∟ trading_shares | string | false | 交易股數 |
| ∟ ∟ trading_price | string | false | 交易價格 |
| ∟ ∟ trading_type | string | false | 交易方向：`Buy` 或 `Sell` |

> 說明：部分字段在數據不可用時返回空字符串或空數組。
