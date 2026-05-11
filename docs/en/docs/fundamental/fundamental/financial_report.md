---
slug: financial-report
title: Financial Report
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Fetch income statement, balance sheet, and cash flow statement for any public company.

<CliCommand>
longbridge financial-report TSLA.US --kind IS
longbridge financial-report AAPL.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="financial_report" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/fundamental/financial_reports</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol, e.g. `AAPL.US` |
| kind | string | YES | Report type: `IncomeStatement`, `BalanceSheet`, `CashFlow`, `All` |
| period | string | YES | Report period: `Annual`, `SemiAnnual`, `Q1`, `Q2`, `Q3`, `ThreeQ`, `QuarterlyFull` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.financial_report("AAPL.US")
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

    resp = await ctx.financial_report("AAPL.US")
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
  const resp = await ctx.financial_report('AAPL.US')
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
            var resp = ctx.getFinancialReport("AAPL.US").get();
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
    let resp = ctx.financial_report("AAPL.US").await?;
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
using namespace longbridge::fundamental;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            FundamentalContext ctx = FundamentalContext::create(config);
            ctx.financial_report("AAPL.US", [](auto resp) {
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
	resp, err := c.FinancialReport(context.Background(), "AAPL.US")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "type": "IS",
        "period": "Q4 2025",
        "eps": "0.24",
        "revenue": "24900000000",
        "net_income": "840000000",
        "gross_margin": "0.2012"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [FinancialReportsResponse](#FinancialReportsResponse) |
| 400    | Bad request | None   |

## Schemas

### FinancialReportsResponse

<a id="FinancialReportsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| list | object | true | Report data grouped by kind (key: report type code, e.g. `IS`, `BS`, `CF`) |

### FinancialReportIndicator

<a id="FinancialReportIndicator"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| title | string | false | Indicator title |
| short_title | string | false | Short title |
| currency | string | false | Currency |
| has_yoy | boolean | false | Whether year-over-year data is available |
| entry | string | false | Entry identifier |
| periods | string[] | false | Available reporting periods |
| accounts | object[] | false | List of financial line items |

### FinancialAccount

<a id="FinancialAccount"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| field | string | true | Field identifier |
| name | string | false | Field display name |
| percent | boolean | false | Whether the value is a percentage |
| tip | string | false | Tooltip description |
| values | object[] | false | Historical values by period |

### FinancialValue

<a id="FinancialValue"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| period | string | true | Period label (e.g. `FY 2024`) |
| year | integer | false | Fiscal year |
| fp_end | string | false | Period end timestamp |
| value | string | false | Reported value |
| ratio | string | false | Ratio value |
| yoy | string | false | Year-over-year growth rate |
