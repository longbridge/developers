---
slug: replace
sidebar_position: 2
title: 修改网格订单
sidebar_label: '修改订单'
search: true
headingLevel: 3
---

修改已存在的网格订单规则。提交的 `grid_trading_rule` 会整体替换原有规则，因此需要传入完整的规则，而不是仅传改动的字段。

<CliCommand>
# 修改网格订单的基准价、上下边界价格和数量
longbridge grid replace 764609681686573056 --base-price 305 --upper-price 360 --lower-price 240 --trigger-type percent --trigger-up 2 --trigger-down 2 --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# 仅校验新规则而不实际应用
longbridge grid replace 764609681686573056 --base-price 305 --upper-price 360 --lower-price 240 --trigger-type percent --trigger-up 2 --trigger-down 2 --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc --dry-run
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="replace" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/replace</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name              | Type   | Required | Description                                    |
| ----------------- | ------ | -------- | ---------------------------------------------- |
| order_id          | string | YES      | 网格订单 ID，例如：`764609681686573056`         |
| grid_trading_rule | object | YES      | 要应用的完整网格规则，字段见下。                 |

#### grid_trading_rule

| Name                  | Type    | Required | Description                                                                                                     |
| --------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| submitted_base_price  | string  | YES      | 网格锚定的基准价                                                                                               |
| upper_limit_price     | string  | YES      | 价格上边界                                                                                                     |
| lower_limit_price     | string  | YES      | 价格下边界                                                                                                     |
| trigger_price_type    | int32   | YES      | 触发阈值的计算方式<br/><br/>**可选值：**<br/>`1` - 价差（绝对值）<br/>`2` - 百分比                             |
| trigger_spread_up     | string  | NO       | 向上触发价差，`trigger_price_type` 为 `1` 时必填                                                               |
| trigger_spread_down   | string  | NO       | 向下触发价差，`trigger_price_type` 为 `1` 时必填                                                               |
| trigger_percent_up    | string  | NO       | 向上触发百分比，`trigger_price_type` 为 `2` 时必填                                                             |
| trigger_percent_down  | string  | NO       | 向下触发百分比，`trigger_price_type` 为 `2` 时必填                                                             |
| trigger_quantity      | string  | YES      | 每次触发的数量                                                                                                 |
| upper_limit_quantity  | string  | YES      | 到达上边界时处理的数量                                                                                         |
| lower_limit_quantity  | string  | YES      | 到达下边界时处理的数量                                                                                         |
| time_in_force         | int32   | YES      | 订单有效期类型<br/><br/>**可选值：**<br/>`0` - 当日有效<br/>`1` - GTC（撤单前有效）<br/>`6` - GTD（到期前有效） |
| expire_time           | int64   | NO       | 到期时间（Unix 时间戳，单位秒），`time_in_force` 为 `6`（GTD）时必填                                            |
| upper_limit_event     | int32   | NO       | 到达上边界时的动作<br/><br/>**可选值：**<br/>`1` - 忽略（保持运行）<br/>`2` - 以最新价平仓                     |
| lower_limit_event     | int32   | NO       | 到达下边界时的动作<br/><br/>**可选值：**<br/>`1` - 忽略（保持运行）<br/>`2` - 以最新价平仓                     |
| trigger_sell_depth    | int32   | NO       | 卖方向盘口档位（-5 ~ 5）。为 `0` 时使用 `grid_order_type_up` 而非档位                                           |
| trigger_buy_depth     | int32   | NO       | 买方向盘口档位（-5 ~ 5）。为 `0` 时使用 `grid_order_type_down` 而非档位                                         |
| grid_order_type_up    | string  | NO       | `trigger_sell_depth` 为 `0` 时的卖方向订单类型<br/><br/>**可选值：**<br/>`GMO` / `GLO` / `GTG`                 |
| grid_order_type_down  | string  | NO       | `trigger_buy_depth` 为 `0` 时的买方向订单类型<br/><br/>**可选值：**<br/>`GMO` / `GLO` / `GTG`                  |
| multiple_trigger      | boolean | NO       | 单个网格档位是否可多次触发                                                                                     |
| support_shortsell     | boolean | NO       | 是否允许卖空                                                                                                   |
| rth                   | int32   | NO       | 常规交易时段标志（`0` / `1` / `2`）                                                                            |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from decimal import Decimal
from longbridge.openapi import (
    GridContext, Config, OAuthBuilder,
    GridTradeRule, TriggerPriceType, GridTimeInForce, GridLimitEvent,
)

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# Grid REST calls go through the standalone GridContext
ctx = GridContext(config)

rule = GridTradeRule(
    Decimal(305), Decimal(360), Decimal(240),          # base, upper, lower price
    TriggerPriceType.Percent, Decimal(2), Decimal(2),  # trigger type, up, down
    Decimal(100), Decimal(200), Decimal(100),          # quantity, upper qty, lower qty
    GridTimeInForce.GoodTilCanceled,
    upper_limit_event=GridLimitEvent.Ignore,
    lower_limit_event=GridLimitEvent.Ignore,
    grid_order_type_up="GMO",
    grid_order_type_down="GMO",
)
resp = ctx.replace("764609681686573056", rule)
print(resp)
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, GridContext, OAuth, Decimal, TriggerPriceType, GridTimeInForce, GridLimitEvent } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = GridContext.new(config)
  const resp = await ctx.replace({
    orderId: '764609681686573056',
    gridTradingRule: {
      submittedBasePrice: new Decimal(305),
      upperLimitPrice: new Decimal(360),
      lowerLimitPrice: new Decimal(240),
      triggerPriceType: TriggerPriceType.Percent,
      triggerPercentUp: new Decimal(2),
      triggerPercentDown: new Decimal(2),
      triggerQuantity: new Decimal(100),
      upperLimitQuantity: new Decimal(200),
      lowerLimitQuantity: new Decimal(100),
      timeInForce: GridTimeInForce.GoodTilCanceled,
      upperLimitEvent: GridLimitEvent.Ignore,
      lowerLimitEvent: GridLimitEvent.Ignore,
      gridOrderTypeUp: 'GMO',
      gridOrderTypeDown: 'GMO',
    },
  })
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.grid.*;
import java.math.BigDecimal;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             GridContext ctx = GridContext.create(config)) {
            GridTradeRule rule = new GridTradeRule(
                    new BigDecimal("305"), new BigDecimal("360"), new BigDecimal("240"),
                    GridTrigger.percent(new BigDecimal("2"), new BigDecimal("2")),
                    new BigDecimal("100"), new BigDecimal("200"), new BigDecimal("100"),
                    GridTimeInForce.GoodTilCanceled)
                    .orderTypes("GMO", "GMO")
                    .limitEvents(GridLimitEvent.Ignore, GridLimitEvent.Ignore);
            ctx.replace(new ReplaceGridOrderOptions("764609681686573056", rule)).get();
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
    grid::{GridContext, GridTradeRule, ReplaceGridOrderOptions},
    oauth::OAuthBuilder,
};
use rust_decimal::Decimal;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let rule = GridTradeRule {
        submitted_base_price: Some(Decimal::new(305, 0)),
        upper_limit_price: Some(Decimal::new(360, 0)),
        lower_limit_price: Some(Decimal::new(240, 0)),
        trigger_price_type: Some(2.into()), // 1 = spread, 2 = percent
        trigger_percent_up: Some(Decimal::new(2, 0)),
        trigger_percent_down: Some(Decimal::new(2, 0)),
        trigger_quantity: Some(Decimal::new(100, 0)),
        upper_limit_quantity: Some(Decimal::new(200, 0)),
        lower_limit_quantity: Some(Decimal::new(100, 0)),
        time_in_force: Some(1.into()), // GTC
        grid_order_type_up: Some("GMO".to_string()),
        grid_order_type_down: Some("GMO".to_string()),
        upper_limit_event: Some(1.into()),
        lower_limit_event: Some(1.into()),
        ..Default::default()
    };
    ctx.replace(ReplaceGridOrderOptions::new("764609681686573056", rule)).await?;
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

    GridTradeRule rule;
    rule.submitted_base_price = Decimal("305");
    rule.upper_limit_price = Decimal("360");
    rule.lower_limit_price = Decimal("240");
    rule.trigger_price_type = TriggerPriceType::Percent;
    rule.trigger_percent_up = Decimal("2");
    rule.trigger_percent_down = Decimal("2");
    rule.trigger_quantity = Decimal("100");
    rule.upper_limit_quantity = Decimal("200");
    rule.lower_limit_quantity = Decimal("100");
    rule.time_in_force = GridTimeInForce::GoodTilCanceled;
    rule.grid_order_type_up = "GMO";
    rule.grid_order_type_down = "GMO";

    ReplaceGridOrderOptions opts{ "764609681686573056", rule };
    ctx.replace(opts, [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "replaced" << std::endl;
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
  "data": {}
}
```

### Response Status

| Status | Description                | Schema |
| ------ | -------------------------- | ------ |
| 200    | 网格订单修改成功。         | None   |
| 400    | 修改被拒绝，请求参数错误。 | None   |

<aside className="success">
</aside>
