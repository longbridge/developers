---
title: Historical Market Temperature
slug: history_market_temperature
sidebar_position: 22
---

This interface is used to get historical market temperature.

<CliCommand>
# HK temperature Q1 2025
longbridge market-temp HK --history --start 2025-01-01 --end 2025-03-31
# US temperature Jan 2025
longbridge market-temp US --history --start 2025-01-01 --end 2025-01-31
# CN A-share temperature H1 2025
longbridge market-temp CN --history --start 2025-01-01 --end 2025-06-30
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="history_market_temperature" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/quote/history_market_temperature</td></tr>
</tbody>
</table>

### Parameters

| Name       | Type   | Required | Description                                 |
| ---------- | ------ | -------- | ------------------------------------------- |
| market     | string | YES      | Market, currently supports US, HK, SG, CN   |
| start_date | string | YES      | Start date, minimum to 2016, e.g.: 20240101 |
| end_date   | string | YES      | End date, e.g.: 20250101                    |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
import datetime
from longbridge.openapi import QuoteContext, Config, Market, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
resp = ctx.history_market_temperature(Market.US, datetime.date(2024, 1, 1), datetime.date(2025, 1, 1))
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
import datetime
from longbridge.openapi import AsyncQuoteContext, Config, Market, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)
    resp = await ctx.history_market_temperature(Market.US, datetime.date(2024, 1, 1), datetime.date(2025, 1, 1))
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
  const resp = await ctx.historyMarketTemperature(Market.US, new NaiveDate(2024, 1, 1), new NaiveDate(2024, 1, 31))
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
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            HistoryMarketTemperatureResponse resp = ctx.getHistoryMarketTemperature(Market.US, LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 31)).get();
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.history_market_temperature(Market::US, date!(2024 - 01 - 01), date!(2024 - 01 - 31)).await?;
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

    ctx.history_market_temperature(Market::US, Date{2024, 1, 1}, Date{2024, 1, 31}, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "records: " << res->records.size() << std::endl;
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
	// History market temperature: use HTTP client for GET /v1/quote/history-market-temperature
	_ = qctx
	fmt.Println("See openapi-go for HTTP quote APIs")
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
    "type": "month"
    "list": [
      {
        "timestamp": 1580486400,
        "temperature": 36,
        "valuation": 12,
        "sentiment": 46
      },
      {
        "timestamp": 1582992000,
        "temperature": 36,
        "valuation": 12,
        "sentiment": 46
      }
    ]
  }
}
```

#### Response Status

| Status | Description     | Schema                                                                   |
| ------ | --------------- | ------------------------------------------------------------------------ |
| 200    | Success         | [HistoryMarketTemperatureResponse](#history_market_temperature_response) |
| 400    | Parameter Error | None                                                                     |

<aside className="success">
</aside>

## Schemas

### HistoryMarketTemperatureResponse

<a id="history_market_temperature_response"></a>

| Name         | Type     | Required | Description                                                     |
| ------------ | -------- | -------- | --------------------------------------------------------------- |
| list         | object[] | true     | List                                                            |
| ∟timestamp   | integer  | true     | Timestamp                                                       |
| ∟temperature | integer  | true     | Temperature                                                     |
| ∟valuation   | integer  | true     | Valuation                                                       |
| ∟sentiment   | integer  | true     | Sentiment                                                       |
| type         | string   | true     | Data granularity <br />day: daily; week: weekly; month: monthly |

## Error Codes

| Business Error Code | Description           | Troubleshooting Suggestions               |
| ------------------- | --------------------- | ----------------------------------------- |
| 2601500             | Server Internal Error | Please retry or contact technical support |
