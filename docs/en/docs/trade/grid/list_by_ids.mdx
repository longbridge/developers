---
slug: list_by_ids
sidebar_position: 4
title: Query Grid Orders by IDs
sidebar_label: 'Query Orders by IDs'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Query specific grid orders by their IDs.

<CliCommand>
# Query specific grid orders by ID
longbridge grid --ids 764609681686573056 764609681686573057
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="list_by_ids" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/list</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name      | Type     | Required | Description                          |
| --------- | -------- | -------- | ------------------------------------ |
| order_ids | string[] | YES      | Grid order IDs to query              |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# Grid REST calls go through the standalone GridContext
ctx = GridContext(config)

resp = ctx.list_by_ids(["764609681686573056"])
print(resp)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, GridContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = GridContext.new(config)
  const resp = await ctx.listByIds({ orderIds: ['764609681686573056'] })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.grid.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             GridContext ctx = GridContext.create(config)) {
            GridOrder[] orders = ctx.listByIds(new String[]{"764609681686573056"}).get();
            for (GridOrder order : orders) {
                System.out.println(order);
            }
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{
    Config,
    grid::{GridContext, GetGridOrdersByIdsOptions},
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let resp = ctx.list_by_ids(GetGridOrdersByIdsOptions::new(["764609681686573056"])).await?;
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
using namespace longbridge::grid;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    GridContext ctx = GridContext::create(config);

    GetGridOrdersByIdsOptions opts;
    opts.order_ids = { "764609681686573056" };

    ctx.list_by_ids(opts, [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "grid orders: " << res->count << std::endl;
    });
}

int main(int argc, char const* argv[]) {
    const std::string client_id = "your-client-id";
    OAuthBuilder(client_id).build(
    [](const std::string& url) {
        std::cout << "Open this URL to authorize: " << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed" << std::endl;
            return;
        }
        run(*res);
    });

    std::cin.get();
    return 0;
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
    "grid_order": [
      {
        "order_id": "764609681686573056",
        "symbol": "700.HK",
        "stock_name": "TENCENT",
        "market": "HK",
        "status": "Performing",
        "grid_status": "Performing",
        "submitted_base_price": "300.000",
        "current_base_price": "300.000",
        "pre_trigger_base_price": "300.000",
        "post_trigger_base_price": "306.000",
        "upper_limit_price": "360.000",
        "lower_limit_price": "240.000",
        "trigger_price_type": 2,
        "trigger_spread_up": "",
        "trigger_spread_down": "",
        "trigger_percent_up": "2",
        "trigger_percent_down": "2",
        "pullback_percent": "",
        "pullback_spread": "",
        "rebound_percent": "",
        "rebound_spread": "",
        "trigger_sell_order_type": "GMO",
        "trigger_buy_order_type": "GMO",
        "trigger_sell_depth": 0,
        "trigger_buy_depth": 0,
        "trigger_quantity": "100",
        "trigger_sell_quantity": "100",
        "trigger_buy_quantity": "100",
        "upper_limit_quantity": "200",
        "lower_limit_quantity": "100",
        "upper_limit_event": 1,
        "lower_limit_event": 1,
        "multiple_trigger": false,
        "trigger_times": 3,
        "total_buy_quantity": "300",
        "total_sell_quantity": "200",
        "total_profit_balance": "1250.00",
        "settlement_currency": "HKD",
        "time_in_force": 1,
        "gtd": "",
        "created_at": "2025-01-15T09:30:00+08:00",
        "rth": 0,
        "support_shortsell": false,
        "grid_order_type_up": "GMO",
        "grid_order_type_down": "GMO"
      }
    ]
  }
}
```

### Response Status

| Status | Description                                                      | Schema                                                                        |
| ------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 200    | The grid orders were returned successfully.                      | [list_grid_orders_by_ids_rsp](#schemalist_grid_orders_by_ids_rsp)             |
| 400    | The request was rejected with an incorrect request parameter.    | None                                                                          |

<aside className="success">
</aside>

## Schemas

### list_grid_orders_by_ids_rsp

<a id="schemalist_grid_orders_by_ids_rsp"></a>

| Name                       | Type     | Required | Description                                                                                                                            |
| -------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| grid_order                 | object[] | false    | Grid orders                                                                                                                            |
| ∟ order_id                 | string   | true     | Grid order ID                                                                                                                          |
| ∟ symbol                   | string   | true     | Stock symbol, use `ticker.region` format, example: `AAPL.US`                                                                          |
| ∟ stock_name               | string   | true     | Stock name                                                                                                                             |
| ∟ market                   | string   | true     | Market                                                                                                                                 |
| ∟ status                   | string   | true     | Grid order status                                                                                                                      |
| ∟ grid_status              | string   | true     | Grid running status                                                                                                                    |
| ∟ submitted_base_price     | string   | true     | Submitted base price the grid is anchored to                                                                                          |
| ∟ current_base_price       | string   | true     | Current base price                                                                                                                     |
| ∟ pre_trigger_base_price   | string   | true     | Base price before the last trigger                                                                                                    |
| ∟ post_trigger_base_price  | string   | true     | Base price after the last trigger                                                                                                     |
| ∟ upper_limit_price        | string   | true     | Upper price bound                                                                                                                      |
| ∟ lower_limit_price        | string   | true     | Lower price bound                                                                                                                      |
| ∟ trigger_price_type       | int32    | true     | Trigger price type<br/><br/> **Enum Value:**<br/> `1` - Spread<br/> `2` - Percent                                                     |
| ∟ trigger_spread_up        | string   | true     | Upward trigger spread, used when `trigger_price_type` is `1`                                                                          |
| ∟ trigger_spread_down      | string   | true     | Downward trigger spread, used when `trigger_price_type` is `1`                                                                        |
| ∟ trigger_percent_up       | string   | true     | Upward trigger percent, used when `trigger_price_type` is `2`                                                                         |
| ∟ trigger_percent_down     | string   | true     | Downward trigger percent, used when `trigger_price_type` is `2`                                                                       |
| ∟ pullback_percent         | string   | true     | Pullback percent                                                                                                                       |
| ∟ pullback_spread          | string   | true     | Pullback spread                                                                                                                        |
| ∟ rebound_percent          | string   | true     | Rebound percent                                                                                                                        |
| ∟ rebound_spread           | string   | true     | Rebound spread                                                                                                                         |
| ∟ trigger_sell_order_type  | string   | true     | Sell-side grid order type<br/><br/> **Enum Value:**<br/> `GMO` - Grid market order<br/> `GLO` - Grid limit order<br/> `GTG` - Grid touch-to-go |
| ∟ trigger_buy_order_type   | string   | true     | Buy-side grid order type<br/><br/> **Enum Value:**<br/> `GMO` - Grid market order<br/> `GLO` - Grid limit order<br/> `GTG` - Grid touch-to-go  |
| ∟ trigger_sell_depth       | int32    | true     | Sell-side order-book depth, range `-5..5`; `0` means use `trigger_sell_order_type`                                                    |
| ∟ trigger_buy_depth        | int32    | true     | Buy-side order-book depth, range `-5..5`; `0` means use `trigger_buy_order_type`                                                      |
| ∟ trigger_quantity         | string   | true     | Quantity per trigger                                                                                                                   |
| ∟ trigger_sell_quantity    | string   | true     | Sell-side trigger quantity                                                                                                            |
| ∟ trigger_buy_quantity     | string   | true     | Buy-side trigger quantity                                                                                                             |
| ∟ upper_limit_quantity     | string   | true     | Quantity handled at the upper bound                                                                                                   |
| ∟ lower_limit_quantity     | string   | true     | Quantity handled at the lower bound                                                                                                   |
| ∟ upper_limit_event        | int32    | true     | Event when the upper bound is reached<br/><br/> **Enum Value:**<br/> `1` - Ignore (keep grid running)<br/> `2` - Close position at last price |
| ∟ lower_limit_event        | int32    | true     | Event when the lower bound is reached<br/><br/> **Enum Value:**<br/> `1` - Ignore (keep grid running)<br/> `2` - Close position at last price |
| ∟ multiple_trigger         | boolean  | true     | Whether a single grid level can trigger multiple times                                                                                |
| ∟ trigger_times            | int32    | true     | Number of times the grid has triggered                                                                                                |
| ∟ total_buy_quantity       | string   | true     | Total bought quantity                                                                                                                 |
| ∟ total_sell_quantity      | string   | true     | Total sold quantity                                                                                                                   |
| ∟ total_profit_balance     | string   | true     | Total profit balance                                                                                                                  |
| ∟ settlement_currency      | string   | true     | Settlement currency                                                                                                                   |
| ∟ time_in_force            | int32    | true     | Time in force type<br/><br/> **Enum Value:**<br/> `0` - Day<br/> `1` - Good-Til-Canceled<br/> `6` - Good-Til-Date                     |
| ∟ gtd                      | string   | true     | Good-Til-Date expiry date, format: `YYYY-MM-DD`                                                                                       |
| ∟ created_at               | string   | true     | Creation time, formatted as RFC3339                                                                                                   |
| ∟ rth                      | int32    | true     | Regular trading hours flag<br/><br/> **Enum Value:**<br/> `0`<br/> `1`<br/> `2`                                                       |
| ∟ support_shortsell        | boolean  | true     | Whether short selling is allowed                                                                                                      |
| ∟ grid_order_type_up       | string   | true     | Sell-side order type when depth is `0`<br/><br/> **Enum Value:**<br/> `GMO` - Grid market order<br/> `GLO` - Grid limit order<br/> `GTG` - Grid touch-to-go |
| ∟ grid_order_type_down     | string   | true     | Buy-side order type when depth is `0`<br/><br/> **Enum Value:**<br/> `GMO` - Grid market order<br/> `GLO` - Grid limit order<br/> `GTG` - Grid touch-to-go  |
