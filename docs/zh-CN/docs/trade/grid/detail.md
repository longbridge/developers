---
slug: detail
sidebar_position: 5
title: 网格订单详情
sidebar_label: '订单详情'
search: true
headingLevel: 3
---

查询单个网格订单的完整详情，包括网格规则、分页的成交子订单（`grid_sub_orders`）以及分页的生命周期历史（`grid_order_history`）。

<CliCommand>
# 查看网格订单的规则、子订单与历史
longbridge grid detail 764609681686573056
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="detail" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/detail</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name       | Type   | Required | Description                                                         |
| ---------- | ------ | -------- | ------------------------------------------------------------------- |
| order_id   | string | YES      | 网格订单 ID，例如：`764609681686573056`                             |
| history_id | string | NO       | 生命周期历史的分页游标，传入某页最后一条的 `history_id` 以获取更早的记录 |
| limit      | int32  | NO       | `grid_sub_orders` 与 `grid_order_history` 的分页大小                |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 网格 REST 调用通过独立的 GridContext
ctx = GridContext(config)

resp = ctx.detail("764609681686573056")
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
  const resp = await ctx.detail({ orderId: '764609681686573056' })
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
            GridOrderDetail resp = ctx.detail(new GetGridOrderDetailOptions("764609681686573056")).get();
            System.out.println(resp);
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
    grid::{GridContext, GetGridOrderDetailOptions},
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let resp = ctx.detail(GetGridOrderDetailOptions::new("764609681686573056")).await?;
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

    GetGridOrderDetailOptions opts{ "764609681686573056" };
    ctx.detail(opts, [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "order_id: " << res->order_id << std::endl;
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
    "order_id": "764609681686573056",
    "symbol": "700.HK",
    "stock_name": "TENCENT",
    "status": "Performing",
    "grid_status": "Performing",
    "suspend_reason": "",
    "sleeping_reason": "",
    "submitted_base_price": "300",
    "current_base_price": "300",
    "upper_limit_price": "360",
    "lower_limit_price": "240",
    "trigger_price_type": 2,
    "trigger_spread_up": "",
    "trigger_spread_down": "",
    "trigger_percent_up": "2",
    "trigger_percent_down": "2",
    "pullback_percent": "",
    "pullback_spread": "",
    "rebound_percent": "",
    "rebound_spread": "",
    "multiple_trigger": false,
    "time_in_force": 1,
    "trigger_quantity": "100",
    "trigger_sell_quantity": "0",
    "trigger_buy_quantity": "0",
    "upper_limit_quantity": "200",
    "lower_limit_quantity": "100",
    "upper_limit_event": 1,
    "lower_limit_event": 1,
    "trigger_sell_depth": 0,
    "trigger_buy_depth": 0,
    "created_at": "2024-08-12T10:30:00+08:00",
    "updated_at": "2024-08-12T10:30:00+08:00",
    "settlement_currency": "HKD",
    "expire_time": "",
    "gtd": "",
    "grid_sub_orders": [],
    "sub_has_more": false,
    "grid_order_history": [
      {
        "history_id": "764609681686573100",
        "created_at": "2024-08-12T10:30:00+08:00",
        "status": "Performing",
        "suspend_reason": "",
        "reason": "Grid order started"
      }
    ],
    "history_has_more": false,
    "support_shortsell": false,
    "rth": 0,
    "grid_order_type_up": "GMO",
    "grid_order_type_down": "GMO"
  }
}
```

### Response Status

| Status | Description                    | Schema |
| ------ | ------------------------------ | ------ |
| 200    | 网格订单详情返回成功。         | [grid_order_detail_rsp](#schemagrid_order_detail_rsp) |
| 400    | 请求被拒绝，请求参数错误。     | None   |

<aside className="success">
</aside>

## Schemas

### grid_order_detail_rsp

<a id="schemagrid_order_detail_rsp"></a>

| Name                  | Type     | Required | Description                                                                                 |
| --------------------- | -------- | -------- | ------------------------------------------------------------------------------------------- |
| order_id              | string   | true     | 网格订单 ID                                                                                 |
| symbol                | string   | true     | 标的代码，`ticker.region` 格式                                                              |
| stock_name            | string   | true     | 标的名称                                                                                    |
| status                | string   | true     | 网格订单状态，例如：`Performing` / `Suspended`                                              |
| grid_status           | string   | true     | 网格详细运行状态                                                                            |
| suspend_reason        | string   | true     | 网格被暂停的原因，运行中时为空                                                              |
| sleeping_reason       | string   | true     | 网格休眠的原因，活跃时为空                                                                  |
| submitted_base_price  | string   | true     | 提交时网格锚定的基准价                                                                      |
| current_base_price    | string   | true     | 触发后的当前基准价                                                                          |
| upper_limit_price     | string   | true     | 价格上界                                                                                    |
| lower_limit_price     | string   | true     | 价格下界                                                                                    |
| trigger_price_type    | int32    | true     | 触发阈值的计价方式<br/><br/>**枚举值：**<br/>`1` - 价差（绝对值）<br/>`2` - 百分比           |
| trigger_spread_up     | string   | true     | 向上触发价差（当 `trigger_price_type` 为 `1` 时）                                           |
| trigger_spread_down   | string   | true     | 向下触发价差（当 `trigger_price_type` 为 `1` 时）                                           |
| trigger_percent_up    | string   | true     | 向上触发百分比（当 `trigger_price_type` 为 `2` 时）                                         |
| trigger_percent_down  | string   | true     | 向下触发百分比（当 `trigger_price_type` 为 `2` 时）                                         |
| pullback_percent      | string   | true     | 回落百分比                                                                                  |
| pullback_spread       | string   | true     | 回落价差                                                                                    |
| rebound_percent       | string   | true     | 反弹百分比                                                                                  |
| rebound_spread        | string   | true     | 反弹价差                                                                                    |
| multiple_trigger      | boolean  | true     | 单个网格档位是否可多次触发                                                                  |
| time_in_force         | int32    | true     | 订单有效期<br/><br/>**枚举值：**<br/>`0` - 当日有效<br/>`1` - GTC<br/>`6` - GTD             |
| trigger_quantity      | string   | true     | 每次触发的数量                                                                              |
| trigger_sell_quantity | string   | true     | 卖出方向累计触发数量                                                                        |
| trigger_buy_quantity  | string   | true     | 买入方向累计触发数量                                                                        |
| upper_limit_quantity  | string   | true     | 触及上界时处理的数量                                                                        |
| lower_limit_quantity  | string   | true     | 触及下界时处理的数量                                                                        |
| upper_limit_event     | int32    | true     | 触及上界时的动作<br/><br/>**枚举值：**<br/>`1` - 忽略<br/>`2` - 按最新价平仓                 |
| lower_limit_event     | int32    | true     | 触及下界时的动作<br/><br/>**枚举值：**<br/>`1` - 忽略<br/>`2` - 按最新价平仓                 |
| trigger_sell_depth    | int32    | true     | 卖出方向盘口深度（-5 ~ 5）。`0` = 使用 `grid_order_type_up`                                 |
| trigger_buy_depth     | int32    | true     | 买入方向盘口深度（-5 ~ 5）。`0` = 使用 `grid_order_type_down`                               |
| created_at            | string   | true     | 创建时间，RFC3339 格式                                                                      |
| updated_at            | string   | true     | 最后更新时间，RFC3339 格式                                                                  |
| settlement_currency   | string   | true     | 结算货币，例如：`HKD`                                                                       |
| expire_time           | string   | true     | 过期时间，RFC3339 格式（当 `time_in_force` 为 GTD 时）                                      |
| gtd                   | string   | true     | Good-Til-Date，`YYYY-MM-DD` 格式                                                            |
| grid_sub_orders       | object[] | false    | 该网格已成交的子订单                                                                        |
| ∟ id                  | string   | true     | 子订单 ID                                                                                   |
| ∟ price               | string   | true     | 订单价格                                                                                    |
| ∟ order_type          | string   | true     | 订单类型                                                                                    |
| ∟ quantity            | string   | true     | 订单数量                                                                                    |
| ∟ executed_qty        | string   | true     | 已成交数量                                                                                  |
| ∟ action              | int32    | true     | 买卖方向                                                                                    |
| ∟ status              | string   | true     | 子订单状态                                                                                  |
| ∟ submitted_at        | string   | true     | 提交时间，RFC3339 格式                                                                      |
| ∟ rth                 | int32    | true     | 盘中交易时段标识（`0` / `1` / `2`）                                                         |
| sub_has_more          | boolean  | true     | 是否还有更多子订单可分页                                                                    |
| grid_order_history    | object[] | false    | 生命周期历史记录                                                                            |
| ∟ history_id          | string   | true     | 历史记录 ID，同时用作分页游标                                                               |
| ∟ created_at          | string   | true     | 事件时间，RFC3339 格式                                                                      |
| ∟ status              | string   | true     | 事件后的网格状态                                                                            |
| ∟ suspend_reason      | string   | true     | 暂停原因（如适用）                                                                          |
| ∟ reason              | string   | true     | 事件的可读描述                                                                              |
| history_has_more      | boolean  | true     | 是否可通过 `history_id` 分页获取更多历史记录                                                |
| support_shortsell     | boolean  | true     | 是否允许卖空                                                                                |
| rth                   | int32    | true     | 盘中交易时段标识（`0` / `1` / `2`）                                                         |
| grid_order_type_up    | string   | true     | `trigger_sell_depth` 为 `0` 时的卖出方向订单类型<br/><br/>**枚举值：**<br/>`GMO` / `GLO` / `GTG` |
| grid_order_type_down  | string   | true     | `trigger_buy_depth` 为 `0` 时的买入方向订单类型<br/><br/>**枚举值：**<br/>`GMO` / `GLO` / `GTG`  |
