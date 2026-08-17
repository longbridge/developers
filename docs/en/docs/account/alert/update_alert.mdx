---
slug: update-alert
title: Update Alert
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Enable or disable an existing price alert. First call `list` to obtain the full `AlertItem`, set `item.enabled` to `True` or `False`, then call `update(item)`.

<CliCommand>
# Enable an alert
longbridge alert enable 486469
# Disable an alert
longbridge alert disable 486469
</CliCommand>

<SDKLinks module="alert" klass="AlertContext" method="enable" />


## Parameters

> **SDK method parameters.**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | int64 | YES | Alert ID (path parameter) |
| enabled | bool | YES | New enabled state: `true` to enable, `false` to disable — set on the `AlertItem` before calling `update` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import AlertContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = AlertContext(config)

# Get the alert from list()
alerts = ctx.list()
item = alerts.lists[0].indicators[0]  # pick the alert you want
# Enable: set enabled=True then call update
item.enabled = True
ctx.update(item)
# Disable: set enabled=False then call update
item.enabled = False
ctx.update(item)
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

    alerts = await ctx.list()
    item = alerts.lists[0].indicators[0]
    item.enabled = True   # or False to disable
    await ctx.update(item)

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
  const alerts = await ctx.list()
  const item = alerts.lists[0].indicators[0]
  item.enabled = true   // or false to disable
  await ctx.update(item)
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
            var alerts = ctx.list().get();
            var item = alerts.getLists().get(0).getIndicators().get(0);
            item.setEnabled(true);  // or false to disable
            ctx.update(item).get();
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
    let mut item = ctx.list().await?.lists.remove(0).indicators.remove(0);
    item.enabled = true;  // or false to disable
    ctx.update(&item).await?;
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
            ctx.list([&ctx](auto list_resp) {
              auto& item = (*list_resp).lists[0].indicators[0];
              ctx.enable(item, [](auto resp) {
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
	list, err := c.List(context.Background())
	if err != nil { log.Fatal(err) }
	item := list.Lists[0].Indicators[0]
	item.Enabled = true  // or false to disable
	if err = c.Update(context.Background(), &item); err != nil {
		log.Fatal(err)
	}
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
  "data": {}
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [UpdateAlertResponse](#UpdateAlertResponse) |
| 400    | Bad request | None   |

## Schemas

### UpdateAlertResponse

<a id="UpdateAlertResponse"></a>

No response body fields.
