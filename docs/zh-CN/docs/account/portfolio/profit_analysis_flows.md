---
slug: profit-analysis-flows
title: 盈亏流水
sidebar_position: 5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

查询账户资金流水历史，包含入金、出金、分红和结算等。

<CliCommand>
longbridge cash-flow
longbridge cash-flow --format json
</CliCommand>

<SDKLinks module="portfolio" klass="PortfolioContext" method="profit_analysis_flows" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/account/profit_analysis/flows</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | 证券代码 |
| page | integer | NO | 页码（默认 1） |
| size | integer | NO | 每页数量（默认 20） |
| derivative | boolean | NO | 是否包含衍生品仓位 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import PortfolioContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = PortfolioContext(config)

resp = ctx.profit_analysis_flows()
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

    resp = await ctx.profit_analysis_flows()
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
  const resp = await ctx.profit_analysis_flows()
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
            var resp = ctx.getProfitAnalysisFlows().get();
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
    let resp = ctx.profit_analysis_flows().await?;
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
            ctx.profit_analysis_flows([](auto resp) {
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
	resp, err := c.ProfitAnalysisFlows(context.Background())
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
    "list": [
      {
        "transaction_flow_name": "Cash Dividend",
        "direction": 1,
        "business_type": 2,
        "balance": "25.00",
        "currency": "USD",
        "business_time": "1774310400",
        "symbol": "AAPL.US"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [ProfitAnalysisFlowsResponse](#ProfitAnalysisFlowsResponse) |
| 400    | 请求错误    | None   |

## Schemas

### ProfitAnalysisFlowsResponse

<a id="ProfitAnalysisFlowsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| flows_list | object[] | true | 资金流水列表（分页） |
| has_more | boolean | false | 是否有更多页 |

### FlowItem

<a id="FlowItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| executed_date | string | true | 执行日期（如 `2024-01-15`） |
| executed_timestamp | string | false | 执行时间戳 |
| code | string | false | 证券代码 |
| direction | string | false | 方向：`In`（买入）或 `Out`（卖出） |
| executed_quantity | string | false | 成交数量 |
| executed_price | string | false | 成交价格 |
| executed_cost | string | false | 成交成本 |
| describe | string | false | 描述说明 |