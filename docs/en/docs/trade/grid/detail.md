---
slug: detail
sidebar_position: 5
title: Grid Order Detail
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Query the full detail of a single grid order, including its rule, paged executed sub-orders (`grid_sub_orders`), and paged lifecycle history (`grid_order_history`).

<CliCommand>
# Rule, sub-orders and history of a grid order
longbridge grid detail 764609681686573056
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="detail" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/detail</td></tr>
</tbody>
</table>

### Parameters

| Name       | Type   | Required | Description                                                                          |
| ---------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| order_id   | string | YES      | Grid order ID, example: `764609681686573056`                                         |
| history_id | string | NO       | Cursor for paging the lifecycle history. Pass the last `history_id` of a page to fetch older entries. |
| limit      | int32  | NO       | Page size for `grid_sub_orders` and `grid_order_history`                             |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# Grid REST calls go through the standalone GridContext
ctx = GridContext(config)

resp = ctx.detail("764609681686573056")
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
  const resp = await ctx.detail({ orderId: '764609681686573056' })
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
            GridOrderDetail resp = ctx.detail(new GetGridOrderDetailOptions("764609681686573056")).get();
            System.out.println(resp);
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
    grid::{GridContext, GetGridOrderDetailOptions},
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let resp = ctx.detail(GetGridOrderDetailOptions::new("764609681686573056")).await?;
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

    GetGridOrderDetailOptions opts{ "764609681686573056" };
    ctx.detail(opts, [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "order_id: " << res->order_id << std::endl;
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

### Response Fields

The `data` object is a `GridOrderDetail`:

| Name                 | Type    | Description                                                                                                    |
| -------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| order_id             | string  | Grid order ID                                                                                                  |
| symbol               | string  | Security symbol, `ticker.region` format                                                                        |
| stock_name           | string  | Security name                                                                                                  |
| status               | string  | Grid order status, example: `Performing` / `Suspended`                                                        |
| grid_status          | string  | Detailed grid running status                                                                                  |
| suspend_reason       | string  | Reason the grid is suspended, empty when running                                                              |
| sleeping_reason      | string  | Reason the grid is dormant, empty when active                                                                 |
| submitted_base_price | string  | Base price the grid was anchored to at submission                                                             |
| current_base_price   | string  | Current base price after triggers                                                                             |
| upper_limit_price    | string  | Upper price bound                                                                                             |
| lower_limit_price    | string  | Lower price bound                                                                                             |
| trigger_price_type   | int32   | How trigger thresholds are interpreted<br/><br/>**Enum Value:**<br/>`1` - spread (absolute)<br/>`2` - percent |
| trigger_spread_up    | string  | Upward trigger spread (when `trigger_price_type` is `1`)                                                      |
| trigger_spread_down  | string  | Downward trigger spread (when `trigger_price_type` is `1`)                                                    |
| trigger_percent_up   | string  | Upward trigger percent (when `trigger_price_type` is `2`)                                                     |
| trigger_percent_down | string  | Downward trigger percent (when `trigger_price_type` is `2`)                                                   |
| pullback_percent     | string  | Pullback percent                                                                                             |
| pullback_spread      | string  | Pullback spread                                                                                             |
| rebound_percent      | string  | Rebound percent                                                                                             |
| rebound_spread       | string  | Rebound spread                                                                                             |
| multiple_trigger     | boolean | Whether a single grid level may trigger multiple times                                                       |
| time_in_force        | int32   | Time in force<br/><br/>**Enum Value:**<br/>`0` - Day<br/>`1` - GTC<br/>`6` - GTD                              |
| trigger_quantity     | string  | Quantity per trigger                                                                                         |
| trigger_sell_quantity| string  | Cumulative quantity triggered on the sell side                                                              |
| trigger_buy_quantity | string  | Cumulative quantity triggered on the buy side                                                               |
| upper_limit_quantity | string  | Quantity handled when the upper bound is reached                                                            |
| lower_limit_quantity | string  | Quantity handled when the lower bound is reached                                                            |
| upper_limit_event    | int32   | Action at the upper bound<br/><br/>**Enum Value:**<br/>`1` - ignore<br/>`2` - close position at last price   |
| lower_limit_event    | int32   | Action at the lower bound<br/><br/>**Enum Value:**<br/>`1` - ignore<br/>`2` - close position at last price   |
| trigger_sell_depth   | int32   | Sell-side order-book depth (-5 ~ 5). `0` = use `grid_order_type_up`                                          |
| trigger_buy_depth    | int32   | Buy-side order-book depth (-5 ~ 5). `0` = use `grid_order_type_down`                                         |
| created_at           | string  | Creation time, RFC3339 format                                                                               |
| updated_at           | string  | Last update time, RFC3339 format                                                                            |
| settlement_currency  | string  | Settlement currency, example: `HKD`                                                                         |
| expire_time          | string  | Expiry time, RFC3339 format (when `time_in_force` is GTD)                                                   |
| gtd                  | string  | Good-Til-Date, `YYYY-MM-DD` format                                                                          |
| grid_sub_orders      | object[]| Executed sub-orders for this grid, see [GridOrderSubOrder](#gridordersuborder)                              |
| sub_has_more         | boolean | Whether more sub-orders can be paged                                                                        |
| grid_order_history   | object[]| Lifecycle history entries, see [GridOrderHistory](#gridorderhistory)                                        |
| history_has_more     | boolean | Whether more history entries can be paged via `history_id`                                                  |
| support_shortsell    | boolean | Whether short selling is allowed                                                                            |
| rth                  | int32   | Regular-trading-hours flag (`0` / `1` / `2`)                                                                |
| grid_order_type_up   | string  | Sell-side order type when `trigger_sell_depth` is `0`<br/><br/>**Enum Value:**<br/>`GMO` / `GLO` / `GTG`     |
| grid_order_type_down | string  | Buy-side order type when `trigger_buy_depth` is `0`<br/><br/>**Enum Value:**<br/>`GMO` / `GLO` / `GTG`       |

#### GridOrderSubOrder

An executed order placed by the grid.

| Name         | Type   | Description                                                       |
| ------------ | ------ | ----------------------------------------------------------------- |
| id           | string | Sub-order ID                                                      |
| price        | string | Order price                                                       |
| order_type   | string | Order type                                                        |
| quantity     | string | Order quantity                                                    |
| executed_qty | string | Executed quantity                                                 |
| action       | int32  | Buy/sell direction                                                |
| status       | string | Sub-order status                                                  |
| submitted_at | string | Submission time, RFC3339 format                                   |
| rth          | int32  | Regular-trading-hours flag (`0` / `1` / `2`)                      |

#### GridOrderHistory

A lifecycle event of the grid order.

| Name           | Type   | Description                                      |
| -------------- | ------ | ------------------------------------------------ |
| history_id     | string | History entry ID, also used as the paging cursor |
| created_at     | string | Event time, RFC3339 format                       |
| status         | string | Grid status after the event                      |
| suspend_reason | string | Suspend reason, when applicable                  |
| reason         | string | Human-readable description of the event          |

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "order_id": "764609681686573056",
    "symbol": "700.HK",
    "stock_name": "TENCENT",
    "status": "Performing",
    "grid_status": "Performing",
    "suspend_reason": "",
    "sleeping_reason": "",
    "submitted_base_price": "300",
    "current_base_price": "300",
    "upper_limit_price": "360",
    "lower_limit_price": "240",
    "trigger_price_type": 2,
    "trigger_spread_up": "",
    "trigger_spread_down": "",
    "trigger_percent_up": "2",
    "trigger_percent_down": "2",
    "pullback_percent": "",
    "pullback_spread": "",
    "rebound_percent": "",
    "rebound_spread": "",
    "multiple_trigger": false,
    "time_in_force": 1,
    "trigger_quantity": "100",
    "trigger_sell_quantity": "0",
    "trigger_buy_quantity": "0",
    "upper_limit_quantity": "200",
    "lower_limit_quantity": "100",
    "upper_limit_event": 1,
    "lower_limit_event": 1,
    "trigger_sell_depth": 0,
    "trigger_buy_depth": 0,
    "created_at": "2024-08-12T10:30:00+08:00",
    "updated_at": "2024-08-12T10:30:00+08:00",
    "settlement_currency": "HKD",
    "expire_time": "",
    "gtd": "",
    "grid_sub_orders": [],
    "sub_has_more": false,
    "grid_order_history": [
      {
        "history_id": "764609681686573100",
        "created_at": "2024-08-12T10:30:00+08:00",
        "status": "Performing",
        "suspend_reason": "",
        "reason": "Grid order started"
      }
    ],
    "history_has_more": false,
    "support_shortsell": false,
    "rth": 0,
    "grid_order_type_up": "GMO",
    "grid_order_type_down": "GMO"
  }
}
```

### Response Status

| Status | Description                                          | Schema |
| ------ | ---------------------------------------------------- | ------ |
| 200    | The grid order detail was returned successfully.     | None   |
| 400    | The request was rejected with an incorrect parameter.| None   |

<aside className="success">
</aside>
