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

:::warning Longbridge US 賬戶
此方法僅適用於美國數據中心賬戶。
:::

獲取美股加密貨幣交易對的概覽資訊——歷史最高/最低價、資產詳情和貨幣資訊。

<CliCommand>
# 美股加密貨幣概覽
longbridge static DOGEUSD.BKKT
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="us_crypto_overview" />

## Parameters

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 加密貨幣交易對，例如 `DOGEUSD.BKKT` |

## Request Example

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
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/longbridge/openapi-go/config"
	"github.com/longbridge/openapi-go/oauth"
	"github.com/longbridge/openapi-go/quote"
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
	c, err := quote.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.CryptoOverview(context.Background(), "DOGEUSD.BKKT")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
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



## Response

### Response Example

```json
{
  "symbol": "DOGEUSD.BKKT",
  "name": "Dogecoin",
  "ticker": "DOGE",
  "base_asset": "DOGE",
  "currency": "USD",
  "all_time_high": "0.7376",
  "all_time_high_date": "2021-05-08",
  "all_time_low": "0.0000869",
  "all_time_low_date": "2015-05-06",
  "ipo_date": "2013-12-06",
  "shares": "147000000000",
  "official_web_address": "https://dogecoin.com"
}
```

### Response Status

| 狀態碼 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [CryptoOverview](#CryptoOverview) |
| 400    | 請求錯誤 | None   |

## Schemas

### CryptoOverview

<a id="CryptoOverview"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 交易對代碼，如 `DOGEUSD.BKKT` |
| name | string | 是 | 資產名稱 |
| ticker | string | 是 | 簡短代碼 |
| base_asset | string | 是 | 基礎資產代碼，如 `DOGE` |
| currency | string | 是 | 計價貨幣，如 `USD` |
| all_time_high | string | 是 | 歷史最高價 |
| all_time_high_date | string | 是 | 歷史最高價日期 |
| all_time_low | string | 是 | 歷史最低價 |
| all_time_low_date | string | 是 | 歷史最低價日期 |
| ipo_date | string | 否 | 初始上市日期 |
| issue_price | string | 否 | 初始發行價格 |
| shares | string | 否 | 流通總量 |
| official_web_address | string | 否 | 官方網站 URL |
| logo | string | 否 | 資產 Logo URL |
| wiki_url | string | 否 | Wikipedia URL |
| profile | string | 否 | 資產簡介（JSON 字符串） |
