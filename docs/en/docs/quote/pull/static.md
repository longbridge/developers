---
id: quote_static
title: Basic Information of Securities
slug: static
sidebar_position: 1
---

This API is used to obtain the basic information of securities.

<CliCommand>
# static info for Tesla (name, lot size, shares, etc.)
longbridge static TSLA.US
# static info for multiple US stocks
longbridge static AAPL.US NVDA.US
# static info for US and HK stocks
longbridge static TSLA.US 700.HK
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="static_info" />

:::info
[Business Command](../../socket/biz-command): `10`
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

resp = ctx.static_info(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"])
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

    resp = await ctx.static_info(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"])
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
  const resp = await ctx.staticInfo(['700.HK', 'AAPL.US', 'TSLA.US', 'NFLX.US'])
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
            SecurityStaticInfo[] resp = ctx.getStaticInfo(new String[] { "700.HK", "AAPL.US", "TSLA.US", "NFLX.US" }).get();
            for (SecurityStaticInfo obj : resp) {
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
    let resp = ctx.static_info(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"]).await?;
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
    ctx.static_info(symbols, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        for (const auto& obj : *res) {
            std::cout << obj.symbol << " " << obj.name_cn << " " << obj.name_en << std::endl;
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
	infos, err := qctx.StaticInfo(context.Background(), []string{"700.HK", "AAPL.US", "TSLA.US", "NFLX.US"})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", infos[0])
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name                 | Type     | Description                                                                                          |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| secu_static_info     | object[] | Securities Basic Information                                                                         |
| ∟ symbol             | string   | Security code                                                                                        |
| ∟ name_cn            | string   | Security name (zh-CN)                                                                                |
| ∟ name_en            | string   | Security name (en)                                                                                   |
| ∟ name_hk            | string   | Security name (zh-HK)                                                                                |
| ∟ exchange           | string   | Exchange which the security belongs to                                                               |
| ∟ currency           | string   | Trading currency <br /><br />**Optional value: **<br />`CNY` <br />`USD` <br />`SGD` <br />`HKD`     |
| ∟ lot_size           | int32    | Lot size                                                                                             |
| ∟ total_shares       | int64    | Total shares                                                                                         |
| ∟ circulating_shares | int64    | Circulating shares                                                                                   |
| ∟ hk_shares          | int64    | HK shares (only HK stocks)                                                                           |
| ∟ eps                | string   | Earnings per share                                                                                   |
| ∟ eps_ttm            | string   | Earnings per share (TTM)                                                                             |
| ∟ bps                | string   | Net assets per share                                                                                 |
| ∟ dividend_yield     | string   | Dividend yield                                                                                       |
| ∟ stock_derivatives  | int32[]  | Types of supported derivatives <br /><br />**Optional value:**<br />`1` - Option <br />`2` - Warrant |
| ∟ board              | string   | The board to whitch the security belongs, see [Board](../objects#board---security-board) for details |

### Protobuf

```protobuf
message SecurityStaticInfoResponse {
  repeated StaticInfo secu_static_info = 1;
}

message StaticInfo {
  string symbol = 1;
  string name_cn = 2;
  string name_en = 3;
  string name_hk = 4;
  string listing_date = 5;
  string exchange = 6;
  string currency = 7;
  int32 lot_size = 8;
  int64 total_shares = 9;
  int64 circulating_shares = 10;
  int64 hk_shares = 11;
  string eps = 12;
  string eps_ttm = 13;
  string bps = 14;
  string dividend_yield = 15;
  repeated int32 stock_derivatives = 16;
  string board = 17;
}
```

### Response JSON Example

```json
{
  "secu_static_info": [
    {
      "symbol": "700.HK",
      "name_cn": "腾讯控股",
      "name_en": "TENCENT",
      "name_hk": "騰訊控股",
      "exchange": "SEHK",
      "currency": "HKD",
      "lot_size": 100,
      "total_shares": 9612464038,
      "circulating_shares": 9612464038,
      "hk_shares": 9612464038,
      "eps": "28.4394",
      "eps_ttm": "28.4394",
      "bps": "103.40413",
      "dividend_yield": "1.6",
      "stock_derivatives": [2],
      "board": "HKEquity"
    },
    {
      "symbol": "AAPL.US",
      "name_cn": "苹果",
      "name_en": "Apple Inc.",
      "exchange": "NASD",
      "currency": "USD",
      "lot_size": 1,
      "total_shares": 1631944100,
      "circulating_shares": 16302661350,
      "eps": "5.669",
      "eps_ttm": "6.0771",
      "bps": "4.40197",
      "dividend_yield": "0.85",
      "stock_derivatives": [1],
      "board": "USMain"
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
