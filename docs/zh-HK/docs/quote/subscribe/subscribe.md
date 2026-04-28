---
id: quote_subscribe
title: 訂閱行情數據
slug: subscribe
sidebar_position: 1
---

該接口用於訂閱標的行情數據。

<SDKLinks module="quote" klass="QuoteContext" method="subscriptions" />

:::info

[業務指令](../../socket/biz-command)：`6`

:::

## Request

### Parameters

| Name          | Type     | Required | Description                                                                                                                                         |
|---------------|----------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| symbol        | string[] | 是       | 訂閱的標的代碼，例如：`[700.HK]` <br /><br />**校驗規則：**<br />每次請求支持傳入的標的數量上限是 `500` 個 <br /> 每個用戶同時訂閱標的數量最多為 `500` |
| sub_type      | int32[]  | 是       | 訂閱的數據類型，例如：`[1,2]`，詳見 [SubType](../objects#subtype---訂閱數據的類型)                                                                     |
| is_first_push | bool     | 是       | 訂閱後是否立刻進行一次數據推送。 ( trade 不支持)                                                                                                     |

### Protobuf

```protobuf
message SubscribeRequest {
  repeated string symbol = 1;
  repeated SubType sub_type = 2;
  bool is_first_push = 3;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from time import sleep
from longbridge.openapi import QuoteContext, Config, SubType, PushQuote, OAuthBuilder

def on_quote(symbol: str, event: PushQuote):
    print(symbol, event)

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_quote(on_quote)

ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Quote])
sleep(30)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, SubType, PushQuote, OAuthBuilder

async def main() -> None:
    async def on_quote(symbol: str, event: PushQuote) -> None:
        print(symbol, event)

    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)
    ctx.set_on_quote(on_quote)

    await ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Quote])
    await asyncio.sleep(30)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, SubType } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  ctx.setOnQuote((event) => console.log(event))
  await ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Quote], true)
  await new Promise(r => setTimeout(r, 30000))
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
            ctx.setOnQuote(event -> System.out.println(event));
            ctx.subscribe(new String[] { "700.HK", "AAPL.US" }, new SubType[] { SubType.Quote }, true).get();
            Thread.sleep(30000);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config, quote::SubFlags};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    ctx.subscribe(vec!["700.HK".to_string(), "AAPL.US".to_string()], SubFlags::quote(), true).await?;
    tokio::time::sleep(std::time::Duration::from_secs(30)).await;
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

    ctx.set_on_quote([](auto e) { std::cout << e->symbol << std::endl; });
    ctx.subscribe(symbols, SubFlags::QUOTE(), true, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
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
	qctx.OnQuote(func(e *quote.PushQuote) { fmt.Println(e.Symbol) })
	err = qctx.Subscribe(context.Background(), []string{"700.HK", "AAPL.US"}, []quote.SubType{quote.SubTypeQuote}, true)
	if err != nil {
		log.Fatal(err)
	}
	// keep running to receive push
	select {}
}
```

  </TabItem>
</Tabs>


## Response

### Response Properties

返回本次請求訂閱成功的標的和類型。

| Name       | Type     | Description                                                        |
|------------|----------|--------------------------------------------------------------------|
| sub_list   | object[] | 訂閱的數據                                                         |
| ∟ symbol   | string   | 標的代碼                                                           |
| ∟ sub_type | int32[]  | 訂閱的數據類型，詳見：[SubType](../objects#subtype---訂閱數據的類型) |

### Protobuf

```protobuf
message SubscriptionResponse {
  repeated SubTypeList sub_list = 1;
}

message SubTypeList {
  string symbol = 1;
  repeated SubType sub_type = 2;
}
```

### Response JSON Example

```json
{
  "sub_list": [
    {
      "symbol": "700.HK",
      "sub_type": [1, 2, 3]
    },
    {
      "symbol": "AAPL.US",
      "sub_type": [2]
    }
  ]
}
```

## 接口限制

:::caution

- 港股 BMP 行情不支持行情數據推送。

:::

## 錯誤碼

| 協議錯誤碼 | 業務錯誤碼 | 描述             | 排查建議                 |
|------------|------------|----------------|----------------------|
| 3          | 301600     | 無效的請求       | 請求參數有誤或解包失敗   |
| 3          | 301606     | 限流             | 降低請求頻次             |
| 7          | 301602     | 服務端內部錯誤   | 請重試或聯繫技術人員處理 |
| 7          | 301605     | 訂閱數量超出限制 | 取消部分訂閱             |
| 7          | 301600     | 請求參數有誤     | 檢查請求的 `sub_type`    |
