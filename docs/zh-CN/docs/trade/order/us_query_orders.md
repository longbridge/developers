---
slug: us_query_orders
title: 美股历史委托
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US 账户
此方法仅适用于美国数据中心账户。
:::

查询美股账户的历史委托和待成交委托，支持分页和筛选。

<CliCommand>
# 查询美股委托
longbridge order
# 筛选待成交委托
longbridge order --status pending
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_query_orders" />

## 参数

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 否 | 按标的筛选，例如 `AAPL.US` |
| action | int | 否 | 方向筛选：`0`=全部，`1`=买入，`2`=卖出（默认：`0`） |
| start_at | int64 | 否 | 开始时间（Unix 秒）；`0` = 最近 90 天 |
| end_at | int64 | 否 | 结束时间（Unix 秒）；`0` = 当前时间 |
| query_type | int32 | 否 | 0=全部，1=待成交，2=已成交（默认：0） |
| page | int32 | 否 | 页码，从 1 开始（默认：1） |
| limit | int32 | 否 | 每页数量（默认：20） |

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
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
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("请访问：", url))
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
    console.log('请访问此 URL 授权：' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问：{url}")).await?;
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



## 响应

### 响应示例

```json
{
  "orders": [
    {
      "order_id": "701276261045858304",
      "symbol": "AAPL.US",
      "side": "Buy",
      "status": "Filled",
      "qty": "10",
      "price": "185.00",
      "executed_qty": "10",
      "executed_price": "184.95",
      "created_at": 1751866334
    }
  ],
  "total_count": 1
}
```

### 响应状态

| 状态码 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [QueryUSOrdersResponse](#QueryUSOrdersResponse) |
| 400    | 请求错误 | None   |

## 数据结构

### QueryUSOrdersResponse

<a id="QueryUSOrdersResponse"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| orders | USOrder[] | 是 | 符合筛选条件的委托列表 |
| total_count | int | 是 | 满足条件的委托总数 |

### USOrder

<a id="USOrder"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| order_id | string | 是 | 委托唯一 ID |
| symbol | string | 是 | 交易标的，如 `AAPL.US` |
| side | string | 是 | `Buy`（买入）或 `Sell`（卖出） |
| status | string | 是 | 委托状态（如 `Filled`、`New`、`PartialFilled`） |
| qty | string | 是 | 委托数量 |
| price | string | 是 | 委托价格 |
| executed_qty | string | 是 | 已成交数量 |
| executed_price | string | 是 | 平均成交价格 |
| created_at | int64 | 是 | 创建时间（Unix 秒） |
