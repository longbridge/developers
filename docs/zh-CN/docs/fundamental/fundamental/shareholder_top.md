---
slug: shareholder-top
title: 大股东排行
sidebar_position: 27
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取上市公司前20大股东（机构、个人、内部人）的持股数据，支持多报告期对比。`object_id` 可传入 `shareholder_detail` 查看详情。

<CliCommand>
longbridge shareholder AAPL.US --top
longbridge shareholder 700.HK --top
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="shareholder_top" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 证券代码，例如 `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.shareholder_top("AAPL.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncFundamentalContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncFundamentalContext.create(config)

    resp = await ctx.shareholder_top("AAPL.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.shareholderTop('AAPL.US')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.fundamental.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             FundamentalContext ctx = FundamentalContext.create(config)) {
            var resp = ctx.getShareholderTop("AAPL.US").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, fundamental::FundamentalContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.shareholder_top("AAPL.US").await?;
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
using namespace longbridge::fundamental;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            FundamentalContext ctx = FundamentalContext::create(config);
            ctx.shareholder_top("AAPL.US", [](auto resp) {
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
	"github.com/longbridge/openapi-go/fundamental"
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
	c, err := fundamental.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.ShareholderTop(context.Background(), "AAPL.US")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response


### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "periods": ["2025-12-31", "2025-09-30"],
    "info": [
      {
        "period": "2025-12-31",
        "share_holders": [
          {
            "object_id": 19463,
            "name": "The Vanguard Group, Inc.",
            "title": "机构",
            "shares_held": "1285506048",
            "percent_shares_held": "8.46",
            "shares_changed": "5812736",
            "filing_date": "2026-02-14"
          },
          {
            "object_id": 20181,
            "name": "BlackRock, Inc.",
            "title": "机构",
            "shares_held": "1071234816",
            "percent_shares_held": "7.05",
            "shares_changed": "-3104128",
            "filing_date": "2026-02-05"
          }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [ShareholderTopResponse](#ShareholderTopResponse) |
| 400    | 请求错误    | None   |

## Schemas

### ShareholderTopResponse

<a id="ShareholderTopResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| periods | string[] | false | 可用的报告期列表，格式 `YYYY-MM-DD` |
| info | object[] | false | 各报告期的股东数据 |
| ∟ period | string | false | 报告期，格式 `YYYY-MM-DD` |
| ∟ share_holders | object[] | false | 股东列表（最多 20 条） |
| ∟ ∟ object_id | integer | false | 股东唯一 ID，可传入 `shareholder_detail` |
| ∟ ∟ name | string | false | 股东名称 |
| ∟ ∟ title | string | false | 股东类型（机构 / 个人 / 内部人） |
| ∟ ∟ shares_held | string | false | 持股数量 |
| ∟ ∟ percent_shares_held | string | false | 持股比例（百分比） |
| ∟ ∟ shares_changed | string | false | 持股变动数量（正增负减） |
| ∟ ∟ filing_date | string | false | 申报日期，格式 `YYYY-MM-DD` |
