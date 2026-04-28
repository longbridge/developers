---
slug: history_executions
title: 獲取歷史成交明細
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

該接口用於獲取歷史訂單的成交明細，包括買入和賣出的成交記錄，不支持當日成交明細查詢。

<CliCommand>
longbridge executions --history
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="history_executions" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/execution/history </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type   | Required | Description                                                                                                   |
| -------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| symbol   | string | NO       | 股票代碼，使用 `ticker.region` 格式，例如：`AAPL.US`                                                          |
| start_at | string | NO       | 開始時間，格式為時間戳 (秒)，例如：`1650410999`。<br/><br/>開始時間為空時，默認為結束時間或當前時間前九十天。 |
| end_at   | string | NO       | 結束時間，格式為時間戳 (秒)，例如：`1650410999`。<br/><br/>結束時間為空時，默認為開始時間後九十天或當前時間。 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from datetime import datetime
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.history_executions(
    symbol = "700.HK",
    start_at = datetime(2022, 5, 9),
    end_at = datetime(2022, 5, 12),
)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from datetime import datetime
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)

    resp = await ctx.history_executions(
        symbol = "700.HK",
        start_at = datetime(2022, 5, 9),
        end_at = datetime(2022, 5, 12),
    )
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.historyExecutions({})
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.trade.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            Execution[] resp = ctx.getHistoryExecutions(null).get();
            for (Execution e : resp) System.out.println(e);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, trade::TradeContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.history_executions(None).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

#ifdef WIN32
#include <windows.h>
#endif

using namespace longbridge;
using namespace longbridge::trade;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    TradeContext ctx = TradeContext::create(config);

    ctx.history_executions(std::nullopt, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        for (const auto& e : *res) std::cout << e.order_id << std::endl;
    });
}

int main(int argc, char const* argv[]) {
#ifdef WIN32
    SetConsoleOutputCP(CP_UTF8);
#endif

    const std::string client_id = "your-client-id";
    OAuthBuilder(client_id).build(
    [](const std::string& url) {
        std::cout << "Open this URL to authorize: " << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed: " << *res.status().message() << std::endl;
            return;
        }
        run(*res);
    });

    std::cin.get();
    return 0;
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
	"time"

	"github.com/longbridge/openapi-go/config"
	"github.com/longbridge/openapi-go/oauth"
	"github.com/longbridge/openapi-go/trade"
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
	tctx, err := trade.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer tctx.Close()
	start := time.Date(2024, 5, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2024, 5, 10, 0, 0, 0, 0, time.UTC)
	executions, err := tctx.HistoryExecutions(context.Background(), &trade.GetHistoryExecutions{
		Symbol:  "AAPL.US",
		StartAt: start,
		EndAt:   end,
	})
	if err != nil {
		log.Fatal(err)
	}
	for _, e := range executions {
		fmt.Println(e.OrderId)
	}
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
    "has_more": false,
    "trades": [
      {
        "order_id": "693664675163312128",
        "price": "388",
        "quantity": "100",
        "symbol": "700.HK",
        "trade_done_at": "1648611351",
        "trade_id": "693664675163312128-1648611351433741210"
      }
    ]
  }
}
```

### Response Status

| Status | Description              | Schema                                                  |
| ------ | ------------------------ | ------------------------------------------------------- |
| 200    | 查詢成功                 | [history_executions_rsp](#schemahistory_executions_rsp) |
| 400    | 查詢失敗，請求參數錯誤。 | None                                                    |

<aside className="success">
</aside>

## Schemas

### history_executions_rsp

<a id="schemahistory_executions_rsp"></a>
<a id="schemahistory_executions_rsp"></a>

| Name            | Type     | Required | Description                                                                                                   |
| --------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| has_more        | boolean  | true     | 是否還有更多數據。<br/><br/>每次查詢最大訂單數量為 1000，如果查詢結果數量超過 1000，那麽 has_more 就會為 true |
| trades          | object[] | false    | 成交明細信息                                                                                                  |
| ∟ order_id      | string   | true     | 訂單 ID                                                                                                       |
| ∟ trade_id      | string   | true     | 成交 ID                                                                                                       |
| ∟ symbol        | string   | true     | 股票代碼，使用 `ticker.region` 格式，例如：`AAPL.US`                                                          |
| ∟ trade_done_at | string   | true     | 成交時間，格式為時間戳 (秒)                                                                                   |
| ∟ quantity      | string   | true     | 成交數量                                                                                                      |
| ∟ price         | string   | true     | 成交價格                                                                                                      |
