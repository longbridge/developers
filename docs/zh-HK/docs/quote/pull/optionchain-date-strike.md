---
id: quote_optionchain_date_strike
title: 獲取標的的期權鏈到期日期權標的列表
slug: optionchain-date-strike
sidebar_position: 12
---

該接口用於獲取標的的期權鏈到期日期權標的列表。

<CliCommand>
# AAPL 2026-04-17 到期的行權價列表
longbridge option chain AAPL.US --date 2026-04-17
# TSLA 2026-04-17 到期的行權價列表
longbridge option chain TSLA.US --date 2026-04-17
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="option_chain_info_by_date" />

:::info

[業務指令](../../socket/biz-command)：`21`

:::

## Request

### Parameters

| Name        | Type   | Required | Description                                                                                         |
| ----------- | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| symbol      | string | 是       | 標的代碼，使用 `ticker.region` 格式，例如：`700.HK`                                                 |
| expiry_date | string | 是       | 期權到期日，使用 `YYMMDD` 格式，例如：`20220429`，通過 [期權到期日](./optionchain_date.md) 接口獲取 |

### Protobuf

```protobuf
message OptionChainDateStrikeInfoRequest {
  string symbol = 1;
  string expiry_date = 2;
}
```

## Response

### Response Properties

| Name              | Type     | Description        |
| ----------------- | -------- | ------------------ |
| strike_price_info | object[] | 到期日期權標的列表 |
| ∟ price           | string   | 行權價             |
| ∟ call_symbol     | string   | CALL 期權標的代碼  |
| ∟ put_symbol      | string   | PUT 期權標的代碼   |
| ∟ standard        | bool     | 是否標準期權       |

### Protobuf

```protobuf
message OptionChainDateStrikeInfoResponse {
  repeated StrikePriceInfo strike_price_info = 1;
}

message StrikePriceInfo {
  string price = 1;
  string call_symbol = 2;
  string put_symbol = 3;
  bool  standard = 4;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from datetime import date
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.option_chain_info_by_date("AAPL.US", date(2023, 1, 20))
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from datetime import date
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.option_chain_info_by_date("AAPL.US", date(2023, 1, 20))
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, NaiveDate } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => {
    console.log("Open this URL to authorize: " + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.optionChainInfoByDate("AAPL.US", new NaiveDate(2023, 1, 20))
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
            StrikePriceInfo[] resp = ctx.getOptionChainInfoByDate("AAPL.US", LocalDate.of(2023, 1, 20)).get();
            for (StrikePriceInfo o : resp) System.out.println(o);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};
use time::macros::date;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id")
        .build(|url| println!("Open this URL to authorize: {url}"))
        .await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.option_chain_info_by_date("AAPL.US", date!(2023 - 01 - 20)).await?;
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

    ctx.option_chain_info_by_date("AAPL.US", Date{2023, 1, 20}, [](auto res) {
        if (!res) {
            std::cout << "failed: " << *res.status().message() << std::endl;
            return;
        }
        for (const auto& o : *res) std::cout << o.price << std::endl;
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
	expiry := time.Date(2023, 1, 20, 0, 0, 0, 0, time.UTC)
	list, err := qctx.OptionChainInfoByDate(context.Background(), "AAPL.US", &expiry)
	if err != nil {
		log.Fatal(err)
	}
	for _, o := range list {
		fmt.Println(o.Price)
	}
}
```

  </TabItem>
</Tabs>


### Response JSON Example

```json
{
  "strike_price_info": [
    {
      "price": "100",
      "call_symbol": "AAPL220429C100000.US",
      "put_symbol": "AAPL220429P100000.US",
      "standard": true
    },
    {
      "price": "105",
      "call_symbol": "AAPL220429C105000.US",
      "put_symbol": "AAPL220429P105000.US",
      "standard": true
    },
    {
      "price": "110",
      "call_symbol": "AAPL220429C110000.US",
      "put_symbol": "AAPL220429P110000.US",
      "standard": true
    },
    {
      "price": "115",
      "call_symbol": "AAPL220429C115000.US",
      "put_symbol": "AAPL220429P115000.US",
      "standard": true
    }
  ]
}
```

## 錯誤碼

| 協議錯誤碼 | 業務錯誤碼 | 描述           | 排查建議                                    |
| ---------- | ---------- | -------------- | ------------------------------------------- |
| 3          | 301600     | 無效的請求     | 請求參數有誤或解包失敗                      |
| 3          | 301606     | 限流           | 降低請求頻次                                |
| 7          | 301602     | 服務端內部錯誤 | 請重試或聯繫技術人員處理                    |
| 7          | 301600     | 請求數據非法   | 檢查請求的 `symbol`，`expiry_date` 數據格式 |
