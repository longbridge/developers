---
slug: screener-search
title: 选股筛选
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

按策略 ID 或自定义指标条件筛选股票，支持分页。

接口：`POST /v1/quote/ai/screener/search`

> **JSON 输出格式说明：** 响应使用扁平的 `items[]` 数组（非 `stocks[]`），所有数值字段为 JSON 数字类型（非字符串），指标键名不含 `filter_` 前缀。

<CliCommand>
longbridge screener search --strategy-id 42
longbridge screener search --market HK --filter filter_marketcap:100:1000
</CliCommand>

<SDKLinks module="screener" klass="ScreenerContext" method="screener_search" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| market | string | 是 | 市场：`US`、`HK`、`CN`、`SG` |
| strategy_id | integer | 否 | 策略 ID；与自定义条件二选一，或同时使用 |
| conditions | ScreenerCondition[] | 否 | 自定义筛选条件（模式 B，不传 strategy_id 时使用） |
| show | string[] | 否 | 额外需要返回的指标键名，在默认 7 列之外追加 |
| page | integer | 否 | 页码，从 0 开始，默认 0 |
| size | integer | 否 | 每页条数，默认 20 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import ScreenerContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = ScreenerContext(config)

# 按策略 ID 筛选
resp = ctx.screener_search("US", strategy_id=42)
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

    resp = await ctx.screener_search("US", strategy_id=42, page=1, size=20)
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
  const resp = await ctx.screenerSearch('US', { strategyId: 42, page: 1, size: 20 })
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
            var resp = ctx.screenerSearch("US", 19L, null, List.of(), 0, 20).get();
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
    // 模式 A：运行策略
    let resp = ctx.screener_search("", Some(19), vec![], vec![], 0, 20).await?;
    println!("{:?}", resp);
    // 模式 B：自定义条件
    use longbridge::screener::ScreenerCondition;
    let conditions = vec![ScreenerCondition { key: "pettm".into(), min: "10".into(), max: "50".into(), tech_values: serde_json::json!({}) }];
    let resp = ctx.screener_search("HK", None, conditions, vec![], 0, 20).await?;
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
            ctx.screener_search("US", 42, 1, 20, [](auto resp) {
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
	// 模式 A：运行策略
	stratID := int64(19)
	resp, err := c.ScreenerSearch(context.Background(), "", &stratID, nil, nil, 0, 20)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)

	// 模式 B：自定义条件
	conditions := []screener.ScreenerCondition{
		{Key: "pettm", Min: "10", Max: "50"},
		{Key: "roe", Min: "5"},
	}
	resp2, err := c.ScreenerSearch(context.Background(), "HK", nil, conditions, []string{"roe"}, 0, 20)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp2)
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
    "total": 88,
    "page": 0,
    "market": "US",
    "items": [
      {
        "symbol": "AAPL.US",
        "name": "苹果公司",
        "prevchg": 0.62,
        "marketcap": 3241500000000,
        "pettm": 32.15,
        "pbmrq": 50.21,
        "salesgrowthyoy": 8.04
      },
      {
        "symbol": "MSFT.US",
        "name": "微软",
        "prevchg": 1.05,
        "marketcap": 3085000000000,
        "pettm": 35.42,
        "pbmrq": 12.87,
        "salesgrowthyoy": 12.61
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [ScreenerSearchResponse](#ScreenerSearchResponse) |
| 400    | 请求错误    | None   |

## Schemas

### ScreenerSearchResponse

<a id="ScreenerSearchResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| total | integer | false | 满足条件的股票总数 |
| page | integer | false | 当前页码（从零开始） |
| market | string | false | 结果集的市场 |
| items | object[] | false | 筛选结果股票列表 |
| ∟ symbol | string | false | 证券代码 |
| ∟ name | string | false | 证券名称 |
| ∟ prevchg | number | false | 昨日涨跌幅（如 `1.24` 表示 1.24%） |
| ∟ marketcap | number | false | 市值（数字类型） |
| ∟ pettm | number | false | 市盈率 TTM（数字类型） |
| ∟ pbmrq | number | false | 市净率 MRQ（数字类型） |
| ∟ salesgrowthyoy | number | false | 营收同比增速（%） |
| ∟ industry | string | false | 行业分类 |

> 所有数值指标字段均为 JSON 数字类型。具体返回字段取决于所用策略或筛选条件。指标键名不含 `filter_` 前缀。
