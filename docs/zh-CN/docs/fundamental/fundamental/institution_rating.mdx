---
slug: institution-rating
title: 机构评级
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取分析师机构评级快照（评级分布及平均目标价）。

<CliCommand>
longbridge institution-rating TSLA.US
longbridge institution-rating AAPL.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="institution_rating" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 证券代码，例如 `TSLA.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.institution_rating("TSLA.US")
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

    resp = await ctx.institution_rating("TSLA.US")
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
  const resp = await ctx.institutionRating('TSLA.US')
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
            var resp = ctx.getInstitutionRating("TSLA.US").get();
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
    let resp = ctx.institution_rating("TSLA.US").await?;
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
            ctx.institution_rating("TSLA.US", [](auto resp) {
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
	resp, err := c.InstitutionRating(context.Background(), "TSLA.US")
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
    "latest": {
      "evaluate": {
        "buy": 18,
        "hold": 17,
        "sell": 4,
        "no_opinion": 4,
        "over": 5,
        "under": 3,
        "total": 51,
        "start_date": "1778198400",
        "end_date": "0"
      },
      "industry_id": 87676,
      "industry_mean": 10,
      "industry_median": 4,
      "industry_name": "Automobiles",
      "industry_rank": 1,
      "industry_total": 30,
      "target": {
        "highest_price": "600.000",
        "lowest_price": "123.000",
        "prev_close": "428.35",
        "start_date": "1778198400",
        "end_date": "0"
      }
    },
    "summary": {
      "ccy_symbol": "$",
      "change": "0",
      "recommend": "Buy",
      "updated_at": "1778198400",
      "evaluate": {
        "buy": 18,
        "hold": 17,
        "sell": 4
      },
      "target": {
        "average_target": "350.00",
        "highest_price": "600.000",
        "lowest_price": "123.000"
      }
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [InstitutionRatingResponse](#InstitutionRatingResponse) |
| 400    | 请求错误    | None   |

## Schemas

### InstitutionRatingResponse

<a id="InstitutionRatingResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| latest | object | 是 | 最新机构评级快照 |
| latest.evaluate | object | 是 | 评级分布 |
| latest.evaluate.buy | integer | 否 | 买入评级数量 |
| latest.evaluate.hold | integer | 否 | 持有评级数量 |
| latest.evaluate.sell | integer | 否 | 卖出评级数量 |
| latest.evaluate.over | integer | 否 | 跑赢市场数量 |
| latest.evaluate.under | integer | 否 | 跑输市场数量 |
| latest.evaluate.no_opinion | integer | 否 | 无评级数量 |
| latest.evaluate.total | integer | 否 | 机构总数 |
| latest.evaluate.start_date | string | 否 | 统计周期开始日期 |
| latest.evaluate.end_date | string | 否 | 统计周期结束日期 |
| latest.industry_id | integer | 否 | 行业 ID |
| latest.industry_name | string | 否 | 行业名称 |
| latest.industry_rank | integer | 否 | 行业内排名 |
| latest.industry_total | integer | 否 | 行业标的总数 |
| latest.industry_mean | integer | 否 | 行业平均评分 |
| latest.industry_median | integer | 否 | 行业中位数评分 |
| latest.target | object | 否 | 目标价区间 |
| latest.target.highest_price | string | 否 | 最高目标价 |
| latest.target.lowest_price | string | 否 | 最低目标价 |
| latest.target.prev_close | string | 否 | 前收盘价 |
| latest.target.start_date | string | 否 | 统计周期开始日期 |
| latest.target.end_date | string | 否 | 统计周期结束日期 |
| summary | object | 否 | 综合评级快照 |
| summary.recommend | object | 否 | 评级分布映射 |
| summary.change | string | 否 | 价格变动值 |
| summary.ccy_symbol | string | 否 | 货币符号 |
| summary.evaluate | object | 否 | 评级分布数量 |
| summary.evaluate.buy | integer | 否 | 买入数量 |
| summary.evaluate.strong_buy | integer | 否 | 强力买入数量 |
| summary.evaluate.hold | integer | 否 | 持有数量 |
| summary.evaluate.sell | integer | 否 | 卖出数量 |
| summary.evaluate.under | integer | 否 | 跑输数量 |
| summary.target | string | 否 | 一致平均目标价 |
| summary.updated_at | string | 否 | 最后更新日期字符串 |
