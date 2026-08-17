---
slug: us_order_detail
title: 美股委託詳情
sidebar_position: 11
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US 賬戶
此方法僅適用於美國數據中心賬戶。
:::

獲取美股指定委託的詳情，包括成交歷史，可選獲取關聯子委託。


<CliCommand>
# 查看美股委託詳情
longbridge order detail 701276261045858304
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_order_detail" />

## Parameters

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| order_id | string | 是 | 委託 ID |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_order_detail("701276261045858304")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("請訪問：", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.us_order_detail("701276261045858304")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, TradeContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請訪問此 URL 授權：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.usOrderDetail("701276261045858304")
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
            var resp = ctx.getUsOrderDetail("701276261045858304").get();
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("請訪問：{url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = TradeContext::new(config);
    let resp = ctx.us_order_detail("701276261045858304").await?;
    println!("{:?}", resp);
    Ok(())
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
	c, err := trade.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.USOrderDetail(context.Background(), "701276261045858304")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>



## Response

### Response Example

```json
{
  "order": {
    "id": "701276261045858304",
    "symbol": "AAPL.US",
    "action": "Buy",
    "order_type": "LO",
    "status": "Filled",
    "price": "185.00",
    "quantity": "10",
    "executed_qty": "10",
    "executed_price": "184.95",
    "executed_amount": "1849.50",
    "currency": "USD",
    "submitted_at": "1751866334",
    "done_at": "1751866400",
    "time_in_force": 0,
    "msg": ""
  },
  "current_attached_order": null,
  "current_millisecond": "1751866400000"
}
```

### Response Status

| 狀態碼 | 描述 | 結構 |
| ------ | ---- | ---- |
| 200    | 成功 | [USOrderDetailResponse](#USOrderDetailResponse) |
| 400    | 請求錯誤 | None   |



### USOrderDetailResponse

<a id="USOrderDetailResponse"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| order | USOrderDetail \| null | 是 | 完整委託詳情，未找到時為 null |
| current_attached_order | USOrderDetail \| null | 否 | 關聯子委託（括號單/OCO） |
| current_millisecond | string | 否 | 服務器時間戳（毫秒） |

### USOrderDetail

<a id="USOrderDetail"></a>

核心字段（完整響應包含 50+ 个字段，涵蓋費用、觸發條件和結算詳情）：

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| id | string | 委託 ID |
| symbol | string | 交易標的，如 `AAPL.US` |
| action | int | 方向：1=買入，2=賣出 |
| order_type | string | 委託類型 |
| status | string | 委託狀態 |
| price | string | 委託價格 |
| quantity | string | 委託數量 |
| executed_qty | string | 已成交數量 |
| executed_price | string | 平均成交價格 |
| executed_amount | string | 成交總金額 |
| currency | string | 貨幣代碼 |
| submitted_at | string | 提交時間 |
| done_at | string | 完成時間 |
| time_in_force | int | 有效期類型 |
| trigger_price | string | 觸發價格（止損/止盈單） |
| msg | string | 狀態消息 |
| order_histories | USOrderHistory[] | 委託狀態变更历史 |
| attached_orders | USAttachedOrder[] | 關聯子委託列表 |
| button_control | USButtonControl | 可用操作按鈕狀態 |
| charge_detail | USChargeDetail \| null | 費用明細 |

### USOrderHistory

<a id="USOrderHistory"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| exec_type | int | 執行類型 |
| status | string | 当前节点委託狀態 |
| price | string | 价格 |
| qty | string | 数量 |
| time | string | 時間戳 |
| msg | string | 消息 |
