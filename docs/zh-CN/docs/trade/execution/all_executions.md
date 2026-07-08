---
slug: all_executions
sidebar_position: 3
title: 全部成交明细
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

该接口用于获取订单的成交明细，包括买入和卖出的成交记录，同时支持当日成交和历史成交查询。相比当日/历史成交接口，每条记录额外返回买卖方向 `side`。

<SDKLinks module="trade" klass="TradeContext" method="all_executions" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v3/trade/execution/all </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type   | Required | Description                                                                                                        |
| -------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------- |
| symbol   | string | NO       | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US`                                                              |
| order_id | string | NO       | 订单 ID，例如：`701276261045858304`                                                                                |
| start_at | string | NO       | 开始时间，格式为时间戳 (秒)，例如：`1650410999`。<br/><br/>开始时间为空时，默认为结束时间或当前时间前九十天。      |
| end_at   | string | NO       | 结束时间，格式为时间戳 (秒)，例如：`1650410999`。<br/><br/>结束时间为空时，默认为开始时间后九十天或当前时间。      |
| page     | int32  | NO       | 页码，从 `1` 开始。单次查询最多返回 1000 条记录，若结果超过 1000 条，`has_more` 为 `true`，可结合 `has_more` 翻页。 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from datetime import datetime
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.all_executions(
    symbol = "700.HK",
    start_at = datetime(2022, 5, 9),
    end_at = datetime(2022, 5, 12),
)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from datetime import datetime
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)

    resp = await ctx.all_executions(
        symbol = "700.HK",
        start_at = datetime(2022, 5, 9),
        end_at = datetime(2022, 5, 12),
    )
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.allExecutions({ symbol: '700.HK' })
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
            AllExecutionsResponse resp = ctx.getAllExecutions(null).get();
            for (Execution e : resp.getTrades()) System.out.println(e);
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
    let resp = ctx.all_executions(None).await?;
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

    ctx.all_executions(std::nullopt, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        for (const auto& e : res->trades) std::cout << e.order_id << std::endl;
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
	"time"

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
	start := time.Date(2022, 5, 9, 0, 0, 0, 0, time.UTC)
	end := time.Date(2022, 5, 12, 0, 0, 0, 0, time.UTC)
	resp, err := tctx.AllExecutions(context.Background(), &trade.GetAllExecutions{
		Symbol:  "700.HK",
		StartAt: start,
		EndAt:   end,
	})
	if err != nil {
		log.Fatal(err)
	}
	for _, e := range resp.Trades {
		fmt.Println(e.OrderId)
	}
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
  "message": "success",
  "data": {
    "has_more": false,
    "trades": [
      {
        "order_id": "693664675163312128",
        "price": "388",
        "quantity": "100",
        "symbol": "700.HK",
        "trade_done_at": "1648611351",
        "trade_id": "693664675163312128-1648611351433741210",
        "side": "Buy"
      }
    ]
  }
}
```

### Response Status

| Status | Description        | Schema                                          |
| ------ | ------------------ | ----------------------------------------------- |
| 200    | 获取全部成交明细成功 | [all_executions_rsp](#schemaall_executions_rsp) |
| 400    | 请求参数有误，查询失败 | None                                            |

<aside className="success">
</aside>

## Schemas

### all_executions_rsp

<a id="schemaall_executions_rsp"></a>
<a id="schemaall_executions_rsp"></a>

| Name            | Type     | Required | Description                                                            |
| --------------- | -------- | -------- | --------------------------------------------------------------------- |
| has_more        | boolean  | true     | 是否有更多记录。<br/><br/>单次查询最多返回 1000 条记录，若结果超过 1000 条，has_more 为 true |
| trades          | object[] | false    | 成交明细                                                              |
| ∟ order_id      | string   | true     | 订单 ID                                                               |
| ∟ trade_id      | string   | true     | 成交 ID                                                               |
| ∟ symbol        | string   | true     | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US`                  |
| ∟ trade_done_at | string   | true     | 成交时间，格式为时间戳 (秒)                                           |
| ∟ quantity      | string   | true     | 成交数量                                                              |
| ∟ price         | string   | true     | 成交价格                                                              |
| ∟ side          | string   | true     | 买卖方向<br/><br/> **可选值：**<br/> `Buy` - 买入<br/> `Sell` - 卖出   |
