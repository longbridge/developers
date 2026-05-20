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
        "counter_id": "ST/US/AAPL",
        "name": "蘋果公司",
        "currency": "USD",
        "market_value": "3241500000000",
        "price_close": "213.49",
        "pe": "32.15",
        "pb": "50.21",
        "ps": "8.04",
        "roe": "136.45",
        "eps": "6.43",
        "bps": "4.38",
        "dps": "0.99",
        "div_yld": "0.46",
        "assets": "371082000000",
        "history": [
          { "date": "1622520000", "pe": "37.56", "pb": "30.16", "ps": "6.41" },
          { "date": "1625112000", "pe": "41.49", "pb": "35.64", "ps": "6.60" }
        ]
      },
      {
        "counter_id": "ST/US/MSFT",
        "name": "微軟",
        "currency": "USD",
        "market_value": "3085000000000",
        "price_close": "415.32",
        "pe": "35.42",
        "pb": "12.87",
        "ps": "12.61",
        "roe": "38.21",
        "eps": "11.72",
        "bps": "32.28",
        "dps": "3.32",
        "div_yld": "0.80",
        "assets": "512163000000",
        "history": [
          { "date": "1622520000", "pe": "33.12", "pb": "11.94", "ps": "11.84" }
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
| ∟ counter_id | string | false | Counter ID（如 `ST/US/AAPL`） |
| ∟ name | string | false | 證券名稱 |
| ∟ currency | string | false | 數值所用貨幣 |
| ∟ market_value | string | false | 市值 |
| ∟ price_close | string | false | 最新收盤價 |
| ∟ pe | string | false | 市盈率（TTM） |
| ∟ pb | string | false | 市淨率 |
| ∟ ps | string | false | 市銷率（TTM） |
| ∟ roe | string | false | 淨資產收益率（%） |
| ∟ eps | string | false | 每股收益（TTM） |
| ∟ bps | string | false | 每股淨資產 |
| ∟ dps | string | false | 每股派息（TTM） |
| ∟ div_yld | string | false | 股息率（%） |
| ∟ assets | string | false | 總資產 |
| ∟ history | object[] | false | 歷史估值時間序列 |
| ∟ ∟ date | string | false | 日期（Unix 時間戳，秒） |
| ∟ ∟ pe | string | false | 歷史 PE |
| ∟ ∟ pb | string | false | 歷史 PB |
| ∟ ∟ ps | string | false | 歷史 PS |
