---
slug: news
title: Security News
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the news list for a specified security.

<CliCommand>
# latest news for Tesla
longbridge news TSLA.US
# latest news for Apple
longbridge news AAPL.US
# latest news for NVDA
longbridge news NVDA.US
</CliCommand>

<SDKLinks module="content" klass="ContentContext" method="news" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/content/{symbol}/news</td></tr>
</tbody>
</table>

### Path Parameters

| Name   | Type   | Required | Description                                              |
| ------ | ------ | -------- | -------------------------------------------------------- |
| symbol | string | YES      | Stock symbol, use `ticker.region` format, e.g. `AAPL.US` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

resp = ctx.news("AAPL.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncContentContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncContentContext.create(config)

    resp = await ctx.news("AAPL.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, ContentContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = ContentContext.new(config)
  const resp = await ctx.news('AAPL.US')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.content.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             ContentContext ctx = ContentContext.create(config)) {
            NewsItem[] resp = ctx.getNews("AAPL.US").get();
            for (NewsItem item : resp) System.out.println(item);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, content::ContentContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ContentContext::new(config);
    let resp = ctx.news("AAPL.US").await?;
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
using namespace longbridge::content;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    ContentContext ctx = ContentContext::create(config);

    ctx.news("AAPL.US", [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "news: " << res->size() << std::endl;
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
	"github.com/longbridge/openapi-go/content"
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
	ctx, err := content.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	items, err := ctx.News(context.Background(), "AAPL.US")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("news:", len(items))
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
  "message": "success",
  "data": {
    "items": [
      {
        "id": "279528757",
        "title": "Beats cross-industry collaboration breaks the circle with Nike! Apple aims to ignite a new wave of wearable consumer trends, while Nike bets on the narrative of \"sports technology.\"",
        "description": "Apple's Beats has collaborated with Nike to launch a limited edition Powerbeats Pro 2 headphones, featuring Nike's Swoosh logo. The headphones will be available online and at select Apple Stores on March 20, priced at $250. This marks Beats' first collaboration with an external sports brand, signifying further synergy between the two companies in branding and product ecosystems. The headphones feature real-time heart rate tracking and a battery life of up to 45 hours",
        "url": "https://longbridge.com/news/279528757",
        "published_at": "1773805586",
        "comments_count": 0,
        "likes_count": 0,
        "shares_count": 0
      }
    ]
  }
}
```

### Response Status

| Status | Description    | Schema                                |
| ------ | -------------- | ------------------------------------- |
| 200    | Success        | [news_response](#schemanews_response) |
| 500    | Internal error | None                                  |

## Schemas

### news_response

<a id="schemanews_response"></a>

| Name             | Type     | Required | Description                              |
| ---------------- | -------- | -------- | ---------------------------------------- |
| items            | object[] | true     | News list                                |
| ∟ id             | string   | true     | News ID                                  |
| ∟ title          | string   | true     | Title                                    |
| ∟ description    | string   | true     | Summary/description                      |
| ∟ url            | string   | true     | Detail page URL                          |
| ∟ published_at   | string   | true     | Published time, Unix timestamp (seconds) |
| ∟ comments_count | int32    | true     | Comment count                            |
| ∟ likes_count    | int32    | true     | Like count                               |
| ∟ shares_count   | int32    | true     | Share count                              |
