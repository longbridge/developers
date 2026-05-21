---
slug: /quote/pull/short-positions
title: 沽空数据（美股 / 港股）
sidebar_position: 25
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取美股或港股沽空持仓数据。市场根据代码后缀自动识别：`.HK` → 港交所沽空数据（每日更新）；其他 → 美股 FINRA 沽空数据（双月更新）。

<CliCommand>
longbridge short-positions TSLA.US
longbridge short-positions 700.HK
longbridge short-positions AAPL.US --count 50
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="short_positions" />


## Parameters

> **SDK 方法参数。**

| Name   | Type    | Required | Description                                                      |
| ------ | ------- | -------- | ---------------------------------------------------------------- |
| symbol | string  | YES      | 证券代码，例如 `TSLA.US` 或 `700.HK`                            |
| count  | integer | NO       | 返回记录数（1–100，默认 20）                                     |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

<CliCommand>
longbridge short-positions TSLA.US
longbridge short-positions 700.HK
longbridge short-positions AAPL.US --count 50
</CliCommand>

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

# 美股示例
resp = ctx.short_positions("TSLA.US", 20)
print(resp)

# 港股示例
resp = ctx.short_positions("700.HK", 20)
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

    # 美股示例
    resp = await ctx.short_positions("TSLA.US", 20)
    print(resp)

    # 港股示例
    resp = await ctx.short_positions("700.HK", 20)
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
  const resp = await ctx.shortPositions('TSLA.US', 20)
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
            var resp = ctx.getShortPositions("TSLA.US", 20).get();
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
    let resp = ctx.short_positions("TSLA.US", 20).await?;
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
            ctx.short_positions("TSLA.US", 20, [](auto resp) {
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
	resp, err := qctx.ShortPositions(context.Background(), "TSLA.US", 20)
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

<Tabs groupId="response-example">
  <TabItem value="us" label="美股（.US 代码）" default>

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "timestamp": "1647316800",
      "current_shares_short": "111286790",
      "avg_daily_share_volume": "95077016",
      "days_to_cover": "1.17",
      "rate": "0.0068",
      "close": ""
    }
  ]
}
```

  </TabItem>
  <TabItem value="hk" label="港股（.HK 代码）">

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "timestamp": "1718294400",
      "amount": "53677721",
      "balance": "20386798436",
      "cost": "379.800",
      "rate": "0.0057"
    }
  ]
}
```

  </TabItem>
</Tabs>

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | 见下方 Schema |
| 400    | 请求错误    | None   |

## Schemas

### 美股响应（`.US` 代码）

| Name                     | Type     | Required | Description                               |
| ------------------------ | -------- | -------- | ----------------------------------------- |
| data                     | object[] | false    | 沽空持仓记录                              |
| ∟ timestamp              | string   | false    | 结算日期（Unix 时间戳，秒）               |
| ∟ current_shares_short   | string   | false    | 沽空持仓股数                              |
| ∟ avg_daily_share_volume | string   | false    | 日均成交量                                |
| ∟ days_to_cover          | string   | false    | 沽空回补天数                              |
| ∟ rate                   | string   | false    | 沽空比率                                  |
| ∟ close                  | string   | false    | 当日收盘价                                |

### 港股响应（`.HK` 代码）

| Name        | Type     | Required | Description                    |
| ----------- | -------- | -------- | ------------------------------ |
| data        | object[] | false    | 沽空持仓记录                   |
| ∟ timestamp | string   | false    | 交易日期（Unix 时间戳，秒）    |
| ∟ amount    | string   | false    | 沽空金额（港元）               |
| ∟ balance   | string   | false    | 沽空持仓余额                   |
| ∟ cost      | string   | false    | 当日收盘价                     |
| ∟ rate      | string   | false    | 沽空比率                       |
