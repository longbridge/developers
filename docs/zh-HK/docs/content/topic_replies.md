---
slug: topic-replies
title: 獲取討論回覆列表
sidebar_position: 6
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取指定討論下的回覆列表，支持分頁。

每條回覆包含作者信息、正文（純文本）、互動數據及 `reply_to_id` 字段：`"0"` 表示頂層回覆，其他值表示對指定回覆的嵌套回覆。

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

| Name      | Type   | Required | Description                                              |
| --------- | ------ | -------- | -------------------------------------------------------- |
| topic_id  | string | YES      | 討論 ID，如 `6993508780031016960`                        |

### Query Parameters

| Name  | Type  | Required | Description                               |
| ----- | ----- | -------- | ----------------------------------------- |
| page  | int32 | NO       | 頁碼，默認 1                              |
| size  | int32 | NO       | 每頁數量，範圍 1~50，默認 20              |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

```bash
longbridge topic replies 6993508780031016960
longbridge topic replies 6993508780031016960 --page 2 --size 20
```

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
        "body": "分析得很到位！",
        "reply_to_id": "0",
        "author": {
          "member_id": "10087",
          "name": "李四",
          "avatar": "https://example.com/avatar2.jpg"
        },
        "images": [],
        "likes_count": 5,
        "comments_count": 2,
        "created_at": "1742001500"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema                                                          |
| ------ | ----------- | --------------------------------------------------------------- |
| 200    | 返回成功    | [topic_replies_response](#schematopic_replies_response)         |
| 500    | 內部錯誤    | None                                                            |

## Schemas

### topic_replies_response

<a id="schematopic_replies_response"></a>

| Name                | Type     | Required | Description                                                               |
| ------------------- | -------- | -------- | ------------------------------------------------------------------------- |
| items               | object[] | true     | 回覆列表                                                                  |
| ∟ id                | string   | true     | 回覆 ID                                                                   |
| ∟ topic_id          | string   | true     | 所屬討論 ID                                                               |
| ∟ body              | string   | false    | 回覆正文（純文本）                                                        |
| ∟ reply_to_id       | string   | false    | 父回覆 ID，`"0"` 表示頂層回覆                                             |
| ∟ author            | object   | false    | 作者信息                                                                  |
| ∟∟ member_id        | string   | false    | 作者 member ID                                                            |
| ∟∟ name             | string   | false    | 作者暱稱                                                                  |
| ∟∟ avatar           | string   | false    | 作者頭像 URL                                                              |
| ∟ images            | object[] | false    | 附圖列表                                                                  |
| ∟∟ url              | string   | false    | 原始圖片 URL                                                              |
| ∟∟ sm               | string   | false    | 小縮略圖 URL                                                              |
| ∟∟ lg               | string   | false    | 大縮略圖 URL                                                              |
| ∟ likes_count       | int32    | false    | 點讚數                                                                    |
| ∟ comments_count    | int32    | false    | 嵌套回覆數                                                                |
| ∟ created_at        | string   | true     | 創建時間，Unix 時間戳（秒）                                               |
