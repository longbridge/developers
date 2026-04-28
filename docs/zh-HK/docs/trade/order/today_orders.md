---
slug: today_orders
title: 獲取當日訂單
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

該接口用於獲取當日訂單和訂單查詢。

<CliCommand>
longbridge orders
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="today_orders" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/order/today </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type     | Required | Description                                                                                       |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------------- |
| symbol   | string   | NO       | 股票代碼，使用 `ticker.region` 格式，例如：`AAPL.US`                                              |
| status   | string[] | NO       | [訂單狀態](../trade-definition#orderstatus)<br/><br/>例如：`status=FilledStatus&status=NewStatus` |
| side     | string   | NO       | 買賣方向<br/><br/> **可選值：**<br/> `Buy` - 買入<br/> `Sell` - 賣出                              |
| market   | string   | NO       | 市場<br/><br/> **可選值：**<br/> `US` - 美股<br/> `HK` - 港股                                     |
| order_id | string   | NO       | 訂單 ID，用於指定訂單 ID 查詢，例如：`701276261045858304`                                         |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import TradeContext, Config, OrderStatus, OrderSide, Market, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.today_orders(
    symbol = "700.HK",
    status = [OrderStatus.Filled, OrderStatus.New],
    side = OrderSide.Buy,
    market = Market.HK,
)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OrderStatus, OrderSide, Market, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)

    resp = await ctx.today_orders(
        symbol = "700.HK",
        status = [OrderStatus.Filled, OrderStatus.New],
        side = OrderSide.Buy,
        market = Market.HK,
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
  const resp = await ctx.todayOrders({})
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
            Order[] resp = ctx.getTodayOrders(null).get();
            for (Order o : resp) System.out.println(o);
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
    let resp = ctx.today_orders(None).await?;
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

    ctx.today_orders(std::nullopt, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        for (const auto& o : *res) std::cout << o.order_id << std::endl;
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
	orders, err := tctx.TodayOrders(context.Background(), &trade.GetTodayOrders{})
	if err != nil {
		log.Fatal(err)
	}
	for _, o := range orders {
		fmt.Println(o.OrderId)
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
    "orders": [
      {
        "currency": "HKD",
        "executed_price": "0.000",
        "executed_quantity": "0",
        "expire_date": "",
        "last_done": "",
        "limit_offset": "",
        "msg": "",
        "order_id": "706388312699592704",
        "order_type": "ELO",
        "outside_rth": "UnknownOutsideRth",
        "price": "11.900",
        "quantity": "200",
        "side": "Buy",
        "status": "RejectedStatus",
        "stock_name": "東亞銀行",
        "submitted_at": "1651644897",
        "symbol": "23.HK",
        "tag": "Normal",
        "time_in_force": "Day",
        "trailing_amount": "",
        "trailing_percent": "",
        "trigger_at": "0",
        "trigger_price": "",
        "trigger_status": "NOT_USED",
        "updated_at": "1651644898",
        "remark": "",
        "limit_depth_level": 0,
        "monitor_price": "",
        "trigger_count": 1
      }
    ]
  }
}
```

### Response Status

| Status | Description              | Schema                                      |
| ------ | ------------------------ | ------------------------------------------- |
| 200    | 當日訂單查詢成功         | [today_orders_rsp](#schematoday_orders_rsp) |
| 400    | 查詢失敗，請求參數錯誤。 | None                                        |

<aside className="success">
</aside>

## Schemas

### today_orders_rsp

<a id="schematoday_orders_rsp"></a>
<a id="schematoday_orders_rsp"></a>

| Name                | Type     | Required | Description                                                                                                                                                                         |
| ------------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orders              | object[] | false    | 订单信息                                                                                                                                                                            |
| ∟ order_id          | string   | true     | 订单 ID                                                                                                                                                                             |
| ∟ status            | string   | true     | [订单状态](../trade-definition#orderstatus)                                                                                                                                         |
| ∟ stock_name        | string   | true     | 股票名称                                                                                                                                                                            |
| ∟ quantity          | string   | true     | 下单数量                                                                                                                                                                            |
| ∟ executed_quantity | string   | true     | 成交数量。<br/><br/>当订单未成交时为 0                                                                                                                                              |
| ∟ price             | string   | true     | 下单价格。<br/><br/>当市价条件单未触发时为空字符串                                                                                                                                  |
| ∟ executed_price    | string   | true     | 成交价。<br/><br/>当订单未成交时为 0                                                                                                                                                |
| ∟ submitted_at      | string   | true     | 下单时间                                                                                                                                                                            |
| ∟ side              | string   | true     | 买卖方向<br/><br/> **可选值：**<br/> `Buy` - 买入<br/> `Sell` - 卖出                                                                                                                |
| ∟ symbol            | string   | true     | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US`                                                                                                                                |
| ∟ order_type        | string   | true     | [订单类型](../trade-definition#ordertype)                                                                                                                                           |
| ∟ last_done         | string   | true     | 最近成交价格。<br/><br/>当订单未成交时为空字符串                                                                                                                                    |
| ∟ trigger_price     | string   | true     | `LIT` / `MIT` 订单触发价格。<br/><br/>当订单不是 `LIT` / `MIT` 订单为空字符串                                                                                                       |
| ∟ msg               | string   | true     | 拒绝信息或备注，默认为空字符串。                                                                                                                                                    |
| ∟ tag               | string   | true     | 订单标记<br/><br/> **可选值：**<br/> `Normal` - 普通订单<br/> `GTC` - 长期单<br/> `Grey` - 暗盘单                                                                                   |
| ∟ time_in_force     | string   | true     | 订单有效期类型<br/><br/> **可选值：**<br/> `Day` - 当日有效<br/> `GTC` - 撤单前有效<br/> `GTD` - 到期前有效                                                                         |
| ∟ expire_date       | string   | true     | 长期单过期时间，格式为 `YYYY-MM-DD`, 例如：`2022-12-05。<br/><br/>不是长期单时，默认为空字符串。`                                                                                   |
| ∟ updated_at        | string   | true     | 最近更新时间，格式为时间戳 (秒)，默认为 0。                                                                                                                                         |
| ∟ trigger_at        | string   | true     | 条件单触发时间，格式为时间戳 (秒)，默认为 0。                                                                                                                                       |
| ∟ trailing_amount   | string   | true     | `TSLPAMT` 订单跟踪金额。<br/><br/>当订单不是 `TSLPAMT` 订单时为空字符串。                                                                                                           |
| ∟ trailing_percent  | string   | true     | `TSLPPCT` 订单跟踪涨跌幅。<br/><br/>当订单不是 `TSLPPCT` 订单时为空字符串。                                                                                                         |
| ∟ limit_offset      | string   | true     | `TSLPAMT` / `TSLPPCT` 订单指定价差。<br/><br/>当订单不是 `TSLPAMT` / `TSLPPCT` 订单时为空字符串。                                                                                   |
| ∟ trigger_status    | string   | true     | 条件单触发状态<br/> 当订单不是条件单或条件单未触发时，触发状态为 NOT_USED<br/><br/> **可选值：**<br/> `NOT_USED` - 未激活 `DEACTIVE` - 已失效 `ACTIVE` - 已激活 `RELEASED` - 已触发 |
| ∟ currency          | string   | true     | 结算货币                                                                                                                                                                            |
| ∟ outside_rth       | string   | true     | 是否允许盘前盘后<br/> 当订单不是美股时，默认为 UnknownOutsideRth<br/><br/> **可选值：**<br/> `RTH_ONLY` - 不允许盘前盘后<br/> `ANY_TIME` - 允许盘前盘后<br/> `OVERNIGHT` - 夜盘"    |
| ∟ remark            | string   | true     | 備註                                                                                                                                                                                |
| ∟ limit_depth_level | int32    | true     | 指定買賣檔位   |
| ∟ monitor_price     | string   | true     | 監控價格       |
| ∟ trigger_count     | int32    | true     | 觸發次數       |
