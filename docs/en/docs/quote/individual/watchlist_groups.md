---
slug: watchlist_groups
title: Watchlist Group
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get watched groups

<CliCommand>
# list all watchlist groups and their symbols
longbridge watchlist
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="watchlist" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/watchlist/groups</td></tr>
</tbody>
</table>

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
resp = ctx.watchlist()
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
    resp = await ctx.watchlist()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.watchlist()
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
            WatchlistGroup[] resp = ctx.getWatchlist().get();
            for (WatchlistGroup g : resp) System.out.println(g);
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
    let resp = ctx.watchlist().await?;
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

    ctx.watchlist([](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        for (const auto& g : *res) std::cout << g.name << std::endl;
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
	groups, err := qctx.WatchedGroups(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	for _, g := range groups {
		fmt.Println(g.Name)
	}
}
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "data": {
    "groups": [
      {
        "id": 28020,
        "name": "all",
        "securities": [
          {
            "symbol": "700.HK",
            "market": "HK",
            "name": "Tencent",
            "watched_price": "364.4",
            "watched_at": 1652855022,
            "is_pinned": true
          }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description    | Schema                                    |
| ------ | -------------- | ----------------------------------------- |
| 200    | Success        | [groups_response](#schemagroups_response) |
| 500    | Internal error | None                                      |

<aside className="success">
</aside>

## Schemas

### groups_response

<a id="schemagroups_response"></a>
<a id="schemagroups_response"></a>

| Name             | Type     | Required | Description                    |
| ---------------- | -------- | -------- | ------------------------------ |
| groups           | object[] | false    | Groups                         |
| ∟ id             | integer  | true     | Group ID                       |
| ∟ name           | string   | true     | Name                           |
| ∟ securities     | object[] | true     | Security                       |
| ∟∟ symbol        | string   | true     | Symbol                         |
| ∟∟ market        | string   | true     | Market                         |
| ∟∟ name          | string   | true     | Name                           |
| ∟∟ watched_price | string   | true     | Watched price                  |
| ∟∟ watched_at    | integer  | true     | Watched time                   |
| ∟∟ is_pinned     | boolean  | true     | Whether the security is pinned |
