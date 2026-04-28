---
slug: topic-detail
title: 獲取討論詳情
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

根據討論 ID 獲取完整詳情，包含正文（Markdown）、作者信息、關聯標的與標籤、互動數據及詳情頁鏈接。

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

| Name | Type   | Required | Description                       |
| ---- | ------ | -------- | --------------------------------- |
| id   | string | YES      | 討論 ID，如 `6993508780031016960` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

```bash
longbridge topic detail 6993508780031016960
```

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
      "title": "我對蘋果的分析",
      "description": "文章摘要...",
      "body": "**看多** AAPL，因為...",
      "topic_type": "article",
      "tickers": ["AAPL.US"],
      "hashtags": ["earnings"],
      "images": [],
      "likes_count": 42,
      "comments_count": 7,
      "views_count": 1500,
      "shares_count": 3,
      "detail_url": "https://longbridge.com/topics/6993508780031016960",
      "author": {
        "member_id": "10086",
        "name": "張三",
        "avatar": "https://example.com/avatar.jpg"
      },
      "created_at": "1742000000",
      "updated_at": "1742001000"
    }
  }
}
```

### Response Status

| Status | Description | Schema                                                |
| ------ | ----------- | ----------------------------------------------------- |
| 200    | 返回成功    | [topic_detail_response](#schematopic_detail_response) |
| 500    | 內部錯誤    | None                                                  |

## Schemas

### topic_detail_response

<a id="schematopic_detail_response"></a>

| Name             | Type     | Required | Description                                  |
| ---------------- | -------- | -------- | -------------------------------------------- |
| item             | object   | true     | 討論詳情                                     |
| ∟ id             | string   | true     | 討論 ID                                      |
| ∟ title          | string   | false    | 標題（短帖可能為空）                         |
| ∟ description    | string   | false    | 純文本摘要                                   |
| ∟ body           | string   | false    | Markdown 格式正文                            |
| ∟ topic_type     | string   | true     | 內容類型，`article`（長文）或 `post`（短帖） |
| ∟ tickers        | string[] | false    | 關聯標的代碼，如 `["AAPL.US", "700.HK"]`     |
| ∟ hashtags       | string[] | false    | 討論標籤名稱列表                             |
| ∟ images         | object[] | false    | 附圖列表                                     |
| ∟∟ url           | string   | false    | 原始圖片 URL                                 |
| ∟∟ sm            | string   | false    | 小縮略圖 URL                                 |
| ∟∟ lg            | string   | false    | 大縮略圖 URL                                 |
| ∟ likes_count    | int32    | false    | 點讚數                                       |
| ∟ comments_count | int32    | false    | 回覆數                                       |
| ∟ views_count    | int32    | false    | 瀏覽數                                       |
| ∟ shares_count   | int32    | false    | 分享數                                       |
| ∟ detail_url     | string   | false    | 討論詳情頁鏈接                               |
| ∟ author         | object   | false    | 作者信息                                     |
| ∟∟ member_id     | string   | false    | 作者 member ID                               |
| ∟∟ name          | string   | false    | 作者暱稱                                     |
| ∟∟ avatar        | string   | false    | 作者頭像 URL                                 |
| ∟ created_at     | string   | true     | 創建時間，Unix 時間戳（秒）                  |
| ∟ updated_at     | string   | false    | 最後更新時間，Unix 時間戳（秒）              |
