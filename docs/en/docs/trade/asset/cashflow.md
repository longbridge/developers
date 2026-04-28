---
slug: cashflow
title: Get Cash Flow
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

The API is used to obtain capital inflow/outflow direction, capital type, capital amount, occurrence time,
associated stock code and capital flow description information.

<CliCommand>
longbridge cash-flow
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="cash_flow" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/asset/cashflow </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name          | Type   | Required | Description                                                                                                 |
| ------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------- |
| start_time    | string | YES      | start time timestamp, in `seconds`, E.g:`1650037563`                                                        |
| end_time      | string | YES      | end time timestamp, in `seconds`, E.g:`1650747581`                                                          |
| business_type | string | NO       | Balance type<br/><br/> <b>Option:</b> <br/>`1` - cash <br/>`2` - stock<br/> `3` - fund                      |
| symbol        | string | NO       | Target code, E.g:`AAPL.US`                                                                                  |
| page          | string | NO       | start page <br/><br/><b>Default value:</b> `1` <br/><b>Data validation rules:</b><br/> <b>Ranges:</b> `>=1` |
| size          | string | NO       | page size <br/><br/><b>Default value:</b> `50` <br/><b>Data validation rules:</b> `1~10000`                 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from datetime import datetime
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.cash_flow(
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
    resp = await ctx.cash_flow(
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
  const resp = await ctx.cashFlow({ startAt: new Date(2022, 4, 9), endAt: new Date(2022, 4, 12) })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.trade.*;
import java.time.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            GetCashFlowOptions opts = new GetCashFlowOptions(
                OffsetDateTime.of(2022, 5, 9, 0, 0, 0, 0, ZoneOffset.UTC),
                OffsetDateTime.of(2022, 5, 12, 0, 0, 0, 0, ZoneOffset.UTC));
            CashFlow[] resp = ctx.getCashFlow(opts).get();
            for (CashFlow c : resp) System.out.println(c);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, trade::{TradeContext, GetCashFlowOptions}, Config};
use time::macros::datetime;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let opts = GetCashFlowOptions::new(datetime!(2022-05-09 0:00 UTC), datetime!(2022-05-12 0:00 UTC));
    let resp = ctx.cash_flow(opts).await?;
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

    GetCashFlowOptions opts{}; ctx.account_balance(opts, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        std::cout << "cashflow" << std::endl;
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
	start := time.Date(2024, 5, 1, 0, 0, 0, 0, time.UTC).Unix()
	end := time.Date(2024, 6, 1, 0, 0, 0, 0, time.UTC).Unix()
	flows, err := tctx.CashFlow(context.Background(), &trade.GetCashFlow{
		StartAt:      start,
		EndAt:        end,
		BusinessType: trade.BalanceTypeCash,
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", flows)
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
        "transaction_flow_name": "BuyContract-Stocks",
        "direction": 1,
        "balance": "-248.60",
        "currency": "USD",
        "business_time": "1621507957",
        "symbol": "AAPL.US",
        "description": "AAPL"
      },
      {
        "transaction_flow_name": "BuyContract-Stocks",
        "direction": 1,
        "balance": "-125.16",
        "currency": "USD",
        "business_time": "1621504824",
        "symbol": "AAPL.US",
        "description": "AAPL"
      }
    ]
  }
}
```

### Response Status

| Status | Description    | Schema                              |
| ------ | -------------- | ----------------------------------- |
| 200    | Success        | [cashflow_rsp](#schemacashflow_rsp) |
| 400    | Internal Error | None                                |

<aside className="success">
</aside>

## Schemas

### cashflow_rsp

<a id="schemacashflow_rsp"></a>
<a id="schemacashflow_rsp"></a>

| Name                    | Type     | Required | Description                                                                                  |
| ----------------------- | -------- | -------- | -------------------------------------------------------------------------------------------- |
| list                    | object[] | false    | Cash flow info                                                                               |
| ∟ transaction_flow_name | string   | true     | Cash flow name                                                                               |
| ∟ direction             | string   | true     | outflow direction <br/><br/><b>Option:</b> <br/>`1` - outflow <br/> `2` - inflow             |
| ∟ business_type         | string   | true     | Funding Category <br/><br/><b>Option:</b> <br/>`1` - cash <br/> `2` - stock <br/> `3` - fund |
| ∟ balance               | string   | true     | Cash amount                                                                                  |
| ∟ currency              | string   | true     | Cash Currency                                                                                |
| ∟ business_time         | string   | true     | business time                                                                                |
| ∟ symbol                | string   | false    | associated Stock code information                                                            |
| ∟ description           | string   | false    | Cash flow description                                                                        |
