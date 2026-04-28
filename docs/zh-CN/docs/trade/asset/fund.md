---
slug: fund
title: 获取基金持仓
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

该接口用于获取包括账户、基金代码、持有份额、成本净值、当前净值、币种在内的基金持仓信息。

<CliCommand>
longbridge fund-positions
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="fund_positions" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/asset/fund </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name   | Type     | Required | Description                                                                                                                                           |
| ------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol | string[] | NO       | 基金代码，使用 `ISIN` 格式，例如：`HK0000676327` <a href="https://en.wikipedia.org/wiki/International_Securities_Identification_Number">ISIN 解释</a> |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.fund_positions()
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.fund_positions()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.fundPositions()
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.trade.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            FundPositionsResponse resp = ctx.getFundPositions(null).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.fund_positions(None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

#ifdef WIN32
#include <windows.h>
#endif

using namespace longbridge;
using namespace longbridge::trade;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    TradeContext ctx = TradeContext::create(config);

    ctx.fund_positions(std::nullopt, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        std::cout << "fund positions" << std::endl;
    });
}

int main(int argc, char const* argv[]) {
#ifdef WIN32
    SetConsoleOutputCP(CP_UTF8);
#endif

    const std::string client_id = "your-client-id";
    OAuthBuilder(client_id).build(
    [](const std::string& url) {
        std::cout << "Open this URL to authorize: " << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed: " << *res.status().message() << std::endl;
            return;
        }
        run(*res);
    });

    std::cin.get();
    return 0;
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
	"github.com/longbridge/openapi-go/trade"
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
	tctx, err := trade.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer tctx.Close()
	positions, err := tctx.FundPositions(context.Background(), []string{"AAPL.US", "700.HK"})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", positions)
}
```

  </TabItem>
</Tabs>


## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "account_channel": "lb",
        "fund_info": [
          {
            "symbol": "HK0000447943",
            "symbol_name": "高腾亚洲收益基金",
            "currency": "USD",
            "holding_units": "5.000",
            "current_net_asset_value": "0",
            "cost_net_asset_value": "0.00",
            "net_asset_value_day": "1649865600"
          }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema                      |
| ------ | ----------- | --------------------------- |
| 200    | 返回成功    | [fund_rsp](#schemafund_rsp) |
| 400    | 内部错误    | None                        |

<aside className="success">
</aside>

## Schemas

### fund_rsp

<a id="schemafund_rsp"></a>
<a id="schemafund_rsp"></a>

| Name                       | Type     | Required | Description    |
| -------------------------- | -------- | -------- | -------------- |
| list                       | object[] | false    | 股票持仓信息   |
| ∟ account_channel          | string   | true     | 账户类型       |
| ∟ fund_info                | object[] | false    | 基金详情       |
| ∟∟ symbol                  | string   | true     | 基金 ISIN 代码 |
| ∟∟ current_net_asset_value | string   | true     | 当前净值       |
| ∟∟ net_asset_value_day     | string   | true     | 当前净值时间   |
| ∟∟ symbol_name             | string   | true     | 基金名称       |
| ∟∟ currency                | string   | true     | 币种           |
| ∟∟ cost_net_asset_value    | string   | true     | 成本净值       |
