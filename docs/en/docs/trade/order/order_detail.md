---
slug: order_detail
title: Order Details
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

This API is used for order detail query

<CliCommand>
# Replace the order ID below with your actual order ID
longbridge order 693664675163312128
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="order_detail" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/order </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type   | Required | Description                                                               |
| -------- | ------ | -------- | ------------------------------------------------------------------------- |
| order_id | string | YES      | Order ID for specifying order ID query, for example: `701276261045858304` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.order_detail(
    order_id = "701276261045858304",
)
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

    resp = await ctx.order_detail(
        order_id = "701276261045858304",
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
  const resp = await ctx.orderDetail('701276261045858304')
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
            OrderDetail resp = ctx.getOrderDetail("701276261045858304").get();
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
    let resp = ctx.order_detail("701276261045858304").await?;
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

    ctx.order_detail("701276261045858304", [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        std::cout << res->order_id << std::endl;
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
	detail, err := tctx.OrderDetail(context.Background(), "701276261045858304")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", detail)
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
    "order_id": "828940451093708800",
    "status": "FilledStatus",
    "stock_name": "Apple",
    "quantity": "10",
    "executed_quantity": "10",
    "price": "200.000",
    "executed_price": "164.660",
    "submitted_at": "1680863604",
    "side": "Buy",
    "symbol": "AAPL.US",
    "order_type": "LO",
    "last_done": "164.660",
    "trigger_price": "0.0000",
    "msg": "",
    "tag": "Normal",
    "time_in_force": "Day",
    "expire_date": "2023-04-10",
    "updated_at": "1681113000",
    "trigger_at": "0",
    "trailing_amount": "",
    "trailing_percent": "",
    "limit_offset": "",
    "limit_depth_level": 0,
    "monitor_price": "",
    "trigger_count": 1,
    "trigger_status": "NOT_USED",
    "outside_rth": "ANY_TIME",
    "currency": "USD",
    "remark": "1680863603.927165",
    "free_status": "None",
    "free_amount": "",
    "free_currency": "",
    "deductions_status": "NONE",
    "deductions_amount": "",
    "deductions_currency": "",
    "platform_deducted_status": "NONE",
    "platform_deducted_amount": "",
    "platform_deducted_currency": "",
    "history": [
      {
        "price": "164.6600",
        "quantity": "10",
        "status": "FilledStatus",
        "msg": "Execution of 10",
        "time": "1681113000"
      },
      {
        "price": "200.0000",
        "quantity": "10",
        "status": "NewStatus",
        "msg": "",
        "time": "1681113000"
      }
    ],
    "charge_detail": {
      "items": [
        {
          "code": "BROKER_FEES",
          "name": "Broker Fees",
          "fees": []
        },
        {
          "code": "THIRD_FEES",
          "name": "Third-party Fees",
          "fees": []
        }
      ],
      "total_amount": "0",
      "currency": "USD"
    }
  }
}
```

### Response Status

| Status | Description                            | Schema                                      |
| ------ | -------------------------------------- | ------------------------------------------- |
| 200    | Order detail query successful          | [order_detail_rsp](#schemaorder_detail_rsp) |
| 400    | Query failed, request parameter error. | None                                        |

<aside className="success">
</aside>

## Schemas

### order_detail_rsp

<a id="schemaorder_detail_rsp"></a>
<a id="schemaorder_detail_rsp"></a>

Order Information

| Name                       | Type     | Required | Description                                                                                                                                                                                                                                                    |
| -------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| order_id                   | string   | true     | Order ID                                                                                                                                                                                                                                                       |
| status                     | string   | true     | [Order Status](../trade-definition#orderstatus)                                                                                                                                                                                                                |
| stock_name                 | string   | true     | Stock Name                                                                                                                                                                                                                                                     |
| quantity                   | string   | true     | Order Quantity                                                                                                                                                                                                                                                 |
| executed_quantity          | string   | true     | Executed Quantity<br/><br/>When the order is not executed, it is 0                                                                                                                                                                                             |
| price                      | string   | true     | Order Price<br/><br/>When the market price conditional order is not triggered, it is an empty string                                                                                                                                                           |
| executed_price             | string   | true     | Execution Price<br/><br/>When the order is not executed, it is 0                                                                                                                                                                                               |
| submitted_at               | string   | true     | Submitted Time                                                                                                                                                                                                                                                 |
| side                       | string   | true     | Order Side<br/><br/> **Enum Value:**<br/> `Buy`<br/> `Sell`                                                                                                                                                                                                    |
| symbol                     | string   | true     | Stock symbol, use `ticker.region` format, example: `AAPL.US`                                                                                                                                                                                                   |
| order_type                 | string   | true     | [Order Type](../trade-definition#ordertype)                                                                                                                                                                                                                    |
| last_done                  | string   | true     | Last done.<br/><br/>when the order is not filled, value is empty string                                                                                                                                                                                        |
| trigger_price              | string   | true     | `LIT` / `MIT` Order Trigger Price.<br/><br/>When the order is not `LIT` / `MIT` order, value is empty string                                                                                                                                                   |
| msg                        | string   | true     | Rejected message or remark, default value is empty string.                                                                                                                                                                                                     |
| tag                        | string   | true     | Order tag<br/><br/> **Enum Value**<br/> `Normal` - Normal Order<br/> `GTC` - Long term Order<br/> `Grey` - Grey Order                                                                                                                                          |
| time_in_force              | string   | true     | Time in force Type<br/><br/> **Enum Value:**<br/> `Day` - Day Order<br/> `GTC` - Good Til Canceled Order<br/> `GTD` - Good Til Date Order                                                                                                                      |
| expire_date                | string   | true     | Long term order expire date, format: `YYYY-MM-DD`, example: `2022-12-05`.<br/><br/> When not a long term order, default value is empty string                                                                                                                  |
| updated_at                 | string   | true     | Last updated time, formatted as a timestamp (second)                                                                                                                                                                                                           |
| trigger_at                 | string   | true     | Conditional order trigger time. formatted as a timestamp (second)                                                                                                                                                                                              |
| trailing_amount            | string   | true     | `TSLPAMT` order trailing amount.<br/><br/>When the order is not `TSLPAMT` order, value is empty string                                                                                                                                                         |
| trailing_percent           | string   | true     | `TSLPPCT` order trailing percent.<br/><br/>When the order is not `TSLPPCT` order, value is empty string                                                                                                                                                        |
| limit_offset               | string   | true     | `TSLPPCT` order limit offset amount.<br/><br/>When the order is not `TSLPPCT` order, value is empty string                                                                                                                                                     |
| trigger_status             | string   | true     | Conditional Order Trigger Status<br/> When an order is not a conditional order or a conditional order is not triggered, the trigger status is NOT_USED<br/><br/> **Enum Value**<br/> `NOT_USED`<br/> `DEACTIVE`<br /> `ACTIVE`<br /> `RELEASED`                |
| currency                   | string   | true     | Currency                                                                                                                                                                                                                                                       |
| outside_rth                | string   | true     | Enable or disable outside regular trading hours<br/> Default is `UnknownOutsideRth` when the order is not a US stock<br/><br/> **Enum Value:**<br/> `RTH_ONLY` - Regular trading hour only<br/> `ANY_TIME` - Any time<br/> `OVERNIGHT` - Overnight"            |
| remark                     | string   | true     | Remark                                                                                                                                                                                                                                                         |
| free_status                | string   | true     | Commission-free Status, default value is None<br/><br/> **Enum Value:**<br/> `None` - None<br/> `Calculated` - Commission-free amount to be calculated<br/> `Pending` - Pending commission-free<br/> `Ready` - Commission-free applied                         |
| free_amount                | string   | true     | Commission-free amount, default value is empty string.                                                                                                                                                                                                         |
| free_currency              | string   | true     | Commission-free currency, default value is empty string.                                                                                                                                                                                                       |
| deductions_status          | string   | true     | Deduction status/Cashback Status, default value is NONE<br/><br/> **Enum Value:**<br/> `NONE` - Pending Settlement <br/> `NO_DATA` - Settled with no data<br/> `PENDING` - Settled and pending distribution<br/> `DONE` - Settled and distributed              |
| deductions_amount          | string   | true     | Deduction amount, default value is empty string.                                                                                                                                                                                                               |
| deductions_currency        | string   | true     | Deduction currency, default value is empty string.                                                                                                                                                                                                             |
| platform_deducted_status   | string   | true     | Platform fee deduction status/Cashback Status, default value is NONE<br/><br/> **Enum Value:**<br/> `NONE` - Pending Settlement <br/> `NO_DATA` - Settled with no data<br/> `PENDING` - Settled and pending distribution<br/> `DONE` - Settled and distributed |
| platform_deducted_amount   | string   | true     | Platform fee deduction amount, default value is empty string.                                                                                                                                                                                                  |
| platform_deducted_currency | string   | true     | Platform fee deduction currency, default value is empty string.                                                                                                                                                                                                |
| history                    | object[] | true     | Order history details                                                                                                                                                                                                                                          |
| ∟ price                    | string   | true     | Executed price for executed orders, submitted price for expired, canceled, rejected orders, etc.                                                                                                                                                               |
| ∟ quantity                 | string   | true     | Executed quantity for executed orders, remaining quantity for expired, canceled, rejected orders, etc.                                                                                                                                                         |
| ∟ status                   | string   | true     | Order status                                                                                                                                                                                                                                                   |
| ∟ msg                      | string   | true     | Execution or error message                                                                                                                                                                                                                                     |
| ∟ time                     | string   | true     | Occurrence time                                                                                                                                                                                                                                                |
| charge_detail              | object   | true     | Order charges                                                                                                                                                                                                                                                  |
| ∟ total_amount             | string   | true     | Total charges amount                                                                                                                                                                                                                                           |
| ∟ currency                 | string   | true     | Settlement currency                                                                                                                                                                                                                                            |
| ∟ items                    | object[] | true     | Order charge details                                                                                                                                                                                                                                           |
| ∟∟ code                    | string   | true     | Charge category code<br/><br/> **Enum Value:**<br/> `UNKNOWN`<br/> `BROKER_FEES`<br/> `THIRD_FEES`                                                                                                                                                             |
| ∟∟ name                    | string   | true     | Charge category name                                                                                                                                                                                                                                           |
| ∟∟ fees                    | object[] | true     | Charge details                                                                                                                                                                                                                                                 |
| ∟∟∟ code                   | string   | true     | Charge code                                                                                                                                                                                                                                                    |
| ∟∟∟ name                   | string   | true     | Charge name                                                                                                                                                                                                                                                    |
| ∟∟∟ amount                 | string   | true     | Charge amount                                                                                                                                                                                                                                                  |
| ∟∟∟ currency               | string   | true     | Charge currency                                                                                                                                                                                                                                                |
| ∟∟∟ limit_depth_level      | int32    | true     | Specifies the bid/ask depth level                                                                                                                                                                                                                              |
| ∟∟∟ monitor_price          | string   | true     | Monitoring price                                                                                                                                                                                                                                               |
| ∟∟∟ trigger_count          | int32    | true     | Number of triggers                                                                                                                                                                                                                                             |
