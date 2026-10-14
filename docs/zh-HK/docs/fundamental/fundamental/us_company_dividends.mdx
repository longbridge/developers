---
slug: us_company_dividends
title: 美股公司分紅
sidebar_position: 37
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US 賬戶
此方法僅適用於美國數據中心賬戶。
:::

獲取美股股票分紅歷史——TTM 股息率、派息次數及逐筆分紅記錄。

<CliCommand>
# 公司分紅（美股賬戶）
longbridge dividend AAPL.US
longbridge dividend MSFT.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_company_dividends" />

## Parameters

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代碼，如 `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_company_dividends("AAPL.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncFundamentalContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("請訪問：", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncFundamentalContext.create(config)
    resp = await ctx.us_company_dividends("AAPL.US")
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
    console.log('請訪問此 URL 授權：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.usCompanyDividends("AAPL.US")
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
            var resp = ctx.getUsCompanyDividends("AAPL.US").get();
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("請訪問：{url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.us_company_dividends("AAPL.US").await?;
    println!("{:?}", resp);
    Ok(())
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
    resp, err := c.CompanyDividends(context.Background(), "AAPL.US")
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
  "recent_dividends": {
    "dividend_ttm": "1.00",
    "dividend_yield_ttm": "0.0053",
    "payouts": "4",
    "currency": "USD"
  },
  "dividend_history": [
    {
      "fiscal_year": "2024",
      "fiscal_year_range": "2024-01-01 ~ 2024-12-31",
      "dividend": "1.00",
      "dividend_yield": "0.0053",
      "dividend_growth_rate": "0.0408",
      "dividend_payout_ratio": "0.1497",
      "total_shareholder_yield": "0.0163",
      "currency": "USD"
    }
  ],
  "payout_ratios": [
    {
      "fiscal_year": "2024",
      "fiscal_year_range": "2024-01-01 ~ 2024-12-31",
      "dividend_payout_ratio": "0.1497",
      "currency": "USD"
    }
  ],
  "dividend_payout_history": [
    {
      "dividend": "0.25",
      "dividend_type": "Cash",
      "currency": "USD",
      "ex_date": "2024-11-08",
      "payment_date": "2024-11-14",
      "record_date": "2024-11-11",
      "title": "Q4 FY2024 Dividend",
      "start_time_unix": "1730000000"
    }
  ]
}
```

### Response Status

| 狀態碼 | 描述 | 結構 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsCompanyDividends](#UsCompanyDividends) |
| 400    | 請求錯誤 | None   |


## Schemas

### UsCompanyDividends

<a id="UsCompanyDividends"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| recent_dividends | USRecentDividend | 是 | 近期分紅摘要 |
| dividend_history | USDividendHistoryItem[] | 否 | 歷年分紅歷史 |
| payout_ratios | USDividendHistoryItem[] | 否 | 派息率歷史 |
| dividend_payout_history | USDividendPayoutRecord[] | 否 | 逐筆分紅派發記錄 |

### USRecentDividend

<a id="USRecentDividend"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| dividend_ttm | string | 過去 12 個月每股股息 |
| dividend_yield_ttm | string | TTM 股息率（%） |
| payouts | string | 過去一年派息次數 |
| currency | string | 貨幣代碼 |

### USDividendHistoryItem

<a id="USDividendHistoryItem"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| fiscal_year | string | 財年 |
| fiscal_year_range | string | 財年日期範圍 |
| dividend | string | 每股總股息 |
| dividend_yield | string | 股息率 |
| dividend_growth_rate | string | 股息同比增長率 |
| dividend_payout_ratio | string | 派息率 |
| dividend_to_cashflow_ratio | string | 股息與現金流比率 |
| total_shareholder_yield | string | 股東總回報率 |
| net_buyback | string | 淨回購金額 |
| net_buyback_yield | string | 淨回購收益率 |
| net_buyback_growth_rate | string | 淨回購增長率 |
| net_buyback_payout_ratio | string | 淨回購派出率 |
| net_buyback_to_cashflow_ratio | string | 淨回購與現金流比率 |
| currency | string | 貨幣代碼 |

