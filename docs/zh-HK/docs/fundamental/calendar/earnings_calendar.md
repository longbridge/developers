---
slug: earnings-calendar
title: 財報日曆
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

瀏覽即將發布的財報及近期業績，包含 EPS 和營收預期。

<CliCommand>
longbridge finance-calendar report
longbridge finance-calendar report --market US
</CliCommand>

<SDKLinks module="calendar" klass="CalendarContext" method="earnings_calendar" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/calendar/earnings</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| market | string | NO | Market filter: `US`, `HK`, `SH`, `SZ`. Omit for all. |
| start_date | string | NO | Start date in `YYYY-MM-DD` format |
| end_date | string | NO | End date in `YYYY-MM-DD` format |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="cli" label="CLI" default>

<CliCommand>
longbridge finance-calendar report
longbridge finance-calendar report --market US
</CliCommand>

  </TabItem>
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import CalendarContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = CalendarContext(config)

resp = ctx.earnings_calendar("AAPL.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncCalendarContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncCalendarContext.create(config)

    resp = await ctx.earnings_calendar("AAPL.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, CalendarContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = CalendarContext.new(config)
  const resp = await ctx.earnings_calendar('AAPL.US')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.calendar.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             CalendarContext ctx = CalendarContext.create(config)) {
            var resp = ctx.getEarningsCalendar("AAPL.US").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, calendar::CalendarContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = CalendarContext::new(config);
    let resp = ctx.earnings_calendar("AAPL.US").await?;
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
using namespace longbridge::calendar;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            CalendarContext ctx = CalendarContext::create(config);
            ctx.earnings_calendar("AAPL.US", [](auto resp) {
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
	"github.com/longbridge/openapi-go/calendar"
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
	c, err := calendar.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.EarningsCalendar(context.Background(), "AAPL.US")
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
        "symbol": "AAPL.US",
        "name": "Apple Inc.",
        "report_date": "2026-04-30",
        "eps_estimate": "1.62",
        "eps_actual": null,
        "revenue_estimate": "94500000000"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [earnings_calendar_rsp](#earnings_calendar_rsp) |
| 400    | Bad request | None   |

## Schemas

### earnings_calendar_rsp

<a id="earnings_calendar_rsp"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| list | object[] | true | Earnings event list |
| ∟ symbol | string | true | Security symbol |
| ∟ name | string | true | Company name |
| ∟ report_date | string | true | Expected report date |
| ∟ eps_estimate | string | false | EPS estimate |
| ∟ eps_actual | string | false | Actual EPS (null if not yet reported) |
| ∟ revenue_estimate | string | false | Revenue estimate |
