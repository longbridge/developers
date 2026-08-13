---
slug: symbol_info
sidebar_position: 11
title: Grid Symbol Info
sidebar_label: 'Symbol Info'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Fetch the grid-trading information for a security: lot size, last done price, price steps, and authorization status. Use it to build a valid grid rule before calling [Submit Grid Order](./submit). The `channel_info.strategy_granted` field tells you whether the strategy risk-disclosure consent has already been recorded — if it is `false`, submit the [Strategy Questionnaire](./questionnaire) first.

<SDKLinks module="grid" klass="GridContext" method="symbol_info" hideGo />

<CliCommand>
# Show the grid-trading info for 700.HK
longbridge grid info 700.HK
</CliCommand>

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/orders/info</td></tr>
</tbody>
</table>

### Parameters

| Name       | Type   | Required | Description                                                |
| ---------- | ------ | -------- | ---------------------------------------------------------- |
| counter_id | string | YES      | Security symbol, `ticker.region` format, example: `700.HK` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# Grid REST calls go through the standalone GridContext
ctx = GridContext(config)

resp = ctx.symbol_info("700.HK")
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
  const resp = await ctx.symbolInfo('700.HK')
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
            GridSymbolInfo info = ctx.symbolInfo("700.HK").get();
            System.out.println(info);
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
    grid::GridContext,
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let info = ctx.symbol_info("700.HK").await?;
    println!("{info:?}");
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

    ctx.symbol_info("700.HK", [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "last_done: " << res->last_done << std::endl;
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

| Name          | Type   | Description                                                          |
| ------------- | ------ | -------------------------------------------------------------------- |
| name          | string | Security name                                                        |
| last_done     | string | Latest traded price                                                  |
| lot_size      | string | Board lot size                                                       |
| buy_lot_size  | string | Minimum lot size for a buy order                                     |
| sell_lot_size | string | Minimum lot size for a sell order                                    |
| bid_sizes     | object[] | Price-step tiers, see below                                        |
| channel_info  | object | Trading-channel info and authorization, see below                    |

#### bid_sizes

| Name         | Type   | Description                                     |
| ------------ | ------ | ----------------------------------------------- |
| str_proceed  | string | Start price of the tier                         |
| end_proceed  | string | End price of the tier                           |
| bid_size     | string | Minimum price step within the tier              |

#### channel_info

| Name                | Type     | Description                                                             |
| ------------------- | -------- | ----------------------------------------------------------------------- |
| strategy_granted    | boolean  | Whether the strategy risk-disclosure consent has been recorded          |
| support_rth         | boolean  | Whether the security supports regular-trading-hours grids               |
| currency            | string   | Trading currency                                                        |
| settlement_currency | string[] | Supported settlement currencies                                         |

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "TENCENT",
    "last_done": "300.000",
    "lot_size": "100",
    "buy_lot_size": "100",
    "sell_lot_size": "100",
    "bid_sizes": [
      {
        "str_proceed": "0.010",
        "end_proceed": "500.000",
        "bid_size": "0.200"
      }
    ],
    "channel_info": {
      "strategy_granted": true,
      "support_rth": false,
      "currency": "HKD",
      "settlement_currency": ["HKD"]
    }
  }
}
```

### Response Status

| Status | Description                                                      | Schema |
| ------ | ---------------------------------------------------------------- | ------ |
| 200    | The security grid info was returned successfully.                | None   |
| 400    | The request was rejected with an incorrect request parameter.    | None   |

<aside className="success">
</aside>
