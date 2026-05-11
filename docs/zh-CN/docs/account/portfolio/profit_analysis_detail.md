---
slug: profit-analysis-detail
title: 盈亏分析明细
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取指定证券的详细盈亏分析，包含交易流水和成本分解。

<CliCommand>
longbridge profit-analysis detail TSLA.US
longbridge profit-analysis detail AAPL.US
</CliCommand>

<SDKLinks module="portfolio" klass="PortfolioContext" method="profit_analysis_detail" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/account/profit_analysis/detail</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 证券代码，例如 `AAPL.US` |
| start | string | 否 | 开始日期，格式 `YYYY-MM-DD` |
| end | string | 否 | 结束日期，格式 `YYYY-MM-DD` | 分析结束日期，格式 `YYYY-MM-DD` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import PortfolioContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = PortfolioContext(config)

resp = ctx.profit_analysis_detail("TSLA.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncPortfolioContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncPortfolioContext.create(config)

    resp = await ctx.profit_analysis_detail("TSLA.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, PortfolioContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = PortfolioContext.new(config)
  const resp = await ctx.profit_analysis_detail()
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.portfolio.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             PortfolioContext ctx = PortfolioContext.create(config)) {
            var resp = ctx.getProfitAnalysisDetail().get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, portfolio::PortfolioContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = PortfolioContext::new(config);
    let resp = ctx.profit_analysis_detail().await?;
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
using namespace longbridge::portfolio;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            PortfolioContext ctx = PortfolioContext::create(config);
            ctx.profit_analysis_detail([](auto resp) {
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
	"github.com/longbridge/openapi-go/portfolio"
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
	c, err := portfolio.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.ProfitAnalysisDetail(context.Background())
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
    "symbol": "TSLA.US",
    "name": "Tesla Inc.",
    "pnl": "12450.00",
    "pnl_pct": "0.2891",
    "cost": "43085.00",
    "market_value": "55535.00",
    "currency": "USD"
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [ProfitAnalysisDetailResponse](#ProfitAnalysisDetailResponse) |
| 400    | 请求错误    | None   |

## Schemas

### ProfitAnalysisDetailResponse

<a id="ProfitAnalysisDetailResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | string | false | 证券名称 |
| currency | string | false | 货币 |
| profit | string | false | 总盈亏 |
| start | string | false | 统计期开始 |
| end | string | false | 统计期结束 |
| start_date | string | false | 开始日期 |
| end_date | string | false | 结束日期 |
| default_tag | integer | false | 默认显示标签 |
| underlying_details | object | false | 正股盈亏明细 |
| derivative_pnl_details | object | false | 衍生品盈亏明细 |

### ProfitDetails

<a id="ProfitDetails"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| profit | string | false | 总盈亏 |
| holding_value | string | false | 当前持仓市值 |
| holding_value_at_beginning | string | false | 期初持仓市值 |
| holding_value_at_ending | string | false | 期末持仓市值 |
| long_holding_value | string | false | 多头持仓市值 |
| short_holding_value | string | false | 空头持仓市值 |
| cumulative_credited_amount | string | false | 累计入账金额 |
| cumulative_debited_amount | string | false | 累计出账金额 |
| cumulative_fee_amount | string | false | 累计费用金额 |
| credited_details | object[] | false | 入账明细 |
| debited_details | object[] | false | 出账明细 |
| fee_details | object[] | false | 费用明细 |