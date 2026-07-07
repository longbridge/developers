---
slug: us_query_orders
title: 美股歷史委託
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning 僅限美股賬戶
此方法僅適用於美國數據中心賬戶。
:::

查詢美股賬戶的歷史委託和待成交委託，支持分頁和篩選。

<CliCommand>
# 查詢美股委託
longbridge order
# 篩選待成交委託
longbridge order --status pending
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_query_orders" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 否 | 按標的篩選，例如 `AAPL.US` |
| action | int | 否 | 方向篩選：`0`=全部，`1`=買入，`2`=賣出（默認：`0`） |
| start_at | int64 | 否 | 開始時間（Unix 秒）；`0` = 最近 90 天 |
| end_at | int64 | 否 | 結束時間（Unix 秒）；`0` = 當前時間 |
| query_type | int32 | 否 | 0=全部，1=待成交，2=已成交（默認：0） |
| page | int32 | 否 | 頁碼，從 1 開始（默認：1） |
| limit | int32 | 否 | 每頁數量（默認：20） |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_query_orders()
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
    resp = await ctx.us_query_orders()
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
  const resp = await ctx.usQueryOrders()
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
            var resp = ctx.getUsQueryOrders().get();
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
    let resp = ctx.us_query_orders().await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.QueryUSOrders(ctx, &trade.GetUSHistoryOrders{Page: 1, Limit: 20})
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>


## 響應

返回 `QueryUSOrdersResponse` ，包含以下字段：

| 字段 | 類型 | 描述 |
| ---- | ---- | ---- |
| orders | USOrder[] | 符合篩選條件的委託列表 |
| total_count | int | 滿足條件的委託總數 |

每條 `USOrder` 包含：

| 字段 | 類型 | 描述 |
| ---- | ---- | ---- |
| order_id | string | 委託唯一 ID |
| symbol | string | 交易標的，如 `AAPL.US` |
| side | string | `Buy`（買入）或 `Sell`（賣出） |
| status | string | 委託狀態 |
| qty | string | 委託數量 |
| price | string | 委託價格 |
| executed_qty | string | 已成交數量 |
| executed_price | string | 成交價格 |
| created_at | int64 | 創建時間（Unix 秒） |
