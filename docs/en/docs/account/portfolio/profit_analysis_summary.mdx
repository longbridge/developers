---
slug: profit-analysis-summary
title: Profit Analysis Summary
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get a P&L summary for the account including total asset, total P&L, and yield metrics.

<CliCommand>
longbridge profit-analysis
longbridge profit-analysis --start 2026-01-01
</CliCommand>

<SDKLinks module="portfolio" klass="PortfolioContext" method="profit_analysis_summary" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| start_date | string | NO | Analysis start date in `YYYY-MM-DD` format |
| end_date | string | NO | Analysis end date in `YYYY-MM-DD` format |

## Request Example

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


### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "summary": {
      "currency": "USD",
      "sum_profit": "62905.97",
      "sum_profit_rate": "0.6128",
      "invest_amount": "102659.74",
      "current_total_asset": "165565.71",
      "initial_asset_value": "0.00",
      "ending_asset_value": "165565.71",
      "is_traded": true,
      "start_date": "2025-10-17",
      "start_time": "1760659200",
      "end_date": "2026-05-14",
      "end_time": "1778731947",
      "profits": {
        "stock": "66370.84",
        "crypto": "0",
        "fund": null,
        "ipo": null,
        "mmf": null,
        "other": null,
        "cumulative_transaction_amount": "1244920.28"
      }
    },
    "sublist": {
      "start": "2025-10-17",
      "start_date": "2025-10-17",
      "end": "2026-05-14",
      "end_date": "2026-05-14",
      "updated_at": "1778731947",
      "updated_date": "2026-05-14",
      "items": [
        {
          "symbol": "AAPL.US",
          "name": "Apple",
          "market": "US",
          "currency": "USD",
          "profit": "100.00",
          "profit_rate": "0.05",
          "holding_period": "180",
          "clearance_times": 0,
          "is_holding": true,
          "item_type": "Stock",
          "isin": "",
          "security_code": "AAPL",
          "underlying_profit": "100.00",
          "derivatives_profit": "0.00",
          "order_profit": null
        }
      ]
    }
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [ProfitAnalysisResponse](#ProfitAnalysisResponse) |
| 400    | Bad request | None   |

## Schemas

### ProfitAnalysisResponse

<a id="ProfitAnalysisResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| summary | object | true | Overall summary |
| sublist | object | false | Per-position breakdown |

### ProfitAnalysisSummary

<a id="ProfitAnalysisSummary"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | false | Currency |
| sum_profit | string | false | Total profit/loss |
| sum_profit_rate | string | false | Total profit/loss rate |
| invest_amount | string | false | Total invested amount |
| current_total_asset | string | false | Current total asset value |
| initial_asset_value | string | false | Initial asset value |
| ending_asset_value | string | false | Ending asset value |
| is_traded | boolean | false | Whether any trades exist |
| start_date | string | false | Period start date |
| start_time | string | false | Period start timestamp |
| end_date | string | false | Period end date |
| end_time | string | false | Period end timestamp |
| profits | object | false | Profit breakdown by category |
| profits.stock | string | false | Stock profit |
| profits.crypto | string | false | Crypto profit |
| profits.fund | string | false | Fund profit |
| profits.ipo | string | false | IPO profit |
| profits.mmf | string | false | Money market fund profit |
| profits.other | string | false | Other profit |
| profits.cumulative_transaction_amount | string | false | Cumulative transaction amount |

### ProfitAnalysisSublist

<a id="ProfitAnalysisSublist"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| start | string | false | Period start |
| start_date | string | false | Start date |
| end | string | false | Period end |
| end_date | string | false | End date |
| updated_at | string | false | Last update timestamp |
| updated_date | string | false | Last update date |
| items | object[] | false | Per-position P&L items, see [ProfitAnalysisItem](#ProfitAnalysisItem) |

### ProfitAnalysisItem

<a id="ProfitAnalysisItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | false | Security symbol |
| name | string | false | Security name |
| market | string | false | Market |
| currency | string | false | Currency |
| profit | string | false | Profit/loss |
| profit_rate | string | false | Profit/loss rate |
| holding_period | string | false | Holding period (days) |
| clearance_times | integer | false | Number of clearances |
| is_holding | boolean | false | Whether currently holding |
| item_type | string | false | Asset type: `Stock`, `Fund`, `Crypto`, etc. |
| isin | string | false | ISIN code |
| security_code | string | false | Security code |
| underlying_profit | string | false | Underlying stock profit |
| derivatives_profit | string | false | Derivatives profit |
| order_profit | string | false | Order profit |