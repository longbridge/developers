---
slug: us_crypto_overview
title: 美股加密貨幣概覽
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

獲取美股加密貨幣交易對的概覽資訊——歷史最高/最低價、資產詳情和貨幣資訊。

<CliCommand>
# 美股加密貨幣概覽
longbridge static DOGEUSD.BKKT
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="us_crypto_overview" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 加密貨幣交易對，例如 `DOGEUSD.BKKT` |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
resp = ctx.us_crypto_overview("DOGEUSD.BKKT")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("請訪問：", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)
    resp = await ctx.us_crypto_overview("DOGEUSD.BKKT")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請訪問此 URL 授權：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.usCryptoOverview("DOGEUSD.BKKT")
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            var resp = ctx.getUsCryptoOverview("DOGEUSD.BKKT").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("請訪問：{url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = QuoteContext::new(config);
    let resp = ctx.us_crypto_overview("DOGEUSD.BKKT").await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
resp, err := c.CryptoOverview(ctx, "DOGEUSD.BKKT")
if err != nil { log.Fatal(err) }
fmt.Printf("%+v\n", resp)
```

  </TabItem>
</Tabs>

## 響應字段

| 字段 | 類型 | 描述 |
| ---- | ---- | ---- |
| symbol | string | 交易對代碼 |
| name | string | 資產名稱 |
| ticker | string | 簡短代碼 |
| base_asset | string | 基礎資產代碼 |
| currency | string | 計價貨幣 |
| all_time_high | string | 歷史最高價 |
| all_time_high_date | string | 歷史最高價日期 |
| all_time_low | string | 歷史最低價 |
| all_time_low_date | string | 歷史最低價日期 |

## 響應

返回 `CryptoOverview` ，包含以下字段：

| 字段 | 類型 | 描述 |
| ---- | ---- | ---- |
| symbol | string | 交易對代碼，如 `DOGEUSD.BKKT` |
| name | string | 資產名稱 |
| ticker | string | 簡短代碼 |
| base_asset | string | 基礎資產代碼，如 `DOGE` |
| currency | string | 計價貨幣，如 `USD` |
| all_time_high | string | 歷史最高價 |
| all_time_high_date | string | 歷史最高價日期 |
| all_time_low | string | 歷史最低價 |
| all_time_low_date | string | 歷史最低價日期 |
