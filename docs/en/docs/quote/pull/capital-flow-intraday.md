---
id: quote_capital_flow_intraday
title: Security Capital Flow Intraday
slug: capital-flow-intraday
sidebar_position: 17
---

This API is used to obtain the daily capital flow intraday of security.

<CliCommand>
# intraday capital flow time series for Tesla
longbridge capital flow TSLA.US
# intraday capital flow time series for Apple
longbridge capital flow AAPL.US
# intraday capital flow time series for NVDA
longbridge capital flow NVDA.US
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="capital_flow" />

:::info
[Business Command](../../socket/biz-command)：`24`
:::

## Request

### Parameters

| Name   | Type   | Required | Description                                                     |
| ------ | ------ | -------- | --------------------------------------------------------------- |
| symbol | string | Yes      | Security code, in `ticker.region` format, for example: `700.HK` |

### Protobuf

```protobuf
message CapitalFlowIntradayRequest {
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

resp = ctx.capital_flow("700.HK")
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

    resp = await ctx.capital_flow("700.HK")
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
  const resp = await ctx.capitalFlow('700.HK')
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
            CapitalFlowLine[] resp = ctx.getCapitalFlow("700.HK").get();
            for (CapitalFlowLine line : resp) System.out.println(line);
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
    let resp = ctx.capital_flow("700.HK").await?;
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

    ctx.capital_flow("700.HK", [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        std::cout << "capital_flow lines: " << res->size() << std::endl;
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
	lines, err := qctx.CapitalFlow(context.Background(), "700.HK")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("capital_flow lines:", len(lines))
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name               | Type     | Description                    |
| ------------------ | -------- | ------------------------------ |
| symbol             | string   | Security code                  |
| capital_flow_lines | object[] | Capital flow data              |
| ∟ inflow           | string   | Inflow capital data            |
| ∟ timestamp        | int64    | Start time stamp of the minute |

### Protobuf

```protobuf
message CapitalFlowIntradayResponse {
  message CapitalFlowLine {
    string inflow = 1;
    int64 timestamp = 2;
  }
  string symbol = 1;
  repeated CapitalFlowLine capital_flow_lines = 2;
}
```

### Response JSON Example

```json
{
  "symbol": "700.HK",
  "capital_flow_lines": [
    { "inflow": "-310255860.000", "timestamp": "1655106960" },
    { "inflow": "-314011220.000", "timestamp": "1655107020" },
    { "inflow": "-314011220.000", "timestamp": "1655107080" },
    { "inflow": "-314011220.000", "timestamp": "1655107140" },
    { "inflow": "-314011220.000", "timestamp": "1655107200" }
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
