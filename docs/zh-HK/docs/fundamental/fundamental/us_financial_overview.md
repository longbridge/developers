---
slug: us_financial_overview
title: 美股財務概覽
sidebar_position: 32
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

按報告週期獲取美股財務概覽——損益、資產負債和現金流摘要。

<CliCommand>
# 美股財務概覽
longbridge financial-report AAPL.US
longbridge financial-report TSLA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_financial_overview" />

## Parameters

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代碼，如 `AAPL.US` |
| report | string | 是 | 報告週期：`annual` 或 `quarterly`（默認：annual）|

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_financial_overview("AAPL.US", report="annual")
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
    resp = await ctx.us_financial_overview("AAPL.US", report="annual")
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
  const resp = await ctx.usFinancialOverview("AAPL.US", "annual")
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
            var resp = ctx.getUsFinancialOverview("AAPL.US", "annual").get();
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
    let resp = ctx.us_financial_overview("AAPL.US", "annual").await?;
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
    resp, err := c.FinancialOverview(context.Background(), "AAPL.US", "annual")
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
  "ccy_symbol": "USD",
  "report_type": "annual",
  "is_list": [
    {
      "revenue": "391035000000",
      "net_income": "93736000000",
      "net_margin": "0.2397",
      "report": {
        "start_date": "2023-10-01",
        "end_date": "2024-09-28",
        "report_txt": "FY2024"
      }
    }
  ],
  "bs_list": [
    {
      "debt_assets_ratio": "0.8193",
      "total_assets": "364840000000",
      "total_liabilities": "308927000000",
      "report": {
        "start_date": "2023-10-01",
        "end_date": "2024-09-28",
        "report_txt": "FY2024"
      }
    }
  ],
  "cf_list": [
    {
      "operating": "118254000000",
      "investing": "-21013000000",
      "financing": "-89831000000",
      "report": {
        "start_date": "2023-10-01",
        "end_date": "2024-09-28",
        "report_txt": "FY2024"
      }
    }
  ]
}
```

### Response Status

| 状態码 | 描述 | 结構 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsFinancialOverview](#UsFinancialOverview) |
| 400    | 請求錯誤 | None   |

## Schemas

### UsFinancialOverview

<a id="UsFinancialOverview"></a>

| 名称 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| ccy_symbol | string | 是 | 貨币符号 |
| report_type | string | 是 | 報告類型（如 `annual`、`quarterly`） |
| is_list | USFinancialISItem[] | 是 | 損益表条目列表 |
| bs_list | USFinancialBSItem[] | 是 | 資產負債表条目列表 |
| cf_list | USFinancialCFItem[] | 是 | 现金流量表条目列表 |

### USFinancialISItem

<a id="USFinancialISItem"></a>

| 名称 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| revenue | string | 是 | 總營收 |
| net_income | string | 是 | 净利润 |
| net_margin | string | 是 | 净利润率 |
| report | USReportPeriod | 是 | 報告期信息 |

### USFinancialBSItem

<a id="USFinancialBSItem"></a>

| 名称 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| debt_assets_ratio | string | 是 | 資產負債率 |
| total_assets | string | 是 | 總資產 |
| total_liabilities | string | 是 | 總負債 |
| report | USReportPeriod | 是 | 報告期信息 |

### USFinancialCFItem

<a id="USFinancialCFItem"></a>

| 名称 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| operating | string | 是 | 经營活动现金流 |
| investing | string | 是 | 投資活动现金流 |
| financing | string | 是 | 籌資活动现金流 |
| report | USReportPeriod | 是 | 報告期信息 |

### USReportPeriod

<a id="USReportPeriod"></a>

| 名称 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| start_date | string | 是 | 報告期开始日期 |
| end_date | string | 是 | 報告期结束日期 |
| report_txt | string | 是 | 報告期標签（如 `FY2024`、`Q1 2024`） |
