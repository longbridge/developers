---
slug: us_key_financial_metrics
title: 美股關鍵財務指標
sidebar_position: 34
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

獲取美股關鍵財務指標——營收、淨利潤、EPS、利潤率和增長率。

<CliCommand>
# 關鍵財務指標（美股賬戶）
longbridge financial-report key-metrics AAPL.US
longbridge financial-report key-metrics AAPL.US --report quarterly
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_key_financial_metrics" />

## Parameters

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代碼，如 `AAPL.US` |
| report | string | 否 | 報告週期：`af`（年報）、`saf`（半年報）、`qf`（季報）、`q1`（Q1）、`3q`（Q3）|

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_key_financial_metrics("AAPL.US", "af")
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
    resp = await ctx.us_key_financial_metrics("AAPL.US", "af")
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
  const resp = await ctx.usKeyFinancialMetrics("AAPL.US", "af")
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
            var resp = ctx.getUsKeyFinancialMetrics("AAPL.US", "af").get();
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
    let resp = ctx.us_key_financial_metrics("AAPL.US", "af").await?;
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
    resp, err := c.KeyFinancialMetrics(context.Background(), "AAPL.US", "af")
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
  "currency": "USD",
  "report": "af",
  "empty_fields": [],
  "list": [
    {
      "ff_period": "A",
      "ff_year": 2024,
      "fp_end": "2024-09-28",
      "report_txt": "FY2024",
      "rpt_date": "2024-11-01",
      "fields": [
        {"key": "revenue", "value": "391035000000"},
        {"key": "gross_margin", "value": "0.4621"},
        {"key": "net_margin", "value": "0.2397"},
        {"key": "eps", "value": "6.07"}
      ]
    }
  ]
}
```

### Response Status

| 状態码 | 描述 | 结構 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsKeyFinancialMetrics](#UsKeyFinancialMetrics) |
| 400    | 請求錯誤 | None   |

## Schemas

### UsKeyFinancialMetrics

<a id="UsKeyFinancialMetrics"></a>

| 名称 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| currency | string | 是 | 貨币代码，如 `USD` |
| report | string | 是 | 報告周期類型（如 `annual`、`quarterly`） |
| empty_fields | string[] | 否 | 本期无數据的字段列表 |
| list | USKeyMetricItem[] | 是 | 按報告期排列的关鍵指標數据 |

### USKeyMetricItem

<a id="USKeyMetricItem"></a>

| 名称 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| ff_period | string | 是 | 報告周期代码（如 `A`=年報、`Q`=季報） |
| ff_year | int | 是 | 財年 |
| fp_end | string | 是 | 報告期结束日期 |
| report_txt | string | 是 | 報告期標签（如 `FY2024`） |
| rpt_date | string | 是 | 財報发布日期 |
| fields | object | 是 | 关鍵財务指標（结構因公司而异） |
