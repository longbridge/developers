---
slug: us_valuation_overview
title: 美股估值概覽
sidebar_position: 31
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

獲取美股估值概覽——當前估值指標及歷史區間。

<CliCommand>
# 美股估值概覽
longbridge valuation AAPL.US
longbridge valuation NVDA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_valuation_overview" />

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
resp = ctx.us_valuation_overview("AAPL.US")
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
    resp = await ctx.us_valuation_overview("AAPL.US")
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
  const resp = await ctx.usValuationOverview("AAPL.US")
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
            var resp = ctx.getUsValuationOverview("AAPL.US").get();
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
    let resp = ctx.us_valuation_overview("AAPL.US").await?;
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
    resp, err := c.ValuationOverview(context.Background(), "AAPL.US")
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
  "indicator": "PE",
  "metrics": {
    "pe": {
      "circle": "35.2",
      "part": "72",
      "metric": "PE",
      "desc": "Price-to-Earnings ratio",
      "industry_median": "28.4"
    }
  },
  "range": 72,
  "date": "2026-07-01",
  "ccy_symbol": "USD",
  "ai_summary": "Apple's PE ratio is in the 72nd percentile...",
  "aichat_data": {
    "agent_id": "valuation_aapl",
    "handoff_agent_id": "",
    "symbol": "AAPL.US",
    "text": "Valuation overview for AAPL",
    "type": "valuation",
    "workflow_type": "valuation"
  }
}
```

### Response Status

| 狀態碼 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsValuationOverview](#UsValuationOverview) |
| 400    | 請求錯誤 | None   |

## Schemas

### UsValuationOverview

<a id="UsValuationOverview"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| indicator | string | 是 | 主要估值指標名稱（如 `PE`） |
| metrics | map[string, USValuationMetric] | 是 | 以指標名稱為鍵的估值指標字典 |
| range | int | 是 | 歷史百分位（0–100） |
| date | string | 是 | 估值日期 |
| ccy_symbol | string | 是 | 貨幣符號 |
| ai_summary | string | 否 | AI 生成的估值摘要 |
| aichat_data | USAIChatData | 否 | AI 對話上下文數據 |

### USValuationMetric

<a id="USValuationMetric"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| circle | string | 當前指標數值 |
| part | string | 百分位位置 |
| metric | string | 指標名稱 |
| desc | string | 指標描述 |
| industry_median | string | 行業中位數 |
