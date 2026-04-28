---
id: quote_subscribe
title: 订阅行情数据
slug: subscribe
sidebar_position: 1
---

该接口用于订阅标的行情数据。

<SDKLinks module="quote" klass="QuoteContext" method="subscribe" />

:::info

[业务指令](../../socket/biz-command)：`6`

:::

## Request

### Parameters

| Name          | Type     | Required | Description                                                                                                                                         |
|---------------|----------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| symbol        | string[] | 是       | 订阅的标的代码，例如：`[700.HK]` <br /><br />**校验规则：**<br />每次请求支持传入的标的数量上限是 `500` 个 <br /> 每个用户同时订阅标的数量最多为 `500` |
| sub_type      | int32[]  | 是       | 订阅的数据类型，例如：`[1,2]`，详见 [SubType](../objects#subtype---订阅数据的类型)                                                                     |
| is_first_push | bool     | 是       | 订阅后是否立刻进行一次数据推送。( trade 不支持)                                                                                                      |

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

返回本次请求订阅成功的标的和类型。

| Name       | Type     | Description                                                        |
|------------|----------|--------------------------------------------------------------------|
| sub_list   | object[] | 订阅的数据                                                         |
| ∟ symbol   | string   | 标的代码                                                           |
| ∟ sub_type | int32[]  | 订阅的数据类型，详见：[SubType](../objects#subtype---订阅数据的类型) |

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

- 港股 BMP 行情不支持行情数据推送。

:::

## 错误码

| 协议错误码 | 业务错误码 | 描述             | 排查建议                 |
|------------|------------|----------------|----------------------|
| 3          | 301600     | 无效的请求       | 请求参数有误或解包失败   |
| 3          | 301606     | 限流             | 降低请求频次             |
| 7          | 301602     | 服务端内部错误   | 请重试或联系技术人员处理 |
| 7          | 301605     | 订阅数量超出限制 | 取消部分订阅             |
| 7          | 301600     | 请求参数有误     | 检查请求的 `sub_type`    |
