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


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| start_date | string | 否 | 分析開始日期，格式 `YYYY-MM-DD` |
| end_date | string | 否 | 分析結束日期，格式 `YYYY-MM-DD` |

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
| 200    | 成功        | [ProfitAnalysisResponse](#ProfitAnalysisResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### ProfitAnalysisResponse

<a id="ProfitAnalysisResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| summary | object | true | 總體匯總 |
| sublist | object | false | 逐倉位明細 |

### ProfitAnalysisSummary

<a id="ProfitAnalysisSummary"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| currency | string | false | 貨幣 |
| sum_profit | string | false | 總盈虧 |
| sum_profit_rate | string | false | 總盈虧率 |
| invest_amount | string | false | 總投入金額 |
| current_total_asset | string | false | 當前總資產 |
| initial_asset_value | string | false | 初始資產價值 |
| ending_asset_value | string | false | 期末資產價值 |
| is_traded | boolean | false | 是否有交易紀錄 |
| start_date | string | false | 統計開始日期 |
| start_time | string | false | 統計開始時間戳 |
| end_date | string | false | 統計結束日期 |
| end_time | string | false | 統計結束時間戳 |
| profits | object | false | 按類型分解的盈虧 |
| profits.stock | string | false | 股票盈虧 |
| profits.crypto | string | false | 加密貨幣盈虧 |
| profits.fund | string | false | 基金盈虧 |
| profits.ipo | string | false | 打新盈虧 |
| profits.mmf | string | false | 貨幣基金盈虧 |
| profits.other | string | false | 其他盈虧 |
| profits.cumulative_transaction_amount | string | false | 累計交易金額 |

### ProfitAnalysisSublist

<a id="ProfitAnalysisSublist"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| start | string | false | 統計期開始 |
| start_date | string | false | 開始日期 |
| end | string | false | 統計期結束 |
| end_date | string | false | 結束日期 |
| updated_at | string | false | 最後更新時間戳 |
| updated_date | string | false | 最後更新日期 |
| items | object[] | false | 逐倉位盈虧列表，見 [ProfitAnalysisItem](#ProfitAnalysisItem) |

### ProfitAnalysisItem

<a id="ProfitAnalysisItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | false | 證券代碼 |
| name | string | false | 證券名稱 |
| market | string | false | 市場 |
| currency | string | false | 貨幣 |
| profit | string | false | 盈虧 |
| profit_rate | string | false | 盈虧率 |
| holding_period | string | false | 持倉天數 |
| clearance_times | integer | false | 清倉次數 |
| is_holding | boolean | false | 是否持有中 |
| item_type | string | false | 資產類型：`Stock`、`Fund`、`Crypto` 等 |
| isin | string | false | ISIN 代碼 |
| security_code | string | false | 證券代碼（短） |
| underlying_profit | string | false | 正股盈虧 |
| derivatives_profit | string | false | 衍生品盈虧 |
| order_profit | string | false | 訂單盈虧 |