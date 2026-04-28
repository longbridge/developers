---
id: quote_intraday
title: Security Intraday
slug: intraday
sidebar_position: 9
---

This API is used to obtain the intraday data of security.

<CliCommand>
# minute-by-minute intraday data for Tesla
longbridge intraday TSLA.US
# minute-by-minute intraday data for Apple
longbridge intraday AAPL.US
# minute-by-minute intraday data for Tencent
longbridge intraday 700.HK
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="intraday" />

:::info

[Business Command](../../socket/biz-command): `18`

:::

## Request

### Parameters

| Name   | Type   | Required | Description                                                    |
| ------ | ------ | -------- | -------------------------------------------------------------- |
| symbol | string | Yes      | Security code, in `ticker.region` format, for example:`700.HK` |

### Protobuf

```protobuf
message SecurityIntradayRequest {
  string symbol = 1;
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

resp = ctx.intraday("700.HK")
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

    resp = await ctx.intraday("700.HK")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, TradeSessions } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.intraday('700.HK', TradeSessions.Intraday)
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
        try (OAuth oauth = new OAuthBuilder("your-client-id")
                .build(url -> System.out.println("Open to authorize: " + url))
                .get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            IntradayLine[] resp = ctx.getIntraday("700.HK", TradeSessions.Intraday).get();
            for (IntradayLine line : resp) System.out.println(line);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::{QuoteContext, TradeSessions}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open this URL to authorize: {url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.intraday("700.HK", TradeSessions::Intraday).await?;
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

    ctx.intraday("700.HK", TradeSessions::Intraday, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        std::cout << "intraday lines: " << res->size() << std::endl;
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
	lines, err := qctx.Intraday(context.Background(), "700.HK")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("intraday lines:", len(lines))
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name        | Type     | Description                           |
| ----------- | -------- | ------------------------------------- |
| symbol      | string   | Security code, for example: `AAPL.US` |
| lines       | object[] | Intraday line data                    |
| ∟ price     | string   | Close price of the minute             |
| ∟ timestamp | int64    | Start time stamp of the minute        |
| ∟ volume    | int64    | Volume                                |
| ∟ turnover  | string   | Turnover                              |
| ∟ avg_price | string   | Average price                         |

### Protobuf

```
message SecurityIntradayResponse{
  string symbol = 1;
  repeated Line lines = 2;
}

message Line {
  string price = 1;
  int64 timestamp = 2;
  int64 volume = 3;
  string turnover = 4;
  string avg_price = 5;
}
```

### Response JSON Example

```json
{
  "symbol": "700.HK",
  "lines": [
    {
      "price": "330.400",
      "timestamp": 1651023000,
      "volume": 375870,
      "turnover": "123949699.000",
      "avg_price": "329.767470"
    },
    {
      "price": "331.200",
      "timestamp": 1651023060,
      "volume": 233095,
      "turnover": "77269032.800",
      "avg_price": "330.427416"
    },
    {
      "price": "330.400",
      "timestamp": 1651023120,
      "volume": 192565,
      "turnover": "63711556.000",
      "avg_price": "330.530719"
    },
    {
      "price": "330.800",
      "timestamp": 1651023180,
      "volume": 143397,
      "turnover": "47471072.400",
      "avg_price": "330.608989"
    },
    {
      "price": "330.800",
      "timestamp": 1651023240,
      "volume": 141834,
      "turnover": "46890605.600",
      "avg_price": "330.608078"
    }
  ]
}
```

## Error Code

| Protocol Error Code | Business Error Code | Description        | Troubleshooting Suggestions                                   |
| ------------------- | ------------------- | ------------------ | ------------------------------------------------------------- |
| 3                   | 301600              | Invalid request    | Invalid request parameters or unpacking request failed        |
| 3                   | 301606              | Request rate limit | Reduce the frequency of requests                              |
| 7                   | 301602              | Server error       | Please try again or contact a technician to resolve the issue |
| 7                   | 301600              | Symbol not found   | Check that the requested `symbol` is correct                  |
| 7                   | 301603              | No quotes          | Security no quote                                             |
| 7                   | 301604              | No access          | No access to security quote                                   |
