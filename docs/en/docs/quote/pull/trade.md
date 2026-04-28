---
id: quote_trade
title: Security Trades
slug: trade
sidebar_position: 8
---

This API is used to obtain the trades data of security.

<CliCommand>
# recent tick-by-tick trades for Tesla
longbridge trades TSLA.US
# recent tick-by-tick trades for Apple
longbridge trades AAPL.US
# recent tick-by-tick trades for NVDA
longbridge trades NVDA.US
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="trades" />

:::info

[Business Command](../../socket/biz-command): `17`

:::

## Request

### Parameters

| Name   | Type   | Required | Description                                                                                              |
| ------ | ------ | -------- | -------------------------------------------------------------------------------------------------------- |
| symbol | string | Yes      | Security code, in `ticker.region` format, for example:`700.HK`                                           |
| count  | int32  | Yes      | Count of trades <br /><br />**Check rules:**<br />The maximum number of trades in each request is `1000` |

### Protobuf

```protobuf
message SecurityTradeRequest {
  string symbol = 1;
  int32 count = 2;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.trades("700.HK", 10)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.trades("700.HK", 10)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.trades('700.HK', 10)
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
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id")
                .build(url -> System.out.println("Open to authorize: " + url))
                .get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            Trade[] resp = ctx.getTrades("700.HK", 10).get();
            for (Trade obj : resp) {
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
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open this URL to authorize: {url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.trades("700.HK", 10).await?;
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
using namespace longbridge::quote;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    QuoteContext ctx = QuoteContext::create(config);

    ctx.trades("700.HK", 10, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        for (const auto& t : *res) {
            std::cout << t.price << " " << t.quantity << std::endl;
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
	"github.com/longbridge/openapi-go/quote"
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
	qctx, err := quote.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer qctx.Close()
	trades, err := qctx.Trades(context.Background(), "700.HK", 10)
	if err != nil {
		log.Fatal(err)
	}
	for _, t := range trades {
		fmt.Println(t.Price, t.Volume)
	}
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name            | Type     | Description                                                                                      |
| --------------- | -------- | ------------------------------------------------------------------------------------------------ |
| symbol          | string   | Security code                                                                                    |
| trades          | object[] | Trades data                                                                                      |
| ∟ price         | string   | Price                                                                                            |
| ∟ volume        | int64    | Volume                                                                                           |
| ∟ timestamp     | int64    | Time of trading                                                                                  |
| ∟ trade_type    | string   | [Trade type](#trade-type)                                                                        |
| ∟ direction     | int32    | Trade direction <br /><br />**Optional value:**<br />`0` - neutral<br />`1` - down<br />`2` - up |
| ∟ trade_session | int32    | Trade session, see [TradeSession](../objects#tradesession---trading-session)                     |

#### Trade Type

HK

- `*` - Overseas trade
- `D` - Odd-lot trade
- `M` - Non-direct off-exchange trade
- `P` - Late trade (Off-exchange previous day)
- `U` - Auction trade
- `X` - Direct off-exchange trade
- `Y` - Automatch internalized
- ` ` - Automatch normal

US

- ` ` - Regular sale
- `A` - Acquisition
- `B` - Bunched trade
- `D` - Distribution
- `F` - Intermarket sweep
- `G` - Bunched sold trades
- `H` - Price variation trade
- `I` - Odd lot trade
- `K` - Rule 155 trde(NYSE MKT)
- `M` - Market center close price
- `P` - Prior reference price
- `Q` - Market center open price
- `S` - Split trade
- `V` - Contingent trade
- `W` - Average price trade
- `X` - Cross trade
- `1` - Stopped stock(Regular trade)

### Protobuf

```protobuf
message SecurityTradeResponse {
  string symbol = 1;
  repeated Trade trades = 2;
}

message Trade {
  string price = 1;
  int64 volume = 2;
  int64 timestamp = 3;
  string trade_type = 4;
  int32 direction = 5;
  TradeSession trade_session = 6;
}
```

### Response JSON Example

```json
{
  "symbol": "AAPL.US",
  "trades": [
    {
      "price": "158.760",
      "volume": 1,
      "timestamp": 1651103979,
      "trade_type": "I",
      "direction": 0,
      "trade_session": 2
    },
    {
      "price": "158.745",
      "volume": 1,
      "timestamp": 1651103985,
      "trade_type": "I",
      "direction": 0,
      "trade_session": 2
    },
    {
      "price": "158.800",
      "volume": 1,
      "timestamp": 1651103995,
      "trade_type": "I",
      "direction": 0,
      "trade_session": 2
    }
  ]
}
```

## Error Code

| Protocol Error Code | Business Error Code | Description              | Troubleshooting Suggestions                                   |
| ------------------- | ------------------- | ------------------------ | ------------------------------------------------------------- |
| 3                   | 301600              | Invalid request          | Invalid request parameters or unpacking request failed        |
| 3                   | 301606              | Request rate limit       | Reduce the frequency of requests                              |
| 7                   | 301602              | Server error             | Please try again or contact a technician to resolve the issue |
| 7                   | 301600              | Symbol not found         | Check that the requested `symbol` is correct                  |
| 7                   | 301603              | No quotes                | Security no quote                                             |
| 7                   | 301604              | No access                | No access to security quote                                   |
| 7                   | 301607              | Too many trades requeted | Reduce the amount of trades in each request                   |
