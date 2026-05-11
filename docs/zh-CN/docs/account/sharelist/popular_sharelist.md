---
slug: popular-sharelist
title: 热门股单
sidebar_position: 6
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取社区热门股单列表。

<CliCommand>
longbridge sharelist popular --count 10
</CliCommand>

<SDKLinks module="sharelist" klass="SharelistContext" method="popular" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/sharelist/popular</td></tr>
</tbody>
</table>

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| count | integer | 否 | 返回数量上限，默认 20 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import SharelistContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = SharelistContext(config)

resp = ctx.popular(10)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncSharelistContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncSharelistContext.create(config)

    resp = await ctx.popular(10)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, SharelistContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = SharelistContext.new(config)
  const resp = await ctx.popular(10)
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.sharelist.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             SharelistContext ctx = SharelistContext.create(config)) {
            var resp = ctx.popular(10).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, sharelist::SharelistContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = SharelistContext::new(config);
    let resp = ctx.popular(10).await?;
    println!("{:?}", resp);
    Ok(())
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
	"github.com/longbridge/openapi-go/sharelist"
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
	c, err := sharelist.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.Popular(context.Background(), 10)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
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
    "list": [
      { "id": 123, "name": "AI Picks", "description": "Top AI infrastructure stocks" },
      { "id": 456, "name": "EV Leaders", "description": "Electric vehicle sector leaders" }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [SharelistListResponse](#SharelistListResponse) |
| 400    | 请求错误    | None   |

## Schemas

### SharelistListResponse

<a id="SharelistListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| sharelists | object[] | false | 用户自建股单列表 |
| subscribed_sharelists | object[] | false | 已订阅股单列表 |
| tail_mark | string | false | 已订阅列表的分页游标 |

### SharelistInfo

<a id="SharelistInfo"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | integer | true | 股单 ID |
| name | string | false | 股单名称 |
| description | string | false | 描述 |
| cover | string | false | 封面图片 URL |
| subscribers_count | integer | false | 订阅人数 |
| chg | string | false | 日涨跌幅 |
| this_year_chg | string | false | 今年以来涨跌幅 |
| subscribed | boolean | false | 当前用户是否已订阅 |
| sharelist_type | integer | false | 类型：`0`=普通，`3`=官方，`4`=行业 |
| industry_code | string | false | 行业代码（行业股单适用） |
| stocks | object[] | false | 成份股列表 |

### SharelistStock

<a id="SharelistStock"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | true | 证券代码 |
| code | string | false | 股票代码 |
| name | string | false | 证券名称 |
| market | string | false | 市场 |
| intro | string | false | 简介 |
| last_done | string | false | 最新价格 |
| change | string | false | 日涨跌幅 |
| trade_status | integer | false | 交易状态码 |
