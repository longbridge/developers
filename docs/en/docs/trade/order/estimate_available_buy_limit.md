---
slug: estimate_available_buy_limit
title: Estimate Maximum Purchase Quantity
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

This API is used for estimating the maximum purchase quantity for Hong Kong and US stocks, warrants, and options.

<CliCommand>
longbridge max-qty TSLA.US
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="estimate_max_purchase_quantity" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/estimate/buy_limit </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name       | Type   | Required | Description                                                                                                             |
| ---------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| symbol     | string | YES      | Stock code, using ticker.region format, for example: `AAPL.US`                                                          |
| order_type | string | YES      | [Order Type](../trade-definition#ordertype)                                                                             |
| price      | string | NO       | Estimated order price, for example: `388.5`                                                                             |
| side       | string | YES      | Order side<br/><br/> **Enum Value**<br/> `Buy` - Buy<br/> `Sell` - Sell (Short selling is only supported for US stocks) |
| currency   | string | NO       | Settlement currency                                                                                                     |
| order_id   | string | NO       | Order ID, required when estimating the maximum purchase quantity for a modified order                                   |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import TradeContext, Config, OrderType, OrderSide, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.estimate_max_purchase_quantity(
    symbol = "700.HK",
    order_type = OrderType.LO,
    side = OrderSide.Buy,
)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OrderType, OrderSide, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)

    resp = await ctx.estimate_max_purchase_quantity(
        symbol = "700.HK",
        order_type = OrderType.LO,
        side = OrderSide.Buy,
    )
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, TradeContext, OAuth, OrderType, OrderSide, Decimal } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.estimateMaxPurchaseQuantity({
    symbol: '700.HK',
    orderType: OrderType.LO,
    side: OrderSide.Buy,
    price: new Decimal('400'),
    fractionalShares: false,
  })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.trade.*;
import java.math.BigDecimal;
class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            EstimateMaxPurchaseQuantityResponse resp = ctx.getEstimateMaxPurchaseQuantity(new EstimateMaxPurchaseQuantityOptions("700.HK", OrderType.LO, OrderSide.Buy).setPrice(new BigDecimal("400"))).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, trade::{TradeContext, EstimateMaxPurchaseQuantityOptions, OrderType, OrderSide}, Config};
use rust_decimal::Decimal;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.estimate_max_purchase_quantity(
        EstimateMaxPurchaseQuantityOptions::new("700.HK", OrderType::LO, OrderSide::Buy)
            .price(Decimal::from(400))
    ).await?;
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

    EstimateMaxPurchaseQuantityOptions opts{"700.HK", OrderType::LO, OrderSide::Buy, Decimal(400.0), 100};
    ctx.estimate_max_purchase_quantity(opts, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        std::cout << "max_cash_buy: " << res->max_cash_buy << std::endl;
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
	"github.com/shopspring/decimal"
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
	resp, err := tctx.EstimateMaxPurchaseQuantity(context.Background(), &trade.GetEstimateMaxPurchaseQuantity{
		Symbol:    "AAPL.US",
		OrderType: trade.OrderTypeLO,
		Price:     decimal.NewFromFloat(175.62),
		Currency:  "USD",
		Side:      trade.OrderSideBuy,
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("max_cash_buy:", resp.MaxCashBuy)
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
    "cash_max_qty": "100",
    "margin_max_qty": "100"
  }
}
```

### Response Status

| Status | Description                                              | Schema                                                                      |
| ------ | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| 200    | Estimate Maximum Purchase Quantity Success               | [estimate_available_buy_limit_rsp](#schemaestimate_available_buy_limit_rsp) |
| 400    | The query failed with an error in the request parameter. | None                                                                        |

<aside className="success">
</aside>

## Schemas

### estimate_available_buy_limit_rsp

<a id="schemaestimate_available_buy_limit_rsp"></a>
<a id="schemaestimate_available_buy_limit_rsp"></a>

Estimated Maximum Purchase Quantity

| Name           | Type   | Required | Description                                               |
| -------------- | ------ | -------- | --------------------------------------------------------- |
| cash_max_qty   | string | true     | Cash available quantity, default value is empty string.   |
| margin_max_qty | string | true     | Margin available quantity, default value is empty string. |
