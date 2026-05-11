---
slug: list-sharelist
title: 獲取自選列表
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取當前用戶創建的或訂閱的所有社區自選股列表。

<CliCommand>
longbridge sharelist
longbridge sharelist --format json
</CliCommand>

<SDKLinks module="sharelist" klass="SharelistContext" method="list_sharelist" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/community/sharelists</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| type | string | 否 | 篩選：`mine`（我創建的）或 `subscribed`（我訂閱的），不傳則返回兩者 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import SharelistContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = SharelistContext(config)

resp = ctx.list_sharelist()
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

    resp = await ctx.list_sharelist()
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
  const resp = await ctx.list_sharelist()
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
            var resp = ctx.getListSharelist().get();
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
    let resp = ctx.list_sharelist().await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

using namespace longbridge;
using namespace longbridge::sharelist;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            SharelistContext ctx = SharelistContext::create(config);
            ctx.list_sharelist([](auto resp) {
                if (resp) std::cout << "OK" << std::endl;
            });
        });
    std::cin.get();
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
	resp, err := c.ListSharelist(context.Background())
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
    "mine": [
      {
        "id": 15921,
        "name": "AI Picks",
        "type": "Regular",
        "day_change": "-0.40",
        "ytd_change": "6.64",
        "subscribers": 500
      }
    ],
    "subscribed": []
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [SharelistListResponse](#SharelistListResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### SharelistListResponse

<a id="SharelistListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| sharelists | object[] | false | 用戶自建股單列表 |
| subscribed_sharelists | object[] | false | 已訂閱股單列表 |
| tail_mark | string | false | 已訂閱列表的分頁游標 |

### SharelistInfo

<a id="SharelistInfo"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | integer | true | 股單 ID |
| name | string | false | 股單名稱 |
| description | string | false | 描述 |
| cover | string | false | 封面圖片 URL |
| subscribers_count | integer | false | 訂閱人數 |
| chg | string | false | 日漲跌幅 |
| this_year_chg | string | false | 今年以來漲跌幅 |
| subscribed | boolean | false | 當前用戶是否已訂閱 |
| sharelist_type | integer | false | 類型：`0`=普通，`3`=官方，`4`=行業 |
| industry_code | string | false | 行業代碼（行業股單適用） |
| stocks | object[] | false | 成份股列表 |

### SharelistStock

<a id="SharelistStock"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | true | 證券代碼 |
| code | string | false | 股票代碼 |
| name | string | false | 證券名稱 |
| market | string | false | 市場 |
| intro | string | false | 簡介 |
| last_done | string | false | 最新價格 |
| change | string | false | 日漲跌幅 |
| trade_status | integer | false | 交易狀態碼 |
