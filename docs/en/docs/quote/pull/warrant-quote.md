---
id: quote_warrant_quote
title: Real-time Quotes of Warrant
slug: warrant-quote
sidebar_position: 4
---

This API is used to obtain the real-time quotes of HK warrants, including the warrant-specific data.

<CliCommand>
# real-time quote for a Tencent-linked warrant
longbridge warrant quote 25228.HK
# real-time quote for another Tencent-linked warrant
longbridge warrant quote 24687.HK
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="warrant_quote" />

:::info

[Business Command](../../socket/biz-command): `13`

:::

## Request

### Parameters

| Name   | Type     | Required | Description                                                                                                                                                       |
| ------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol | string[] | Yes      | Security code list, in `ticker.region` format, for example: `[13447.HK]` <br /><br />**Check rules:**<br />The maximum number of symbols in each request is `500` |

### Protobuf

```protobuf
message MultiSecurityRequest {
  repeated string symbol = 1;
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

resp = ctx.warrant_quote(["21125.HK"])
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

    resp = await ctx.warrant_quote(["21125.HK"])
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
  const resp = await ctx.warrantQuote(['21125.HK'])
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
            WarrantQuote[] resp = ctx.getWarrantQuote(new String[] { "21125.HK" }).get();
            for (WarrantQuote obj : resp) {
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
    let resp = ctx.warrant_quote(["21125.HK"]).await?;
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

    std::vector<std::string> symbols = {"21926.HK"};
    ctx.warrant_quote(symbols, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        for (const auto& q : *res) {
            std::cout << q.symbol << " " << (double)q.last_done << std::endl;
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
	quotes, err := qctx.WarrantQuote(context.Background(), []string{"21926.HK"})
	if err != nil {
		log.Fatal(err)
	}
	for _, q := range quotes {
		fmt.Println(q.Symbol, q.LastDone)
	}
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name                  | Type     | Description                                                                                                    |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| secu_quote            | object[] | Warrants quote                                                                                                 |
| ∟ symbol              | string   | Security code                                                                                                  |
| ∟ last_done           | string   | Latest price                                                                                                   |
| ∟ prev_close          | string   | Yesterday's close                                                                                              |
| ∟ open                | string   | Open                                                                                                           |
| ∟ high                | string   | High                                                                                                           |
| ∟ low                 | string   | Low                                                                                                            |
| ∟ timestamp           | int64    | Time of latest price                                                                                           |
| ∟ volume              | int64    | Volume                                                                                                         |
| ∟ turnover            | string   | Turnover                                                                                                       |
| ∟ trade_status        | int32    | Security trading status, see [TradeStatus](../objects#tradestatus---security-status)                           |
| ∟ warrant_extend      | object   | Warrant extend quote                                                                                           |
| ∟∟ implied_volatility | string   | Implied volatility                                                                                             |
| ∟∟ expiry_date        | string   | Exprity date, in `YYMMDD` format                                                                               |
| ∟∟ last_trade_date    | string   | Last tradalbe date, in `YYMMDD` format                                                                         |
| ∟∟ outstanding_ratio  | string   | Outstanding ratio                                                                                              |
| ∟∟ outstanding_qty    | int64    | Outstanding quantity                                                                                           |
| ∟∟ conversion_ratio   | string   | Conversion ratio                                                                                               |
| ∟∟ category           | string   | Warrant type <br /><br />**Optional value: **<br />`Call` <br />`Put` <br />`Bull` <br />`Bear` <br />`Inline` |
| ∟∟ strike_price       | string   | Strike price                                                                                                   |
| ∟∟ upper_strike_price | string   | Upper bound price                                                                                              |
| ∟∟ lower_strike_price | string   | Lower bound price                                                                                              |
| ∟∟ call_price         | string   | Call price                                                                                                     |
| ∟∟ underlying_symbol  | string   | Underlying security symbol of the option                                                                       |

### Protobuf

```protobuf
message WarrantQuoteResponse {
  repeated WarrantQuote secu_quote = 2;
}

message WarrantQuote {
  string symbol = 1;
  string last_done = 2;
  string prev_close = 3;
  string open = 4;
  string high = 5;
  string low = 6;
  int64 timestamp = 7;
  int64 volume = 8;
  string turnover = 9;
  TradeStatus trade_status = 10;
  WarrantExtend warrant_extend = 11;
}

message WarrantExtend {
  string implied_volatility = 1;
  string expiry_date = 2;
  string last_trade_date = 3;
  string outstanding_ratio = 4;
  int64  outstanding_qty = 5;
  string conversion_ratio = 6;
  string category = 7;
  string strike_price = 8;
  string upper_strike_price = 9;
  string lower_strike_price = 10;
  string call_price = 11;
  string underlying_symbol = 12;
}
```

### Response JSON Example

```json
{
  "secu_quote": [
    {
      "symbol": "66642.HK",
      "last_done": "0.345",
      "prev_close": "0.365",
      "open": "0.345",
      "high": "0.345",
      "low": "0.345",
      "timestamp": 1651130421,
      "volume": 200000,
      "turnover": "69000.000",
      "warrant_extend": {
        "implied_volatility": "0.319",
        "expiry_date": "20220830",
        "last_trade_date": "20220829",
        "outstanding_ratio": "0.0001",
        "outstanding_qty": 20000,
        "conversion_ratio": "10000",
        "category": "Bear",
        "strike_price": "23200.000",
        "upper_strike_price": "0.000",
        "lower_strike_price": "0.000",
        "call_price": "23100.000",
        "underlying_symbol": "HSI.HK"
      }
    },
    {
      "symbol": "14993.HK",
      "last_done": "0.073",
      "prev_close": "0.066",
      "open": "0.069",
      "high": "0.076",
      "low": "0.069",
      "timestamp": 1651130930,
      "volume": 320825000,
      "turnover": "23401125.000",
      "warrant_extend": {
        "implied_volatility": "0.404",
        "expiry_date": "20220927",
        "last_trade_date": "20220921",
        "outstanding_ratio": "0.0247",
        "outstanding_qty": 2465000,
        "conversion_ratio": "10",
        "category": "Call",
        "strike_price": "70.050",
        "upper_strike_price": "0.000",
        "lower_strike_price": "0.000",
        "call_price": "0.000",
        "underlying_symbol": "2318.HK"
      }
    }
  ]
}
```

## API Restrictions

:::caution

- The HK stocks quotation beyond the 20th will be delayed if the quote level is BMP.

:::

## Error Code

| Protocol Error Code | Business Error Code | Description              | Troubleshooting Suggestions                                   |
| ------------------- | ------------------- | ------------------------ | ------------------------------------------------------------- |
| 3                   | 301600              | Invalid request          | Invalid request parameters or unpacking request failed        |
| 3                   | 301606              | Request rate limit       | Reduce the frequency of requests                              |
| 7                   | 301602              | Server error             | Please try again or contact a technician to resolve the issue |
| 7                   | 301607              | Too many request symbols | Reduce the number of symbols in a request                     |
