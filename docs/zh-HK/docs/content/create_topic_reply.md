---
slug: create-topic-reply
title: 創建討論回覆
sidebar_position: 7
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

在指定討論下發布回覆，支持嵌套回覆已有回覆。

僅限 **Longbridge 開戶且持有資產** 的用戶才允許通過 Longbridge Developers 的 API 或 CLI 發布社區討論和回覆。否則返回 `403`。

**正文格式：** 僅支持純文本，不支持 HTML 或 Markdown。

<TipContainer type="tip">
正文中提到的標的代碼（如 `700.HK`、`TSLA.US`）會被平台自動識別並關聯為相關標的。

⚠️ 請勿濫用此功能關聯與內容無關的標的，否則後台內容運營可能會限制發布，甚至有可能禁言。
</TipContainer>

**頻率限制：** 同一用戶在同一討論下，前 3 條無間隔限制；此後每條須與上一條保持遞增間隔（3 s → 5 s → 8 s → 13 s → 21 s → 34 s → 55 s 封頂），超出限制返回 `429`。

> ⚠️ 以上頻率限制規則僅供參考，平台可能隨時進行內部調整。

<CliCommand>
longbridge topic create-reply 6993508780031016960 --body "分析得好！"
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

| Name     | Type   | Required | Description                       |
| -------- | ------ | -------- | --------------------------------- |
| topic_id | string | YES      | 討論 ID，如 `6993508780031016960` |

### Request Body

| Name        | Type   | Required | Description                                                                    |
| ----------- | ------ | -------- | ------------------------------------------------------------------------------ |
| body        | string | YES      | 回覆正文，僅支持純文本。正文中提到的標的代碼會被平台自動識別並關聯。           |
| reply_to_id | string | NO       | 被回覆的回覆 ID；不填或填 `"0"` 表示發頂層回覆，填入有效 ID 則嵌套在該回覆下。 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

```bash
# 頂層回覆
longbridge topic create-reply 6993508780031016960 --body "分析得很好！"

# 嵌套回覆
longbridge topic create-reply 6993508780031016960 --body "同意你的觀點。" --reply-to 7001234567890123456
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

# 頂層回覆
reply = ctx.create_topic_reply("6993508780031016960", body="分析得很好！")
print(reply.id)

# 嵌套回覆
nested = ctx.create_topic_reply(
    "6993508780031016960",
    body="同意你的觀點。",
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

    reply = await ctx.create_topic_reply("6993508780031016960", body="分析得很好！")
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
		&content.CreateReplyOptions{Body: "分析得很好！"},
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
        CreateReplyOptions { body: "分析得很好！".to_string(), reply_to_id: None },
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
      "body": "分析得很好！",
      "reply_to_id": "0",
      "author": {
        "member_id": "10086",
        "name": "張三",
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

| Status | Description | Schema                                                |
| ------ | ----------- | ----------------------------------------------------- |
| 200    | 返回成功    | [create_reply_response](#schemacreate_reply_response) |
| 403    | 權限不足    | 用戶未開戶或無資產                                    |
| 429    | 頻率超限    | 超過同討論下的發帖頻率限制，請等待後重試              |
| 500    | 內部錯誤    | None                                                  |

## Schemas

### create_reply_response

<a id="schemacreate_reply_response"></a>

| Name             | Type     | Required | Description                   |
| ---------------- | -------- | -------- | ----------------------------- |
| item             | object   | true     | 新建回覆詳情                  |
| ∟ id             | string   | true     | 回覆 ID                       |
| ∟ topic_id       | string   | true     | 所屬討論 ID                   |
| ∟ body           | string   | false    | 回覆正文（純文本）            |
| ∟ reply_to_id    | string   | false    | 父回覆 ID，`"0"` 表示頂層回覆 |
| ∟ author         | object   | false    | 作者信息                      |
| ∟∟ member_id     | string   | false    | 作者 member ID                |
| ∟∟ name          | string   | false    | 作者暱稱                      |
| ∟∟ avatar        | string   | false    | 作者頭像 URL                  |
| ∟ images         | object[] | false    | 附圖列表                      |
| ∟∟ url           | string   | false    | 原始圖片 URL                  |
| ∟∟ sm            | string   | false    | 小縮略圖 URL                  |
| ∟∟ lg            | string   | false    | 大縮略圖 URL                  |
| ∟ likes_count    | int32    | false    | 點讚數                        |
| ∟ comments_count | int32    | false    | 嵌套回覆數                    |
| ∟ created_at     | string   | true     | 創建時間，Unix 時間戳（秒）   |
