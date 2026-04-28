---
id: quote_subscribe
title: Subscribe Quote
slug: subscribe
sidebar_position: 1
---

This API is used to subscribe quote.

<SDKLinks module="quote" klass="QuoteContext" method="subscriptions" />

:::info

[Business Command](../../socket/biz-command): `6`

:::

## Request

### Parameters

| Name          | Type     | Required | Description                                                                                                                                                                                                          |
|---------------|----------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| symbol        | string[] | Yes      | Security code list, for example: `[700.HK]` <br /><br />**Check rules:**<br />The maximum number of symbols that can be passed in each request is `500` <br /> The maximum number of subscriptions per user is `500` |
| sub_type      | int32[]  | Yes      | Subscription type, for example: `[1,2]`, see [SubType](../objects#subtype---quote-type-of-subscription)                                                                                                              |
| is_first_push | bool     | Yes      | Whether to perform a data push immediately after subscribing. (trade not supported)                                                                                                                                  |

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

Returns the securities and types of the successful subscription of this request.

| Name       | Type     | Description                                                                       |
|------------|----------|-----------------------------------------------------------------------------------|
| sub_list   | object[] | Subscription list                                                                 |
| ∟ symbol   | string   | Seurity code                                                                      |
| ∟ sub_type | int32[]  | Subscription type, see [SubType](../objects#subtype---quote-type-of-subscription) |

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

## API Restrictions

:::caution

- HK BMP quote level does not support quote push.

:::

## Error Code

| Protocol Error Code | Business Error Code | Description                | Troubleshooting Suggestions                                   |
|---------------------|---------------------|----------------------------|---------------------------------------------------------------|
| 3                   | 301600              | Invalid request            | Invalid request parameters or unpacking request failed        |
| 3                   | 301606              | Request rate limit         | Reduce the frequency of requests                              |
| 7                   | 301602              | Server error               | Please try again or contact a technician to resolve the issue |
| 7                   | 301605              | Too many subscriptons      | Unsubscribe some subscribed securities                        |
| 7                   | 301600              | Invalue request parameters | Please check the request parameter: `sub_type`                |
