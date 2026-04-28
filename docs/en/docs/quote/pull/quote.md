---
id: quote_quote
title: Real-time Quotes Of Securities
slug: quote
sidebar_position: 2
---

This API is used to obtain the real-time quotes of securities, and supports all types of securities.

<CliCommand>
# real-time quote for Tesla
longbridge quote TSLA.US
# query multiple US stocks at once
longbridge quote AAPL.US NVDA.US
# mix US and HK stocks
longbridge quote TSLA.US 700.HK AAPL.US
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="quote" />

:::info
[Business Command](../../socket/biz-command): `11`
:::

## Request

### Parameters

| Name   | Type     | Required | Description                                                                                                                                                     |
| ------ | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol | string[] | Yes      | Security code list, in `ticker.region` format, for example: `[700.HK]` <br /><br />**Check rules:**<br />The maximum number of symbols in each request is `500` |

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

resp = ctx.quote(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"])
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

    resp = await ctx.quote(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"])
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
  const resp = await ctx.quote(['700.HK', 'AAPL.US', 'TSLA.US', 'NFLX.US'])
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
            SecurityQuote[] resp = ctx.getQuote(new String[] { "700.HK", "AAPL.US", "TSLA.US", "NFLX.US" }).get();
            for (SecurityQuote obj : resp) {
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
    let resp = ctx.quote(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"]).await?;
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

    std::vector<std::string> symbols = {"700.HK", "AAPL.US", "TSLA.US", "NFLX.US"};
    ctx.quote(symbols, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        for (const auto& it : *res) {
            std::cout << it.symbol << " last_done=" << (double)it.last_done << std::endl;
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
	quotes, err := qctx.Quote(context.Background(), []string{"700.HK", "AAPL.US", "TSLA.US", "NFLX.US"})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", quotes[0])
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name                | Type     | Description                                                                                                                                                                                                 |
| ------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| secu_quote          | object[] | Securities quote                                                                                                                                                                                            |
| ∟ symbol            | string   | Security code                                                                                                                                                                                               |
| ∟ last_done         | string   | Latest price                                                                                                                                                                                                |
| ∟ prev_close        | string   | Yesterday's close                                                                                                                                                                                           |
| ∟ open              | string   | Open                                                                                                                                                                                                        |
| ∟ high              | string   | High                                                                                                                                                                                                        |
| ∟ low               | string   | Low                                                                                                                                                                                                         |
| ∟ timestamp         | int64    | Time of latest price                                                                                                                                                                                        |
| ∟ volume            | int64    | Volume                                                                                                                                                                                                      |
| ∟ turnover          | string   | Turnover                                                                                                                                                                                                    |
| ∟ trade_status      | int32    | Security trading status, see [TradeStatus](../objects#tradestatus---security-status)                                                                                                                        |
| ∟ pre_market_quote  | object   | Quote of US pre market                                                                                                                                                                                      |
| ∟∟ last_done        | string   | Latest price                                                                                                                                                                                                |
| ∟∟ timestamp        | int64    | Time of latest price                                                                                                                                                                                        |
| ∟∟ volume           | int64    | Volume                                                                                                                                                                                                      |
| ∟∟ turnover         | string   | Turnover                                                                                                                                                                                                    |
| ∟∟ high             | string   | High                                                                                                                                                                                                        |
| ∟∟ low              | string   | Low                                                                                                                                                                                                         |
| ∟∟ prev_close       | string   | Close of the last trade session                                                                                                                                                                             |
| ∟ post_market_quote | object   | Quote of US post market                                                                                                                                                                                     |
| ∟∟ last_done        | string   | Latest price                                                                                                                                                                                                |
| ∟∟ timestamp        | int64    | Time of latest price                                                                                                                                                                                        |
| ∟∟ volume           | int64    | Volume                                                                                                                                                                                                      |
| ∟∟ turnover         | string   | Turnover                                                                                                                                                                                                    |
| ∟∟ high             | string   | High                                                                                                                                                                                                        |
| ∟∟ low              | string   | Low                                                                                                                                                                                                         |
| ∟∟ prev_close       | string   | Close of the last trade session                                                                                                                                                                             |
| ∟ over_night_quote  | object   | Quote of US overnight market<br/><br/>Note: Requires purchasing the "LV1 Real-time Quote (OpenAPI)" quote card in the Longbridge App and enabling the `enable_overnight` parameter. Returns null otherwise. |
| ∟∟ last_done        | string   | Latest price                                                                                                                                                                                                |
| ∟∟ timestamp        | int64    | Time of latest price                                                                                                                                                                                        |
| ∟∟ volume           | int64    | Volume                                                                                                                                                                                                      |
| ∟∟ turnover         | string   | Turnover                                                                                                                                                                                                    |
| ∟∟ high             | string   | High                                                                                                                                                                                                        |
| ∟∟ low              | string   | Low                                                                                                                                                                                                         |
| ∟∟ prev_close       | string   | Close of the last trade session                                                                                                                                                                             |

### Protobuf

```protobuf
message SecurityQuoteResponse {
  repeated SecurityQuote secu_quote = 1;
}

message SecurityQuote {
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
  PrePostQuote pre_market_quote = 11;
  PrePostQuote post_market_quote = 12;
}

message PrePostQuote {
  string last_done = 1;
  int64 timestamp = 2;
  int64 volume = 3;
  string turnover = 4;
  string high = 5;
  string low = 6;
  string prev_close = 7;
}
```

### Response JSON Example

```json
{
  "secu_quote": [
    {
      "symbol": "700.HK",
      "last_done": "338.000",
      "prev_close": "334.800",
      "open": "340.600",
      "high": "340.600",
      "low": "333.000",
      "timestamp": 1651115955,
      "volume": 7310881,
      "turnover": "2461463161.000"
    },
    {
      "symbol": "AAPL.US",
      "last_done": "156.570",
      "prev_close": "156.800",
      "open": "155.910",
      "high": "159.790",
      "low": "155.380",
      "timestamp": 1651089600,
      "volume": 88063191,
      "turnover": "13865092584.000",
      "pre_market_quote": {
        "last_done": "155.880",
        "timestamp": 1651066201,
        "volume": 1575504,
        "turnover": "246653442.000",
        "high": "158.400",
        "low": "155.100",
        "prev_close": "156.800"
      },
      "post_market_quote": {
        "last_done": "158.770",
        "timestamp": 1651103995,
        "volume": 6188441,
        "turnover": "970874184.759",
        "high": "159.400",
        "low": "156.400",
        "prev_close": "156.570"
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
