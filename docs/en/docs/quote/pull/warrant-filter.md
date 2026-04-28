---
id: quote_warrant_filter
title: Warrant Filter
slug: warrant-filter
sidebar_position: 14
---

This API is used to obtain the quotes of HK warrants, and supports sorting and filtering.

<CliCommand>
# list warrants linked to Tencent
longbridge warrant list 700.HK
# list warrants linked to Alibaba
longbridge warrant list 9988.HK
# list warrants linked to JD.com
longbridge warrant list 9618.HK
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="warrant_list" />

:::info

[Business Command](../../socket/biz-command): `23`

:::

## Request

### Parameters

| Name          | Type    | Required | Description                                                                                                                                                                         |
| ------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol        | string  | Yes      | Security code, in `ticker.region` format, for example:`700.HK`                                                                                                                      |
| filter_config | object  | Yes      | Filter conditions                                                                                                                                                                   |
| ∟ sort_by     | int32   | Yes      | Which data to sort by, for example: `0`, see the `OrderSequence` field of the response data for the sequence number.                                                                |
| ∟ sort_order  | int32   | Yes      | Order, for example: `1` <br /><br />**Optional value:**<br />`0` - Ascending<br />`1` - Descending                                                                                  |
| ∟ sort_offset | int32   | Yes      | The first data offset of paging, for example: `0`                                                                                                                                   |
| ∟ sort_count  | int32   | Yes      | Number of paginated pages per page, for example: `20`, no pagination when filling in `0`                                                                                            |
| ∟ type        | int32[] | No       | Filter warrant type, for example: `[0,1]` <br /><br />**Optional value:**<br />`0` - Call<br />`1` - Put<br />`2` - Bull<br />`3` - Bear<br />`4` - Inline                          |
| ∟ issuer      | int32[] | No       | Filter issuer example: `[12,14]`, obtain [Issuer ID](./issuer) through API                                                                                                          |
| ∟ expiry_date | int32[] | No       | Filter expiry date, example: `[1]` <br /><br />**Optional value:**<br />`1` - Less than 3 months<br />`2` - 3 - 6 months<br />`3` - 6 - 12 months<br />`4` - greater than 12 months |
| ∟ price_type  | int32[] | No       | Filter in/out of bounds, for example: `[2]` <br /><br />**Optional value:**<br />`1` - In bounds<br />`2` - Out bounds                                                              |
| ∟ status      | int32[] | No       | Filter status, for example: `[2]` <br /><br />**Optional value:**<br />`2`- Suspend trading<br />`3` - Papare List<br />`4` - Normal                                                |
| language      | int32   | Yes      | Language, for example: `[1]` <br /><br />**Optional value:**<br />`0` - zh-CN<br />`1` - en<br />`2` - zh-HK                                                                        |

### Protobuf

```protobuf
message WarrantFilterListRequest {
  string symbol = 1;
  FilterConfig filter_config = 2;
  int32 language = 3;
}

message FilterConfig {
  int32 sort_by = 1;
  int32 sort_order = 2;
  int32 sort_offset = 3;
  int32 sort_count = 4;
  repeated int32 type = 5;
  repeated int32 issuer = 6;
  repeated int32 expiry_date = 7;
  repeated int32 price_type = 8;
  repeated int32 status = 9;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, WarrantSortBy, SortOrderType, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.warrant_list("700.HK", WarrantSortBy.LastDone, SortOrderType.Ascending)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, WarrantSortBy, SortOrderType, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.warrant_list("700.HK", WarrantSortBy.LastDone, SortOrderType.Ascending)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, WarrantSortBy, SortOrderType } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.warrantList('700.HK', WarrantSortBy.LastDone, SortOrderType.Ascending)
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
            WarrantInfo[] resp = ctx.queryWarrantList(new QueryWarrantOptions("700.HK", WarrantSortBy.LastDone, SortOrderType.Ascending)).get();
            for (WarrantInfo w : resp) System.out.println(w);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::{QuoteContext, WarrantSortBy, SortOrderType}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.warrant_list("700.HK", WarrantSortBy::LastDone, SortOrderType::Ascending, None, None, None, None, None).await?;
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

    ctx.warrant_list("700.HK", WarrantSortBy::Turnover, SortOrderType::Descending, {}, {}, {}, {}, {}, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "warrants: " << res->size() << std::endl;
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
	list, err := qctx.WarrantList(context.Background(), "700.HK", quote.WarrantFilter{
		SortBy: quote.WarrantVolume, SortOrder: quote.WarrantDesc, SortOffset: 0, SortCount: 10,
	}, quote.WarrantEN)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("warrants:", len(list))
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name                 | Type     | Description                                                                                                | OrderSequence | Support_Call/Put | Support_Bull/Bear | Support_Inline |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------- | ------------- | ---------------- | ----------------- | -------------- |
| warrant_list         | object[] | Filted warrant data list                                                                                   |               |                  |                   |                |
| ∟ symbol             | string   | Security code                                                                                              |               | true             | true              | true           |
| ∟ name               | string   | Security name                                                                                              |               | true             | true              | true           |
| ∟ last_done          | string   | Latest price                                                                                               | 0             | true             | true              | true           |
| ∟ change_rate        | string   | Quote change rate                                                                                          | 1             | true             | true              | true           |
| ∟ change_val         | string   | Quote change                                                                                               | 2             | true             | true              | true           |
| ∟ volume             | int64    | Volume                                                                                                     | 3             | true             | true              | true           |
| ∟ turnover           | string   | Turnover                                                                                                   | 4             | true             | true              | true           |
| ∟ expiry_date        | string   | Expiry date, in `YYMMDD` format                                                                            | 5             | true             | true              | true           |
| ∟ strike_price       | string   | Strike price                                                                                               | 6             | true             | true              | false          |
| ∟ upper_strike_price | string   | Upper bound price                                                                                          | 7             | false            | false             | true           |
| ∟ lower_strike_price | string   | Lower bound price                                                                                          | 8             | false            | false             | true           |
| ∟ outstanding_qty    | string   | Outstanding quantity                                                                                       | 9             | true             | true              | true           |
| ∟ outstanding_ratio  | string   | Outstanding ratio                                                                                          | 10            | true             | true              | true           |
| ∟ premium            | string   | Premium                                                                                                    | 11            | true             | true              | true           |
| ∟ itm_otm            | string   | In/out of the bound                                                                                        | 12            | true             | true              | false          |
| ∟ implied_volatility | string   | Implied volatility                                                                                         | 13            | true             | false             | false          |
| ∟ delta              | string   | Greek value Delta                                                                                          | 14            | true             | false             | false          |
| ∟ call_price         | string   | Call price                                                                                                 | 15            | false            | true              | false          |
| ∟ to_call_price      | string   | Price interval from the call price                                                                         | 16            | false            | true              | false          |
| ∟ effective_leverage | string   | Effective leverage                                                                                         | 17            | true             | false             | false          |
| ∟ leverage_ratio     | string   | Leverage ratio                                                                                             | 18            | true             | true              | true           |
| ∟ conversion_ratio   | string   | Conversion ratio                                                                                           | 19            | true             | true              | false          |
| ∟ balance_point      | string   | Breakeven point                                                                                            | 20            | true             | true              | false          |
| ∟ status             | int32    | Status, <br /><br />**Optional value:**<br />`2`- Suspend trading<br />`3` - Papare List<br />`4` - Normal | 21            | true             | true              | true           |
| total_count          | int32    | Total number of eligible                                                                                   |               |                  |                   |                |

### Protobuf

```protobuf
message WarrantFilterListResponse {
  repeated FilterWarrant warrant_list = 1;
  int32 total_count = 2;
}

message FilterWarrant {
  string symbol = 1;
  string name = 2;
  string last_done = 3;
  string change_rate = 4;
  string change_val = 5;
  int64 volume = 6;
  string turnover = 7;
  string expiry_date = 8;
  string strike_price = 9;
  string upper_strike_price = 10;
  string lower_strike_price = 11;
  string outstanding_qty = 12;
  string outstanding_ratio = 13;
  string premium = 14;
  string itm_otm = 15;
  string implied_volatility = 16;
  string delta = 17;
  string call_price = 18;
  string to_call_price = 19;
  string effective_leverage = 20;
  string leverage_ratio = 21;
  string conversion_ratio = 22;
  string balance_point = 23;
  int32 status = 24;
}
```

### Response JSON Example

```json
{
  "warrant_list": [
    {
      "symbol": "13157.HK",
      "name": "MBTENCT@EP2207A",
      "last_done": "2.26",
      "change_rate": "-0.0216450216450218",
      "change_val": "-0.050000000000000266",
      "turnover": "0",
      "expiry_date": "20220705",
      "strike_price": "442.233",
      "upper_strike_price": "0",
      "lower_strike_price": "0",
      "outstanding_qty": "5000",
      "outstanding_ratio": "0.0003",
      "premium": "0.016784269662921222",
      "itm_otm": "0.23524476916014864",
      "implied_volatility": "0.5275",
      "delta": "-0.8524",
      "call_price": "0",
      "effective_leverage": "-2.627683451852457",
      "leverage_ratio": "3.0826882353970637",
      "conversion_ratio": "48.544",
      "balance_point": "332.52356000000003",
      "status": 4
    },
    {
      "symbol": "13649.HK",
      "name": "MBTENCT@EP2205A",
      "last_done": "1.14",
      "change_rate": "0",
      "change_val": "0",
      "turnover": "0",
      "expiry_date": "20220518",
      "strike_price": "445.223",
      "upper_strike_price": "0",
      "lower_strike_price": "0",
      "outstanding_qty": "80000",
      "outstanding_ratio": "0.0004",
      "premium": "0.010810703725606",
      "itm_otm": "0.24038066317328624",
      "implied_volatility": "0.5997",
      "delta": "-0.7964",
      "call_price": "0",
      "effective_leverage": "-2.4335424241487873",
      "leverage_ratio": "3.055678583813144",
      "conversion_ratio": "97.087",
      "balance_point": "334.54382000000004",
      "status": 4
    }
  ],
  "total_count": 1197
}
```

## Error Code

| Protocol Error Code | Business Error Code | Description                  | Troubleshooting Suggestions                                   |
| ------------------- | ------------------- | ---------------------------- | ------------------------------------------------------------- |
| 3                   | 301600              | Invalid request              | Invalid request parameters or unpacking request failed        |
| 3                   | 301606              | Request rate limit           | Reduce the frequency of requests                              |
| 7                   | 301602              | Server error                 | Please try again or contact a technician to resolve the issue |
| 7                   | 301600              | Symbol not found             | Check that the requested `symbol` is correct                  |
| 7                   | 301603              | No quotes                    | Security no quote                                             |
| 7                   | 301604              | No access                    | No access to security quote                                   |
| 7                   | 301607              | Too many symbols in one page | Reduce the number of symbols in a page of request             |
