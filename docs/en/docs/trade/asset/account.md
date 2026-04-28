---
slug: account
title: Get Account Assets
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

The API is used to obtain the available, desirable, frozen, to-be-settled, and in-transit
funds (fund purchase and redemption) information for each currency of the user.

<CliCommand>
longbridge assets
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="account_balance" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/asset/account </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type   | Required | Description              |
| -------- | ------ | -------- | ------------------------ |
| currency | string | NO       | Currency (HKD, USD, CNH) |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.account_balance()
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
    resp = await ctx.account_balance()
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
  const resp = await ctx.accountBalance()
  for (const obj of resp) {
    console.log(obj.toString())
  }
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
        try (OAuth oauth = new OAuthBuilder("your-client-id")
                .build(url -> System.out.println("Open to authorize: " + url))
                .get();
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            AccountBalance[] resp = ctx.getAccountBalance().get();
            for (AccountBalance obj : resp) {
                System.out.println(obj);
            }
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
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open this URL to authorize: {url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.account_balance(None).await?;
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

    ctx.account_balance([](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        for (const auto& b : *res) {
            std::cout << b.currency << " " << (double)b.available << std::endl;
        }
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
	ab, err := tctx.AccountBalance(context.Background(), &trade.GetAccountBalance{})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", ab[0])
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
        "total_cash": "1759070010.72",
        "max_finance_amount": "977582000",
        "remaining_finance_amount": "0",
        "risk_level": "1",
        "margin_call": "2598051051.50",
        "currency": "HKD",
        "net_assets": "24145.90",
        "init_margin": "1540.09",
        "maintenance_margin": "1540.09",
        "buy_power": "1759070.12",
        "cash_infos": [
          {
            "withdraw_cash": "97592.30",
            "available_cash": "195902464.37",
            "frozen_cash": "11579339.13",
            "settling_cash": "207288537.81",
            "currency": "HKD"
          },
          {
            "withdraw_cash": "199893416.74",
            "available_cash": "199893416.74",
            "frozen_cash": "28723.76",
            "settling_cash": "-276806.51",
            "currency": "USD"
          }
        ],
        "frozen_transaction_fees": [
          {
            "currency": "USD",
            "frozen_transaction_fee": "6.51"
          }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description    | Schema                                    |
| ------ | -------------- | ----------------------------------------- |
| 200    | Success        | [accountcash_rsp](#schemaaccountcash_rsp) |
| 400    | Internal Error | None                                      |

<aside className="success">
</aside>

## Schemas

### accountcash_rsp

<a id="schemaaccountcash_rsp"></a>
<a id="schemaaccountcash_rsp"></a>

| Name                       | Type     | Required | Description                                                                                                                      |
| -------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| list                       | object[] | false    | Account Balance                                                                                                                  |
| ∟ total_cash               | string   | true     | Total Cash                                                                                                                       |
| ∟ max_finance_amount       | string   | true     | Maximum Financing Amount                                                                                                         |
| ∟ remaining_finance_amount | string   | true     | Remaining Financing Amount                                                                                                       |
| ∟ risk_level               | string   | true     | Risk control level <br/> <br/> <b>Option:</b><br/> `0` - safe <br/> `1` - medium risk<br/> `2` - early warning<br/> `3` - danger |
| ∟ margin_call              | string   | true     | Margin Call                                                                                                                      |
| ∟ net_assets               | string   | true     | net asset                                                                                                                        |
| ∟ init_margin              | string   | true     | initial margin                                                                                                                   |
| ∟ maintenance_margin       | string   | true     | maintenance margin                                                                                                               |
| ∟ currency                 | string   | true     | Currency                                                                                                                         |
| ∟ buy_power                | string   | true     | Buy Power                                                                                                                        |
| ∟ cash_infos               | object[] | false    | Cash Details                                                                                                                     |
| ∟∟ withdraw_cash           | string   | true     | Withdraw Cash                                                                                                                    |
| ∟∟ available_cash          | string   | true     | Available Cash                                                                                                                   |
| ∟∟ frozen_cash             | string   | true     | Frozen Cash                                                                                                                      |
| ∟∟ settling_cash           | string   | true     | Cash to be Settled                                                                                                               |
| ∟∟ currency                | string   | true     | Currency                                                                                                                         |
| ∟ frozen_transaction_fees  | object[] | false    | frozen fees                                                                                                                      |
| ∟∟ currency                | string   | false    | currency                                                                                                                         |
| ∟∟ frozen_transaction_fee  | string   | false    | frozen amount                                                                                                                    |
