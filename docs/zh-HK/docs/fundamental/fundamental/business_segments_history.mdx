---
slug: business-segments-history
title: 業務分部（歷史趨勢）
sidebar_position: 22
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取上市公司按報告期的歷史業務分部收入趨勢。

<CliCommand>
longbridge business-segments AAPL.US --history
longbridge business-segments AAPL.US --history --report qf
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="business_segments_history" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 證券代碼，例如 `AAPL.US` |
| report | string | 否 | 報告類型：`qf`（季報）/ `saf`（半年報）/ `af`（年報） |
| cate | string | 否 | 分部類別過濾 |

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
| 400    | 請求錯誤    | None   |

## Schemas

### BusinessSegmentsHistoryResponse

<a id="BusinessSegmentsHistoryResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| historical | object[] | 否 | 歷史報告期列表 |
| ∟ date | string | 否 | 報告期，格式 YYYYMMDD，例如 `20260331` |
| ∟ total | string | 否 | 當期總收入 |
| ∟ currency | string | 否 | 貨幣代碼 |
| ∟ business | object[] | 否 | 業務分部列表 |
| ∟ ∟ name | string | 否 | 業務分部名稱 |
| ∟ ∟ percent | string | 否 | 收入佔比（百分比，例如 `40.80`） |
| ∟ ∟ value | string | 否 | 絕對收入數值 |
| ∟ regionals | object[] | 否 | 地區分部列表（當前通常為空數組） |
| ∟ ∟ name | string | 否 | 地區名稱 |
| ∟ ∟ percent | string | 否 | 收入佔比（百分比） |
| ∟ ∟ value | string | 否 | 絕對收入數值 |
