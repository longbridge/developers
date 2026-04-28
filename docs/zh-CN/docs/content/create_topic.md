---
slug: create-topic
title: 创建讨论
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

创建一篇新讨论。支持两种内容类型：

| 类型 | `title` | `body` 格式 | 说明 |
|------|---------|-------------|------|
| `post`（默认） | 可选 | 纯文本 | Markdown 语法（如 `**加粗**`、`# 标题`）**不会渲染**，将作为字面字符显示，类似发推文。 |
| `article` | **必填** | Markdown | 服务端将 Markdown 转为 HTML 展示，支持标题、表格、加粗、代码块等。 |

仅限 **Longbridge 开户且持有资产** 的用户才允许通过 Longbridge Developers 的 API 或 CLI 发布社区讨论和回复。否则返回 `403`。

<TipContainer type="tip">
正文中提到的标的代码（如 `700.HK`、`TSLA.US`）会被平台自动识别并关联为相关标的。`tickers` 字段用于补充正文中未显式提及的标的。

> ⚠️ 请勿滥用此功能关联与内容无关的标的，否则后台内容运营可能会限制发布，甚至有可能禁言。
</TipContainer>

**频率限制：** 同一用户每分钟最多创建 3 篇，24 小时内最多 10 篇，超出返回 `429`。

> ⚠️ 以上频率限制规则仅供参考，平台可能随时进行内部调整。

<CliCommand>
# 发布 Tesla 相关话题
longbridge topic create TSLA.US "Tesla Q1 财报分析"
# 发布 Apple 相关话题
longbridge topic create AAPL.US "Apple WWDC 前瞻"
</CliCommand>

<SDKLinks module="content" klass="ContentContext" method="create_topic" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/content/topics</td></tr>
</tbody>
</table>

### Request Body

| Name        | Type     | Required              | Description                                                                                           |
| ----------- | -------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| title       | string   | 是（article 类型必填） | 标题。`topic_type` 为 `article` 时必填，`post` 时可省略。                                              |
| body        | string   | YES                   | 正文。`post` 类型为纯文本，Markdown 不渲染；`article` 类型支持 Markdown。                              |
| topic_type  | string   | NO                    | 内容类型：`post`（纯文本，默认）或 `article`（Markdown）                                               |
| tickers     | string[] | NO                    | 关联标的代码，格式 `{symbol}.{market}`，如 `["AAPL.US", "700.HK"]`，最多 10 个。**注意：** 正文中提到的标的代码（如 `700.HK`、`TSLA.US`）会被平台自动识别并关联，`tickers` 用于补充正文中未显式提及的标的。 |
| hashtags    | string[] | NO                    | 讨论标签名称列表，如 `["earnings", "fed"]`，最多 1 个                                                  |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

```bash
# 短帖 — 纯文本（默认），Markdown 不渲染
longbridge topic create --body "今天看好 700.HK"

# 短帖 + 关联标的
longbridge topic create --body "NVDA GTC 看点" --tickers NVDA.US,700.HK

# 长文 — 支持 Markdown，必须填写标题
longbridge topic create --title "我的分析" --body "**看好** 700.HK，因为..." --type article

# 长文 — 从 Markdown 文件读取正文
longbridge topic create --title "Q4 财报前瞻" --body "$(cat analysis.md)" --type article

# JSON 输出
longbridge topic create --body "测试帖" --format json
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ContentContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ContentContext(config)

# 短帖（纯文本）
resp = ctx.create_topic(
    title="",
    body="今天看好 700.HK",
    topic_type="post",
    tickers=["700.HK"],
)
print(resp)

# 长文（Markdown，标题必填）
resp = ctx.create_topic(
    title="我的分析",
    body="**看好** 700.HK，因为...",
    topic_type="article",
    tickers=["700.HK"],
    license=1,
)
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

    resp = await ctx.create_topic(
        title="我的分析",
        body="**看好** 700.HK，因为...",
        topic_type="article",
        tickers=["700.HK"],
    )
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, ContentContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = ContentContext.new(config)

  // 长文（Markdown，标题必填）
  const resp = await ctx.createTopic({
    title: "我的分析",
    body: "**看好** 700.HK，因为...",
    topicType: "article",
    tickers: ["700.HK"],
  })
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
            // 长文（Markdown，标题必填）
            CreateTopicOptions opts = new CreateTopicOptions("我的分析", "**看好** 700.HK，因为...")
                .setTopicType("article")
                .setTickers(new String[]{"700.HK"})
                .setLicense(1);
            OwnedTopic resp = ctx.createTopic(opts).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, content::{ContentContext, CreateTopicOptions}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ContentContext::new(config);

    // 长文（Markdown，标题必填）
    let opts = CreateTopicOptions {
        title: "我的分析".to_string(),
        body: "**看好** 700.HK，因为...".to_string(),
        topic_type: Some("article".to_string()),
        tickers: Some(vec!["700.HK".to_string()]),
        hashtags: None,
        license: Some(1),
    };
    let resp = ctx.create_topic(opts).await?;
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

    // 长文（Markdown，标题必填）
    CreateTopicOptions opts;
    opts.title = "我的分析";
    opts.body = "**看好** 700.HK，因为...";
    opts.topic_type = "article";
    opts.tickers = {"700.HK"};

    ctx.create_topic(opts, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "created topic: " << res->id << std::endl;
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
	// 长文（Markdown，标题必填）
	opts := content.CreateTopicOptions{
		Title:     "我的分析",
		Body:      "**看好** 700.HK，因为...",
		TopicType: "article",
		Tickers:   []string{"700.HK"},
	}
	resp, err := ctx.CreateTopic(context.Background(), opts)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("created topic: %s\n", resp.ID)
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
      "id": "39304657",
      "title": "我对苹果的看法",
      "topic_type": "article",
      "tickers": ["AAPL.US"],
      "hashtags": ["earnings"],
      "created_at": "1742000000"
    }
  }
}
```

### Response Status

| Status | Description | Schema                                                |
| ------ | ----------- | ----------------------------------------------------- |
| 200    | 返回成功    | [create_topic_response](#schemacreate_topic_response) |
| 403    | 权限不足    | 用户未开户或无资产                                    |
| 429    | 频率超限    | 超过每分钟或每日创建上限，请稍后重试                  |
| 500    | 内部错误    | None                                                  |

## Schemas

### create_topic_response

<a id="schemacreate_topic_response"></a>

| Name                | Type     | Required | Description                          |
| ------------------- | -------- | -------- | ------------------------------------ |
| item                | object   | true     | 新建讨论详情                         |
| ∟ id                | string   | true     | 讨论 ID                              |
| ∟ title             | string   | false    | 标题                                 |
| ∟ description       | string   | false    | 纯文本摘要（由正文自动截取）         |
| ∟ body              | string   | false    | 完整正文（`article` 类型为 Markdown）|
| ∟ topic_type        | string   | false    | 内容类型，`article` 或 `post`        |
| ∟ tickers           | string[] | false    | 关联标的代码                         |
| ∟ hashtags          | string[] | false    | 讨论标签名称列表                     |
| ∟ images            | object[] | false    | 附图列表                             |
| ∟∟ url              | string   | false    | 原始图片 URL                         |
| ∟∟ sm               | string   | false    | 小缩略图 URL                         |
| ∟∟ lg               | string   | false    | 大缩略图 URL                         |
| ∟ likes_count       | int32    | false    | 点赞数                               |
| ∟ comments_count    | int32    | false    | 回复数                               |
| ∟ views_count       | int32    | false    | 浏览数                               |
| ∟ shares_count      | int32    | false    | 分享数                               |
| ∟ detail_url        | string   | false    | 讨论页面直链                         |
| ∟ author            | object   | false    | 作者信息                             |
| ∟∟ member_id        | string   | false    | 作者 member ID                       |
| ∟∟ name             | string   | false    | 作者昵称                             |
| ∟∟ avatar           | string   | false    | 作者头像 URL                         |
| ∟ created_at        | string   | true     | 创建时间，Unix 时间戳（秒）          |
| ∟ updated_at        | string   | false    | 最近更新时间，Unix 时间戳（秒）      |
