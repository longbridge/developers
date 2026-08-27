---
slug: trigger_history
sidebar_position: 6
title: Grid Trigger History
sidebar_label: 'Trigger History'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Query the paged trigger history of a single grid order — the individual orders the grid has placed each time a trigger fired.

<CliCommand>
# Trigger history of a grid order
longbridge grid triggers 764609681686573056
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="trigger_history" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/trigger_history_list</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name          | Type   | Required | Description                                            |
| ------------- | ------ | -------- | ------------------------------------------------------ |
| grid_order_id | string | YES      | Grid order ID, example: `764609681686573056`           |
| page          | int32  | NO       | Page number, starting from `1`                         |
| limit         | int32  | NO       | Page size                                              |

:::warning
This endpoint uses `grid_order_id`, **not** `order_id` like the other grid endpoints. Using `order_id` here will not resolve the grid order.
:::

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# Grid REST calls go through the standalone GridContext
ctx = GridContext(config)

resp = ctx.trigger_history("764609681686573056")
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
  const resp = await ctx.triggerHistory({ gridOrderId: '764609681686573056' })
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
            GridTriggerHistory resp = ctx.triggerHistory(new GetGridTriggerHistoryOptions("764609681686573056")).get();
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
    grid::{GridContext, GetGridTriggerHistoryOptions},
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let resp = ctx.trigger_history(GetGridTriggerHistoryOptions::new("764609681686573056")).await?;
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

    GetGridTriggerHistoryOptions opts{ "764609681686573056" };
    ctx.trigger_history(opts, [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "trigger orders: " << res->trigger_orders.size() << std::endl;
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
    "trigger_orders": [
      {
        "id": "764610000000000001",
        "status": "Filled",
        "name": "TENCENT",
        "symbol": "700.HK",
        "price": "294",
        "quantity": "100",
        "executed_price": "294",
        "executed_qty": "100",
        "submitted_at": "2024-08-12T10:35:00+08:00",
        "action": 1,
        "order_type": "GMO",
        "trigger_price": "294",
        "msg": "",
        "currency": "HKD",
        "last_done": "294",
        "updated_at": "2024-08-12T10:35:05+08:00",
        "time_in_force": 1,
        "gtd": "",
        "trigger_at": "2024-08-12T10:35:00+08:00",
        "trigger_status": 1
      }
    ],
    "has_more": false
  }
}
```

### Response Status

| Status | Description                                            | Schema |
| ------ | ------------------------------------------------------ | ------ |
| 200    | The trigger history was returned successfully.         | [grid_trigger_history_rsp](#schemagrid_trigger_history_rsp) |
| 400    | The request was rejected with an incorrect parameter.  | None   |

<aside className="success">
</aside>

## Schemas

### grid_trigger_history_rsp

<a id="schemagrid_trigger_history_rsp"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| trigger_orders | object[] | false | Triggered orders |
| ∟ id | string | true | Trigger order ID |
| ∟ status | string | true | Order status |
| ∟ name | string | true | Security name |
| ∟ symbol | string | true | Security symbol, `ticker.region` format |
| ∟ price | string | true | Order price |
| ∟ quantity | string | true | Order quantity |
| ∟ executed_price | string | true | Executed price |
| ∟ executed_qty | string | true | Executed quantity |
| ∟ submitted_at | string | true | Submission time, RFC3339 format |
| ∟ action | int32 | true | Buy/sell direction |
| ∟ order_type | string | true | Order type |
| ∟ trigger_price | string | true | Price that triggered this order |
| ∟ msg | string | true | Additional message |
| ∟ currency | string | true | Order currency |
| ∟ last_done | string | true | Last traded price at trigger time |
| ∟ updated_at | string | true | Last update time, RFC3339 format |
| ∟ time_in_force | int32 | true | Time in force<br/><br/>**Enum Value:**<br/>`0` - Day<br/>`1` - GTC<br/>`6` - GTD |
| ∟ gtd | string | true | Good-Til-Date, `YYYY-MM-DD` format |
| ∟ trigger_at | string | true | Trigger time, RFC3339 format |
| ∟ trigger_status | int32 | true | Trigger status |
| has_more | boolean | false | Whether more pages are available |
