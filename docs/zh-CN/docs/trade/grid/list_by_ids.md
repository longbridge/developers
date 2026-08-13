---
slug: list_by_ids
sidebar_position: 4
title: 按 ID 查询网格订单
sidebar_label: '按 ID 查询订单'
search: true
headingLevel: 3
---

按 ID 查询指定的网格订单。

<CliCommand>
# 按 ID 查询指定网格订单
longbridge grid --ids 764609681686573056 764609681686573057
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="list_by_ids" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/list</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name      | Type     | Required | Description        |
| --------- | -------- | -------- | ------------------ |
| order_ids | string[] | YES      | 待查询的网格订单 ID |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 网格 REST 接口通过独立的 GridContext 调用
ctx = GridContext(config)

resp = ctx.list_by_ids(["764609681686573056"])
print(resp)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, GridContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = GridContext.new(config)
  const resp = await ctx.listByIds({ orderIds: ['764609681686573056'] })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.grid.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             GridContext ctx = GridContext.create(config)) {
            GridOrder[] orders = ctx.listByIds(new String[]{"764609681686573056"}).get();
            for (GridOrder order : orders) {
                System.out.println(order);
            }
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{
    Config,
    grid::{GridContext, GetGridOrdersByIdsOptions},
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let resp = ctx.list_by_ids(GetGridOrdersByIdsOptions::new(["764609681686573056"])).await?;
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
using namespace longbridge::grid;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    GridContext ctx = GridContext::create(config);

    GetGridOrdersByIdsOptions opts;
    opts.order_ids = { "764609681686573056" };

    ctx.list_by_ids(opts, [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "grid orders: " << res->count << std::endl;
    });
}

int main(int argc, char const* argv[]) {
    const std::string client_id = "your-client-id";
    OAuthBuilder(client_id).build(
    [](const std::string& url) {
        std::cout << "Open this URL to authorize: " << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed" << std::endl;
            return;
        }
        run(*res);
    });

    std::cin.get();
    return 0;
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
    "grid_order": [
      {
        "order_id": "764609681686573056",
        "symbol": "700.HK",
        "stock_name": "TENCENT",
        "market": "HK",
        "status": "Performing",
        "grid_status": "Performing",
        "submitted_base_price": "300.000",
        "current_base_price": "300.000",
        "pre_trigger_base_price": "300.000",
        "post_trigger_base_price": "306.000",
        "upper_limit_price": "360.000",
        "lower_limit_price": "240.000",
        "trigger_price_type": 2,
        "trigger_spread_up": "",
        "trigger_spread_down": "",
        "trigger_percent_up": "2",
        "trigger_percent_down": "2",
        "pullback_percent": "",
        "pullback_spread": "",
        "rebound_percent": "",
        "rebound_spread": "",
        "trigger_sell_order_type": "GMO",
        "trigger_buy_order_type": "GMO",
        "trigger_sell_depth": 0,
        "trigger_buy_depth": 0,
        "trigger_quantity": "100",
        "trigger_sell_quantity": "100",
        "trigger_buy_quantity": "100",
        "upper_limit_quantity": "200",
        "lower_limit_quantity": "100",
        "upper_limit_event": 1,
        "lower_limit_event": 1,
        "multiple_trigger": false,
        "trigger_times": 3,
        "total_buy_quantity": "300",
        "total_sell_quantity": "200",
        "total_profit_balance": "1250.00",
        "settlement_currency": "HKD",
        "time_in_force": 1,
        "gtd": "",
        "created_at": "2025-01-15T09:30:00+08:00",
        "rth": 0,
        "support_shortsell": false,
        "grid_order_type_up": "GMO",
        "grid_order_type_down": "GMO"
      }
    ]
  }
}
```

### Response Status

| Status | Description                | Schema                                                            |
| ------ | -------------------------- | ----------------------------------------------------------------- |
| 200    | 网格订单返回成功。         | [list_grid_orders_by_ids_rsp](#schemalist_grid_orders_by_ids_rsp) |
| 400    | 请求被拒绝，请求参数错误。 | None                                                              |

<aside className="success">
</aside>

## Schemas

### list_grid_orders_by_ids_rsp

<a id="schemalist_grid_orders_by_ids_rsp"></a>

| Name                       | Type     | Required | Description                                                                                                          |
| -------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| grid_order                 | object[] | false    | 网格订单                                                                                                            |
| ∟ order_id                 | string   | true     | 网格订单 ID                                                                                                         |
| ∟ symbol                   | string   | true     | 标的代码，使用 `ticker.region` 格式，例如：`AAPL.US`                                                                |
| ∟ stock_name               | string   | true     | 标的名称                                                                                                            |
| ∟ market                   | string   | true     | 市场                                                                                                                |
| ∟ status                   | string   | true     | 网格订单状态                                                                                                        |
| ∟ grid_status              | string   | true     | 网格运行状态                                                                                                        |
| ∟ submitted_base_price     | string   | true     | 网格锚定的提交基准价格                                                                                              |
| ∟ current_base_price       | string   | true     | 当前基准价格                                                                                                        |
| ∟ pre_trigger_base_price   | string   | true     | 上次触发前的基准价格                                                                                                |
| ∟ post_trigger_base_price  | string   | true     | 上次触发后的基准价格                                                                                                |
| ∟ upper_limit_price        | string   | true     | 价格上限                                                                                                            |
| ∟ lower_limit_price        | string   | true     | 价格下限                                                                                                            |
| ∟ trigger_price_type       | int32    | true     | 触发价格类型<br/><br/> **Enum Value:**<br/> `1` - 价差<br/> `2` - 百分比                                            |
| ∟ trigger_spread_up        | string   | true     | 向上触发价差，`trigger_price_type` 为 `1` 时使用                                                                    |
| ∟ trigger_spread_down      | string   | true     | 向下触发价差，`trigger_price_type` 为 `1` 时使用                                                                    |
| ∟ trigger_percent_up       | string   | true     | 向上触发百分比，`trigger_price_type` 为 `2` 时使用                                                                  |
| ∟ trigger_percent_down     | string   | true     | 向下触发百分比，`trigger_price_type` 为 `2` 时使用                                                                  |
| ∟ pullback_percent         | string   | true     | 回调百分比                                                                                                          |
| ∟ pullback_spread          | string   | true     | 回调价差                                                                                                            |
| ∟ rebound_percent          | string   | true     | 反弹百分比                                                                                                          |
| ∟ rebound_spread           | string   | true     | 反弹价差                                                                                                            |
| ∟ trigger_sell_order_type  | string   | true     | 卖出方网格订单类型<br/><br/> **Enum Value:**<br/> `GMO` - 网格市价单<br/> `GLO` - 网格限价单<br/> `GTG` - 网格触价单 |
| ∟ trigger_buy_order_type   | string   | true     | 买入方网格订单类型<br/><br/> **Enum Value:**<br/> `GMO` - 网格市价单<br/> `GLO` - 网格限价单<br/> `GTG` - 网格触价单 |
| ∟ trigger_sell_depth       | int32    | true     | 卖出方盘口深度，范围 `-5..5`；`0` 表示使用 `trigger_sell_order_type`                                                |
| ∟ trigger_buy_depth        | int32    | true     | 买入方盘口深度，范围 `-5..5`；`0` 表示使用 `trigger_buy_order_type`                                                 |
| ∟ trigger_quantity         | string   | true     | 每次触发数量                                                                                                        |
| ∟ trigger_sell_quantity    | string   | true     | 卖出方触发数量                                                                                                      |
| ∟ trigger_buy_quantity     | string   | true     | 买入方触发数量                                                                                                      |
| ∟ upper_limit_quantity     | string   | true     | 触及上限时处理的数量                                                                                                |
| ∟ lower_limit_quantity     | string   | true     | 触及下限时处理的数量                                                                                                |
| ∟ upper_limit_event        | int32    | true     | 触及上限时的处理事件<br/><br/> **Enum Value:**<br/> `1` - 忽略（保持网格运行）<br/> `2` - 以最新价平仓             |
| ∟ lower_limit_event        | int32    | true     | 触及下限时的处理事件<br/><br/> **Enum Value:**<br/> `1` - 忽略（保持网格运行）<br/> `2` - 以最新价平仓             |
| ∟ multiple_trigger         | boolean  | true     | 单个网格档位是否可多次触发                                                                                          |
| ∟ trigger_times            | int32    | true     | 网格已触发次数                                                                                                      |
| ∟ total_buy_quantity       | string   | true     | 累计买入数量                                                                                                        |
| ∟ total_sell_quantity      | string   | true     | 累计卖出数量                                                                                                        |
| ∟ total_profit_balance     | string   | true     | 累计收益余额                                                                                                        |
| ∟ settlement_currency      | string   | true     | 结算货币                                                                                                            |
| ∟ time_in_force            | int32    | true     | 订单有效期类型<br/><br/> **Enum Value:**<br/> `0` - 当日有效<br/> `1` - 撤单前有效<br/> `6` - 指定日期前有效       |
| ∟ gtd                      | string   | true     | 指定日期前有效的到期日期，格式：`YYYY-MM-DD`                                                                        |
| ∟ created_at               | string   | true     | 创建时间，格式为 RFC3339                                                                                            |
| ∟ rth                      | int32    | true     | 盘中交易时段标识<br/><br/> **Enum Value:**<br/> `0`<br/> `1`<br/> `2`                                               |
| ∟ support_shortsell        | boolean  | true     | 是否允许卖空                                                                                                        |
| ∟ grid_order_type_up       | string   | true     | 深度为 `0` 时卖出方的订单类型<br/><br/> **Enum Value:**<br/> `GMO` - 网格市价单<br/> `GLO` - 网格限价单<br/> `GTG` - 网格触价单 |
| ∟ grid_order_type_down     | string   | true     | 深度为 `0` 时买入方的订单类型<br/><br/> **Enum Value:**<br/> `GMO` - 网格市价单<br/> `GLO` - 网格限价单<br/> `GTG` - 网格触价单 |
