---
id: quote_static
title: 獲取標的基礎信息
slug: static
sidebar_position: 1
---

該接口用於獲取標的的基礎信息。

<CliCommand>
# Tesla 靜態資訊（名稱、手數、股本等）
longbridge static TSLA.US
# 多隻美股靜態資訊
longbridge static AAPL.US NVDA.US
# 美港股混合查詢
longbridge static TSLA.US 700.HK
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="static_info" />

:::info
[業務指令](../../socket/biz-command)：`10`
:::

## Request

### Parameters

| Name   | Type     | Required | Description                                                                                                                         |
| ------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| symbol | string[] | 是       | 標的代碼列表，使用 `ticker.region` 格式，例如：`[700.HK]` <br /><br />**校驗規則：**<br />每次請求支持傳入的標的數量上限是 `500` 個 |

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
  const oauth = await OAuth.build("your-client-id", (_, url) => {
    console.log("Open this URL to authorize: " + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.staticInfo(["700.HK", "AAPL.US", "TSLA.US", "NFLX.US"])
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

| Name                 | Type     | Description                                                                                      |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| secu_static_info     | object[] | 標的基礎數據列表                                                                                 |
| ∟ symbol             | string   | 標的代碼                                                                                         |
| ∟ name_cn            | string   | 中文簡體標的名稱                                                                                 |
| ∟ name_en            | string   | 英文標的名稱                                                                                     |
| ∟ name_hk            | string   | 中文繁體標的名稱                                                                                 |
| ∟ exchange           | string   | 標的所屬交易所                                                                                   |
| ∟ currency           | string   | 交易幣種 <br /><br />**可選值：**<br />`CNY` <br />`USD` <br />`SGD` <br />`HKD`                 |
| ∟ lot_size           | int32    | 每手股數                                                                                         |
| ∟ total_shares       | int64    | 總股本                                                                                           |
| ∟ circulating_shares | int64    | 流通股本                                                                                         |
| ∟ hk_shares          | int64    | 港股股本 (僅港股)                                                                                |
| ∟ eps                | string   | 每股盈利                                                                                         |
| ∟ eps_ttm            | string   | 每股盈利 (TTM)                                                                                   |
| ∟ bps                | string   | 每股淨資產                                                                                       |
| ∟ dividend_yield     | string   | 股息                                                                                             |
| ∟ stock_derivatives  | int32[]  | 如果標的是正股，可提供的衍生品行情類型 <br /><br />**可選值：**<br />`1` - 期權 <br />`2` - 輪證 |
| ∟ board              | string   | 標的所屬板塊，詳見 [Board](../objects#board---標的板塊)                                          |

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

## 錯誤碼

| 協議錯誤碼 | 業務錯誤碼 | 描述           | 排查建議                                   |
| ---------- | ---------- | -------------- | ------------------------------------------ |
| 3          | 301600     | 無效的請求     | 請求參數有誤或解包失敗                     |
| 3          | 301606     | 限流           | 降低請求頻次                               |
| 7          | 301602     | 服務端內部錯誤 | 請重試或聯繫技術人員處理                   |
| 7          | 301607     | 接口限制       | 請求的標的數量超限，請減少單次請求標的數量 |
