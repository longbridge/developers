---
slug: institution-rating
title: 機構評級
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取分析師機構評級快照（評級分佈及平均目標價）。

<CliCommand>
longbridge institution-rating TSLA.US
longbridge institution-rating AAPL.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="institution_rating" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/fundamental/institution_rating</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 證券代碼，例如 `TSLA.US` |

### Request Example

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

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "analyst": {
      "evaluate": {
        "buy": 18,
        "hold": 17,
        "no_opinion": 4,
        "over": 5,
        "sell": 4,
        "total": 51,
        "under": 3,
        "start_date": "2024-01-01",
        "end_date": "2025-01-01"
      },
      "industry_id": 87676,
      "industry_mean": 10,
      "industry_median": 4,
      "industry_name": "汽車製造商",
      "industry_rank": 1,
      "industry_total": 30,
      "target": {
        "end_date": "2025-01-01",
        "highest_price": "600.000",
        "lowest_price": "123.000",
        "prev_close": "428.35",
        "start_date": "2024-01-01"
      }
    },
    "instratings": {
      "ccy_symbol": "$",
      "change": "Upgraded",
      "evaluate": {
        "buy": 18,
        "hold": 17,
        "sell": 4
      },
      "recommend": "Buy",
      "target": {
        "average_target": "380.00",
        "highest_price": "600.000",
        "lowest_price": "123.000"
      },
      "updated_at": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [InstitutionRatingResponse](#InstitutionRatingResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### InstitutionRatingResponse

<a id="InstitutionRatingResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| analyst | object | 是 | 機構評級匯總 |
| analyst.evaluate | object | 是 | 評級分佈（買入/持有/賣出數量） |
| analyst.evaluate.buy | integer | 否 | 買入評級數量 |
| analyst.evaluate.hold | integer | 否 | 持有評級數量 |
| analyst.evaluate.sell | integer | 否 | 賣出評級數量 |
| analyst.evaluate.over | integer | 否 | 跑贏市場評級數量 |
| analyst.evaluate.under | integer | 否 | 跑輸市場評級數量 |
| analyst.evaluate.no_opinion | integer | 否 | 無評級數量 |
| analyst.evaluate.total | integer | 否 | 機構總數 |
| analyst.industry_id | integer | 否 | 行業 ID |
| analyst.industry_name | string | 否 | 行業名稱 |
| analyst.industry_rank | integer | 否 | 行業內排名 |
| analyst.industry_total | integer | 否 | 行業內標的總數 |
| analyst.industry_mean | number | 否 | 行業均值 |
| analyst.industry_median | number | 否 | 行業中位數 |
| analyst.target | object | 否 | 目標價區間 |
| analyst.target.highest_price | string | 否 | 最高目標價 |
| analyst.target.lowest_price | string | 否 | 最低目標價 |
| analyst.target.prev_close | string | 否 | 前收盤價 |
| instratings | object | 否 | 評級快照 |
| instratings.recommend | string | 否 | 綜合評級 |
| instratings.change | string | 否 | 評級變化 |
| instratings.ccy_symbol | string | 否 | 貨幣符號 |
| instratings.target | object | 否 | 一致目標價 |
| instratings.updated_at | string | 否 | 最後更新時間 |
