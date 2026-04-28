---
id: quote_trade_day
title: Market Trading Days
slug: trade-day
sidebar_position: 16
---

This API is used to obtain the trading days of the market.

<CliCommand>
# upcoming HK trading days
longbridge trading days HK
# upcoming US trading days
longbridge trading days US
# upcoming A-share trading days
longbridge trading days CN
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="trading_days" />

:::info

[Business Command](../../socket/biz-command): `9`

:::

## Request

### Parameters

| Name    | Type   | Required | Description                                                                                                                                                                                 |
| ------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| market  | string | Yes      | Market <br /><br />**Optional value:**<br/>`US` - US market<br/>`HK` - HK market<br/>`CN` - CN market<br/>`SG` - SG market                                                                  |
| beg_day | string | Yes      | begin day, in `YYMMDD` format, for example: `20220401`                                                                                                                                      |
| end_day | string | Yes      | begin day, in `YYMMDD` format, for example: `20220420` <br/><br/>**Check rules:**<br/> The interval cannot be greater than one month <br/> Only supports query data of the most recent year |

### Protobuf

```protobuf
message MarketTradeDayRequest {
  string market = 1;
  string beg_day = 2;
  string end_day = 3;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from datetime import date
from longbridge.openapi import QuoteContext, Config, Market, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.trading_days(Market.HK, date(2022, 1, 1), date(2022, 2, 1))
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from datetime import date
from longbridge.openapi import AsyncQuoteContext, Config, Market, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.trading_days(Market.HK, date(2022, 1, 1), date(2022, 2, 1))
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, Market, NaiveDate } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.tradingDays(Market.HK, new NaiveDate(2022, 1, 1), new NaiveDate(2022, 2, 1))
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.quote.*;
import java.time.LocalDate;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id")
                .build(url -> System.out.println("Open to authorize: " + url))
                .get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            MarketTradingDays resp = ctx.getTradingDays(Market.HK, LocalDate.of(2022, 1, 1), LocalDate.of(2022, 2, 1)).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config, Market};
use time::macros::date;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open this URL to authorize: {url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.trading_days(Market::HK, date!(2022 - 01 - 01), date!(2022 - 02 - 01)).await?;
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

    ctx.trading_days(Market::HK, Date{2022, 1, 1}, Date{2022, 2, 1}, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        std::cout << "trade_days: " << res->trade_day.size() << std::endl;
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
	"github.com/longbridge/openapi-go/quote"
	openapi "github.com/longbridge/openapi-go"
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
	begin := time.Date(2022, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2022, 2, 1, 0, 0, 0, 0, time.UTC)
	days, err := qctx.TradingDays(context.Background(), openapi.MarketHK, &begin, &end)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("trade_days:", len(days.TradeDay))
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name           | Type     | Description                           |
| -------------- | -------- | ------------------------------------- |
| trade_day      | string[] | Trading days, in `YYMMDD` format      |
| half_trade_day | string[] | Half trading days, in `YYMMDD` format |

### Protobuf

```protobuf
message MarketTradeDayResponse {
  repeated string trade_day = 1;
  repeated string half_trade_day = 2;
}
```

### Response JSON Example

```json
{
  "trade_day": [
    "20220120",
    "20220121",
    "20220124",
    "20220125",
    "20220126",
    "20220127",
    "20220128",
    "20220204",
    "20220207",
    "20220208",
    "20220209",
    "20220210"
  ],
  "half_trade_day": ["20220131"]
}
```

## Error Code

| Protocol Error Code | Business Error Code | Description                | Troubleshooting Suggestions                                        |
| ------------------- | ------------------- | -------------------------- | ------------------------------------------------------------------ |
| 3                   | 301600              | Invalid request            | Invalid request parameters or unpacking request failed             |
| 3                   | 301606              | Request rate limit         | Reduce the frequency of requests                                   |
| 7                   | 301602              | Server error               | Please try again or contact a technician to resolve the issue      |
| 7                   | 301600              | Invalue request parameters | Please check the request parameter: `market`, `beg_day`, `end_day` |
