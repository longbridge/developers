---
slug: detail
sidebar_position: 5
title: 網格訂單詳情
sidebar_label: '訂單詳情'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

查詢單個網格訂單的完整詳情，包括網格規則、分頁的成交子訂單（`grid_sub_orders`）以及分頁的生命週期歷史（`grid_order_history`）。

<CliCommand>
# 查看網格訂單的規則、子訂單與歷史
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

| Name       | Type   | Required | Description                                                         |
| ---------- | ------ | -------- | ------------------------------------------------------------------- |
| order_id   | string | YES      | 網格訂單 ID，例如：`764609681686573056`                             |
| history_id | string | NO       | 生命週期歷史的分頁游標，傳入某頁最後一條的 `history_id` 以獲取更早的記錄 |
| limit      | int32  | NO       | `grid_sub_orders` 與 `grid_order_history` 的分頁大小                |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 網格 REST 調用通過獨立的 GridContext
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

### Response Fields

`data` 為一個 `GridOrderDetail` 物件：

| Name                 | Type    | Description                                                                                    |
| -------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| order_id             | string  | 網格訂單 ID                                                                                    |
| symbol               | string  | 股票代碼，`ticker.region` 格式                                                                 |
| stock_name           | string  | 股票名稱                                                                                       |
| status               | string  | 網格訂單狀態，例如：`Performing` / `Suspended`                                                 |
| grid_status          | string  | 網格詳細運行狀態                                                                               |
| suspend_reason       | string  | 網格暫停原因，運行中時為空                                                                      |
| sleeping_reason      | string  | 網格休眠原因，活躍時為空                                                                        |
| submitted_base_price | string  | 提交時錨定的基準價                                                                              |
| current_base_price   | string  | 觸發後的當前基準價                                                                              |
| upper_limit_price    | string  | 價格上限                                                                                       |
| lower_limit_price    | string  | 價格下限                                                                                       |
| trigger_price_type   | int32   | 觸發閾值的類型<br/><br/>**可選值：**<br/>`1` - 價差（絕對值）<br/>`2` - 百分比                  |
| trigger_spread_up    | string  | 向上觸發價差（`trigger_price_type` 為 `1` 時）                                                 |
| trigger_spread_down  | string  | 向下觸發價差（`trigger_price_type` 為 `1` 時）                                                 |
| trigger_percent_up   | string  | 向上觸發百分比（`trigger_price_type` 為 `2` 時）                                               |
| trigger_percent_down | string  | 向下觸發百分比（`trigger_price_type` 為 `2` 時）                                               |
| pullback_percent     | string  | 回落百分比                                                                                     |
| pullback_spread      | string  | 回落價差                                                                                       |
| rebound_percent      | string  | 反彈百分比                                                                                     |
| rebound_spread       | string  | 反彈價差                                                                                       |
| multiple_trigger     | boolean | 同一網格檔位是否允許多次觸發                                                                    |
| time_in_force        | int32   | 訂單有效期<br/><br/>**可選值：**<br/>`0` - 當日有效<br/>`1` - GTC<br/>`6` - GTD                |
| trigger_quantity     | string  | 每次觸發的數量                                                                                 |
| trigger_sell_quantity| string  | 賣出方向累計已觸發數量                                                                          |
| trigger_buy_quantity | string  | 買入方向累計已觸發數量                                                                          |
| upper_limit_quantity | string  | 到達價格上限時處理的數量                                                                        |
| lower_limit_quantity | string  | 到達價格下限時處理的數量                                                                        |
| upper_limit_event    | int32   | 到達上限時的動作<br/><br/>**可選值：**<br/>`1` - 忽略<br/>`2` - 以最新價平倉                    |
| lower_limit_event    | int32   | 到達下限時的動作<br/><br/>**可選值：**<br/>`1` - 忽略<br/>`2` - 以最新價平倉                    |
| trigger_sell_depth   | int32   | 賣出方向盤口檔位（-5 ~ 5），`0` 表示使用 `grid_order_type_up`                                   |
| trigger_buy_depth    | int32   | 買入方向盤口檔位（-5 ~ 5），`0` 表示使用 `grid_order_type_down`                                 |
| created_at           | string  | 建立時間，RFC3339 格式                                                                          |
| updated_at           | string  | 最後更新時間，RFC3339 格式                                                                      |
| settlement_currency  | string  | 結算貨幣，例如：`HKD`                                                                           |
| expire_time          | string  | 過期時間，RFC3339 格式（`time_in_force` 為 GTD 時）                                             |
| gtd                  | string  | 到期日，`YYYY-MM-DD` 格式                                                                       |
| grid_sub_orders      | object[]| 該網格的成交子訂單，見 [GridOrderSubOrder](#gridordersuborder)                                 |
| sub_has_more         | boolean | 是否還有更多子訂單可分頁                                                                        |
| grid_order_history   | object[]| 生命週期歷史記錄，見 [GridOrderHistory](#gridorderhistory)                                     |
| history_has_more     | boolean | 是否可通過 `history_id` 分頁獲取更多歷史記錄                                                    |
| support_shortsell    | boolean | 是否允許賣空                                                                                    |
| rth                  | int32   | 盤中交易時段標記（`0` / `1` / `2`）                                                             |
| grid_order_type_up   | string  | `trigger_sell_depth` 為 `0` 時的賣出方向訂單類型<br/><br/>**可選值：**<br/>`GMO` / `GLO` / `GTG` |
| grid_order_type_down | string  | `trigger_buy_depth` 為 `0` 時的買入方向訂單類型<br/><br/>**可選值：**<br/>`GMO` / `GLO` / `GTG`  |

#### GridOrderSubOrder

網格發出的一筆成交訂單。

| Name         | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| id           | string | 子訂單 ID                                |
| price        | string | 訂單價格                                 |
| order_type   | string | 訂單類型                                 |
| quantity     | string | 訂單數量                                 |
| executed_qty | string | 已成交數量                               |
| action       | int32  | 買賣方向                                 |
| status       | string | 子訂單狀態                               |
| submitted_at | string | 提交時間，RFC3339 格式                   |
| rth          | int32  | 盤中交易時段標記（`0` / `1` / `2`）      |

#### GridOrderHistory

網格訂單的一條生命週期事件。

| Name           | Type   | Description                          |
| -------------- | ------ | ------------------------------------ |
| history_id     | string | 歷史記錄 ID，同時作為分頁游標        |
| created_at     | string | 事件時間，RFC3339 格式               |
| status         | string | 事件後的網格狀態                     |
| suspend_reason | string | 暫停原因（如適用）                   |
| reason         | string | 事件的可讀描述                       |

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
| 200    | 網格訂單詳情返回成功。         | None   |
| 400    | 請求被拒絕，請求參數錯誤。     | None   |

<aside className="success">
</aside>
