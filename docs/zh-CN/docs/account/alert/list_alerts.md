---
slug: list-alerts
title: 获取价格提醒列表
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取当前用户的所有价格提醒，支持按标的筛选。

<CliCommand>
longbridge alert
longbridge alert TSLA.US
</CliCommand>

<SDKLinks module="alert" klass="AlertContext" method="list_alerts" />


## Parameters

> **SDK 方法参数。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 否 | 按证券代码筛选，例如 `TSLA.US` |

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
| 200    | 成功        | [AlertListResponse](#AlertListResponse) |
| 400    | 请求错误    | None   |

## Schemas

### AlertListResponse

<a id="AlertListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| lists | object[] | true | 按标的分组的提醒列表，见 [AlertSymbolGroup](#AlertSymbolGroup) |

### AlertSymbolGroup

<a id="AlertSymbolGroup"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | true | 证券代码 |
| code | string | false | 股票代码 |
| market | string | false | 市场 |
| name | string | false | 证券名称 |
| price | string | false | 最新价 |
| chg | string | false | 当日涨跌额 |
| p_chg | string | false | 当日涨跌幅 |
| product | string | false | 产品类型 |
| indicators | object[] | false | 价格提醒列表，见 [AlertItem](#AlertItem) |

### AlertItem

<a id="AlertItem"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | string | true | 提醒 ID |
| indicator_id | string | false | 条件：`1`=价格上涨，`2`=价格下跌，`3`=涨幅，`4`=跌幅 |
| enabled | boolean | false | 是否启用 |
| frequency | integer | false | 触发频率：`1`=每日，`2`=每次，`3`=一次 |
| scope | integer | false | 范围 |
| text | string | false | 显示文本 |
| state | integer[] | false | 触发状态标志 |
| value_map | object | false | 触发值（如 `{"price":"400"}` 或 `{"chg":"5"}`） |