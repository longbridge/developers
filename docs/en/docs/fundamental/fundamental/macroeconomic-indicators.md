---
slug: macroeconomic-indicators
title: Macroeconomic Indicators
sidebar_position: 20
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

List macroeconomic indicators available through Longbridge, optionally filtered by country.

<CliCommand>
# List all indicators
longbridge macrodata
# Filter by US indicators
longbridge macrodata --country US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic_indicators" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| country | MacroeconomicCountry | NO | Filter by country. Omit for all countries. |
| offset | int | NO | Pagination offset. Default: 0 |
| limit | int | NO | Max records per page. Default: 100, max: 1000 |

### MacroeconomicCountry

| Value | Country |
| ----- | ------- |
| HongKong | Hong Kong SAR |
| China | China (Mainland) |
| UnitedStates | United States |
| EuroZone | Euro Zone |
| Japan | Japan |
| Singapore | Singapore |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder, MacroeconomicCountry

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

# All indicators
resp = ctx.macroeconomic_indicators()
print(resp)

# US only
resp = ctx.macroeconomic_indicators(country=MacroeconomicCountry.UnitedStates, limit=50)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncFundamentalContext, Config, OAuthBuilder, MacroeconomicCountry

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncFundamentalContext.create(config)
    resp = await ctx.macroeconomic_indicators(country=MacroeconomicCountry.UnitedStates)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth, MacroeconomicCountry } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.macroeconomicIndicators({ country: MacroeconomicCountry.UnitedStates })
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
            var resp = ctx.getMacroeconomicIndicators(null, null, null).get();
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
    let resp = ctx.macroeconomic_indicators(None, None, None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
</Tabs>

## Response

### Response Example

```json
{
  "count": 619,
  "list": [
    {
      "indicator_code": "US00175",
      "source_org": "Bureau of Labor Statistics",
      "country": "United States",
      "name": {
        "english": "Non-Farm Payroll",
        "simplified_chinese": "非农就业人数",
        "traditional_chinese": "非農就業人數"
      },
      "adjustment_factor": "",
      "periodicity": "Monthly",
      "category": "Employment",
      "describe": {
        "english": "Employment situation report...",
        "simplified_chinese": "",
        "traditional_chinese": ""
      },
      "importance": 3,
      "start_date": 1356998400
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200 | Success | [MacroeconomicIndicatorListResponse](#MacroeconomicIndicatorListResponse) |
| 400 | Bad request | None |

## Schemas

### MacroeconomicIndicatorListResponse

<a id="MacroeconomicIndicatorListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| list | MacroeconomicIndicator[] | true | Indicator list |
| count | int | true | Total number of matching indicators |

### MacroeconomicIndicator

<a id="MacroeconomicIndicator"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| indicator_code | string | true | Indicator code (use as input to `macroeconomic`) |
| source_org | string | true | Publishing organisation |
| country | string | true | Country name |
| name | MultiLanguageText | true | Indicator name |
| adjustment_factor | string | false | Adjustment factor |
| periodicity | string | true | Release periodicity (e.g. `Monthly`, `Quarterly`) |
| category | string | true | Indicator category (e.g. `Employment`, `Inflation`) |
| describe | MultiLanguageText | true | Indicator description |
| importance | int | true | Importance level (1 = Low, 2 = Medium, 3 = High) |
| start_date | int | false | Unix timestamp of data coverage start date |

### MultiLanguageText

<a id="MultiLanguageText"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| english | string | English text |
| simplified_chinese | string | Simplified Chinese text |
| traditional_chinese | string | Traditional Chinese text |
