---
slug: us_analyst_consensus
title: 美股分析师一致预期
sidebar_position: 35
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

获取美股分析师一致预期——营收、EPS 预测及买入/持有/卖出评级。

<CliCommand>
# 美股分析师一致预期
longbridge consensus AAPL.US
longbridge consensus NVDA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_analyst_consensus" />

## Parameters

> **SDK 方法参数。**

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代码，如 `AAPL.US` |
| report | string | 否 | 报告周期：`af`（年报）、`saf`（半年报）、`qf`（季报）、`q1`（Q1）、`3q`（Q3）|

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
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
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("请访问：", url))
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
    console.log('请访问此 URL 授权：' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问：{url}")).await?;
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

| 状态码 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsAnalystConsensus](#UsAnalystConsensus) |
| 400    | 请求错误 | None   |


## Schemas

### UsAnalystConsensus

<a id="UsAnalystConsensus"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| ai_summary | string | 是 | AI 生成的分析师一致预期摘要 |
| aichat_data | USAIChatData | 是 | AI 对话上下文数据 |
| currency | string | 是 | 货币代码，如 `USD` |
| report | string | 是 | 报告周期类型 |
| list | USConsensusItem[] | 是 | 按财年排列的一致预期数据 |
| opt_reports | string[] | 否 | 可选的报告期列表 |
| h5_data | any | 否 | H5 展示数据 |

### USConsensusItem

<a id="USConsensusItem"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| fiscal_year | int | 财年 |
| report_txt | string | 报告期标签（如 `FY2024`） |
| revenue | USConsensusEstimate | 营收一致预期 |
| eps | USConsensusEstimate | EPS 一致预期 |
| ebit | USConsensusEstimate | EBIT 一致预期 |

### USConsensusEstimate

<a id="USConsensusEstimate"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| actual | string | 实际公布值 |
| estimate | string | 分析师一致预期值 |

### USAIChatData

<a id="USAIChatData"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| agent_id | string | AI Agent 标识 |
| handoff_agent_id | string | 转交 Agent 标识 |
| symbol | string | 股票代码 |
| text | string | 对话上下文文本 |
| type | string | 对话类型 |
| workflow_type | string | 工作流类型 |
