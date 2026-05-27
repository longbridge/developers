---
slug: list-dca
title: 獲取定投列表
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

獲取當前用戶的所有定投（DCA）計劃。

<CliCommand>
longbridge dca
longbridge dca --status Active
</CliCommand>

<SDKLinks module="dca" klass="DCAContext" method="list" />


## Parameters

> **SDK 方法參數。**

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| status | string | 否 | 按計劃狀態篩選：`Active`（進行中）、`Suspended`（已暫停）、`Finished`（已結束） |
| symbol | string | 否 | 按證券代碼篩選 |

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
| 200    | 成功        | [DcaListResponse](#DcaListResponse) |
| 400    | 請求錯誤    | None   |

## Schemas

### DcaListResponse

<a id="DcaListResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| plans | object[] | 是 | 定投計劃列表，見 [DcaPlan](#DcaPlan) |

### DcaPlan

<a id="DcaPlan"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| plan_id | string | 是 | 定投計劃 ID |
| symbol | string | 是 | 證券代碼 |
| stock_name | string | 否 | 標的名稱 |
| market | string | 否 | 市場 |
| status | string | 否 | 計劃狀態：`Active`（進行中）、`Suspended`（已暫停）、`Finished`（已結束） |
| per_invest_amount | string | 否 | 每次投入金額 |
| invest_frequency | string | 否 | 投資頻率：`Daily`、`Weekly`、`Fortnightly`、`Monthly` |
| invest_day_of_week | string | 否 | 每週扣款日 |
| invest_day_of_month | string | 否 | 每月扣款日 |
| next_trd_date | string | 否 | 下次交易日 |
| cum_amount | string | 否 | 累計投入金額 |
| cum_profit | string | 否 | 累計盈虧 |
| average_cost | string | 否 | 平均持倉成本 |
| allow_margin_finance | boolean | 否 | 是否允許融資 |
| alter_hours | string | 否 | 提前提醒小時數 |
| display_account | string | 否 | 賬戶顯示名稱 |
| account_channel | string | 否 | 賬戶渠道 |
| aaid | string | 否 | 賬戶資產 ID |
| member_id | string | 否 | 用戶 ID |
| issue_number | string | 否 | 已執行次數 |
| created_at | string | 否 | 創建時間 |
| updated_at | string | 否 | 最後更新時間 |
