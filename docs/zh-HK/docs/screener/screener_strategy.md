---
slug: screener-strategy
title: 選股策略詳情
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

根據策略 ID 獲取單個選股策略的完整配置，包含所有指標分組和各指標的篩選範圍。

<CliCommand>
longbridge screener strategies --id 42
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_strategy" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | integer | 是 | 策略 ID，來自 `screener_recommend_strategies` 或 `screener_user_strategies` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ScreenerContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ScreenerContext(config)

resp = ctx.screener_strategy(42)
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

    resp = await ctx.screener_strategy(42)
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
  const resp = await ctx.screenerStrategy(42)
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
            var resp = ctx.getScreenerStrategy(42L).get();
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
    let resp = ctx.screener_strategy(42).await?;
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
            ctx.screener_strategy(42, [](auto resp) {
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
	resp, err := c.ScreenerStrategy(context.Background(), 42)
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
    "groups": [
      {
        "group_name": "範圍",
        "group_type": "range",
        "indicators": [
          {
            "id": -1,
            "key": "filter_market",
            "name": "港股",
            "unit": "",
            "min": "",
            "max": "",
            "value": "HK",
            "tech_data": []
          }
        ]
      },
      {
        "group_name": "行情類指標",
        "group_type": "Quotes",
        "indicators": [
          {
            "id": 1,
            "key": "filter_marketcap",
            "name": "市值",
            "unit": "億",
            "min": "100",
            "max": "",
            "value": "",
            "tech_data": []
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
| 200    | 成功        | [ScreenerStrategyDetail](#ScreenerStrategyDetail) |
| 400    | 請求錯誤    | None   |

## Schemas

### ScreenerStrategyDetail

<a id="ScreenerStrategyDetail"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| groups | object[] | false | 指標分組列表 |
| ∟ group_name | string | false | 分組名稱 |
| ∟ group_type | string | false | 分組類型（如 `range`、`Quotes`、`DividendIndex`） |
| ∟ indicators | object[] | false | 該分組下的指標條件 |
| ∟ ∟ id | integer | false | 指標 ID |
| ∟ ∟ key | string | false | 指標鍵值 |
| ∟ ∟ name | string | false | 指標顯示名稱 |
| ∟ ∟ unit | string | false | 指標單位（如 `%`、`億` 等） |
| ∟ ∟ min | string | false | 最小值；空字符串表示無下限 |
| ∟ ∟ max | string | false | 最大值；空字符串表示無上限 |
| ∟ ∟ value | string | false | 固定值（用於非範圍型指標，如市場選擇器） |
| ∟ ∟ tech_data | array | false | 技術指標數據數組 |
