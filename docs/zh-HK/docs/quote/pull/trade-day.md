---
id: quote_trade_day
title: 獲取市場交易日
slug: trade-day
sidebar_position: 16
---

該接口用於獲取市場的交易日信息。

<CliCommand>
# 港股未來交易日
longbridge trading days HK
# 美股未來交易日
longbridge trading days US
# A 股未來交易日
longbridge trading days CN
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="trading_days" />

:::info

[業務指令](../../socket/biz-command)：`9`

:::

## Request

### Parameters

| Name    | Type   | Required | Description                                                                                                                                              |
| ------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| market  | string | 是       | 市場 <br /><br />**可選值：**<br/>`US` - 美股市場<br/>`HK` - 港股市場<br/>`CN` - A 股市場<br/>`SG` - 新加坡市場                                          |
| beg_day | string | 是       | 開始時間，使用 `YYMMDD` 格式，例如：`20220401`                                                                                                           |
| end_day | string | 是       | 結束時間，使用 `YYMMDD` 格式，例如：`20220420` <br/><br/>**校驗規則：**<br/> `開始時間` 和 `結束時間`，間隔不能大於一個月 <br/> 僅支持查詢最近一年的數據 |

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
  const oauth = await OAuth.build("your-client-id", (_, url) => {
    console.log("Open this URL to authorize: " + url)
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

| Name           | Type     | Description                |
| -------------- | -------- | -------------------------- |
| trade_day      | string[] | 交易日，使用 `YYMMDD` 格式 |
| half_trade_day | string[] | 半日市，使用 `YYMMDD` 格式 |

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

## 錯誤碼

| 協議錯誤碼 | 業務錯誤碼 | 描述           | 排查建議                             |
| ---------- | ---------- | -------------- | ------------------------------------ |
| 3          | 301600     | 無效的請求     | 請求參數有誤或解包失敗               |
| 3          | 301606     | 限流           | 降低請求頻次                         |
| 7          | 301602     | 服務端內部錯誤 | 請重試或聯繫技術人員處理             |
| 7          | 301600     | 請求數據非法   | 檢查請求的市場，日期是否在正確範圍內 |
