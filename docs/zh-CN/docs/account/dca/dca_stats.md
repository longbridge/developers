---
slug: dca-stats
title: 定投统计
sidebar_position: 8
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US 账户不支持
此方法需要 AP 数据中心账户（香港/新加坡）。美股数据中心账户将收到区域限制错误。AP 账户可操作任意标的，包括美股。
:::

获取定投统计汇总信息，包括总投入金额和盈亏情况。

<CliCommand>
longbridge dca stats
</CliCommand>

<SDKLinks module="dca" klass="DCAContext" method="stats" />


## Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 否 | 按标的过滤 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import DCAContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = DCAContext(config)

resp = ctx.stats()
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

    resp = await ctx.stats()
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
  const resp = await ctx.stats()
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
            var resp = ctx.stats(null).get();
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
    let resp = ctx.stats(None).await?;
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
	resp, err := c.Stats(context.Background(), nil)
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
    "active_count": "2",
    "finished_count": "1",
    "suspended_count": "0",
    "rest_days": "3",
    "total_amount": "5400",
    "total_profit": "120.50",
    "nearest_plans": [
      {
        "plan_id": "1239402174908207104",
        "symbol": "AAPL.US",
        "stock_name": "Apple Inc.",
        "market": "US",
        "status": "Active",
        "per_invest_amount": "100",
        "invest_frequency": "Monthly",
        "invest_day_of_month": "15",
        "next_trd_date": "1778853600",
        "cum_amount": "0",
        "cum_profit": "0"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [DcaStats](#DcaStats) |
| 400    | 请求错误    | None   |

## Schemas

### DcaStatsResponse

<a id="DcaStatsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| active_count | string | false | 活跃计划数量 |
| finished_count | string | false | 已完成计划数量 |
| suspended_count | string | false | 已暂停计划数量 |
| rest_days | string | false | 距下次扣款天数 |
| total_amount | string | false | 总投入金额 |
| total_profit | string | false | 总盈亏 |
| nearest_plans | object[] | false | 最近即将执行的定投计划（结构与 DcaPlan 一致） |

> `nearest_plans` 的子项结构与 [查看定投计划](./list-dca) 中的 `DcaPlan` 一致。