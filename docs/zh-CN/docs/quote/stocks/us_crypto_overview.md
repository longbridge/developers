---
slug: us_crypto_overview
title: 美股加密货币概览
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

获取美股加密货币交易对的概览信息——历史最高/最低价、资产详情和货币信息。

<CliCommand>
# 美股加密货币概览
longbridge static DOGEUSD.BKKT
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="us_crypto_overview" />

## 参数

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 加密货币交易对，例如 `DOGEUSD.BKKT` |

## 请求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import QuoteContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
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
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("请访问：", url))
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
    console.log('请访问此 URL 授权：' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问：{url}")).await?;
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

## 响应字段

| 字段 | 类型 | 描述 |
| ---- | ---- | ---- |
| symbol | string | 交易对代码 |
| name | string | 资产名称 |
| ticker | string | 简短代码 |
| base_asset | string | 基础资产代码 |
| currency | string | 计价货币 |
| all_time_high | string | 历史最高价 |
| all_time_high_date | string | 历史最高价日期 |
| all_time_low | string | 历史最低价 |
| all_time_low_date | string | 历史最低价日期 |


## 响应

### 响应 Example

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
  "all_time_low_date": "2015-05-06"
}
```

### 响应 Status

| 状态码 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [CryptoOverview](#CryptoOverview) |
| 400    | 请求错误 | None   |

## 数据结构

### CryptoOverview

<a id="CryptoOverview"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | true | 交易对代码，如 `DOGEUSD.BKKT` |
| name | string | true | 资产名称 |
| ticker | string | true | 简短代码 |
| base_asset | string | true | 基础资产代码，如 `DOGE` |
| currency | string | true | 计价货币，如 `USD` |
| all_time_high | string | true | 历史最高价 |
| all_time_high_date | string | true | 历史最高价日期 |
| all_time_low | string | true | 历史最低价 |
| all_time_low_date | string | true | 历史最低价日期 |
