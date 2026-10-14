---
slug: us_analyst_consensus
title: 美股分析師一致預期
sidebar_position: 35
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

獲取美股分析師一致預期——營收、EPS 預測及買入/持有/賣出評級。

<CliCommand>
# 美股分析師一致預期
longbridge consensus AAPL.US
longbridge consensus NVDA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_analyst_consensus" />

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
resp = ctx.us_analyst_consensus("AAPL.US", "af")
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
    resp = await ctx.us_analyst_consensus("AAPL.US", "af")
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
  const resp = await ctx.usAnalystConsensus("AAPL.US", "af")
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
            var resp = ctx.getUsAnalystConsensus("AAPL.US", "af").get();
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
    let resp = ctx.us_analyst_consensus("AAPL.US", "af").await?;
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
    resp, err := c.AnalystConsensus(context.Background(), "AAPL.US", "af")
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
  "ai_summary": "Analysts remain broadly bullish on AAPL with 35 Buy ratings...",
  "aichat_data": {
    "agent_id": "analyst_aapl",
    "handoff_agent_id": "",
    "symbol": "AAPL.US",
    "text": "Analyst consensus summary for AAPL",
    "type": "consensus",
    "workflow_type": "analyst"
  },
  "currency": "USD",
  "report": "af",
  "list": [
    {
      "fiscal_year": 2025,
      "report_txt": "FY2025",
      "revenue": {"actual": "391035000000", "estimate": "388000000000"},
      "eps": {"actual": "6.42", "estimate": "6.29"},
      "ebit": {"actual": "125820000000", "estimate": "122000000000"}
    }
  ],
  "opt_reports": ["af", "qf"],
  "h5_data": null
}
```

### Response Status

| 状態码 | 描述 | 结構 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsAnalystConsensus](#UsAnalystConsensus) |
| 400    | 請求錯誤 | None   |


## Schemas

### UsAnalystConsensus

<a id="UsAnalystConsensus"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| ai_summary | string | 是 | AI 生成的分析師一致預期摘要 |
| aichat_data | USAIChatData | 是 | AI 對話上下文數據 |
| currency | string | 是 | 貨幣代碼，如 `USD` |
| report | string | 是 | 報告週期類型 |
| list | USConsensusItem[] | 是 | 按財年排列的一致預期數據 |
| opt_reports | string[] | 否 | 可選的報告期列表 |
| h5_data | any | 否 | H5 展示數據 |

### USConsensusItem

<a id="USConsensusItem"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| fiscal_year | int | 財年 |
| report_txt | string | 報告期標籤（如 `FY2024`） |
| revenue | USConsensusEstimate | 營收一致預期 |
| eps | USConsensusEstimate | EPS 一致预期 |
| ebit | USConsensusEstimate | EBIT 一致预期 |

### USConsensusEstimate

<a id="USConsensusEstimate"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| actual | string | 實際公布值 |
| estimate | string | 分析師一致預期值 |

### USAIChatData

<a id="USAIChatData"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| agent_id | string | AI Agent 標識 |
| handoff_agent_id | string | 轉交 Agent 標識 |
| symbol | string | 股票代碼 |
| text | string | 對話上下文文本 |
| type | string | 對話類型 |
| workflow_type | string | 工作流類型 |
