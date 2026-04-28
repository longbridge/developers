---
id: quote_candlestick
title: Security Candlesticks
slug: candlestick
sidebar_position: 20
---

This API is used to obtain the candlestick data of security.

:::info
Note: This interface can only retrieve the last 1000 candlesticks. To obtain longer historical data, please visit the interface: Get Security History Candlesticks.
:::

<CliCommand>
# daily candlestick for Tesla (last 100 bars)
longbridge kline TSLA.US
# weekly candlestick for Apple
longbridge kline AAPL.US --period week
# last 20 daily bars for NVDA
longbridge kline NVDA.US --period day --count 20
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="candlesticks" />

:::info

[Business Command](../../socket/biz-command): `19`

:::

## Request

### Parameters

| Name          | Type   | Required | Description                                                                                                                                                                               |
| ------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol        | string | Yes      | Security code, in `ticker.region` format, for example:`700.HK`                                                                                                                            |
| period        | int32  | Yes      | Candlestick period, for example: `1000`, see [Period](../objects#period---candlestick-period)                                                                                             |
| count         | int32  | Yes      | Count of cancdlestick, for example: `100`<br /><br />**Check rules:** <br />maximum count is `1000`                                                                                       |
| adjust_type   | int32  | Yes      | Adjustment type, for example: `0`, see [AdjustType](../objects#adjusttype---candlestick-adjustment-type)                                                                                  |
| trade_session | int32  | No       | Trading session, 0: intraday, 100: All (pre, intraday, post, overnight)<br/><br/>Note: Overnight data requires purchasing the "LV1 Real-time Quote (OpenAPI)" quote card. US stocks only. |

### Protobuf

```protobuf
message SecurityCandlestickRequest {
  string symbol = 1;
  Period period = 2;
  int32 count = 3;
  AdjustType adjust_type = 4;
  int32 trade_session = 5;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, Period, AdjustType, TradeSessions, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

# Get intraday candlestick data for 700.HK
resp = ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust)
print(resp)

# Get all candlestick data for 700.HK
resp = ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust, trade_session=TradeSessions.All)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, Period, AdjustType, TradeSessions, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    # Get intraday candlestick data for 700.HK
    resp = await ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust)
    print(resp)

    # Get all candlestick data for 700.HK
    resp = await ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust, trade_session=TradeSessions.All)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, Period, AdjustType, TradeSessions } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.candlesticks('700.HK', Period.Day, 10, AdjustType.NoAdjust, TradeSessions.Intraday)
  console.log(resp)
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
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            Candlestick[] resp = ctx.getCandlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust, TradeSessions.Intraday).get();
            for (Candlestick c : resp) System.out.println(c);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config, quote::{Period, AdjustType, TradeSessions}};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.candlesticks("700.HK", Period::Day, 10, AdjustType::NoAdjust, TradeSessions::Intraday).await?;
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

    ctx.candlesticks("700.HK", Period::Day, 10, AdjustType::NoAdjust, TradeSessions::Intraday, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "candlesticks: " << res->size() << std::endl;
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
	sticks, err := qctx.Candlesticks(context.Background(), "700.HK", quote.PeriodDay, 10, quote.AdjustTypeNo)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("candlesticks:", len(sticks))
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name            | Type     | Description                                                                  |
| --------------- | -------- | ---------------------------------------------------------------------------- |
| symbol          | string   | Security code, for example: `AAPL.US`                                        |
| candlesticks    | object[] | Candlestick data                                                             |
| ∟ close         | string   | Close price                                                                  |
| ∟ open          | string   | Open price                                                                   |
| ∟ low           | string   | Low price                                                                    |
| ∟ high          | string   | High price                                                                   |
| ∟ volume        | int64    | Volume                                                                       |
| ∟ turnover      | string   | Turnover                                                                     |
| ∟ timestamp     | int64    | Timestamp                                                                    |
| ∟ trade_session | int32    | Trade session, see [TradeSession](../objects#tradesession---trading-session) |

### Protobuf

```protobuf
message SecurityCandlestickResponse {
  string symbol = 1;
  repeated Candlestick candlesticks = 2;
}

message Candlestick {
  string close = 1;
  string open = 2;
  string low = 3;
  string high = 4;
  int64 volume = 5;
  string turnover = 6;
  int64 timestamp = 7;
}
```

### Response JSON Example

```json
{
  "symbol": "700.HK",
  "candlesticks": [
    {
      "close": "362.000",
      "open": "364.600",
      "low": "361.600",
      "high": "368.800",
      "volume": 10853604,
      "turnover": "3954556819.000",
      "timestamp": 1650384000
    },
    {
      "close": "348.000",
      "open": "352.000",
      "low": "343.000",
      "high": "356.200",
      "volume": 25738562,
      "turnover": "8981529950.000",
      "timestamp": 1650470400
    },
    {
      "close": "340.600",
      "open": "334.800",
      "low": "334.200",
      "high": "343.000",
      "volume": 28031299,
      "turnover": "9492674293.000",
      "timestamp": 1650556800
    },
    {
      "close": "327.400",
      "open": "332.200",
      "low": "325.200",
      "high": "338.600",
      "volume": 25788422,
      "turnover": "8541441823.000",
      "timestamp": 1650816000
    },
    {
      "close": "335.800",
      "open": "332.200",
      "low": "330.600",
      "high": "341.600",
      "volume": 27288328,
      "turnover": "9166022626.000",
      "timestamp": 1650902400
    }
  ]
}
```

## Error Code

| Protocol Error Code | Business Error Code | Description                    | Troubleshooting Suggestions                                                    |
| ------------------- | ------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| 3                   | 301600              | Invalid request                | Invalid request parameters or unpacking request failed                         |
| 3                   | 301606              | Request rate limit             | Reduce the frequency of requests                                               |
| 7                   | 301602              | Server error                   | Please try again or contact a technician to resolve the issue                  |
| 7                   | 301600              | Invalue request parameters     | Please check the request parameter: `symbol`, `count`, `adjust_type`, `period` |
| 7                   | 301603              | No quotes                      | Security no quote                                                              |
| 7                   | 301604              | No access                      | No access to security quote                                                    |
| 7                   | 301607              | Too many candlesticks requeted | Reduce the amount of candlestick in each request                               |
