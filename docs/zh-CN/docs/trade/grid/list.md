---
slug: list
sidebar_position: 3
title: 网格订单列表
sidebar_label: '订单列表'
search: true
headingLevel: 3
---

分页获取网格订单列表，可按市场、标的或状态筛选。

<CliCommand>
# 列出全部网格订单（默认）
longbridge grid
# 按标的和状态筛选
longbridge grid --symbol 700.HK --status Performing
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="list" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/list</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name       | Type   | Required | Description                                                              |
| ---------- | ------ | -------- | ------------------------------------------------------------------------ |
| page       | int32  | NO       | 页码，从 `1` 开始                                                         |
| limit      | int32  | NO       | 每页数量                                                                 |
| market     | string | NO       | 市场筛选<br/><br/>**可选值：**<br/>`US` / `HK` / `CN` / `SG`             |
| symbol     | string | NO       | 标的代码，使用 `ticker.region` 格式，例如：`700.HK`                      |
| status     | string | NO       | 网格订单状态筛选，多个状态用逗号连接，例如：`Performing,Suspended`        |
| sort_by    | string | NO       | 排序字段                                                                 |
| sort_order | string | NO       | 排序方向                                                                 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 网格 REST 接口通过独立的 GridContext 调用
ctx = GridContext(config)

resp = ctx.list(symbol="700.HK", status="Performing", limit=20)
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
  const resp = await ctx.list({ symbol: '700.HK', status: 'Performing', limit: 20 })
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
            GridOrder[] orders = ctx.list(new GetGridOrdersOptions().setSymbol("700.HK").setLimit(20)).get();
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
    grid::{GridContext, GetGridOrdersOptions},
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let resp = ctx.list(GetGridOrdersOptions::new().symbol("700.HK").limit(20)).await?;
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

    GetGridOrdersOptions opts;
    opts.symbol = "700.HK";
    opts.status = "Performing";
    opts.limit = 20;

    ctx.list(std::optional<GetGridOrdersOptions>(opts), [](auto res) {
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
    ],
    "has_more": false
  }
}
```

### Response Status

| Status | Description                | Schema |
| ------ | -------------------------- | ------ |
| 200    | 网格订单列表返回成功。     | [list_grid_orders_rsp](#schemalist_grid_orders_rsp)   |
| 400    | 请求被拒绝，请求参数错误。 | None   |

<aside className="success">
</aside>

## Schemas

### list_grid_orders_rsp

<a id="schemalist_grid_orders_rsp"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| grid_order | object[] | false | 网格订单 |
| ∟ order_id | string | true | 网格订单 ID |
| ∟ symbol | string | true | 标的代码，使用 `ticker.region` 格式，例如：`AAPL.US` |
| ∟ stock_name | string | true | 标的名称 |
| ∟ market | string | true | 市场 |
| ∟ status | string | true | 网格订单状态 |
| ∟ grid_status | string | true | 网格运行状态 |
| ∟ submitted_base_price | string | true | 创建网格时提交的基准价 |
| ∟ current_base_price | string | true | 当前基准价 |
| ∟ pre_trigger_base_price | string | true | 上次触发前的基准价 |
| ∟ post_trigger_base_price | string | true | 上次触发后的基准价 |
| ∟ upper_limit_price | string | true | 价格上限 |
| ∟ lower_limit_price | string | true | 价格下限 |
| ∟ trigger_price_type | int32 | true | 触发价类型<br/><br/>**可选值：**<br/>`1` - 价差<br/>`2` - 百分比 |
| ∟ trigger_spread_up | string | true | 向上触发价差 |
| ∟ trigger_spread_down | string | true | 向下触发价差 |
| ∟ trigger_percent_up | string | true | 向上触发百分比 |
| ∟ trigger_percent_down | string | true | 向下触发百分比 |
| ∟ pullback_percent | string | true | 回撤百分比 |
| ∟ pullback_spread | string | true | 回撤价差 |
| ∟ rebound_percent | string | true | 反弹百分比 |
| ∟ rebound_spread | string | true | 反弹价差 |
| ∟ trigger_sell_order_type | string | true | 卖出方向订单类型 |
| ∟ trigger_buy_order_type | string | true | 买入方向订单类型 |
| ∟ trigger_sell_depth | int32 | true | 卖出方向盘口深度 |
| ∟ trigger_buy_depth | int32 | true | 买入方向盘口深度 |
| ∟ trigger_quantity | string | true | 每次触发数量 |
| ∟ trigger_sell_quantity | string | true | 卖出方向触发数量 |
| ∟ trigger_buy_quantity | string | true | 买入方向触发数量 |
| ∟ upper_limit_quantity | string | true | 触及上限时处理的数量 |
| ∟ lower_limit_quantity | string | true | 触及下限时处理的数量 |
| ∟ upper_limit_event | int32 | true | 触及上限时的处理动作<br/><br/>**可选值：**<br/>`1` - 忽略<br/>`2` - 以最新价平仓 |
| ∟ lower_limit_event | int32 | true | 触及下限时的处理动作<br/><br/>**可选值：**<br/>`1` - 忽略<br/>`2` - 以最新价平仓 |
| ∟ multiple_trigger | boolean | true | 单个网格档位是否可多次触发 |
| ∟ trigger_times | int32 | true | 触发次数 |
| ∟ total_buy_quantity | string | true | 累计买入数量 |
| ∟ total_sell_quantity | string | true | 累计卖出数量 |
| ∟ total_profit_balance | string | true | 累计已实现收益 |
| ∟ settlement_currency | string | true | 结算币种 |
| ∟ time_in_force | int32 | true | 订单有效期<br/><br/>**可选值：**<br/>`0` - 当日有效<br/>`1` - GTC（撤单前有效）<br/>`6` - GTD（指定日期前有效） |
| ∟ gtd | string | true | GTD 到期日，格式：`YYYY-MM-DD` |
| ∟ created_at | string | true | 创建时间，RFC3339 格式 |
| ∟ rth | int32 | true | 盘中交易时段标志 |
| ∟ support_shortsell | boolean | true | 是否允许卖空 |
| ∟ grid_order_type_up | string | true | 深度为 `0` 时使用的卖出方向订单类型 |
| ∟ grid_order_type_down | string | true | 深度为 `0` 时使用的买入方向订单类型 |
| has_more | boolean | true | 是否还有更多页 |
