---
slug: /market/rank-list
title: 人气排行榜
sidebar_position: 9
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

根据排行榜标签 key 获取股票排行。key 来自 `rank_categories` 的 `second_tags[].key`，例如 `hot_all-us`（美股总热度）。


<CliCommand>
longbridge rank --key hot_all-us
longbridge rank --key hot_all-hk
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="rank_list" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| key | string | 是 | 排行榜标签键值，来自 `rank_categories` 的 `second_tags[].key` |
| need_article | boolean | 否 | 是否返回关联文章，默认 `false` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.rank_list("hot_all-us")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncMarketContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncMarketContext.create(config)

    resp = await ctx.rank_list("hot_all-us", need_article=False)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, MarketContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = MarketContext.new(config)
  const resp = await ctx.rankList('hot_all-us', false)
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.market.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             MarketContext ctx = MarketContext.create(config)) {
            var resp = ctx.getRankList("hot_all-us", false).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, market::MarketContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = MarketContext::new(config);
    let resp = ctx.rank_list("hot_all-us", false).await?;
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
using namespace longbridge::market;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            MarketContext ctx = MarketContext::create(config);
            ctx.rank_list("hot_all-us", false, [](auto resp) {
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
	"github.com/longbridge/openapi-go/market"
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
	c, err := market.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.RankList(context.Background(), "hot_all-us", false)
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
    "bmp": false,
    "lists": [
      {
        "code": "MU",
        "symbol": "MU.US",
        "name": "美光科技",
        "last_done": "698.740",
        "chg": "0.0252",
        "change": "17.200",
        "inflow": "-347041642",
        "market_cap": "787992890796",
        "industry": "半导体厂商",
        "pre_post_price": "726.600",
        "pre_post_chg": "0.0399",
        "amplitude": "0.1082",
        "five_day_chg": "-0.0885",
        "turnover_rate": "0.0550",
        "volume_rate": "1.11",
        "pb_ttm": "32.68"
      }
    ]
  }
}
```

> 说明：响应中包含更多附加字段，上述为主要字段。

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [RankListResponse](#RankListResponse) |
| 400    | 请求错误    | None   |

## Schemas

### RankListResponse

<a id="RankListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| bmp | boolean | false | 是否为盘前预览数据 |
| lists | object[] | false | 排行榜股票列表 |
| ∟ code | string | false | 股票代码（如 `MU`） |
| ∟ symbol | string | false | 标的代码，格式为 `代码.市场`（如 `MU.US`） |
| ∟ name | string | false | 证券名称 |
| ∟ last_done | string | false | 最新成交价 |
| ∟ chg | string | false | 涨跌幅（小数比率，如 `0.0252` 表示 2.52%） |
| ∟ change | string | false | 价格涨跌额（如 `17.200`） |
| ∟ inflow | string | false | 净流入资金（单位：所属市场货币） |
| ∟ market_cap | string | false | 市值 |
| ∟ industry | string | false | 行业分类 |
| ∟ pre_post_price | string | false | 盘前/盘后价格 |
| ∟ pre_post_chg | string | false | 盘前/盘后涨跌幅（小数比率） |
| ∟ amplitude | string | false | 振幅（小数比率） |
| ∟ five_day_chg | string | false | 5 日涨跌幅（小数比率） |
| ∟ turnover_rate | string | false | 换手率（小数比率） |
| ∟ volume_rate | string | false | 量比 |
| ∟ pb_ttm | string | false | 市净率（TTM） |

> 说明：响应中包含更多附加字段，上述为主要字段。
