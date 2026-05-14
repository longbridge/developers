---
slug: create-topic-reply
title: 创建讨论回复
sidebar_position: 7
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

在指定讨论下发布回复，支持嵌套回复已有回复。

仅限 **Longbridge 开户且持有资产** 的用户才允许通过 Longbridge Developers 的 API 或 CLI 发布社区讨论和回复。否则返回 `403`。

**正文格式：** 仅支持纯文本，不支持 HTML 或 Markdown。

<TipContainer type="tip">
正文中提到的标的代码（如 `700.HK`、`TSLA.US`）会被平台自动识别并关联为相关标的。

⚠️ 请勿滥用此功能关联与内容无关的标的，否则后台内容运营可能会限制发布，甚至有可能禁言。
</TipContainer>

**频率限制：** 同一用户在同一讨论下，前 3 条无间隔限制；此后每条须与上一条保持递增间隔（3 s → 5 s → 8 s → 13 s → 21 s → 34 s → 55 s 封顶），超出限制返回 `429`。

> ⚠️ 以上频率限制规则仅供参考，平台可能随时进行内部调整。

<CliCommand>
longbridge topic create-reply 6993508780031016960 --body "分析得很好！"
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
| topic_id | string | YES      | 讨论 ID，如 `6993508780031016960` |

### Request Body

| Name        | Type   | Required | Description                                                                    |
| ----------- | ------ | -------- | ------------------------------------------------------------------------------ |
| body        | string | YES      | 回复正文，仅支持纯文本。正文中提到的标的代码会被平台自动识别并关联。           |
| reply_to_id | string | NO       | 被回复的回复 ID；不填或填 `"0"` 表示发顶层回复，填入有效 ID 则嵌套在该回复下。 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

```bash
# 顶层回复
longbridge topic create-reply 6993508780031016960 --body "分析得很好！"

# 嵌套回复
longbridge topic create-reply 6993508780031016960 --body "同意你的观点。" --reply-to 7001234567890123456
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

# 顶层回复
reply = ctx.create_topic_reply("6993508780031016960", body="分析得很好！")
print(reply.id)

# 嵌套回复
nested = ctx.create_topic_reply(
    "6993508780031016960",
    body="同意你的观点。",
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
	// 顶层回复
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

    // 顶层回复
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
        "name": "张三",
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
| 403    | 权限不足    | 用户未开户或无资产                                    |
| 429    | 频率超限    | 超过同讨论下的发帖频率限制，请等待后重试              |
| 500    | 内部错误    | None                                                  |

## Schemas

### create_reply_response

<a id="schemacreate_reply_response"></a>

| Name             | Type     | Required | Description                   |
| ---------------- | -------- | -------- | ----------------------------- |
| item             | object   | true     | 新建回复详情                  |
| ∟ id             | string   | true     | 回复 ID                       |
| ∟ topic_id       | string   | true     | 所属讨论 ID                   |
| ∟ body           | string   | false    | 回复正文（纯文本）            |
| ∟ reply_to_id    | string   | false    | 父回复 ID，`"0"` 表示顶层回复 |
| ∟ author         | object   | false    | 作者信息                      |
| ∟∟ member_id     | string   | false    | 作者 member ID                |
| ∟∟ name          | string   | false    | 作者昵称                      |
| ∟∟ avatar        | string   | false    | 作者头像 URL                  |
| ∟ images         | object[] | false    | 附图列表                      |
| ∟∟ url           | string   | false    | 原始图片 URL                  |
| ∟∟ sm            | string   | false    | 小缩略图 URL                  |
| ∟∟ lg            | string   | false    | 大缩略图 URL                  |
| ∟ likes_count    | int32    | false    | 点赞数                        |
| ∟ comments_count | int32    | false    | 嵌套回复数                    |
| ∟ created_at     | string   | true     | 创建时间，Unix 时间戳（秒）   |
