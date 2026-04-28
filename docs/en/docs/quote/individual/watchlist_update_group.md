---
slug: watchlist_update_group
title: Update Watchlist Group
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Update watched group

<CliCommand>
# add symbols to a group
longbridge watchlist update <id> --add TSLA.US AAPL.US
# remove a symbol from a group
longbridge watchlist update <id> --remove NVDA.US
# add and remove at the same time
longbridge watchlist update <id> --add TSLA.US --remove AAPL.US
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="update_watchlist_group" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>PUT</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/watchlist/groups</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name       | Type     | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id         | integer  | YES      | Group ID, for example `10086`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| name       | string   | NO       | Group name, for example `Information Technology Group`. <br /> If this parameter is not passed, the group name will not be updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| securities | string[] | NO       | Security list, for example `["BABA.US", "AAPL.US"]`.<br /> Combined with the `mode` parameter below, it can be used to add securities, remove securities, and sort the watchlist.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| mode       | string   | NO       | Operation method<br /> **optional values:**<br /> `add` - Add securities<br /> `remove` - Remove securities<br /> `replace` - Update securities<br /><br /> When selecting `add`, the securities in the above list will be added to this group in order.<br /><br /> When selecting `remove`, the securities in the above list will be removed from this group.<br /><br /> When selecting `update`, the securities in the above list will completely replace the securities in this group.<br /> For example, if the original group contains `APPL.US, BABA.US, TSLA.US`, and it is updated with `["BABA.US", "AAPL.US", "MSFT.US"]`, it will become `BABA.US, AAPL.US, MSFT.US`, removing `TSLA.US` and adding `MSFT.US`, while adjusting the order of `BABA.US and AAPL.US`. |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, SecuritiesUpdateMode, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.update_watchlist_group(10086, name = "Watchlist2", securities = ["700.HK", "AAPL.US"], SecuritiesUpdateMode.Replace)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, SecuritiesUpdateMode, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)
    ctx.update_watchlist_group(10086, name = "Watchlist2", securities = ["700.HK", "AAPL.US"], SecuritiesUpdateMode.Replace)

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
  await ctx.updateWatchlistGroup(1, 'New Name', ['700.HK'])
  console.log('updated')
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
            ctx.updateWatchlistGroup(1, "New Name", new String[] { "700.HK" }).get();
            System.out.println("updated");
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
    ctx.update_watchlist_group(1, "New Name", vec!["700.HK".to_string()]).await?;
    println!("updated");
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

    ctx.update_watchlist_group(1, "New Name", symbols, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        std::cout << "updated" << std::endl;
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
	err = qctx.UpdateWatchlistGroup(context.Background(), 1, "New Name", []string{"700.HK"}, quote.AddWatchlist)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("updated")
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
  "code": 0
}
```

### Response Status

| Status | Description    | Schema |
| ------ | -------------- | ------ |
| 200    | Success        | None   |
| 500    | Internal error | None   |

<aside className="success">
</aside>
