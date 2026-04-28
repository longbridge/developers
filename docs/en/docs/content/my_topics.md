---
slug: my-topics
title: List My Published Topics
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the list of topics I have published.

<CliCommand>
longbridge topic mine
</CliCommand>

<SDKLinks module="content" klass="ContentContext" method="topics_mine" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/content/topics/mine</td></tr>
</tbody>
</table>

### Query Parameters

| Name       | Type   | Required | Description                                                                                  |
| ---------- | ------ | -------- | -------------------------------------------------------------------------------------------- |
| page       | int32  | NO       | Page number (1-based). Defaults to `1`.                                                      |
| size       | int32  | NO       | Number of items per page, range 1–500. Defaults to `50`.                                     |
| topic_type | string | NO       | Filter by type. One of `article` (long-form), `post` (short post). Omit to return all types. |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

<CliCommand>
longbridge topic mine                           # All types (default: 50 per page)
longbridge topic mine --type article            # Articles only
longbridge topic mine --type post --size 10     # Short posts, 10 per page
longbridge topic mine --page 2                  # Page 2
longbridge topic mine --format json             # JSON output for scripting
</CliCommand>

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

resp = ctx.topics_mine(page=1, size=50, topic_type="article")
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

    resp = await ctx.topics_mine(page=1, size=50, topic_type="article")
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
  const resp = await ctx.topicsMine({ page: 1, size: 50, topicType: 'article' })
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
            ListMyTopicsOptions opts = new ListMyTopicsOptions()
                .setPage(1).setSize(50).setTopicType("article");
            OwnedTopic[] resp = ctx.getTopicsMine(opts).get();
            for (OwnedTopic item : resp) System.out.println(item);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, content::{ContentContext, ListMyTopicsOptions}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ContentContext::new(config);
    let opts = ListMyTopicsOptions {
        page: Some(1),
        size: Some(50),
        topic_type: Some("article".to_string()),
    };
    let resp = ctx.topics_mine(opts).await?;
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

    ListMyTopicsOptions opts;
    opts.page = 1;
    opts.size = 50;
    opts.topic_type = "article";

    ctx.topics_mine(opts, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "my topics: " << res->size() << std::endl;
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
	opts := content.ListMyTopicsOptions{Page: 1, Size: 50, TopicType: "article"}
	items, err := ctx.TopicsMine(context.Background(), opts)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("my topics:", len(items))
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
        "title": "My Analysis on AAPL",
        "description": "A brief summary of my article...",
        "body": "Full markdown content here...",
        "topic_type": "article",
        "tickers": ["AAPL.US"],
        "hashtags": ["earnings"],
        "images": [],
        "likes_count": 12,
        "comments_count": 3,
        "views_count": 200,
        "shares_count": 1,
        "license": 1,
        "detail_url": "https://longbridge.com/topics/39304657",
        "author": {
          "member_id": "10086",
          "name": "John",
          "avatar": "https://example.com/avatar.jpg"
        },
        "created_at": "1742000000",
        "updated_at": "1742000000"
      }
    ]
  }
}
```

### Response Status

| Status | Description    | Schema                                          |
| ------ | -------------- | ----------------------------------------------- |
| 200    | Success        | [my_topics_response](#schemamy_topics_response) |
| 500    | Internal error | None                                            |

## Schemas

### my_topics_response

<a id="schemamy_topics_response"></a>

| Name             | Type     | Required | Description                                                           |
| ---------------- | -------- | -------- | --------------------------------------------------------------------- |
| items            | object[] | true     | Topic list                                                            |
| ∟ id             | string   | true     | Topic ID                                                              |
| ∟ title          | string   | false    | Topic title (may be empty for short posts)                            |
| ∟ description    | string   | false    | Plain-text summary of the topic body                                  |
| ∟ body           | string   | false    | Full topic body in Markdown format                                    |
| ∟ topic_type     | string   | true     | Topic type. One of `article`, `post`                                  |
| ∟ tickers        | string[] | false    | Associated security symbols (e.g. `["AAPL.US", "700.HK"]`)            |
| ∟ hashtags       | string[] | false    | Associated hashtag names                                              |
| ∟ images         | object[] | false    | Images attached to the topic                                          |
| ∟∟ url           | string   | false    | Original image URL                                                    |
| ∟∟ sm            | string   | false    | Small thumbnail URL                                                   |
| ∟∟ lg            | string   | false    | Large thumbnail URL                                                   |
| ∟ likes_count    | int32    | false    | Number of likes                                                       |
| ∟ comments_count | int32    | false    | Number of comments                                                    |
| ∟ views_count    | int32    | false    | Number of views                                                       |
| ∟ shares_count   | int32    | false    | Number of shares                                                      |
| ∟ license        | int32    | false    | Copyright declaration. `0` = none, `1` = original, `2` = non-original |
| ∟ detail_url     | string   | false    | Link to the topic detail page                                         |
| ∟ author         | object   | false    | Author information                                                    |
| ∟∟ member_id     | string   | false    | Author member ID                                                      |
| ∟∟ name          | string   | false    | Author display name                                                   |
| ∟∟ avatar        | string   | false    | Author avatar URL                                                     |
| ∟ created_at     | string   | true     | Unix timestamp (seconds) when the topic was created                   |
| ∟ updated_at     | string   | false    | Unix timestamp (seconds) when the topic was last updated              |
