---
slug: stock
title: 获取股票持仓
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

该接口用于获取包括账户、股票代码、持仓股数、可用股数、持仓均价（按账户设置计算均价方式）、币种在内的股票持仓信息。

<CliCommand>
longbridge positions
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="stock_positions" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/asset/stock </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name   | Type     | Required | Description                                          |
| ------ | -------- | -------- | ---------------------------------------------------- |
| symbol | string[] | NO       | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.stock_positions()
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
    resp = await ctx.stock_positions()
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
  const resp = await ctx.stockPositions()
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
            StockPositionsResponse resp = ctx.getStockPositions(null).get();
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
    let resp = ctx.stock_positions(None).await?;
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

    ctx.stock_positions(std::nullopt, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        std::cout << "positions" << std::endl;
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
	positions, err := tctx.StockPositions(context.Background(), []string{"AAPL.US", "700.HK"})
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
        "stock_info": [
          {
            "symbol": "700.HK",
            "symbol_name": "腾讯控股",
            "currency": "HKD",
            "quantity": "650",
            "market": "HK",
            "available_quantity": "-450",
            "cost_price": "457.53",
            "init_quantity": "214"
          },
          {
            "symbol": "9991.HK",
            "symbol_name": "宝尊电商-SW",
            "currency": "HKD",
            "market": "HK",
            "quantity": "200",
            "available_quantity": "0",
            "cost_price": "32.25",
            "init_quantity": "214"
          },
          {
            "symbol": "TCEHY.US",
            "symbol_name": "腾讯控股 (ADR)",
            "currency": "USD",
            "market": "US",
            "quantity": "10",
            "available_quantity": "10",
            "init_quantity": "18"
          },
          {
            "symbol": "2628.HK",
            "symbol_name": "中国人寿",
            "currency": "HKD",
            "market": "HK",
            "quantity": "9000",
            "available_quantity": "0",
            "init_quantity": "8000"
          },
          {
            "symbol": "5.HK",
            "symbol_name": "汇丰控股",
            "currency": "HKD",
            "market": "HK",
            "quantity": "2400",
            "available_quantity": "2000",
            "init_quantity": "2000"
          },
          {
            "symbol": "BABA.US",
            "symbol_name": "阿里巴巴",
            "currency": "USD",
            "market": "US",
            "quantity": "2000209",
            "available_quantity": "2000209",
            "init_quantity": "214"
          },
          {
            "symbol": "2.HK",
            "symbol_name": "中电控股",
            "currency": "HKD",
            "market": "HK",
            "quantity": "2000",
            "available_quantity": "2000",
            "init_quantity": "2000"
          },
          {
            "symbol": "NOK.US",
            "symbol_name": "诺基亚",
            "currency": "USD",
            "market": "US",
            "quantity": "1",
            "available_quantity": "0",
            "init_quantity": "1"
          }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema                        |
| ------ | ----------- | ----------------------------- |
| 200    | 返回成功    | [stock_rsp](#schemastock_rsp) |
| 400    | 内部错误    | None                          |

<aside className="success">
</aside>

## Schemas

### stock_rsp

<a id="schemastock_rsp"></a>
<a id="schemastock_rsp"></a>

| Name                  | Type     | Required | Description                                       |
| --------------------- | -------- | -------- | ------------------------------------------------- |
| list                  | object[] | false    | 股票持仓信息                                      |
| ∟ account_channel     | string   | true     | 账户类型                                          |
| ∟ stock_info          | object[] | false    | 股票列表                                          |
| ∟∟ symbol             | string   | true     | 股票代码                                          |
| ∟∟ symbol_name        | string   | true     | 股票名称                                          |
| ∟∟ quantity           | string   | true     | 持仓股数                                          |
| ∟∟ available_quantity | string   | false    | 可用股数                                          |
| ∟∟ currency           | string   | true     | 币种                                              |
| ∟∟ market             | string   | true     | 市场                                              |
| ∟∟ cost_price         | string   | true     | 成本价格 (具体根据客户端选择平均买入还是摊薄成本) |
| ∟∟ init_quantity      | string   | false    | 开盘前初始持仓                                    |
