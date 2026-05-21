---
slug: screener-indicators
title: 選股指標
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取選股器支持的所有指標定義，包含鍵值、名稱、單位和可用範圍，可用於構建自定義篩選條件。

<CliCommand>
longbridge screener indicators
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_indicators" />


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

resp = ctx.screener_indicators()
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

    resp = await ctx.screener_indicators()
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
  const resp = await ctx.screenerIndicators()
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
            var resp = ctx.getScreenerIndicators().get();
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
    let resp = ctx.screener_indicators().await?;
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
            ctx.screener_indicators([](auto resp) {
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
	resp, err := c.ScreenerIndicators(context.Background())
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
        "group_name": "市場",
        "group_type": "range",
        "indicators": [
          {
            "id": -1,
            "key": "filter_market",
            "name": "市場",
            "unit": "",
            "category": 0,
            "description": "",
            "default_selected": false,
            "default_range": [],
            "value_ranges": [],
            "places": 0,
            "sub_indicators": [],
            "tech_indicators": []
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
            "category": 1,
            "description": "",
            "default_selected": true,
            "default_range": [{"min": "10", "max": "1000"}],
            "value_ranges": [{"min": "", "max": "10"}, {"min": "10", "max": "100"}],
            "places": 2,
            "sub_indicators": [],
            "tech_indicators": []
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
| 200    | 成功        | [ScreenerIndicatorsResponse](#ScreenerIndicatorsResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### ScreenerIndicatorsResponse

<a id="ScreenerIndicatorsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| groups | object[] | false | 指標分組 |
| ∟ group_name | string | false | 分組名稱 |
| ∟ group_type | string | false | 分組類型（如 `range`、`Quotes`、`DividendIndex`） |
| ∟ indicators | object[] | false | 該分組下的指標列表 |
| ∟ ∟ id | integer | false | 指標 ID |
| ∟ ∟ key | string | false | 指標鍵值，用於構建篩選條件 |
| ∟ ∟ name | string | false | 指標顯示名稱 |
| ∟ ∟ unit | string | false | 單位（如 `%`、`億`） |
| ∟ ∟ category | integer | false | 指標分類代碼 |
| ∟ ∟ description | string | false | 指標描述 |
| ∟ ∟ default_selected | boolean | false | 是否默認選中 |
| ∟ ∟ default_range | [RangeItem](#RangeItem)[] | false | 默認篩選範圍 |
| ∟ ∟ value_ranges | [RangeItem](#RangeItem)[] | false | 指標可選值範圍 |
| ∟ ∟ places | integer | false | 顯示小數位數 |
| ∟ ∟ sub_indicators | object[] | false | 子指標定義 |
| ∟ ∟ tech_indicators | object[] | false | 技術指標定義 |

### RangeItem

<a id="RangeItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| min | string | false | 範圍下限（空字符串表示無下限） |
| max | string | false | 範圍上限（空字符串表示無上限） |
