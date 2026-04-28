---
slug: my-topics
title: 獲取我發布的討論
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取當前登錄用戶發布的討論列表，支持分頁與類型過濾。

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

| Name        | Type   | Required | Description                                                                    |
| ----------- | ------ | -------- | ------------------------------------------------------------------------------ |
| page        | int32  | NO       | 頁碼，默認 1                                                                   |
| size        | int32  | NO       | 每頁數量，範圍 1~500，默認 50                                                  |
| topic_type  | string | NO       | 類型過濾，可選 `article`（長文）、`post`（短帖），不傳返回全部                  |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

```bash
longbridge topic mine                           # 全部類型（默認每頁 50 條）
longbridge topic mine --type article            # 僅長文
longbridge topic mine --type post --size 10     # 短帖，每頁 10 條
longbridge topic mine --page 2                  # 第二頁
longbridge topic mine --format json             # JSON 格式，適合腳本處理
```

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
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = ContentContext.new(config)
  const resp = await ctx.topicsMine({ page: 1, size: 50, topicType: "article" })
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
        "title": "我對蘋果的分析",
        "description": "文章摘要...",
        "body": "Markdown 正文內容...",
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
          "name": "張三",
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

| Status | Description | Schema                                            |
| ------ | ----------- | ------------------------------------------------- |
| 200    | 返回成功    | [my_topics_response](#schemamy_topics_response)   |
| 500    | 內部錯誤    | None                                              |

## Schemas

### my_topics_response

<a id="schemamy_topics_response"></a>

| Name                | Type     | Required | Description                                                       |
| ------------------- | -------- | -------- | ----------------------------------------------------------------- |
| items               | object[] | true     | 討論列表                                                          |
| ∟ id                | string   | true     | 討論 ID                                                           |
| ∟ title             | string   | false    | 標題（短帖可能為空）                                              |
| ∟ description       | string   | false    | 純文本摘要                                                        |
| ∟ body              | string   | false    | Markdown 格式正文                                                 |
| ∟ topic_type        | string   | true     | 內容類型，`article`（長文）或 `post`（短帖）                       |
| ∟ tickers           | string[] | false    | 關聯標的代碼，如 `["AAPL.US", "700.HK"]`                         |
| ∟ hashtags          | string[] | false    | 討論標籤名稱列表                                                  |
| ∟ images            | object[] | false    | 附圖列表                                                          |
| ∟∟ url              | string   | false    | 原始圖片 URL                                                      |
| ∟∟ sm               | string   | false    | 小縮略圖 URL                                                      |
| ∟∟ lg               | string   | false    | 大縮略圖 URL                                                      |
| ∟ likes_count       | int32    | false    | 點讚數                                                            |
| ∟ comments_count    | int32    | false    | 評論數                                                            |
| ∟ views_count       | int32    | false    | 瀏覽數                                                            |
| ∟ shares_count      | int32    | false    | 分享數                                                            |
| ∟ license           | int32    | false    | 版權聲明，`0`=無聲明，`1`=原創，`2`=非原創                        |
| ∟ detail_url        | string   | false    | 討論詳情頁連結                                                    |
| ∟ author            | object   | false    | 作者信息                                                          |
| ∟∟ member_id        | string   | false    | 作者 member ID                                                    |
| ∟∟ name             | string   | false    | 作者昵稱                                                          |
| ∟∟ avatar           | string   | false    | 作者頭像 URL                                                      |
| ∟ created_at        | string   | true     | 創建時間，Unix 時間戳（秒）                                       |
| ∟ updated_at        | string   | false    | 最後更新時間，Unix 時間戳（秒）                                   |
