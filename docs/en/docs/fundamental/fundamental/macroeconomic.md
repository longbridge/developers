---
slug: macroeconomic
title: Macroeconomic Historical Data
sidebar_position: 21
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get historical releases for a specific macroeconomic indicator — actual values, forecasts, previous values, and next release dates.

<CliCommand>
# Historical data for Non-Farm Payroll
longbridge macrodata 62267
# Date range filter
longbridge macrodata 62267 --start 2024-01-01 --end 2024-12-31
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="macroeconomic" />

## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| indicator_code | string | YES | Indicator code from `macroeconomic_indicators` |
| start_date | string | NO | Start date in `YYYY-MM-DD` format |
| end_date | string | NO | End date in `YYYY-MM-DD` format |
| offset | int | NO | Pagination offset. Default: 0 |
| limit | int | NO | Max records. Default: 100, max: 100 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)

resp = ctx.macroeconomic("62267", start_date="2024-01-01", end_date="2024-12-31")
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
    resp = await ctx.macroeconomic("62267", start_date="2024-01-01", end_date="2024-12-31")
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
  const resp = await ctx.macroeconomic('62267', { startDate: '2024-01-01', endDate: '2024-12-31' })
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
            var resp = ctx.getMacroeconomic("62267", "2024-01-01", "2024-12-31", null, null).get();
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
    let resp = ctx.macroeconomic("62267", Some("2024-01-01"), Some("2024-12-31"), None, None).await?;
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
  "count": 24,
  "info": {
    "indicator_code": "62267",
    "country": "US",
    "name": "Non-Farm Payroll",
    "periodicity": "Monthly",
    "describe": "...",
    "importance": 3
  },
  "data": [
    {
      "period": "2024-12-01",
      "release_at": 1735900200,
      "actual_value": "256000",
      "previous_value": "212000",
      "forecast_value": "165000"
    }
  ]
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200 | Success | [MacroeconomicResponse](#MacroeconomicResponse) |
| 400 | Bad request | None |

## Schemas

### MacroeconomicResponse

<a id="MacroeconomicResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| info | MacroeconomicIndicator | true | Indicator metadata |
| data | Macroeconomic[] | true | Historical data points |
| count | int | true | Total number of data points |

### Macroeconomic

<a id="Macroeconomic"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| period | string | true | Statistical period (e.g. `2024-12-01`, `2024-Q4`) |
| release_at | int | false | Unix timestamp of release datetime |
| actual_value | string | true | Actual released value |
| previous_value | string | true | Previous period value |
| forecast_value | string | true | Market consensus forecast |
