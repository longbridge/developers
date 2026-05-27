---
slug: list-dca
title: List DCA Plans
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get all recurring investment (DCA) plans for the current user.

<CliCommand>
longbridge dca
longbridge dca --status Active
</CliCommand>

<SDKLinks module="dca" klass="DCAContext" method="list" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| status | string | NO | Filter by plan status: `Active`, `Suspended`, `Finished` |
| symbol | string | NO | Filter by security symbol |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import DCAContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = DCAContext(config)

resp = ctx.list_dca()
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncDCAContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncDCAContext.create(config)

    resp = await ctx.list_dca()
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, DCAContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = DCAContext.new(config)
  const resp = await ctx.list_dca()
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
            var resp = ctx.getListDca().get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, dca::DCAContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = DCAContext::new(config);
    let resp = ctx.list_dca().await?;
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
using namespace longbridge::dca;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            DCAContext ctx = DCAContext::create(config);
            ctx.list_dca([](auto resp) {
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
	resp, err := c.ListDca(context.Background())
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
    "plans": [
      {
        "plan_id": "1239402174908207104",
        "symbol": "AAPL.US",
        "stock_name": "Apple Inc.",
        "market": "US",
        "status": "Active",
        "per_invest_amount": "100",
        "invest_frequency": "Monthly",
        "invest_day_of_month": "15",
        "invest_day_of_week": "",
        "next_trd_date": "1778853600",
        "cum_amount": "0",
        "cum_profit": "0",
        "average_cost": "0",
        "allow_margin_finance": false,
        "alter_hours": "6",
        "display_account": "LBPT10065023",
        "member_id": "3162",
        "aaid": "20975338",
        "account_channel": "lb_papertrading",
        "issue_number": 0,
        "created_at": "1778725628",
        "updated_at": "1778725628"
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [DcaListResponse](#DcaListResponse) |
| 400    | Bad request | None   |

## Schemas

### DcaListResponse

<a id="DcaListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| plans | object[] | true | List of DCA plans, see [DcaPlan](#DcaPlan) |

### DcaPlan

<a id="DcaPlan"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| plan_id | string | true | DCA plan ID |
| symbol | string | true | Security symbol |
| stock_name | string | false | Security name |
| market | string | false | Market |
| status | string | false | Plan status: `Active`, `Suspended`, `Finished` |
| per_invest_amount | string | false | Amount per investment |
| invest_frequency | string | false | Frequency: `Daily`, `Weekly`, `Fortnightly`, `Monthly` |
| invest_day_of_week | string | false | Day of week for weekly plans |
| invest_day_of_month | string | false | Day of month for monthly plans |
| next_trd_date | string | false | Next trade date |
| cum_amount | string | false | Cumulative invested amount |
| cum_profit | string | false | Cumulative profit/loss |
| average_cost | string | false | Average cost per share |
| allow_margin_finance | boolean | false | Whether margin financing is allowed |
| alter_hours | string | false | Reminder hours before trade |
| display_account | string | false | Account display name |
| account_channel | string | false | Account channel |
| aaid | string | false | Account asset ID |
| member_id | string | false | Member ID |
| issue_number | string | false | Execution count |
| created_at | string | false | Creation timestamp |
| updated_at | string | false | Last update timestamp |
