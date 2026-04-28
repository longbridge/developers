---
slug: watchlist_update_group
title: 更新自選股分組
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

更新自選股分組

<CliCommand>
# 向分組添加標的
longbridge watchlist update <id> --add TSLA.US AAPL.US
# 從分組移除標的
longbridge watchlist update <id> --remove NVDA.US
# 同時添加和移除
longbridge watchlist update <id> --add TSLA.US --remove AAPL.US
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="update_watchlist_group" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>PUT</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/watchlist/groups </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name       | Type     | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id         | integer  | YES      | 分組 ID，例如 `10086`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| name       | string   | NO       | 分組名稱，例如 `信息產業組`<br /> 如果不傳遞此參數，則分組名稱不會更新                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| securities | string[] | NO       | 股票列表，例如 `["BABA.US","AAPL.US"]`<br /> 配合下面的 `mode` 參數，可完成添加股票、移除股票、對關註列表進行排序等操作                                                                                                                                                                                                                                                                                                                                                                                          |
| mode       | string   | NO       | 操作方法 **可選值：**<br /> `add` - 添加<br /> `remove` - 移除<br /> `replace` - 更新<br /><br /> 選 `add` 時，將上面列表中的股票依序添加到此分組中<br /><br /> 選 `remove` 時，將上面列表中的股票從此分組中移除<br /><br /> 選 `replace` 時，將上面列表中的股票全量覆蓋此分組下的股票<br /> 假如原來分組中的股票為 `APPL.US, BABA.US, TSLA.US`，使用 `["BABA.US","AAPL.US","MSFT.US"]` 更新後變為 `["BABA.US","AAPL.US","MSFT.US"]`，對比之前，移除了 `TSLA.US`，添加了 `MSFT.US`，`BABA.US,AAPL.US` 調整了順序 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, SecuritiesUpdateMode, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.update_watchlist_group(10086, name = "WatchList2", securities = ["700.HK", "AAPL.US"], SecuritiesUpdateMode.Replace)
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
    ctx.update_watchlist_group(10086, name = "WatchList2", securities = ["700.HK", "AAPL.US"], SecuritiesUpdateMode.Replace)

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
  await ctx.updateWatchlistGroup(1, "New Name", ["700.HK"])
  console.log("updated")
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

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 返回成功    | None   |
| 500    | 內部錯誤    | None   |

<aside className="success">
</aside>
