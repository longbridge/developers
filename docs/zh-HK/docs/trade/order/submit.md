---
slug: submit
title: 委托下單
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

該接口用於港美股，窩輪，期權的委托下單。

<CliCommand>
longbridge buy TSLA.US 100 --price 250.00
longbridge sell TSLA.US 100 --price 260.00
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="submit_order" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/order </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name               | Type   | Required | Description                                                                                                                               |
| ------------------ | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| symbol             | string | YES      | 股票代碼，使用 `ticker.region` 格式，例如：`AAPL.US`                                                                                      |
| order_type         | string | YES      | [訂單類型](../trade-definition#ordertype)                                                                                                 |
| submitted_price    | string | NO       | 下單價格，例如：`388.5`<br/><br/> `LO` / `ELO` / `ALO` / `ODD` / `LIT` 訂單必填                                                           |
| submitted_quantity | string | YES      | 下單數量，例如：`100`                                                                                                                     |
| trigger_price      | string | NO       | 觸發價格，例如：`388.5`<br/><br/> `LIT` / `MIT` 訂單必填                                                                                  |
| limit_offset       | string | NO       | 指定價差<br/><br/> `TSLPAMT` / `TSLPPCT` 訂單在 `limit_depth_level` 為 0 時必填                                                          |
| trailing_amount    | string | NO       | 跟蹤金額<br/><br/> `TSLPAMT` 訂單必填                                                                                                     |
| trailing_percent   | string | NO       | 跟蹤漲跌幅<br/><br/> `TSLPPCT` 訂單必填                                                                                                   |
| expire_date        | string | NO       | 長期單過期時間，格式為 `YYYY-MM-DD`, 例如：`2022-12-05`<br/><br/> time_in_force 為 `GTD` 時必填                                           |
| side               | string | YES      | 買賣方向<br/><br/> **可選值：**<br/> `Buy` - 買入<br/> `Sell` - 賣出                                                                      |
| outside_rth        | string | NO       | 是否允許盤前盤後，美股必填<br/><br/> **可選值：**<br/> `RTH_ONLY` - 不允許盤前盤後<br/> `ANY_TIME` - 允許盤前盤後<br/> `OVERNIGHT` - 夜盤 |
| time_in_force      | string | YES      | 訂單有效期類型<br/><br/> **可選值：**<br/> `Day` - 當日有效<br/> `GTC` - 撤單前有效<br/> `GTD` - 到期前有效                               |
| remark             | string | NO       | 備註 (最大 64 字符)                                                                                                                       |
| limit_depth_level  | int32  | NO       | 指定買賣檔位，取值範圍為 -5 ～ 0 ～ 5，負數代表買盤檔位（例如 -1 表示買一），<br/>正數代表賣盤檔位（例如 1 表示賣一），當為 0 時 limit_offset 參數生效<br/>`TSLPAMT` / `TSLPPCT` 訂單有效 |
| monitor_price      | string |  NO      | 監控價格，需要達到該價格才會開始監控，更新參考價<br/>`TSLPAMT` / `TSLPPCT` 訂單有效 |
| trigger_count      | int32  |  NO      | 觸發次數，取值範圍 0 ~ 3，表示在 1 分鐘內觸發多次才會觸發訂單，<br/>`LIT` / `MIT` / `TSLPAMT` / `TSLPPCT` 訂單有效 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from decimal import Decimal
from longbridge.openapi import TradeContext, Config, OrderType, OrderSide, TimeInForceType, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# Create a context for trade APIs
ctx = TradeContext(config)

# Submit order
resp = ctx.submit_order("700.HK", OrderType.LO, OrderSide.Buy, Decimal(500), TimeInForceType.Day, submitted_price=Decimal(50), remark="Hello from Python SDK")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from decimal import Decimal
from longbridge.openapi import AsyncTradeContext, Config, OrderType, OrderSide, TimeInForceType, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)

    # Create a context for trade APIs
    ctx = AsyncTradeContext.create(config)

    # Submit order
    resp = await ctx.submit_order("700.HK", OrderType.LO, OrderSide.Buy, Decimal(500), TimeInForceType.Day, submitted_price=Decimal(50), remark="Hello from Python SDK")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, TradeContext, OAuth, OrderType, OrderSide, TimeInForceType, Decimal } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.submitOrder({ symbol: "700.HK", orderType: OrderType.LO, side: OrderSide.Buy, submittedQuantity: new Decimal(500), timeInForce: TimeInForceType.Day, submittedPrice: new Decimal(50), remark: "Hello" })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.trade.*;
import java.math.BigDecimal;
class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             TradeContext ctx = TradeContext.create(config)) {
            SubmitOrderResponse resp = ctx.submitOrder(new SubmitOrderOptions("700.HK", OrderType.LO, OrderSide.Buy, new BigDecimal("500"), TimeInForceType.Day).setSubmittedPrice(new BigDecimal("50")).setRemark("Hello")).get();
            System.out.println(resp.orderId);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, trade::{TradeContext, SubmitOrderOptions, OrderType, OrderSide, TimeInForceType}, Config};
use rust_decimal::Decimal;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = TradeContext::new(config);
    let resp = ctx.submit_order(
        SubmitOrderOptions::new("700.HK", OrderType::LO, OrderSide::Buy, Decimal::from(500), TimeInForceType::Day)
            .submitted_price(Decimal::from(50))
            .remark("Hello")
    ).await?;
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

    SubmitOrderOptions opts{"700.HK", OrderType::LO, OrderSide::Buy, 200, TimeInForceType::Day, Decimal(50.0), std::nullopt, std::nullopt, std::nullopt, std::nullopt, std::nullopt, std::nullopt, std::nullopt};
    ctx.submit_order(opts, [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        std::cout << "order_id: " << res->order_id << std::endl;
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
	"github.com/shopspring/decimal"
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
	orderID, err := tctx.SubmitOrder(context.Background(), &trade.SubmitOrder{
		Symbol:            "700.HK",
		OrderType:         trade.OrderTypeLO,
		Side:              trade.OrderSideBuy,
		SubmittedQuantity: 500,
		SubmittedPrice:    decimal.NewFromFloat(50),
		TimeInForce:       trade.TimeTypeDay,
		Remark:            "Hello from Go SDK",
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("order_id:", orderID)
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
    "order_id": 683615454870679600
  }
}
```

### Response Status

| Status | Description                | Schema |
| ------ | -------------------------- | ------ |
| 200    | 提交成功，訂單已委托。     | None   |
| 400    | 下單被拒絕，請求參數錯誤。 | None   |

<aside className="success">
</aside>
