---
slug: topic-replies
title: List Topic Replies
sidebar_position: 6
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get a paginated list of replies for a specific topic.

Each reply includes author info, body (plain text), engagement counts, and a `reply_to_id` field: `"0"` indicates a top-level reply; any other value identifies the parent reply for nested replies.

<CliCommand>
longbridge topic replies 6993508780031016960
longbridge topic replies 6993508780031016960 --page 2 --size 20
</CliCommand>

<SDKLinks module="content" klass="ContentContext" method="list_topic_replies" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/content/topics/:topic_id/comments</td></tr>
</tbody>
</table>

### Path Parameters

| Name     | Type   | Required | Description                           |
| -------- | ------ | -------- | ------------------------------------- |
| topic_id | string | YES      | Topic ID (e.g. `6993508780031016960`) |

### Query Parameters

| Name | Type  | Required | Description                                   |
| ---- | ----- | -------- | --------------------------------------------- |
| page | int32 | NO       | Page number (1-based). Defaults to `1`.       |
| size | int32 | NO       | Items per page, range 1–50. Defaults to `20`. |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

<CliCommand>
longbridge topic replies 6993508780031016960
longbridge topic replies 6993508780031016960 --page 2 --size 20
</CliCommand>

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

replies = ctx.list_topic_replies("6993508780031016960", page=1, size=20)
for r in replies:
    print(r.author.name, r.body)
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

    replies = await ctx.list_topic_replies("6993508780031016960", page=1, size=20)
    for r in replies:
        print(r.author.name, r.body)

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
	replies, err := ctx.ListTopicReplies(context.Background(), "6993508780031016960",
		&content.ListTopicRepliesOptions{Page: 1, Size: 20},
	)
	if err != nil {
		log.Fatal(err)
	}
	for _, r := range replies {
		fmt.Printf("[%s] %s: %s\n", r.ID, r.Author.Name, r.Body)
	}
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, content::{ContentContext, ListTopicRepliesOptions}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ContentContext::new(config);
    let replies = ctx.list_topic_replies(
        "6993508780031016960",
        ListTopicRepliesOptions { page: Some(1), size: Some(20) },
    ).await?;
    for r in &replies {
        println!("{}: {}", r.author.name, r.body);
    }
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
    "items": [
      {
        "id": "7001234567890123456",
        "topic_id": "6993508780031016960",
        "body": "Great analysis!",
        "reply_to_id": "0",
        "author": {
          "member_id": "10087",
          "name": "John Smith",
          "avatar": "https://example.com/avatar2.jpg"
        },
        "images": [],
        "likes_count": 5,
        "comments_count": 2,
        "created_at": "1742001500"
      },
      {
        "id": "7001234567890123457",
        "topic_id": "6993508780031016960",
        "body": "I disagree on the valuation part.",
        "reply_to_id": "7001234567890123456",
        "author": {
          "member_id": "10088",
          "name": "Alice Lee",
          "avatar": "https://example.com/avatar3.jpg"
        },
        "images": [],
        "likes_count": 1,
        "comments_count": 0,
        "created_at": "1742001800"
      }
    ]
  }
}
```

### Response Status

| Status | Description    | Schema                                                  |
| ------ | -------------- | ------------------------------------------------------- |
| 200    | Success        | [topic_replies_response](#schematopic_replies_response) |
| 500    | Internal error | None                                                    |

## Schemas

### topic_replies_response

<a id="schematopic_replies_response"></a>

| Name             | Type     | Required | Description                               |
| ---------------- | -------- | -------- | ----------------------------------------- |
| items            | object[] | true     | List of replies                           |
| ∟ id             | string   | true     | Reply ID                                  |
| ∟ topic_id       | string   | true     | Parent topic ID                           |
| ∟ body           | string   | false    | Reply body (plain text)                   |
| ∟ reply_to_id    | string   | false    | Parent reply ID; `"0"` = top-level reply  |
| ∟ author         | object   | false    | Author info                               |
| ∟∟ member_id     | string   | false    | Author member ID                          |
| ∟∟ name          | string   | false    | Author display name                       |
| ∟∟ avatar        | string   | false    | Author avatar URL                         |
| ∟ images         | object[] | false    | Attached images                           |
| ∟∟ url           | string   | false    | Original image URL                        |
| ∟∟ sm            | string   | false    | Small thumbnail URL                       |
| ∟∟ lg            | string   | false    | Large image URL                           |
| ∟ likes_count    | int32    | false    | Likes count                               |
| ∟ comments_count | int32    | false    | Nested replies count                      |
| ∟ created_at     | string   | true     | Creation time as Unix timestamp (seconds) |
