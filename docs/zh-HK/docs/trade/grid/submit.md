---
slug: submit
sidebar_position: 1
title: 提交網格訂單
sidebar_label: '提交訂單'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

提交網格策略訂單。網格以 `submitted_base_price` 為基準價，在 `[lower_limit_price, upper_limit_price]` 區間內，價格下跌時掛買單、價格上漲時掛賣單。

使用網格交易前，你需要先記錄一次策略風險揭示的同意確認，詳見[提交策略問卷](./questionnaire)。

<CliCommand>
# 在 700.HK 上提交按百分比觸發的網格
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 --trigger-type percent --trigger-up 2 --trigger-down 2 --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# 僅校驗規則，不實際提交
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 --trigger-type percent --trigger-up 2 --trigger-down 2 --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc --dry-run
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="submit" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/submit</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name                | Type   | Required | Description                                             |
| ------------------- | ------ | -------- | ------------------------------------------------------- |
| symbol              | string | YES      | 標的代碼，`ticker.region` 格式，例如：`700.HK`          |
| settlement_currency | string | YES      | 結算貨幣，例如：`HKD`                                    |
| grid_trading_rule   | object | YES      | 網格規則，欄位見下方。                                  |

#### grid_trading_rule

| Name                  | Type    | Required | Description                                                                                                           |
| --------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| submitted_base_price  | string  | YES      | 網格錨定的基準價                                                                                                    |
| upper_limit_price     | string  | YES      | 價格上邊界                                                                                                          |
| lower_limit_price     | string  | YES      | 價格下邊界                                                                                                          |
| trigger_price_type    | int32   | YES      | 觸發閾值的解釋方式<br/><br/>**可選值：**<br/>`1` - spread（絕對價差）<br/>`2` - percent（百分比）                    |
| trigger_spread_up     | string  | NO       | 上漲觸發價差，`trigger_price_type` 為 `1` 時必填                                                                     |
| trigger_spread_down   | string  | NO       | 下跌觸發價差，`trigger_price_type` 為 `1` 時必填                                                                     |
| trigger_percent_up    | string  | NO       | 上漲觸發百分比，`trigger_price_type` 為 `2` 時必填                                                                   |
| trigger_percent_down  | string  | NO       | 下跌觸發百分比，`trigger_price_type` 為 `2` 時必填                                                                   |
| trigger_quantity      | string  | YES      | 每次觸發的數量                                                                                                      |
| upper_limit_quantity  | string  | YES      | 達到上邊界時處理的數量                                                                                              |
| lower_limit_quantity  | string  | YES      | 達到下邊界時處理的數量                                                                                              |
| time_in_force         | int32   | YES      | 訂單有效期<br/><br/>**可選值：**<br/>`0` - Day（當日有效）<br/>`1` - GTC（撤單前有效）<br/>`6` - GTD（到期前有效）    |
| expire_time           | int64   | NO       | 到期時間（Unix 時間戳，單位秒），`time_in_force` 為 `6`（GTD）時必填                                                 |
| upper_limit_event     | int32   | NO       | 達到上邊界時的動作<br/><br/>**可選值：**<br/>`1` - ignore（繼續運行）<br/>`2` - 按最新價平倉                         |
| lower_limit_event     | int32   | NO       | 達到下邊界時的動作<br/><br/>**可選值：**<br/>`1` - ignore（繼續運行）<br/>`2` - 按最新價平倉                         |
| trigger_sell_depth    | int32   | NO       | 賣盤盤口檔位（-5 ~ 5）。`0` 表示改用 `grid_order_type_up` 而非檔位                                                   |
| trigger_buy_depth     | int32   | NO       | 買盤盤口檔位（-5 ~ 5）。`0` 表示改用 `grid_order_type_down` 而非檔位                                                 |
| grid_order_type_up    | string  | NO       | `trigger_sell_depth` 為 `0` 時的賣盤訂單類型<br/><br/>**可選值：**<br/>`GMO` / `GLO` / `GTG`                         |
| grid_order_type_down  | string  | NO       | `trigger_buy_depth` 為 `0` 時的買盤訂單類型<br/><br/>**可選值：**<br/>`GMO` / `GLO` / `GTG`                          |
| multiple_trigger      | boolean | NO       | 單個網格檔位是否允許多次觸發                                                                                        |
| support_shortsell     | boolean | NO       | 是否允許賣空                                                                                                        |
| rth                   | int32   | NO       | 常規交易時段標誌（`0` / `1` / `2`）                                                                                 |

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
    Decimal(300), Decimal(360), Decimal(240),          # base, upper, lower price
    TriggerPriceType.Percent, Decimal(2), Decimal(2),  # trigger type, up, down
    Decimal(100), Decimal(200), Decimal(100),          # quantity, upper qty, lower qty
    GridTimeInForce.GoodTilCanceled,
    upper_limit_event=GridLimitEvent.Ignore,
    lower_limit_event=GridLimitEvent.Ignore,
    grid_order_type_up="GMO",
    grid_order_type_down="GMO",
)
resp = ctx.submit("700.HK", "HKD", rule)
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
  const resp = await ctx.submit({
    symbol: '700.HK',
    settlementCurrency: 'HKD',
    gridTradingRule: {
      submittedBasePrice: new Decimal(300),
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
                    new BigDecimal("300"), new BigDecimal("360"), new BigDecimal("240"),
                    GridTrigger.percent(new BigDecimal("2"), new BigDecimal("2")),
                    new BigDecimal("100"), new BigDecimal("200"), new BigDecimal("100"),
                    GridTimeInForce.GoodTilCanceled)
                    .orderTypes("GMO", "GMO")
                    .limitEvents(GridLimitEvent.Ignore, GridLimitEvent.Ignore);
            SubmitGridOrderResponse resp = ctx.submit(new SubmitGridOrderOptions("700.HK", "HKD", rule)).get();
            System.out.println(resp.getOrderId());
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
    grid::{GridContext, GridTradeRule, SubmitGridOrderOptions},
    oauth::OAuthBuilder,
};
use rust_decimal::Decimal;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let rule = GridTradeRule {
        submitted_base_price: Some(Decimal::new(300, 0)),
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
    let resp = ctx.submit(SubmitGridOrderOptions::new("700.HK", "HKD", rule)).await?;
    println!("submitted grid order: {}", resp.order_id);
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
    rule.submitted_base_price = Decimal("300");
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

    SubmitGridOrderOptions opts{ "700.HK", "HKD", rule };
    ctx.submit(opts, [](auto res) {
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
    "order_id": "764609681686573056"
  }
}
```

### Response Status

| Status | Description                    | Schema |
| ------ | ------------------------------ | ------ |
| 200    | 網格訂單提交成功。             | None   |
| 400    | 下單被拒絕，請求參數錯誤。     | None   |

<aside className="success">
</aside>
