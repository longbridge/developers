---
id: quote_option_quote
title: Real-time Quotes of Option
slug: option-quote
sidebar_position: 3
---

This API is used to obtain the real-time quotes of US stock options, including the option-specific data.

<CliCommand>
# AAPL call option $250 strike expiry 2026-04-17
longbridge option quote AAPL260417C250000.US
# TSLA put option $350 strike expiry 2026-04-18
longbridge option quote TSLA260418P350000.US
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="option_quote" />

:::info
[Business Command](../../socket/biz-command): `12`
:::

## Request

### Parameters

| Name   | Type     | Required | Description                                                                                                                                                                                                                                      |
| ------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| symbol | string[] | Yes      | Security code list. obtain the symbol of the options through the [optionchain](./optionchain-date-strike.md) API, for example: `[BABA230120C160000.US]` <br /><br />**Check rules:**<br />The maximum number of symbols in each request is `500` |

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

resp = ctx.option_quote(["AAPL230317P160000.US"])
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

    resp = await ctx.option_quote(["AAPL230317P160000.US"])
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
  const resp = await ctx.optionQuote(['AAPL230317P160000.US'])
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
            OptionQuote[] resp = ctx.getOptionQuote(new String[] { "AAPL230317P160000.US" }).get();
            for (OptionQuote obj : resp) {
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
    let resp = ctx.option_quote(["AAPL230317P160000.US"]).await?;
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

    std::vector<std::string> symbols = {"AAPL230317C160000.US"};
    ctx.option_quote(symbols, [](auto res) {
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
	quotes, err := qctx.OptionQuote(context.Background(), []string{"AAPL230317C160000.US"})
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

| Name                     | Type     | Description                                                                          |
| ------------------------ | -------- | ------------------------------------------------------------------------------------ |
| secu_quote               | object[] | Options quote                                                                        |
| ∟ symbol                 | string   | Security code                                                                        |
| ∟ last_done              | string   | Latest price                                                                         |
| ∟ prev_close             | string   | Yesterday's close                                                                    |
| ∟ open                   | string   | Open                                                                                 |
| ∟ high                   | string   | High                                                                                 |
| ∟ low                    | string   | Low                                                                                  |
| ∟ timestamp              | int64    | Time of latest price                                                                 |
| ∟ volume                 | int64    | Volume                                                                               |
| ∟ turnover               | string   | Turnover                                                                             |
| ∟ trade_status           | int32    | Security trading status, see [TradeStatus](../objects#tradestatus---security-status) |
| ∟ option_extend          | object   | Option extend quote                                                                  |
| ∟∟ implied_volatility    | string   | Implied volatility                                                                   |
| ∟∟ open_interest         | int64    | Number of open positions                                                             |
| ∟∟ expiry_date           | string   | Exprity date, in `YYMMDD` format                                                     |
| ∟∟ strike_price          | string   | Strike price                                                                         |
| ∟∟ contract_multiplier   | string   | Contract multiplier                                                                  |
| ∟∟ contract_type         | string   | Option type <br /><br />**Optional value:**<br />`A` - American <br />`U` - Europe   |
| ∟∟ contract_size         | string   | Contract size                                                                        |
| ∟∟ direction             | string   | Direction <br /><br />**Optional value:**<br />`P` - put <br />`C` - call            |
| ∟∟ historical_volatility | string   | Underlying security historical volatility of the optionn                             |
| ∟∟ underlying_symbol     | string   | Underlying security symbol of the option                                             |

### Protobuf

```protobuf
message OptionQuoteResponse {
  repeated OptionQuote secu_quote = 1;
}

message OptionQuote {
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
  OptionExtend option_extend = 11;
}

message OptionExtend {
  string implied_volatility = 1;
  int64 open_interest = 2;
  string expiry_date = 3;
  string strike_price = 4;
  string contract_multiplier = 5;
  string contract_type = 6;
  string contract_size = 7;
  string direction = 8;
  string historical_volatility = 9;
  string underlying_symbol = 10;
}
```

### Response JSON Example

```json
{
  "secu_quote": [
    {
      "symbol": "AAPL220429P162500.US",
      "last_done": "7.78",
      "prev_close": "4.13",
      "open": "4.43",
      "high": "7.80",
      "low": "4.43",
      "timestamp": 1651003200,
      "volume": 3082,
      "turnover": "1813434.00",
      "option_extend": {
        "implied_volatility": "0.592",
        "open_interest": 11463,
        "expiry_date": "20220429",
        "strike_price": "162.50",
        "contract_multiplier": "100",
        "contract_type": "A",
        "contract_size": "100",
        "direction": "P",
        "historical_volatility": "0.2750",
        "underlying_symbol": "AAPL.US"
      }
    },
    {
      "symbol": "AAPL220429C150000.US",
      "last_done": "9.25",
      "prev_close": "13.87",
      "open": "13.80",
      "high": "13.80",
      "low": "9.15",
      "timestamp": 1651003200,
      "volume": 413,
      "turnover": "436835.00",
      "option_extend": {
        "implied_volatility": "0.702",
        "open_interest": 800,
        "expiry_date": "20220429",
        "strike_price": "150.00",
        "contract_multiplier": "100",
        "contract_type": "A",
        "contract_size": "100",
        "direction": "C",
        "historical_volatility": "0.2750",
        "underlying_symbol": "AAPL.US"
      }
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
| 7                   | 301607              | Too many request symbols | Reduce the number of symbols in a request                     |
