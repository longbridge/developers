---
slug: profit-analysis-summary
title: 盈虧分析匯總
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取賬戶盈虧匯總，包含總資產、總盈虧和收益率指標。

<CliCommand>
longbridge profit-analysis
longbridge profit-analysis --start 2026-01-01
</CliCommand>

<SDKLinks module="portfolio" klass="PortfolioContext" method="profit_analysis_summary" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/account/profit_analysis</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| start_date | string | 否 | 分析開始日期，格式 `YYYY-MM-DD` |
| end_date | string | 否 | 分析結束日期，格式 `YYYY-MM-DD` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import PortfolioContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = PortfolioContext(config)

resp = ctx.profit_analysis_summary()
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

    resp = await ctx.profit_analysis_summary()
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
  const resp = await ctx.profit_analysis_summary()
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
            var resp = ctx.getProfitAnalysisSummary().get();
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
    let resp = ctx.profit_analysis_summary().await?;
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
            ctx.profit_analysis_summary([](auto resp) {
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
	resp, err := c.ProfitAnalysisSummary(context.Background())
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
    "currency": "USD",
    "total_asset": "125413.01",
    "invest_amount": "76997.11",
    "total_pnl": "48415.89",
    "simple_yield": "0.6288",
    "twr": "0.5841",
    "stocks_traded": 12,
    "start_date": "2023-12-04",
    "end_date": "2026-04-17"
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功        | [profit_analysis_summary_rsp](#profit_analysis_summary_rsp) |
| 400    | 請求錯誤    | None   |

## Schemas

### profit_analysis_summary_rsp

<a id="profit_analysis_summary_rsp"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | true | 結算貨幣 |
| total_asset | string | true | 總資產價值 |
| invest_amount | string | true | 總投入金額 |
| total_pnl | string | true | 總盈虧金額 |
| simple_yield | string | true | 簡單收益率 |
| twr | string | true | 時間加權收益率 |
| stocks_traded | int32 | true | 已交易股票數量 |
| start_date | string | true | 分析開始日期 |
| end_date | string | true | 分析結束日期 |
