---
slug: merge-calendar
title: Merge Calendar
sidebar_position: 7
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Browse upcoming M&A and merger events.

<SDKLinks module="calendar" klass="CalendarContext" method="finance_calendar" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/quote/finance_calendar</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| start | string | YES | Start date, YYYY-MM-DD |
| end | string | YES | End date, YYYY-MM-DD |
| market | string | NO | Market filter: `US`, `HK`, `SH`, `SZ`. Omit for all. |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import CalendarContext, CalendarCategory, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = CalendarContext(config)

resp = ctx.finance_calendar(CalendarCategory.Merge, "2024-01-01", "2024-03-31")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncCalendarContext, CalendarCategory, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncCalendarContext.create(config)
    resp = await ctx.finance_calendar(CalendarCategory.Merge, "2024-01-01", "2024-03-31")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, CalendarContext, CalendarCategory, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => console.log('Open:', url))
  const config = Config.fromOAuth(oauth)
  const ctx = CalendarContext.new(config)
  const resp = await ctx.financeCalendar(CalendarCategory.Merge, '2024-01-01', '2024-03-31')
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
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             CalendarContext ctx = CalendarContext.create(config)) {
            var resp = ctx.financeCalendar(CalendarCategory.Merge, "2024-01-01", "2024-03-31", null).get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, calendar::{CalendarContext, CalendarCategory}, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = CalendarContext::new(config);
    let resp = ctx.finance_calendar(CalendarCategory::Merge, "2024-01-01", "2024-03-31", None).await?;
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

    "github.com/longbridge/openapi-go/calendar"
    "github.com/longbridge/openapi-go/config"
    "github.com/longbridge/openapi-go/oauth"
)

func main() {
    o := oauth.New("your-client-id").OnOpenURL(func(url string) { fmt.Println("Open:", url) })
    if err := o.Build(context.Background()); err != nil { log.Fatal(err) }
    conf, _ := config.New(config.WithOAuthClient(o))
    c, _ := calendar.NewFromCfg(conf)
    defer c.Close()
    resp, err := c.FinanceCalendar(context.Background(), "Merge", "2024-01-01", "2024-03-31", nil)
    if err != nil { log.Fatal(err) }
    fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | CalendarEventsResponse |
| 400    | Bad request | None   |
