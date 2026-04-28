---
slug: order_detail
title: 订单详情
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

该接口用于订单详情查询。

<CliCommand>
# 将下方订单 ID 替换为实际的订单 ID
longbridge order 693664675163312128
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="order_detail" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/order </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type   | Required | Description                                               |
| -------- | ------ | -------- | --------------------------------------------------------- |
| order_id | string | YES      | 订单 ID，用于指定订单 ID 查询，例如：`701276261045858304` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)

resp = ctx.order_detail(
    order_id = "701276261045858304",
)
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)

    resp = await ctx.order_detail(
        order_id = "701276261045858304",
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
  const resp = await ctx.orderDetail("701276261045858304")
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
            OrderDetail resp = ctx.getOrderDetail("701276261045858304").get();
            System.out.println(resp);
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
    let resp = ctx.order_detail("701276261045858304").await?;
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

    ctx.order_detail("701276261045858304", [](auto res) {
        if (!res) { std::cout << "failed" << std::endl; return; }
        std::cout << res->order_id << std::endl;
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
	detail, err := tctx.OrderDetail(context.Background(), "701276261045858304")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", detail)
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
    "order_id": "828940451093708800",
    "status": "FilledStatus",
    "stock_name": "苹果",
    "quantity": "10",
    "executed_quantity": "10",
    "price": "200.000",
    "executed_price": "164.660",
    "submitted_at": "1680863604",
    "side": "Buy",
    "symbol": "AAPL.US",
    "order_type": "LO",
    "last_done": "164.660",
    "trigger_price": "0.0000",
    "msg": "",
    "tag": "Normal",
    "time_in_force": "Day",
    "expire_date": "2023-04-10",
    "updated_at": "1681113000",
    "trigger_at": "0",
    "trailing_amount": "",
    "trailing_percent": "",
    "limit_offset": "",
    "limit_depth_level": 0,
    "monitor_price": "",
    "trigger_count": 1,
    "trigger_status": "NOT_USED",
    "outside_rth": "ANY_TIME",
    "currency": "USD",
    "remark": "1680863603.927165",
    "free_status": "None",
    "free_amount": "",
    "free_currency": "",
    "deductions_status": "NONE",
    "deductions_amount": "",
    "deductions_currency": "",
    "platform_deducted_status": "NONE",
    "platform_deducted_amount": "",
    "platform_deducted_currency": "",
    "history": [
      {
        "price": "164.6600",
        "quantity": "10",
        "status": "FilledStatus",
        "msg": "Execution of 10",
        "time": "1681113000"
      },
      {
        "price": "200.0000",
        "quantity": "10",
        "status": "NewStatus",
        "msg": "",
        "time": "1681113000"
      }
    ],
    "charge_detail": {
      "items": [
        {
          "code": "BROKER_FEES",
          "name": "收费明细",
          "fees": []
        },
        {
          "code": "THIRD_FEES",
          "name": "第三方收费明细",
          "fees": []
        }
      ],
      "total_amount": "0",
      "currency": "USD"
    }
  }
}
```

### Response Status

| Status | Description              | Schema                                      |
| ------ | ------------------------ | ------------------------------------------- |
| 200    | 订单详情查询成功         | [order_detail_rsp](#schemaorder_detail_rsp) |
| 400    | 查询失败，请求参数错误。 | None                                        |

<aside className="success">
</aside>

## Schemas

### order_detail_rsp

<a id="schemaorder_detail_rsp"></a>
<a id="schemaorder_detail_rsp"></a>

订单信息

| Name                       | Type     | Required | Description                                                                                                                                                                                        |
| -------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| order_id                   | string   | true     | 订单 ID                                                                                                                                                                                            |
| status                     | string   | true     | [订单状态](../trade-definition#orderstatus)                                                                                                                                                        |
| stock_name                 | string   | true     | 股票名称                                                                                                                                                                                           |
| quantity                   | string   | true     | 下单数量                                                                                                                                                                                           |
| executed_quantity          | string   | true     | 成交数量。<br/><br/>当订单未成交时为 0                                                                                                                                                             |
| price                      | string   | true     | 下单价格。<br/><br/>当市价条件单未触发时为空字符串                                                                                                                                                 |
| executed_price             | string   | true     | 成交价。<br/><br/>当订单未成交时为 0                                                                                                                                                               |
| submitted_at               | string   | true     | 下单时间                                                                                                                                                                                           |
| side                       | string   | true     | 买卖方向<br/><br/> **可选值：**<br/> `Buy` - 买入<br/> `Sell` - 卖出                                                                                                                               |
| symbol                     | string   | true     | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US`                                                                                                                                               |
| order_type                 | string   | true     | [订单类型](../trade-definition#ordertype)                                                                                                                                                          |
| last_done                  | string   | true     | 最近成交价格。<br/><br/>当订单未成交时为空字符串                                                                                                                                                   |
| trigger_price              | string   | true     | `LIT` / `MIT` 订单触发价格。<br/><br/>当订单不是 `LIT` / `MIT` 订单为空字符串                                                                                                                      |
| msg                        | string   | true     | 拒绝信息或备注，默认为空字符串。                                                                                                                                                                   |
| tag                        | string   | true     | 订单标记<br/><br/> **可选值：**<br/> `Normal` - 普通订单<br/> `GTC` - 长期单<br/> `Grey` - 暗盘单                                                                                                  |
| time_in_force              | string   | true     | 订单有效期类型<br/><br/> **可选值：**<br/> `Day` - 当日有效<br/> `GTC` - 撤单前有效<br/> `GTD` - 到期前有效                                                                                        |
| expire_date                | string   | true     | 长期单过期时间，格式为 `YYYY-MM-DD`, 例如：`2022-12-05。<br/><br/> 不是长期单时，默认为空字符串。                                                                                                  |
| updated_at                 | string   | true     | 最近更新时间，格式为时间戳 (秒)，默认为 0。                                                                                                                                                        |
| trigger_at                 | string   | true     | 条件单触发时间，格式为时间戳 (秒)，默认为 0。                                                                                                                                                      |
| trailing_amount            | string   | true     | `TSLPAMT` 订单跟踪金额。<br/><br/>当订单不是 `TSLPAMT` 订单时为空字符串。                                                                                                                          |
| trailing_percent           | string   | true     | `TSLPPCT` 订单跟踪涨跌幅。<br/><br/>当订单不是 `TSLPPCT` 订单时为空字符串。                                                                                                                        |
| limit_offset               | string   | true     | `TSLPAMT` / `TSLPPCT` 订单指定价差。<br/><br/>当订单不是 `TSLPAMT` / `TSLPPCT` 订单时为空字符串。                                                                                                  |
| trigger_status             | string   | true     | 条件单触发状态<br/> 当订单不是条件单或条件单未触发时，触发状态为 NOT_USED<br/><br/> **可选值：**<br/> `NOT_USED` - 未激活<br/> `DEACTIVE` - 已失效<br/> `ACTIVE` - 已激活<br/> `RELEASED` - 已触发 |
| currency                   | string   | true     | 结算货币                                                                                                                                                                                           |
| outside_rth                | string   | true     | 是否允许盘前盘后<br/> 当订单不是美股时，默认为 UnknownOutsideRth<br/><br/> **可选值：**<br/> `RTH_ONLY` - 不允许盘前盘后<br/> `ANY_TIME` - 允许盘前盘后<br/> `OVERNIGHT` - 夜盘"                   |
| remark                     | string   | true     | 备注                                                                                                                                                                                               |
| free_status                | string   | true     | 免佣状态，默认为 None<br/><br/> **可选值：**<br/> `None` - 无<br/> `Calculated` - 免佣额待计算<br/> `Pending` - 待免佣<br/> `Ready` - 已免佣                                                       |
| free_amount                | string   | true     | 免佣金额，默认为空字符串                                                                                                                                                                           |
| free_currency              | string   | true     | 免佣货币，默认为空字符串                                                                                                                                                                           |
| deductions_status          | string   | true     | 抵扣状态/返现状态，默认为 NONE<br/><br/> **可选值：**<br/> `NONE` - 待结算 <br/> `NO_DATA` - 已结算无数据<br/> `PENDING` - 已结算待发放<br/> `DONE` - 已结算已发放                                 |
| deductions_amount          | string   | true     | 抵扣金额，默认为空字符串                                                                                                                                                                           |
| deductions_currency        | string   | true     | 抵扣货币，默认为空字符串                                                                                                                                                                           |
| platform_deducted_status   | string   | true     | 平台费抵扣状态/返现状态，默认为 NONE<br/><br/> **可选值：**<br/> `NONE` - 待结算 <br/> `NO_DATA` - 已结算无数据<br/> `PENDING` - 已结算待发放<br/> `DONE` - 已结算已发放                           |
| platform_deducted_amount   | string   | true     | 平台费抵扣金额，默认为空字符串                                                                                                                                                                     |
| platform_deducted_currency | string   | true     | 平台费抵扣货币，默认为空字符串                                                                                                                                                                     |
| history                    | object[] | true     | 订单历史明细                                                                                                                                                                                       |
| ∟ price                    | string   | true     | 成交展示成交价格，过期、撤单、拒绝等状态展示提交价格                                                                                                                                               |
| ∟ quantity                 | string   | true     | 成交展示成交数量，过期、撤单、拒绝等状态展示剩余数量                                                                                                                                               |
| ∟ status                   | string   | true     | 订单状态                                                                                                                                                                                           |
| ∟ msg                      | string   | true     | 成交或错误信息                                                                                                                                                                                     |
| ∟ time                     | string   | true     | 发生时间                                                                                                                                                                                           |
| charge_detail              | object   | true     | 订单费用                                                                                                                                                                                           |
| ∟ total_amount             | string   | true     | 全部费用                                                                                                                                                                                           |
| ∟ currency                 | string   | true     | 结算货币                                                                                                                                                                                           |
| ∟ items                    | object[] | true     | 订单费用明细                                                                                                                                                                                       |
| ∟∟ code                    | string   | true     | 收费类别代码<br/><br/> **可选值：**<br/> `UNKNOWN`<br/> `BROKER_FEES`<br/> `THIRD_FEES`                                                                                                            |
| ∟∟ name                    | string   | true     | 收费类别名称                                                                                                                                                                                       |
| ∟∟ fees                    | object[] | true     | 收费明细                                                                                                                                                                                           |
| ∟∟∟ code                   | string   | true     | 收费代码                                                                                                                                                                                           |
| ∟∟∟ name                   | string   | true     | 收费名称                                                                                                                                                                                           |
| ∟∟∟ amount                 | string   | true     | 单项收费金额                                                                                                                                                                                       |
| ∟∟∟ currency               | string   | true     | 收费货币                                                                                                                                                                                           |
| ∟∟∟ limit_depth_level      | int32    | true     | 指定买卖档位         |
| ∟∟∟ monitor_price          | string   | true     | 监控价格            |
| ∟∟∟ trigger_count          | int32    | true     | 触发次数            |
