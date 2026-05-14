---
slug: create-topic-reply
title: Create Topic Reply
sidebar_position: 7
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Post a reply to a community topic. Supports nesting under an existing reply.

Only users who have opened a **Longbridge account and hold assets** are allowed to publish community topics and replies via Longbridge Developers API or CLI. Returns `403` otherwise.

**Body format:** Plain text only — HTML and Markdown are **not** rendered.

<TipContainer type="tip">
Stock symbols mentioned in the body (e.g. `700.HK`, `TSLA.US`) are automatically recognized and linked as related stocks by the platform.

⚠️ Do not abuse symbol linking to associate unrelated stocks. Content moderation may restrict publishing or mute the account.
</TipContainer>

**Rate limit:** The first 3 replies per user per topic have no wait requirement. After that, each subsequent reply must wait an incrementally longer interval since the previous one:

| Reply # (after 3rd) | Required wait |
| ------------------- | ------------- |
| 4th                 | 3 s           |
| 5th                 | 5 s           |
| 6th                 | 8 s           |
| 7th                 | 13 s          |
| 8th                 | 21 s          |
| 9th                 | 34 s          |
| 10th+               | 55 s (cap)    |

Exceeding the limit returns `429`.

> ⚠️ Rate limit thresholds are for reference only and may be adjusted by the platform at any time.

<CliCommand>
longbridge topic create-reply 6993508780031016960 --body "Great analysis!"
</CliCommand>

<SDKLinks module="content" klass="ContentContext" method="create_topic_reply" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/content/topics/:topic_id/comments</td></tr>
</tbody>
</table>

### Path Parameters

| Name     | Type   | Required | Description                           |
| -------- | ------ | -------- | ------------------------------------- |
| topic_id | string | YES      | Topic ID (e.g. `6993508780031016960`) |

### Request Body

| Name        | Type   | Required | Description                                                                                                            |
| ----------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| body        | string | YES      | Reply body. Plain text only — Markdown is not rendered. Symbols mentioned in the body are auto-linked by the platform. |
| reply_to_id | string | NO       | ID of the reply to nest under. Omit or set to `"0"` for a top-level reply.                                             |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

<CliCommand>
# Top-level reply
longbridge topic create-reply 6993508780031016960 --body "Great analysis!"

# Nested reply
longbridge topic create-reply 6993508780031016960 --body "I agree." --reply-to 7001234567890123456
</CliCommand>

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

# Top-level reply
reply = ctx.create_topic_reply("6993508780031016960", body="Great analysis!")
print(reply.id)

# Nested reply
nested = ctx.create_topic_reply(
    "6993508780031016960",
    body="I agree.",
    reply_to_id="7001234567890123456",
)
print(nested.id)
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

    reply = await ctx.create_topic_reply("6993508780031016960", body="Great analysis!")
    print(reply.id)

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
	reply, err := ctx.CreateTopicReply(context.Background(), "6993508780031016960",
		&content.CreateReplyOptions{Body: "Great analysis!"},
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("reply id:", reply.ID)
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, content::{ContentContext, CreateReplyOptions}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ContentContext::new(config);

    let reply = ctx.create_topic_reply(
        "6993508780031016960",
        CreateReplyOptions { body: "Great analysis!".to_string(), reply_to_id: None },
    ).await?;
    println!("reply id: {}", reply.id);
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
      "id": "7001234567890123460",
      "topic_id": "6993508780031016960",
      "body": "Great analysis!",
      "reply_to_id": "0",
      "author": {
        "member_id": "10086",
        "name": "Jane Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "images": [],
      "likes_count": 0,
      "comments_count": 0,
      "created_at": "1742002000"
    }
  }
}
```

### Response Status

| Status | Description                                                           | Schema                                                |
| ------ | --------------------------------------------------------------------- | ----------------------------------------------------- |
| 200    | Success                                                               | [create_reply_response](#schemacreate_reply_response) |
| 403    | Forbidden — user has not opened a Longbridge account or has no assets | None                                                  |
| 429    | Too Many Requests — rate limit exceeded; wait and retry               | None                                                  |
| 500    | Internal error                                                        | None                                                  |

## Schemas

### create_reply_response

<a id="schemacreate_reply_response"></a>

| Name             | Type     | Required | Description                               |
| ---------------- | -------- | -------- | ----------------------------------------- |
| item             | object   | true     | Created reply details                     |
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
