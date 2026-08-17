---
slug: business-segments-history
title: 业务分部（历史趋势）
sidebar_position: 22
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取上市公司按报告期的历史业务分部收入趋势。

<CliCommand>
longbridge business-segments AAPL.US --history
longbridge business-segments AAPL.US --history --report qf
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="business_segments_history" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 证券代码，例如 `AAPL.US` |
| report | string | 否 | 报告类型：`qf`（季报）/ `saf`（半年报）/ `af`（年报） |
| cate | string | 否 | 分部类别过滤 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.business_segments_history("AAPL.US", report="qf")
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

    resp = await ctx.business_segments_history("AAPL.US", report="qf")
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
  const resp = await ctx.businessSegmentsHistory('AAPL.US', { report: 'qf' })
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
            var resp = ctx.getBusinessSegmentsHistory("AAPL.US", "qf", null).get();
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
    let resp = ctx.business_segments_history("AAPL.US", Some("qf"), None).await?;
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
            ctx.business_segments_history("AAPL.US", "qf", "", [](auto resp) {
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
	resp, err := c.BusinessSegmentsHistory(context.Background(), "AAPL.US", "qf", "")
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
    "historical": [
      {
        "date": "20260331",
        "total": "124300000000",
        "currency": "USD",
        "business": [
          {"name": "美洲", "percent": "40.80", "value": "31968000000"},
          {"name": "欧洲", "percent": "23.64", "value": "18521000000"},
          {"name": "大中华区", "percent": "20.72", "value": "16233000000"}
        ],
        "regionals": []
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [BusinessSegmentsHistoryResponse](#BusinessSegmentsHistoryResponse) |
| 400    | 请求错误    | None   |

## Schemas

### BusinessSegmentsHistoryResponse

<a id="BusinessSegmentsHistoryResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| historical | object[] | 否 | 历史报告期列表 |
| ∟ date | string | 否 | 报告期，格式 YYYYMMDD，例如 `20260331` |
| ∟ total | string | 否 | 当期总收入 |
| ∟ currency | string | 否 | 货币代码 |
| ∟ business | object[] | 否 | 业务分部列表 |
| ∟ ∟ name | string | 否 | 业务分部名称 |
| ∟ ∟ percent | string | 否 | 收入占比（百分比，例如 `40.80`） |
| ∟ ∟ value | string | 否 | 绝对收入数值 |
| ∟ regionals | object[] | 否 | 地区分部列表（当前通常为空数组） |
| ∟ ∟ name | string | 否 | 地区名称 |
| ∟ ∟ percent | string | 否 | 收入占比（百分比） |
| ∟ ∟ value | string | 否 | 绝对收入数值 |
