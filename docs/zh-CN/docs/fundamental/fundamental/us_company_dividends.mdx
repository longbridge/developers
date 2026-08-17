---
slug: us_company_dividends
title: 美股公司分红
sidebar_position: 37
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US 账户
此方法仅适用于美国数据中心账户。
:::

获取美股股票分红历史——TTM 股息率、派息次数及逐笔分红记录。

<CliCommand>
# 公司分红（美股账户）
longbridge dividend AAPL.US
longbridge dividend MSFT.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_company_dividends" />

## Parameters

> **SDK 方法参数。**

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代码，如 `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
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
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("请访问：", url))
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
    console.log('请访问此 URL 授权：' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问：{url}")).await?;
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

| 状态码 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsCompanyDividends](#UsCompanyDividends) |
| 400    | 请求错误 | None   |


## Schemas

### UsCompanyDividends

<a id="UsCompanyDividends"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| recent_dividends | USRecentDividend | 是 | 近期分红摘要 |
| dividend_history | USDividendHistoryItem[] | 否 | 历年分红历史 |
| payout_ratios | USDividendHistoryItem[] | 否 | 派息率历史 |
| dividend_payout_history | USDividendPayoutRecord[] | 否 | 逐笔分红派发记录 |

### USRecentDividend

<a id="USRecentDividend"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| dividend_ttm | string | 过去 12 个月每股股息 |
| dividend_yield_ttm | string | TTM 股息率（%） |
| payouts | string | 过去一年派息次数 |
| currency | string | 货币代码 |

### USDividendHistoryItem

<a id="USDividendHistoryItem"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| fiscal_year | string | 财年 |
| fiscal_year_range | string | 财年日期范围 |
| dividend | string | 每股总股息 |
| dividend_yield | string | 股息率 |
| dividend_growth_rate | string | 股息同比增长率 |
| dividend_payout_ratio | string | 派息率 |
| dividend_to_cashflow_ratio | string | 股息与现金流比率 |
| total_shareholder_yield | string | 股东总回报率 |
| net_buyback | string | 净回购金额 |
| net_buyback_yield | string | 净回购收益率 |
| net_buyback_growth_rate | string | 净回购增长率 |
| net_buyback_payout_ratio | string | 净回购派出率 |
| net_buyback_to_cashflow_ratio | string | 净回购与现金流比率 |
| currency | string | 货币代码 |

