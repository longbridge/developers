---
slug: valuation-comparison
title: 多股估值對比
sidebar_position: 29
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

對比多隻股票的估值指標（PE/PB/PS/市值/收盤價）。不傳對比股票時，服務端自動選取同行業標的。

<CliCommand>
longbridge compare AAPL.US
longbridge compare AAPL.US MSFT.US GOOGL.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="valuation_comparison" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 主標的證券代碼，例如 `AAPL.US` |
| currency | string | 是 | 結果貨幣：`USD`、`HKD`、`CNY` |
| comparison_symbols | string[] | 否 | 對比股票代碼列表；不傳時服務端自動選取同行業標的 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

# 自動選取同行業對比
resp = ctx.valuation_comparison("AAPL.US", "USD")
# 指定對比標的
resp = ctx.valuation_comparison("AAPL.US", "USD", ["MSFT.US", "GOOGL.US"])
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncFundamentalContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncFundamentalContext.create(config)

    resp = await ctx.valuation_comparison("AAPL.US", "USD", ["MSFT.US", "GOOGL.US"])
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.valuationComparison('AAPL.US', 'USD', ['MSFT.US', 'GOOGL.US'])
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.fundamental.*;
import java.util.Arrays;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             FundamentalContext ctx = FundamentalContext.create(config)) {
            var resp = ctx.getValuationComparison("AAPL.US", "USD", Arrays.asList("MSFT.US", "GOOGL.US")).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, fundamental::FundamentalContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.valuation_comparison("AAPL.US", "USD", Some(vec!["MSFT.US", "GOOGL.US"])).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

using namespace longbridge;
using namespace longbridge::fundamental;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            FundamentalContext ctx = FundamentalContext::create(config);
            ctx.valuation_comparison("AAPL.US", "USD", {"MSFT.US", "GOOGL.US"}, [](auto resp) {
                if (resp) std::cout << "OK" << std::endl;
            });
        });
    std::cin.get();
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
	"github.com/longbridge/openapi-go/fundamental"
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
	c, err := fundamental.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.ValuationComparison(context.Background(), "AAPL.US", "USD", []string{"MSFT.US", "GOOGL.US"})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response


### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "symbol": "AAPL.US",
        "name": "蘋果公司",
        "market_value": "3241500000000",
        "price_close": "213.49",
        "pe": "32.15",
        "pb": "50.21",
        "ps": "8.04",
        "history": [
          { "date": "2026-05-01", "pe": "32.15", "pb": "50.21", "ps": "8.04" },
          { "date": "2026-04-01", "pe": "28.73", "pb": "46.88", "ps": "7.52" }
        ]
      },
      {
        "symbol": "MSFT.US",
        "name": "微軟",
        "market_value": "3085000000000",
        "price_close": "415.32",
        "pe": "35.42",
        "pb": "12.87",
        "ps": "12.61",
        "history": [
          { "date": "2026-05-01", "pe": "35.42", "pb": "12.87", "ps": "12.61" },
          { "date": "2026-04-01", "pe": "33.10", "pb": "12.01", "ps": "11.94" }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [ValuationComparisonResponse](#ValuationComparisonResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### ValuationComparisonResponse

<a id="ValuationComparisonResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| list | object[] | false | 股票估值對比列表 |
| ∟ symbol | string | false | 證券代碼 |
| ∟ name | string | false | 證券名稱 |
| ∟ market_value | string | false | 市值（結果貨幣） |
| ∟ price_close | string | false | 最新收盤價 |
| ∟ pe | string | false | 市盈率（TTM） |
| ∟ pb | string | false | 市淨率 |
| ∟ ps | string | false | 市銷率（TTM） |
| ∟ history | object[] | false | 歷史估值時間序列 |
| ∟ ∟ date | string | false | 日期，格式 `YYYY-MM-DD` |
| ∟ ∟ pe | string | false | 歷史 PE |
| ∟ ∟ pb | string | false | 歷史 PB |
| ∟ ∟ ps | string | false | 歷史 PS |
