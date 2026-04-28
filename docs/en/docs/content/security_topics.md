---
slug: topics
title: Get Community Topics by Symbol
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the topic/discussion list for a specified security.

<CliCommand>
# community discussion topics for Tesla
longbridge topics TSLA.US
# community discussion topics for Apple
longbridge topics AAPL.US
# community discussion topics for NVDA
longbridge topics NVDA.US
</CliCommand>

<SDKLinks module="content" klass="ContentContext" method="topics" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/content/{symbol}/topics</td></tr>
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

resp = ctx.topics("AAPL.US")
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

    resp = await ctx.topics("AAPL.US")
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
  const resp = await ctx.topics('AAPL.US')
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
            TopicItem[] resp = ctx.getTopics("AAPL.US").get();
            for (TopicItem item : resp) System.out.println(item);
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
    let resp = ctx.topics("AAPL.US").await?;
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

    ctx.topics("AAPL.US", [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "topics: " << res->size() << std::endl;
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
	items, err := ctx.Topics(context.Background(), "AAPL.US")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("topics:", len(items))
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
        "id": "39304657",
        "title": "NVDA GTC in focus; Alibaba 'Token strategy' ramps up | Daily News Recap",
        "description": "0317 | Dolphin Research Focus: 🐬 Stock #1, $NVIDIA(NVDA.US) — NVIDIA's GTC 2026 officially kicked off, and founder &amp; CEO Jensen Huang delivered the keynote.He announced a Vera Rubin Space Module under the next-gen Vera Rubin architecture, designed for orbital data centers, delivering 25x performance vs. H100.He also unveiled a partnership with Groq to co-develop new LPU chips...",
        "url": "https://longbridge.com/topics/39304657",
        "published_at": "1773736144",
        "comments_count": 1,
        "likes_count": 7,
        "shares_count": 4
      }
    ]
  }
}
```

### Response Status

| Status | Description    | Schema                                    |
| ------ | -------------- | ----------------------------------------- |
| 200    | Success        | [topics_response](#schematopics_response) |
| 500    | Internal error | None                                      |

## Schemas

### topics_response

<a id="schematopics_response"></a>

| Name             | Type     | Required | Description                              |
| ---------------- | -------- | -------- | ---------------------------------------- |
| items            | object[] | true     | Topic list                               |
| ∟ id             | string   | true     | Topic ID                                 |
| ∟ title          | string   | true     | Title                                    |
| ∟ description    | string   | true     | Summary/description                      |
| ∟ url            | string   | true     | Detail page URL                          |
| ∟ published_at   | string   | true     | Published time, Unix timestamp (seconds) |
| ∟ comments_count | int32    | true     | Comment count                            |
| ∟ likes_count    | int32    | true     | Like count                               |
| ∟ shares_count   | int32    | true     | Share count                              |
