---
id: quote_unsubscribe
title: Unsubscribe Quote
slug: unsubscribe
sidebar_position: 2
---

This API is used to unsubscribe quote.

<SDKLinks module="quote" klass="QuoteContext" method="unsubscribe" />

:::info

[Business Command](../../socket/biz-command): `7`

:::

## Request

### Parameters

| Name      | Type     | Required | Description                                                                                                                                                               |
| --------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol    | string[] | Yes      | Security code list, for example: `[700.HK]` <br /><br />**Check rules:**<br />The maximum number of symbols that can be passed in each request is `500`                   |
| sub_type  | int32[]  | Yes      | Subscription type list, for example: `[1,2]`, see [SubType](../objects#subtype---quote-type-of-subscription)                                                              |
| unsub_all | bool     | Yes      | Is unsubscribe all. <br />- When `symbol` is empty, unsubscribe all subscriptions<br />- When `symbol` is not empty, unsubscribe these all subscriptions of these symbols |

### Protobuf

```protobuf
message UnsubscribeRequest {
  repeated string symbol = 1;
  repeated SubType sub_type = 2;
  bool unsub_all = 3;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, SubType, OAuthBuilder
oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Quote])
ctx.unsubscribe(["AAPL.US"], [SubType.Quote])
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, SubType, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    await ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Quote])
    await ctx.unsubscribe(["AAPL.US"], [SubType.Quote])

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
  await ctx.unsubscribe(["700.HK", "AAPL.US"], [SubType.Quote])
  console.log("unsubscribed")
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
            ctx.unsubscribe(new String[] { "700.HK", "AAPL.US" }, new SubType[] { SubType.Quote }).get();
            System.out.println("unsubscribed");
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
    ctx.unsubscribe(vec!["700.HK".to_string(), "AAPL.US".to_string()], SubFlags::quote()).await?;
    println!("unsubscribed");
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

    ctx.unsubscribe(symbols, SubFlags::QUOTE(), [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "unsubscribed" << std::endl;
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
	err = qctx.Unsubscribe(context.Background(), false, []string{"700.HK", "AAPL.US"}, []quote.SubType{quote.SubTypeQuote})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("unsubscribed")
}
```

  </TabItem>
</Tabs>


## Response

### Protobuf

```protobuf
message UnsubscribeResponse{
}
```

## Error Code

| Protocol Error Code | Business Error Code | Description                | Troubleshooting Suggestions                                   |
| ------------------- | ------------------- | -------------------------- | ------------------------------------------------------------- |
| 3                   | 301600              | Invalid request            | Invalid request parameters or unpacking request failed        |
| 3                   | 301606              | Request rate limit         | Reduce the frequency of requests                              |
| 7                   | 301602              | Server error               | Please try again or contact a technician to resolve the issue |
| 7                   | 301600              | Invalue request parameters | Please check the request parameter: `sub_type`                |
