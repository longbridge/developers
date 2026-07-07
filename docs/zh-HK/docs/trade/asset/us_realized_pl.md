---
slug: us_realized_pl
title: 美股已實現盈虧
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

獲取美股賬戶已實現盈虧，按資產類別（股票/期權/加密貨幣）分組。

<CliCommand>
# 美股已實現盈虧
longbridge profit-analysis realized
# 按股票類別篩選
longbridge profit-analysis realized --category stock
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_realized_pl" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| currency | string | 是 | 結算貨幣，例如 `USD` |
| category | string | 否 | 資產類別：`ALL` \| `STOCK` \| `OPTION` \| `CRYPTO`（默認：`ALL`） |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_realized_pl("USD", category="STOCK")
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
    resp = await ctx.us_realized_pl("USD", category="STOCK")
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
  const resp = await ctx.usRealizedPl("USD", "STOCK")
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
            var resp = ctx.getUsRealizedPl("USD", "STOCK").get();
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
    let resp = ctx.us_realized_pl("USD", category="STOCK").await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
cat := "STOCK"
resp, err := c.USRealizedPL(ctx, &trade.GetUSRealizedPL{Currency: "USD", Category: &cat})
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>

## 響應

返回 `USRealizedPL` ，包含以下字段：

| 字段 | 類型 | 描述 |
| ---- | ---- | ---- |
| realized_pl_list | USRealizedPLEntry[] | 按資產類別分列的盈虧明細 |

Each `USRealizedPLEntry` contains:

| 字段 | 類型 | 描述 |
| ---- | ---- | ---- |
| category | int | 資產類別（1=股票，2=期權，3=加密貨幣） |
| currency | string | 貨幣代碼，如 `USD` |
| metrics | object[] | 不同時期的盈虧指標 |
