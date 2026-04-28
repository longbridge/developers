---
slug: topic-detail
title: Get Topic Detail
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get the full details of a community topic by its ID, including the body (Markdown), author info, associated tickers and hashtags, engagement counts, and the direct URL.

<CliCommand>
longbridge topic detail 6993508780031016960
</CliCommand>

<SDKLinks module="content" klass="ContentContext" method="topic_detail" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/content/topics/:id</td></tr>
</tbody>
</table>

### Path Parameters

| Name | Type   | Required | Description                           |
| ---- | ------ | -------- | ------------------------------------- |
| id   | string | YES      | Topic ID (e.g. `6993508780031016960`) |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

<CliCommand>
longbridge topic detail 6993508780031016960
</CliCommand>

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

topic = ctx.topic_detail("6993508780031016960")
print(topic)
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

    topic = await ctx.topic_detail("6993508780031016960")
    print(topic)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/longportapp/openapi-go/config"
	"github.com/longportapp/openapi-go/content"
)

func main() {
	conf, err := config.NewFromEnv()
	if err != nil {
		log.Fatal(err)
	}
	ctx, err := content.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	topic, err := ctx.TopicDetail(context.Background(), "6993508780031016960")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("title: %s\nauthor: %s\nlikes: %d\n", topic.Title, topic.Author.Name, topic.LikesCount)
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, content::ContentContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ContentContext::new(config);
    let topic = ctx.topic_detail("6993508780031016960").await?;
    println!("{:?}", topic);
    Ok(())
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
    "item": {
      "id": "6993508780031016960",
      "title": "My Analysis on AAPL",
      "description": "Brief plain-text summary...",
      "body": "**Bullish** on AAPL because...",
      "topic_type": "article",
      "tickers": ["AAPL.US"],
      "hashtags": ["earnings"],
      "images": [
        {
          "url": "https://cdn.longbridge.com/img/abc.jpg",
          "sm": "https://cdn.longbridge.com/img/abc_sm.jpg",
          "lg": "https://cdn.longbridge.com/img/abc_lg.jpg"
        }
      ],
      "likes_count": 42,
      "comments_count": 7,
      "views_count": 1500,
      "shares_count": 3,
      "detail_url": "https://longbridge.com/topics/6993508780031016960",
      "author": {
        "member_id": "10086",
        "name": "Jane Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "created_at": "1742000000",
      "updated_at": "1742001000"
    }
  }
}
```

### Response Status

| Status | Description    | Schema                                                |
| ------ | -------------- | ----------------------------------------------------- |
| 200    | Success        | [topic_detail_response](#schematopic_detail_response) |
| 500    | Internal error | None                                                  |

## Schemas

### topic_detail_response

<a id="schematopic_detail_response"></a>

| Name             | Type     | Required | Description                                                |
| ---------------- | -------- | -------- | ---------------------------------------------------------- |
| item             | object   | true     | Topic detail object                                        |
| ∟ id             | string   | true     | Topic ID                                                   |
| ∟ title          | string   | false    | Title (may be empty for short posts)                       |
| ∟ description    | string   | false    | Plain-text excerpt                                         |
| ∟ body           | string   | false    | Markdown body                                              |
| ∟ topic_type     | string   | true     | Content type: `article` or `post`                          |
| ∟ tickers        | string[] | false    | Associated security symbols (e.g. `["AAPL.US", "700.HK"]`) |
| ∟ hashtags       | string[] | false    | Hashtag names                                              |
| ∟ images         | object[] | false    | Attached images                                            |
| ∟∟ url           | string   | false    | Original image URL                                         |
| ∟∟ sm            | string   | false    | Small thumbnail URL                                        |
| ∟∟ lg            | string   | false    | Large image URL                                            |
| ∟ likes_count    | int32    | false    | Likes count                                                |
| ∟ comments_count | int32    | false    | Replies count                                              |
| ∟ views_count    | int32    | false    | Views count                                                |
| ∟ shares_count   | int32    | false    | Shares count                                               |
| ∟ detail_url     | string   | false    | URL to the topic detail page                               |
| ∟ author         | object   | false    | Author info                                                |
| ∟∟ member_id     | string   | false    | Author member ID                                           |
| ∟∟ name          | string   | false    | Author display name                                        |
| ∟∟ avatar        | string   | false    | Author avatar URL                                          |
| ∟ created_at     | string   | true     | Creation time as Unix timestamp (seconds)                  |
| ∟ updated_at     | string   | false    | Last updated time as Unix timestamp (seconds)              |
