---
slug: us_analyst_consensus
title: US Analyst Consensus
sidebar_position: 35
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US Accounts
This method is only available for US data-center accounts.
:::

Get analyst consensus estimates for a US stock — revenue, EPS forecasts, and buy/hold/sell ratings.

<CliCommand>
# US analyst consensus
longbridge consensus AAPL.US
longbridge consensus NVDA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_analyst_consensus" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Stock symbol, e.g. `AAPL.US` |
| report | string | NO | Period: `af` (annual), `saf` (semi-annual), `qf` (quarterly), `q1` (Q1), `3q` (Q3) |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
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
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
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
    console.log('Open this URL to authorize: ' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
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

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UsAnalystConsensus](#UsAnalystConsensus) |
| 400    | Bad request | None   |


## Schemas

### UsAnalystConsensus

<a id="UsAnalystConsensus"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| ai_summary | string | true | AI-generated analyst consensus summary |
| aichat_data | USAIChatData | true | AI chat context data |
| currency | string | true | Currency code (e.g. `USD`) |
| report | string | true | Report period type |
| list | USConsensusItem[] | true | Consensus estimates by fiscal year |
| opt_reports | string[] | false | Optional available report periods |
| h5_data | any | false | H5 display data |

### USConsensusItem

<a id="USConsensusItem"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| fiscal_year | int | Fiscal year |
| report_txt | string | Period label (e.g. `FY2024`) |
| revenue | USConsensusEstimate | Revenue consensus |
| eps | USConsensusEstimate | EPS consensus |
| ebit | USConsensusEstimate | EBIT consensus |

### USConsensusEstimate

<a id="USConsensusEstimate"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| actual | string | Actual reported value |
| estimate | string | Analyst consensus estimate |

### USAIChatData

<a id="USAIChatData"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| agent_id | string | AI agent identifier |
| handoff_agent_id | string | Handoff agent identifier |
| symbol | string | Stock symbol |
| text | string | Chat context text |
| type | string | Chat type |
| workflow_type | string | Workflow type |
