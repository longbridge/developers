---
slug: screener-indicators
title: 选股指标
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取选股器支持的所有指标定义，包含键值、名称、单位和可用范围，可用于构建自定义筛选条件。

<CliCommand>
longbridge screener indicators
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_indicators" />


## Parameters

> **SDK 方法参数。**

此方法无参数。

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
        "group_name": "市场",
        "group_type": "range",
        "indicators": [
          {
            "id": -1,
            "key": "filter_market",
            "name": "市场",
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
        "group_name": "行情类指标",
        "group_type": "Quotes",
        "indicators": [
          {
            "id": 1,
            "key": "filter_marketcap",
            "name": "市值",
            "unit": "亿",
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
| 400    | 请求错误    | None   |

## Schemas

### ScreenerIndicatorsResponse

<a id="ScreenerIndicatorsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| groups | object[] | false | 指标分组 |
| ∟ group_name | string | false | 分组名称 |
| ∟ group_type | string | false | 分组类型（如 `range`、`Quotes`、`DividendIndex`） |
| ∟ indicators | object[] | false | 该分组下的指标列表 |
| ∟ ∟ id | integer | false | 指标 ID |
| ∟ ∟ key | string | false | 指标键值，用于构建筛选条件 |
| ∟ ∟ name | string | false | 指标显示名称 |
| ∟ ∟ unit | string | false | 单位（如 `%`、`亿`） |
| ∟ ∟ category | integer | false | 指标分类代码 |
| ∟ ∟ description | string | false | 指标描述 |
| ∟ ∟ default_selected | boolean | false | 是否默认选中 |
| ∟ ∟ default_range | [RangeItem](#RangeItem)[] | false | 默认筛选范围 |
| ∟ ∟ value_ranges | [RangeItem](#RangeItem)[] | false | 指标可选值范围 |
| ∟ ∟ places | integer | false | 显示小数位数 |
| ∟ ∟ sub_indicators | object[] | false | 子指标定义 |
| ∟ ∟ tech_indicators | object[] | false | 技术指标定义 |

### RangeItem

<a id="RangeItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| min | string | false | 范围下限（空字符串表示无下限） |
| max | string | false | 范围上限（空字符串表示无上限） |
