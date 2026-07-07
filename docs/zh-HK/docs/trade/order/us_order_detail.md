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

:::warning 僅限美股賬戶
此方法僅適用於美國數據中心賬戶。
:::

獲取美股指定委託的詳情，包括成交歷史，可選獲取關聯子委託。


<CliCommand>
# 查看美股委託詳情
longbridge order detail 701276261045858304
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_order_detail" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| order_id | string | 是 | 委託 ID |

## 請求示例

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
resp, err := c.USOrderDetail(ctx, "701276261045858304")
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>

## 響應

返回 `USOrderDetailResponse` ，包含以下字段：

| 字段 | 類型 | 描述 |
| ---- | ---- | ---- |
| order | object | 含狀態及成交詳情的完整委託對象 |
| order_histories | object[] | 該委託的歷史狀態變更記錄 |
| current_attached_order | object | 關聯子委託（如括號單/OCO），如有 |
