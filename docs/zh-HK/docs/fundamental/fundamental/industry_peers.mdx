---
slug: industry-peers
title: 行業子板塊層級樹
sidebar_position: 25
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取行業分組的層級子板塊樹，含各節點股票數量、日漲跌幅和年初至今漲跌幅。Counter ID 可從 `industry_rank` 返回結果中獲取。

<CliCommand>
longbridge industry-peers BK/US/IN00258
longbridge industry-peers BK/HK/IN20337
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="industry_peers" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| counter_id | string | 是 | 行業唯一標識（BK/市場/ID 格式），來源於 `industry_rank` |
| market | string | 是 | 市場代碼：`US` / `HK` / `CN` / `SG` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.industry_peers("BK/US/IN00258", "US")
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

    resp = await ctx.industry_peers("BK/US/IN00258", "US")
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
  const resp = await ctx.industryPeers('BK/US/IN00258', 'US')
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
            var resp = ctx.getIndustryPeers("BK/US/IN00258", "US").get();
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
    let resp = ctx.industry_peers("BK/US/IN00258", "US").await?;
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
            ctx.industry_peers("BK/US/IN00258", "US", [](auto resp) {
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
	resp, err := c.IndustryPeers(context.Background(), "BK/US/IN00258", "US")
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
    "top": {"name": "All Industries", "market": "US"},
    "chain": {
      "name": "Technology",
      "counter_id": "BK/US/IN00258",
      "stock_num": 542,
      "chg": "0.0231",
      "ytd_chg": "0.0875",
      "next": [
        {
          "name": "在线消费电子产品零售",
          "counter_id": "",
          "stock_num": 4,
          "chg": "0.0268",
          "ytd_chg": "-0.1869",
          "next": []
        }
      ]
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [IndustryPeersResponse](#IndustryPeersResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### IndustryPeersResponse

<a id="IndustryPeersResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| top | object | 否 | 頂層行業資訊，見 [IndustryPeersTop](#IndustryPeersTop) |
| chain | object | 否 | 行業層級樹根節點，見 [IndustryPeerNode](#IndustryPeerNode) |

### IndustryPeersTop

<a id="IndustryPeersTop"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | string | 否 | 頂層行業名稱 |
| market | string | 否 | 市場代碼 |

### IndustryPeerNode

<a id="IndustryPeerNode"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | string | 否 | 板塊名稱 |
| counter_id | string | 否 | 板塊唯一標識（根節點有值，子節點為空字串） |
| stock_num | integer | 否 | 板塊內股票數量 |
| chg | string | 否 | 當日漲跌幅（小數，可能為空字串） |
| ytd_chg | string | 否 | 年初至今漲跌幅（小數，可能為空字串） |
| next | object[] | 否 | 子板塊列表，結構與當前節點相同（遞迴） |
