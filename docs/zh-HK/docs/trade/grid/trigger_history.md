---
slug: trigger_history
sidebar_position: 6
title: 網格觸發歷史
sidebar_label: '觸發歷史'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

查詢單個網格訂單的分頁觸發歷史 —— 網格每次觸發時所發出的具體訂單。

<CliCommand>
# 查看網格訂單的觸發歷史
longbridge grid triggers 764609681686573056
</CliCommand>

<SDKLinks module="grid" klass="GridContext" method="trigger_history" hideGo />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/gridtrading/trigger_history_list</td></tr>
</tbody>
</table>

### Parameters

| Name          | Type   | Required | Description                                  |
| ------------- | ------ | -------- | -------------------------------------------- |
| grid_order_id | string | YES      | 網格訂單 ID，例如：`764609681686573056`      |
| page          | int32  | NO       | 頁碼，從 `1` 開始                            |
| limit         | int32  | NO       | 分頁大小                                     |

:::warning
該接口使用 `grid_order_id`，而**不是**其他網格接口所用的 `order_id`。此處傳入 `order_id` 將無法定位到網格訂單。
:::

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import GridContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)

# 網格 REST 調用通過獨立的 GridContext
ctx = GridContext(config)

resp = ctx.trigger_history("764609681686573056")
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
  const resp = await ctx.triggerHistory({ gridOrderId: '764609681686573056' })
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
            GridTriggerHistory resp = ctx.triggerHistory(new GetGridTriggerHistoryOptions("764609681686573056")).get();
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
    grid::{GridContext, GetGridTriggerHistoryOptions},
    oauth::OAuthBuilder,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = GridContext::new(config);

    let resp = ctx.trigger_history(GetGridTriggerHistoryOptions::new("764609681686573056")).await?;
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

    GetGridTriggerHistoryOptions opts{ "764609681686573056" };
    ctx.trigger_history(opts, [](auto res) {
        if (!res) {
            std::cout << "failed" << std::endl;
            return;
        }
        std::cout << "trigger orders: " << res->trigger_orders.size() << std::endl;
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

`data` 物件包含：

| Name           | Type    | Description                                     |
| -------------- | ------- | ----------------------------------------------- |
| trigger_orders | object[]| 觸發訂單，見 [TriggerOrder](#triggerorder)      |
| has_more       | boolean | 是否還有更多分頁                                |

#### TriggerOrder

網格觸發時發出的一筆訂單。

| Name           | Type   | Description                                                          |
| -------------- | ------ | -------------------------------------------------------------------- |
| id             | string | 觸發訂單 ID                                                          |
| status         | string | 訂單狀態                                                             |
| name           | string | 股票名稱                                                             |
| symbol         | string | 股票代碼，`ticker.region` 格式                                       |
| price          | string | 訂單價格                                                             |
| quantity       | string | 訂單數量                                                             |
| executed_price | string | 成交價格                                                             |
| executed_qty   | string | 已成交數量                                                           |
| submitted_at   | string | 提交時間，RFC3339 格式                                               |
| action         | int32  | 買賣方向                                                             |
| order_type     | string | 訂單類型                                                             |
| trigger_price  | string | 觸發該訂單的價格                                                     |
| msg            | string | 附加消息                                                             |
| currency       | string | 訂單貨幣                                                             |
| last_done      | string | 觸發時的最新成交價                                                   |
| updated_at     | string | 最後更新時間，RFC3339 格式                                           |
| time_in_force  | int32  | 訂單有效期<br/><br/>**可選值：**<br/>`0` - 當日有效<br/>`1` - GTC<br/>`6` - GTD |
| gtd            | string | 到期日，`YYYY-MM-DD` 格式                                            |
| trigger_at     | string | 觸發時間，RFC3339 格式                                               |
| trigger_status | int32  | 觸發狀態                                                             |

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "trigger_orders": [
      {
        "id": "764610000000000001",
        "status": "Filled",
        "name": "TENCENT",
        "symbol": "700.HK",
        "price": "294",
        "quantity": "100",
        "executed_price": "294",
        "executed_qty": "100",
        "submitted_at": "2024-08-12T10:35:00+08:00",
        "action": 1,
        "order_type": "GMO",
        "trigger_price": "294",
        "msg": "",
        "currency": "HKD",
        "last_done": "294",
        "updated_at": "2024-08-12T10:35:05+08:00",
        "time_in_force": 1,
        "gtd": "",
        "trigger_at": "2024-08-12T10:35:00+08:00",
        "trigger_status": 1
      }
    ],
    "has_more": false
  }
}
```

### Response Status

| Status | Description                    | Schema |
| ------ | ------------------------------ | ------ |
| 200    | 觸發歷史返回成功。             | None   |
| 400    | 請求被拒絕，請求參數錯誤。     | None   |

<aside className="success">
</aside>
