---
slug: screener-recommend-strategies
title: 推薦選股策略
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取平台推薦的選股策略列表，含近期平均日漲跌幅和策略內股票。

<CliCommand>
longbridge screener strategies
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_recommend_strategies" />


## Parameters

> **SDK 方法參數。**

此方法無參數。

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ScreenerContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ScreenerContext(config)

resp = ctx.screener_recommend_strategies()
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncScreenerContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncScreenerContext.create(config)

    resp = await ctx.screener_recommend_strategies()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, ScreenerContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = ScreenerContext.new(config)
  const resp = await ctx.screenerRecommendStrategies()
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.screener.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             ScreenerContext ctx = ScreenerContext.create(config)) {
            var resp = ctx.getScreenerRecommendStrategies().get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, screener::ScreenerContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = ScreenerContext::new(config);
    let resp = ctx.screener_recommend_strategies().await?;
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
using namespace longbridge::screener;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            ScreenerContext ctx = ScreenerContext::create(config);
            ctx.screener_recommend_strategies([](auto resp) {
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
	"github.com/longbridge/openapi-go/screener"
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
	c, err := screener.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.ScreenerRecommendStrategies(context.Background())
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
    "screeners": [
      {
        "id": "1",
        "name": "高股息藍籌股",
        "groups": [
          {
            "group_name": "範圍",
            "group_type": "range",
            "indicators": [
              { "id": -1, "key": "filter_market", "name": "港股", "unit": "", "min": "", "max": "", "value": "HK", "tech_data": [] }
            ]
          },
          {
            "group_name": "分紅指標",
            "group_type": "DividendIndex",
            "indicators": [
              { "id": 29, "key": "filter_divyld", "name": "股息率 (TTM)", "unit": "%", "min": "4", "max": "", "value": "", "tech_data": [] }
            ]
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
| 200    | 成功        | [ScreenerStrategiesResponse](#ScreenerStrategiesResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### ScreenerStrategiesResponse

<a id="ScreenerStrategiesResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| screeners | object[] | false | 策略列表 |
| ∟ id | string | false | 策略 ID |
| ∟ name | string | false | 策略名稱 |
| ∟ groups | object[] | false | 策略過濾條件分組 |
| ∟ ∟ group_name | string | false | 分組名稱 |
| ∟ ∟ group_type | string | false | 分組類型（如 `range`、`Quotes`、`DividendIndex`） |
| ∟ ∟ indicators | object[] | false | 該分組下的指標條件 |
| ∟ ∟ ∟ id | integer | false | 指標 ID |
| ∟ ∟ ∟ key | string | false | 指標鍵值，可用於 `screener_search` |
| ∟ ∟ ∟ name | string | false | 指標名稱 |
| ∟ ∟ ∟ unit | string | false | 指標單位 |
| ∟ ∟ ∟ min | string | false | 策略設定的最小值；空字符串表示無下限 |
| ∟ ∟ ∟ max | string | false | 策略設定的最大值；空字符串表示無上限 |
| ∟ ∟ ∟ value | string | false | 固定值（用於非範圍型指標，如市場選擇器） |
| ∟ ∟ ∟ tech_data | array | false | 技術指標數據數組 |
