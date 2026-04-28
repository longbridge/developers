---
id: quote_option_quote
title: 獲取期權實時行情
slug: option-quote
sidebar_position: 3
---

該接口用於獲取美股期權標的的實時行情，包括期權的特有數據。

<CliCommand>
# AAPL 認購期權 $250 行權價 2026-04-17 到期
longbridge option quote AAPL260417C250000.US
# TSLA 認沽期權 $350 行權價 2026-04-18 到期
longbridge option quote TSLA260418P350000.US
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="option_quote" />

:::info
[業務指令](../../socket/biz-command)：`12`
:::

## Request

### Parameters

| Name   | Type     | Required | Description                                                                                                                                                                                  |
| ------ | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol | string[] | 是       | 標的代碼列表，通過[期權鏈接口](./optionchain-date-strike.md) 獲取期權標的的 symbol，例如：`[BABA230120C160000.US]` <br /><br />**校驗規則：**<br />每次請求支持傳入的標的數量上限是 `500` 個 |

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

resp = ctx.option_quote(["AAPL230317P160000.US"])
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

    resp = await ctx.option_quote(["AAPL230317P160000.US"])
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.optionQuote(["AAPL230317C160000.US"])
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
            OptionQuote[] resp = ctx.getOptionQuote(new String[] { "AAPL230317C160000.US" }).get();
            for (OptionQuote q : resp) System.out.println(q);
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.option_quote(["AAPL230317C160000.US"]).await?;
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

    ctx.option_quote(symbols, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        for (const auto& q : *res) std::cout << q.symbol << std::endl;
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
	quotes, err := qctx.OptionQuote(context.Background(), []string{"AAPL230317C160000.US"})
	if err != nil {
		log.Fatal(err)
	}
	for _, q := range quotes {
		fmt.Println(q.Symbol, q.LastDone)
	}
}
```

  </TabItem>
</Tabs>


## Response

### Response Properties

| Name                     | Type     | Description                                                         |
| ------------------------ | -------- | ------------------------------------------------------------------- |
| secu_quote               | object[] | 期權標的行情數據列表                                                |
| ∟ symbol                 | string   | 標的代碼                                                            |
| ∟ last_done              | string   | 最新價                                                              |
| ∟ prev_close             | string   | 昨收價                                                              |
| ∟ open                   | string   | 開盤價                                                              |
| ∟ high                   | string   | 最高價                                                              |
| ∟ low                    | string   | 最低價                                                              |
| ∟ timestamp              | int64    | 最新成交的時間戳                                                    |
| ∟ volume                 | int64    | 成交量                                                              |
| ∟ turnover               | string   | 成交額                                                              |
| ∟ trade_status           | int32    | 標的交易狀態，詳見 [TradeStatus](../objects#tradestatus---交易狀態) |
| ∟ option_extend          | object   | 期權擴展行情                                                        |
| ∟∟ implied_volatility    | string   | 隱含波動率                                                          |
| ∟∟ open_interest         | int64    | 未平倉數                                                            |
| ∟∟ expiry_date           | string   | 到期日，使用：`YYMMDD` 格式                                         |
| ∟∟ strike_price          | string   | 行權價                                                              |
| ∟∟ contract_multiplier   | string   | 合約乘數                                                            |
| ∟∟ contract_type         | string   | 期權類型 <br /><br />**可選值：**<br />`A` - 美式 <br />`U` - 歐式  |
| ∟∟ contract_size         | string   | 合約規模                                                            |
| ∟∟ direction             | string   | 方向 <br /><br />**可選值：**<br />`P` - put <br />`C` - call       |
| ∟∟ historical_volatility | string   | 對應正股的歷史波動率                                                |
| ∟∟ underlying_symbol     | string   | 對應的正股標的代碼                                                  |

### Protobuf

```protobuf
message OptionQuoteResponse {
  repeated OptionQuote secu_quote = 1;
}

message OptionQuote {
  string symbol = 1;
  string last_done = 2;
  string prev_close = 3;
  string open = 4;
  string high = 5;
  string low = 6;
  int64 timestamp = 7;
  int64 volume = 8;
  string turnover = 9;
  TradeStatus trade_status = 10;
  OptionExtend option_extend = 11;
}

message OptionExtend {
  string implied_volatility = 1;
  int64 open_interest = 2;
  string expiry_date = 3;
  string strike_price = 4;
  string contract_multiplier = 5;
  string contract_type = 6;
  string contract_size = 7;
  string direction = 8;
  string historical_volatility = 9;
  string underlying_symbol = 10;
}
```

### Response JSON Example

```json
{
  "secu_quote": [
    {
      "symbol": "AAPL220429P162500.US",
      "last_done": "7.78",
      "prev_close": "4.13",
      "open": "4.43",
      "high": "7.80",
      "low": "4.43",
      "timestamp": 1651003200,
      "volume": 3082,
      "turnover": "1813434.00",
      "option_extend": {
        "implied_volatility": "0.592",
        "open_interest": 11463,
        "expiry_date": "20220429",
        "strike_price": "162.50",
        "contract_multiplier": "100",
        "contract_type": "A",
        "contract_size": "100",
        "direction": "P",
        "historical_volatility": "0.2750",
        "underlying_symbol": "AAPL.US"
      }
    },
    {
      "symbol": "AAPL220429C150000.US",
      "last_done": "9.25",
      "prev_close": "13.87",
      "open": "13.80",
      "high": "13.80",
      "low": "9.15",
      "timestamp": 1651003200,
      "volume": 413,
      "turnover": "436835.00",
      "option_extend": {
        "implied_volatility": "0.702",
        "open_interest": 800,
        "expiry_date": "20220429",
        "strike_price": "150.00",
        "contract_multiplier": "100",
        "contract_type": "A",
        "contract_size": "100",
        "direction": "C",
        "historical_volatility": "0.2750",
        "underlying_symbol": "AAPL.US"
      }
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
