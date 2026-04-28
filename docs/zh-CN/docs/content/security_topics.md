---
slug: topics
title: 获取标的社区讨论
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取指定股票的讨论列表。

<CliCommand>
# Tesla 社区讨论帖子
longbridge topics TSLA.US
# Apple 社区讨论帖子
longbridge topics AAPL.US
# NVDA 社区讨论帖子
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

| Name   | Type   | Required | Description                                    |
| ------ | ------ | -------- | ---------------------------------------------- |
| symbol | string | YES      | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US` |

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
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = ContentContext.new(config)
  const resp = await ctx.topics("AAPL.US")
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
        "title": "英伟达 GTC 备受关注；阿里 "Token 战略" 再加码｜今日重要消息回顾",
        "description": "0317 ｜海豚君重点关注：🐬 个股 1、[st]ST/US/NVDA#英伟达.US[/st] 英伟达 GTC 2026 大会正式开幕，英伟达创始人兼 CEO 黄仁勋发表了主题演讲。宣布，其下一代 Vera Rubin 架构将推出专为空间轨道数据中心设计的 Vera Rubin Space Module，性能比 H100 提升 25 倍。同时宣布与 Groq 合作开发新型 LPU 芯片...",
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

| Status | Description | Schema                                        |
| ------ | ----------- | --------------------------------------------- |
| 200    | 返回成功    | [topics_response](#schematopics_response)     |
| 500    | 内部错误    | None                                          |

## Schemas

### topics_response

<a id="schematopics_response"></a>

| Name               | Type      | Required | Description                   |
| ------------------ | --------- | -------- | ----------------------------- |
| items              | object[]  | true     | 讨论列表                      |
| ∟ id               | string    | true     | 讨论 ID                       |
| ∟ title            | string    | true     | 标题                          |
| ∟ description      | string    | true     | 摘要/描述                     |
| ∟ url              | string    | true     | 讨论详情链接                  |
| ∟ published_at     | string    | true     | 发布时间，Unix 时间戳（秒）   |
| ∟ comments_count   | int32     | true     | 评论数                        |
| ∟ likes_count      | int32     | true     | 点赞数                        |
| ∟ shares_count     | int32     | true     | 分享数                        |
