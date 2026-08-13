---
slug: list
sidebar_position: 3
title: 網格訂單列表
sidebar_label: '訂單列表'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

分頁獲取網格訂單列表，可按市場、標的或狀態篩選。

<CliCommand>
# 列出全部網格訂單（默認）
longbridge grid
# 按標的和狀態篩選
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
| page       | int32  | NO       | 頁碼，從 `1` 開始                                                         |
| limit      | int32  | NO       | 每頁數量                                                                 |
| market     | string | NO       | 市場篩選<br/><br/>**可選值：**<br/>`US` / `HK` / `CN` / `SG`             |
| symbol     | string | NO       | 標的代碼，使用 `ticker.region` 格式，例如：`700.HK`                      |
| status     | string | NO       | 網格訂單狀態篩選，多個狀態用逗號連接，例如：`Performing,Suspended`        |
| sort_by    | string | NO       | 排序字段                                                                 |
| sort_order | string | NO       | 排序方向                                                                 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 網格 REST 接口通過獨立的 GridContext 調用
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
| 200    | 網格訂單列表返回成功。     | [list_grid_orders_rsp](#schemalist_grid_orders_rsp)   |
| 400    | 請求被拒絕，請求參數錯誤。 | None   |

<aside className="success">
</aside>

## Schemas

### list_grid_orders_rsp

<a id="schemalist_grid_orders_rsp"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| grid_order | object[] | false | 網格訂單 |
| ∟ order_id | string | true | 網格訂單 ID |
| ∟ symbol | string | true | 標的代碼，使用 `ticker.region` 格式，例如：`AAPL.US` |
| ∟ stock_name | string | true | 標的名稱 |
| ∟ market | string | true | 市場 |
| ∟ status | string | true | 網格訂單狀態 |
| ∟ grid_status | string | true | 網格運行狀態 |
| ∟ submitted_base_price | string | true | 創建網格時提交的基準價 |
| ∟ current_base_price | string | true | 當前基準價 |
| ∟ pre_trigger_base_price | string | true | 上次觸發前的基準價 |
| ∟ post_trigger_base_price | string | true | 上次觸發後的基準價 |
| ∟ upper_limit_price | string | true | 價格上限 |
| ∟ lower_limit_price | string | true | 價格下限 |
| ∟ trigger_price_type | int32 | true | 觸發價類型<br/><br/>**可選值：**<br/>`1` - 價差<br/>`2` - 百分比 |
| ∟ trigger_spread_up | string | true | 向上觸發價差 |
| ∟ trigger_spread_down | string | true | 向下觸發價差 |
| ∟ trigger_percent_up | string | true | 向上觸發百分比 |
| ∟ trigger_percent_down | string | true | 向下觸發百分比 |
| ∟ pullback_percent | string | true | 回撤百分比 |
| ∟ pullback_spread | string | true | 回撤價差 |
| ∟ rebound_percent | string | true | 反彈百分比 |
| ∟ rebound_spread | string | true | 反彈價差 |
| ∟ trigger_sell_order_type | string | true | 賣出方向訂單類型 |
| ∟ trigger_buy_order_type | string | true | 買入方向訂單類型 |
| ∟ trigger_sell_depth | int32 | true | 賣出方向盤口深度 |
| ∟ trigger_buy_depth | int32 | true | 買入方向盤口深度 |
| ∟ trigger_quantity | string | true | 每次觸發數量 |
| ∟ trigger_sell_quantity | string | true | 賣出方向觸發數量 |
| ∟ trigger_buy_quantity | string | true | 買入方向觸發數量 |
| ∟ upper_limit_quantity | string | true | 觸及上限時處理的數量 |
| ∟ lower_limit_quantity | string | true | 觸及下限時處理的數量 |
| ∟ upper_limit_event | int32 | true | 觸及上限時的處理動作<br/><br/>**可選值：**<br/>`1` - 忽略<br/>`2` - 以最新價平倉 |
| ∟ lower_limit_event | int32 | true | 觸及下限時的處理動作<br/><br/>**可選值：**<br/>`1` - 忽略<br/>`2` - 以最新價平倉 |
| ∟ multiple_trigger | boolean | true | 單個網格檔位是否可多次觸發 |
| ∟ trigger_times | int32 | true | 觸發次數 |
| ∟ total_buy_quantity | string | true | 累計買入數量 |
| ∟ total_sell_quantity | string | true | 累計賣出數量 |
| ∟ total_profit_balance | string | true | 累計已實現收益 |
| ∟ settlement_currency | string | true | 結算幣種 |
| ∟ time_in_force | int32 | true | 訂單有效期<br/><br/>**可選值：**<br/>`0` - 當日有效<br/>`1` - GTC（撤單前有效）<br/>`6` - GTD（指定日期前有效） |
| ∟ gtd | string | true | GTD 到期日，格式：`YYYY-MM-DD` |
| ∟ created_at | string | true | 創建時間，RFC3339 格式 |
| ∟ rth | int32 | true | 盤中交易時段標誌 |
| ∟ support_shortsell | boolean | true | 是否允許賣空 |
| ∟ grid_order_type_up | string | true | 深度為 `0` 時使用的賣出方向訂單類型 |
| ∟ grid_order_type_down | string | true | 深度為 `0` 時使用的買入方向訂單類型 |
| has_more | boolean | true | 是否還有更多頁 |
