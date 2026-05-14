---
slug: list-alerts
title: List Alerts
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get all price alerts for the current user, with optional filtering by symbol.

<CliCommand>
longbridge alert
longbridge alert TSLA.US
</CliCommand>

<SDKLinks module="alert" klass="AlertContext" method="list_alerts" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | NO | Filter by security symbol, e.g. `TSLA.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import AlertContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = AlertContext(config)

resp = ctx.list_alerts()
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncAlertContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncAlertContext.create(config)

    resp = await ctx.list_alerts()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, AlertContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = AlertContext.new(config)
  const resp = await ctx.list_alerts()
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.alert.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             AlertContext ctx = AlertContext.create(config)) {
            var resp = ctx.getListAlerts().get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, alert::AlertContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = AlertContext::new(config);
    let resp = ctx.list_alerts().await?;
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
using namespace longbridge::alert;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            AlertContext ctx = AlertContext::create(config);
            ctx.list_alerts([](auto resp) {
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
	"github.com/longbridge/openapi-go/alert"
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
	c, err := alert.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.ListAlerts(context.Background())
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
  "code": 0,
  "message": "success",
  "data": {
    "lists": [
      {
        "symbol": "AAPL.US",
        "code": "AAPL",
        "market": "US",
        "name": "Apple",
        "price": "298.87",
        "chg": "4.07",
        "p_chg": "1.38",
        "product": "stock",
        "indicators": [
          {
            "id": "514050",
            "indicator_id": "1",
            "enabled": true,
            "frequency": 2,
            "scope": 0,
            "text": "价格涨到 400",
            "state": [
              1
            ],
            "value_map": {
              "price": "400"
            }
          }
        ]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [AlertListResponse](#AlertListResponse) |
| 400    | Bad request | None   |

## Schemas

### AlertListResponse

<a id="AlertListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| lists | object[] | true | Alert groups per security, see [AlertSymbolGroup](#AlertSymbolGroup) |

### AlertSymbolGroup

<a id="AlertSymbolGroup"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | true | Security symbol |
| code | string | false | Ticker code |
| market | string | false | Market |
| name | string | false | Security name |
| price | string | false | Latest price |
| chg | string | false | Day change amount |
| p_chg | string | false | Day change percentage |
| product | string | false | Product type |
| indicators | object[] | false | Alert indicators, see [AlertItem](#AlertItem) |

### AlertItem

<a id="AlertItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | string | true | Alert ID |
| indicator_id | string | false | Condition: `1`=price_rise, `2`=price_fall, `3`=pct_rise, `4`=pct_fall |
| enabled | boolean | false | Whether the alert is active |
| frequency | integer | false | Frequency: `1`=daily, `2`=every_time, `3`=once |
| scope | integer | false | Scope |
| text | string | false | Display text |
| state | integer[] | false | Trigger state flags |
| value_map | object | false | Trigger value (e.g. `{"price":"400"}` or `{"chg":"5"}`) |