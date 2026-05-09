---
slug: calc-date
title: Calculate DCA Date
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Calculate the next projected trade date for given DCA plan parameters.

<CliCommand>
longbridge dca calc-date AAPL.US --frequency monthly --day-of-month 15
</CliCommand>

<SDKLinks module="dca" klass="DCAContext" method="calc_date" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/dca/calc_date</td></tr>
</tbody>
</table>

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol |
| frequency | string | YES | DCA frequency: `daily`, `weekly`, `fortnightly`, `monthly` |
| day_of_week | string | NO | Day of week for weekly plans: `mon`–`fri` |
| day_of_month | integer | NO | Day of month for monthly/fortnightly plans: 1–28 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import DCAContext, Config, OAuthBuilder, DCAFrequency

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = DCAContext(config)

resp = ctx.calc_date("AAPL.US", DCAFrequency.Monthly, day_of_month=15)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncDCAContext, Config, OAuthBuilder, DCAFrequency

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncDCAContext.create(config)

    resp = await ctx.calc_date("AAPL.US", DCAFrequency.Monthly, day_of_month=15)
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, DCAContext, OAuth, DCAFrequency } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = DCAContext.new(config)
  const resp = await ctx.calcDate('AAPL.US', DCAFrequency.Monthly, undefined, 15)
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.dca.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             DCAContext ctx = DCAContext.create(config)) {
            var opts = new CalcDateOptions("AAPL.US", DCAFrequency.MONTHLY).dayOfMonth(15);
            var resp = ctx.calcDate(opts).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, dca::DCAContext, dca::DCAFrequency, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = DCAContext::new(config);
    let resp = ctx.calc_date("AAPL.US", DCAFrequency::Monthly, None, Some(15)).await?;
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
	"github.com/longbridge/openapi-go/dca"
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
	c, err := dca.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	dayOfMonth := 15
	opts := &dca.CalcDateOptions{
		Symbol:     "AAPL.US",
		Frequency:  dca.FrequencyMonthly,
		DayOfMonth: &dayOfMonth,
	}
	resp, err := c.CalcDate(context.Background(), opts)
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
    "trade_date": "2024-02-15"
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [DcaCalcDateResult](#DcaCalcDateResult) |
| 400    | Bad request | None   |

## Schemas

### DcaCalcDateResult

<a id="DcaCalcDateResult"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| trade_date | string | true | Next projected trade date (YYYY-MM-DD) |
