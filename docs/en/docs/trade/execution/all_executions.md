---
slug: all_executions
sidebar_position: 3
title: All Executions
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

This API is used to query execution (fill) records, including both buy and sell records. It supports querying today's and historical executions at the same time. Compared with the today/history execution APIs, each record additionally returns the trade `side`.

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

| Name     | Type   | Required | Description                                                                                                                                                                                         |
| -------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol   | string | NO       | Stock symbol, use `ticker.region` format, example: `AAPL.US`                                                                                                                                        |
| order_id | string | NO       | Order ID, example: `701276261045858304`                                                                                                                                                             |
| start_at | string | NO       | Start time, formatted as a timestamp (second), example: `1650410999`.<br/><br/> If the start time is null, the default is the 90 days before of the end time or 90 days before of the current time. |
| end_at   | string | NO       | End time, formatted as a timestamp (second), example: `1650410999`. <br/><br/> If the end time is null, the default is the current time or 90 days after of the start time.                         |
| page     | int32  | NO       | Page number, starting from `1`. The maximum number of records per query is 1000. If the number of results exceeds 1000, `has_more` will be `true`, use `page` together with `has_more` to paginate. |

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

| Status | Description                                              | Schema                                          |
| ------ | -------------------------------------------------------- | ----------------------------------------------- |
| 200    | Get All Executions Success                               | [all_executions_rsp](#schemaall_executions_rsp) |
| 400    | The query failed with an error in the request parameter. | None                                            |

<aside className="success">
</aside>

## Schemas

### all_executions_rsp

<a id="schemaall_executions_rsp"></a>
<a id="schemaall_executions_rsp"></a>

| Name            | Type     | Required | Description                                                                                                                                        |
| --------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| has_more        | boolean  | true     | has more orders record.<br/><br/>The maximum number of orders per query is 1000, if the number of results exceeds 1000, then has_more will be true |
| trades          | object[] | false    | Execution Detail                                                                                                                                   |
| ∟ order_id      | string   | true     | Order ID                                                                                                                                           |
| ∟ trade_id      | string   | true     | Execution ID                                                                                                                                       |
| ∟ symbol        | string   | true     | Stock symbol, use `ticker.region` format,example: `AAPL.US`                                                                                        |
| ∟ trade_done_at | string   | true     | Trade done time, formatted as a timestamp (second)                                                                                                 |
| ∟ quantity      | string   | true     | Executed quantity                                                                                                                                  |
| ∟ price         | string   | true     | Executed price                                                                                                                                     |
| ∟ side          | string   | true     | Trade side<br/><br/> **Enum Value:**<br/> `Buy`<br/> `Sell`                                                                                        |
