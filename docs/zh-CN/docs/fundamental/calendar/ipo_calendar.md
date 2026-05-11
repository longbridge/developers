---
slug: ipo-calendar
title: IPO 日历
sidebar_position: 4
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取即将上市和近期 IPO 信息，包含预计发行价和上市日期。

<CliCommand>
longbridge finance-calendar ipo
longbridge finance-calendar ipo --market US
</CliCommand>

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
| start | string | YES | 开始日期，格式 YYYY-MM-DD |
| end | string | YES | 结束日期，格式 YYYY-MM-DD |
| market | string | NO | 市场筛选：US、HK、SH、SZ，不填则返回所有市场 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import CalendarContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = CalendarContext(config)

resp = ctx.ipo_calendar("AAPL.US")
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

    resp = await ctx.ipo_calendar("AAPL.US")
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
  const resp = await ctx.ipo_calendar('AAPL.US')
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
            var resp = ctx.getIpoCalendar("AAPL.US").get();
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
    let resp = ctx.ipo_calendar("AAPL.US").await?;
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
            ctx.ipo_calendar("AAPL.US", [](auto resp) {
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
	resp, err := c.IpoCalendar(context.Background(), "AAPL.US")
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
        "symbol": "NEWCO.US",
        "name": "New Company Inc.",
        "listing_date": "2026-05-15",
        "offer_price": "18.00",
        "currency": "USD",
        "market": "US"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功     | [CalendarEventsResponse](#CalendarEventsResponse) |
| 400    | 请求错误 | None   |

## Schemas

### CalendarEventsResponse

<a id="CalendarEventsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| date | string | 否 | 响应日期 |
| list | object[] | 是 | 日历日期分组列表 |

### CalendarDateGroup

<a id="CalendarDateGroup"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| date | string | 是 | 日期 |
| count | integer | 否 | 该日期的事件数量 |
| infos | object[] | 是 | 日历事件列表 |

### CalendarEventInfo

<a id="CalendarEventInfo"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | string | 否 | 事件 ID |
| symbol | string | 否 | 证券代码 |
| market | string | 否 | 市场 |
| counter_name | string | 否 | 证券名称 |
| event_type | string | 否 | 事件类型 |
| activity_type | string | 否 | 活动类型 |
| date | string | 否 | 事件日期 |
| datetime | string | 否 | 事件时间 |
| date_type | string | 否 | 日期类型 |
| content | string | 否 | 事件内容描述 |
| currency | string | 否 | 货币 |
| star | integer | 否 | 重要性（1-3 星） |
| icon | string | 否 | 图标链接 |
| chart_uid | string | 否 | 图表标识符 |
| financial_market_time | string | 否 | 金融市场时间 |
| data_kv | object[] | 否 | 键值数据对 |
