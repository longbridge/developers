---
slug: today_orders
title: Get Today Order
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

This API is used to get today order or get order by order id.

<CliCommand>
longbridge orders
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="today_orders" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/order/today </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type     | Required | Description                                                                                               |
| -------- | -------- | -------- | --------------------------------------------------------------------------------------------------------- |
| symbol   | string   | NO       | Stock symbol, use `ticker.region` format, example: `AAPL.US`                                              |
| status   | string[] | NO       | [Order status](../trade-definition#orderstatus)<br/><br/>example: `status=FilledStatus&status=NewStatus`  |
| side     | string   | NO       | Order side<br/><br/> **Enum Value:**<br/> `Buy`<br/> `Sell`                                               |
| market   | string   | NO       | Market<br/><br/> **Enum Value:**<br/> `US` - United States of America Market<br/> `HK` - Hong Kong Market |
| order_id | string   | NO       | Order ID, example: `701276261045858304`                                                                   |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import TradeContext, Config, OrderStatus, OrderSide, Market, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.today_orders(
    symbol = "700.HK",
    status = [OrderStatus.Filled, OrderStatus.New],
    side = OrderSide.Buy,
    market = Market.HK,
)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OrderStatus, OrderSide, Market, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)

    resp = await ctx.today_orders(
        symbol = "700.HK",
        status = [OrderStatus.Filled, OrderStatus.New],
        side = OrderSide.Buy,
        market = Market.HK,
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
  const resp = await ctx.todayOrders({})
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
            Order[] resp = ctx.getTodayOrders(null).get();
            for (Order o : resp) System.out.println(o);
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
    let resp = ctx.today_orders(None).await?;
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

    ctx.today_orders(std::nullopt, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        for (const auto& o : *res) std::cout << o.order_id << std::endl;
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
	orders, err := tctx.TodayOrders(context.Background(), &trade.GetTodayOrders{})
	if err != nil {
		log.Fatal(err)
	}
	for _, o := range orders {
		fmt.Println(o.OrderId)
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
    "orders": [
      {
        "currency": "HKD",
        "executed_price": "0.000",
        "executed_quantity": "0",
        "expire_date": "",
        "last_done": "",
        "limit_offset": "",
        "msg": "",
        "order_id": "706388312699592704",
        "order_type": "ELO",
        "outside_rth": "UnknownOutsideRth",
        "price": "11.900",
        "quantity": "200",
        "side": "Buy",
        "status": "RejectedStatus",
        "stock_name": "Bank of East Asia Ltd/The",
        "submitted_at": "1651644897",
        "symbol": "23.HK",
        "tag": "Normal",
        "time_in_force": "Day",
        "trailing_amount": "",
        "trailing_percent": "",
        "trigger_at": "0",
        "trigger_price": "",
        "trigger_status": "NOT_USED",
        "updated_at": "1651644898",
        "remark": ""
      }
    ]
  }
}
```

### Response Status

| Status | Description                                              | Schema                                      |
| ------ | -------------------------------------------------------- | ------------------------------------------- |
| 200    | Get Today Orders Success                                 | [today_orders_rsp](#schematoday_orders_rsp) |
| 400    | The query failed with an error in the request parameter. | None                                        |

<aside className="success">
</aside>

## Schemas

### today_orders_rsp

<a id="schematoday_orders_rsp"></a>
<a id="schematoday_orders_rsp"></a>

| Name                | Type     | Required | Description                                                                                                                                                                                                                                         |
| ------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orders              | object[] | false    | Order Detail                                                                                                                                                                                                                                        |
| ∟ order_id          | string   | true     | Order ID                                                                                                                                                                                                                                            |
| ∟ status            | string   | true     | [Order Status](../trade-definition#orderstatus)                                                                                                                                                                                                     |
| ∟ stock_name        | string   | true     | Stock Name                                                                                                                                                                                                                                          |
| ∟ quantity          | string   | true     | Submitted Quantity                                                                                                                                                                                                                                  |
| ∟ executed_quantity | string   | true     | Executed Quantity.<br/><br/>when the order is not filled, value is 0                                                                                                                                                                                |
| ∟ price             | string   | true     | Submitted Price.<br/><br/>when market condition order is not triggered, value is empty string                                                                                                                                                       |
| ∟ executed_price    | string   | true     | Executed Price.<br/><br/>when the order is not filled, value is 0                                                                                                                                                                                   |
| ∟ submitted_at      | string   | true     | Submitted Time                                                                                                                                                                                                                                      |
| ∟ side              | string   | true     | Order Side<br/><br/> **Enum Value:**<br/> `Buy`<br/> `Sell`                                                                                                                                                                                         |
| ∟ symbol            | string   | true     | Stock symbol, use `ticker.region` format, example: `AAPL.US`                                                                                                                                                                                        |
| ∟ order_type        | string   | true     | [Order Type](../trade-definition#ordertype)                                                                                                                                                                                                         |
| ∟ last_done         | string   | true     | Last done.<br/><br/>when the order is not filled, value is empty string                                                                                                                                                                             |
| ∟ trigger_price     | string   | true     | `LIT` / `MIT` Order Trigger Price.<br/><br/>When the order is not `LIT` / `MIT` order, value is empty string                                                                                                                                        |
| ∟ msg               | string   | true     | Rejected message or remark, default value is empty string.                                                                                                                                                                                          |
| ∟ tag               | string   | true     | Order tag<br/><br/> **Enum Value**<br/> `Normal` - Normal Order<br/> `GTC` - Long term Order<br/> `Grey` - Grey Order                                                                                                                               |
| ∟ time_in_force     | string   | true     | Time in force Type<br/><br/> **Enum Value:**<br/> `Day` - Day Order<br/> `GTC` - Good Til Canceled Order<br/> `GTD` - Good Til Date Order                                                                                                           |
| ∟ expire_date       | string   | true     | Long term order expire date, format: `YYYY-MM-DD`, example: `2022-12-05`.<br/><br/>When not a long term order, default value is empty string                                                                                                        |
| ∟ updated_at        | string   | true     | Last updated time, formatted as a timestamp (second)                                                                                                                                                                                                |
| ∟ trigger_at        | string   | true     | Conditional order trigger time. formatted as a timestamp (second)                                                                                                                                                                                   |
| ∟ trailing_amount   | string   | true     | `TSLPAMT` order trailing amount.<br/><br/>When the order is not `TSLPAMT` order, value is empty string                                                                                                                                              |
| ∟ trailing_percent  | string   | true     | `TSLPPCT` order trailing percent.<br/><br/>When the order is not `TSLPPCT` order, value is empty string                                                                                                                                             |
| ∟ limit_offset      | string   | true     | `TSLPAMT` / `TSLPPCT` order limit offset amount.<br/><br/>When the order is not `TSLPAMT` / `TSLPPCT` order, value is empty string                                                                                                                  |
| ∟ trigger_status    | string   | true     | Conditional Order Trigger Status<br/> When an order is not a conditional order or a conditional order is not triggered, the trigger status is NOT_USED<br/><br/> **Enum Value**<br/> `NOT_USED`<br/> `DEACTIVE`<br /> `ACTIVE`<br /> `RELEASED`     |
| ∟ currency          | string   | true     | Currency                                                                                                                                                                                                                                            |
| ∟ outside_rth       | string   | true     | Enable or disable outside regular trading hours<br/> Default is `UnknownOutsideRth` when the order is not a US stock<br/><br/> **Enum Value:**<br/> `RTH_ONLY` - Regular trading hour only<br/> `ANY_TIME` - Any time<br/> `OVERNIGHT` - Overnight" |
| ∟ remark            | string   | true     | Remark                                                                                                                                                                                                                                              |
| ∟ limit_depth_level | int32    | true     | Specifies the bid/ask depth level                                                                                                                                                                                                                   |
| ∟ monitor_price     | string   | true     | Monitoring price                                                                                                                                                                                                                                    |
| ∟ trigger_count     | int32    | true     | Number of triggers                                                                                                                                                                                                                                  |
