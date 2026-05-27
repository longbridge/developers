---
slug: dca-history
title: 定投交易历史
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取指定定投的执行历史，包含交易日期、金额和价格。

<CliCommand>
longbridge dca history 1225781523156889600
</CliCommand>

<SDKLinks module="dca" klass="DCAContext" method="history" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | string | 是 | 计划 ID（路径参数） |
| page | integer | 否 | 页码（从 1 开始，默认：1） |
| size | integer | 否 | 每页数量（默认：20） |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import DCAContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = DCAContext(config)

resp = ctx.dca_history("1225781523156889600")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncDCAContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncDCAContext.create(config)

    resp = await ctx.dca_history("1225781523156889600")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, DCAContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = DCAContext.new(config)
  const resp = await ctx.dca_history()
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.dca.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             DCAContext ctx = DCAContext.create(config)) {
            var resp = ctx.getDcaHistory().get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, dca::DCAContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = DCAContext::new(config);
    let resp = ctx.dca_history().await?;
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
using namespace longbridge::dca;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            DCAContext ctx = DCAContext::create(config);
            ctx.dca_history([](auto resp) {
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
	"github.com/longbridge/openapi-go/dca"
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
	c, err := dca.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.DcaHistory(context.Background())
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
    "has_more": false,
    "records": [
      {
        "symbol": "AAPL.US",
        "order_id": "123456",
        "status": "Filled",
        "action": "Buy",
        "order_type": "Market",
        "executed_qty": "1",
        "executed_price": "180.50",
        "executed_amount": "180.50",
        "created_at": "1763769600",
        "rejected_reason": ""
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [DcaHistoryResponse](#DcaHistoryResponse) |
| 400    | 请求错误    | None   |

## Schemas

### DcaHistoryResponse

<a id="DcaHistoryResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| records | object[] | true | 执行记录列表， |
| ∟ symbol | string | true | 证券代码 |
| ∟ order_id | string | false | 关联订单 ID |
| ∟ status | string | false | 执行状态 |
| ∟ action | string | false | 操作类型 |
| ∟ order_type | string | false | 订单类型 |
| ∟ executed_qty | string | false | 成交数量 |
| ∟ executed_price | string | false | 成交价格 |
| ∟ executed_amount | string | false | 成交金额 |
| ∟ rejected_reason | string | false | 拒绝原因（如有） |
| ∟ created_at | string | false | 执行时间 |
| ∟ created_at | string | false | 执行时间 |
| ∟ rejected_reason | string | false | 拒绝原因（如有） |
| has_more | boolean | false | 是否有更多记录 |
