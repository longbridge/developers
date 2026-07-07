---
slug: us_financial_statement_v3
title: 美股財務報表
sidebar_position: 33
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

獲取美股指定財務報表（損益表、資產負債表或現金流量表）。

<CliCommand>
# 損益表
longbridge financial-report AAPL.US --kind IS
# 資產負債表
longbridge financial-report AAPL.US --kind BS
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_financial_statement_v3" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代碼，如 `AAPL.US` |
| kind | string | 是 | 報表類型：`IS`（損益表）、`BS`（資產負債表）、`CF`（現金流量表）|
| report | string | 否 | 報告週期 |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_financial_statement_v3("AAPL.US", kind="IS", report="annual")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncFundamentalContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("請訪問：", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncFundamentalContext.create(config)
    resp = await ctx.us_financial_statement_v3("AAPL.US", kind="IS", report="annual")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, FundamentalContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('請訪問此 URL 授權：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = FundamentalContext.new(config)
  const resp = await ctx.usFinancialStatementV3("AAPL.US", "IS", "annual")
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.fundamental.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             FundamentalContext ctx = FundamentalContext.create(config)) {
            var resp = ctx.getUsFinancialStatementV3("AAPL.US", "IS", "annual").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, fundamental::FundamentalContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("請訪問：{url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = FundamentalContext::new(config);
    let resp = ctx.us_financial_statement_v3("AAPL.US", "IS", "annual").await?;
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
    "github.com/longbridge/openapi-go/fundamental"
)

func main() {
    o := oauth.New("your-client-id").
        OnOpenURL(func(url string) { fmt.Println("Open:", url) })
    if err := o.Build(context.Background()); err != nil {
        log.Fatal(err)
    }
    conf, _ := config.New(config.WithOAuthClient(o))
    c, _ := fundamental.NewFromCfg(conf)
    defer c.Close()
    resp, err := c.FinancialStatementV3(context.Background(), "AAPL.US", "IS", "annual")
    if err != nil { log.Fatal(err) }
    fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>



## 響應

### 響應 Example

```json
{
  "revenue": "124300000000",
  "net_income": "30520000000",
  "net_margin": "0.2454",
  "periods": [
    {
      "date": "2026-03-31",
      "values": {
        "total_assets": "364840000000",
        "total_liabilities": "291040000000"
      }
    }
  ],
  "currency": "USD"
}
```

### 響應 Status

| 狀態碼 | 描述 | 結構 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsFinancialStatement](#UsFinancialStatement) |
| 400    | 請求錯誤 | None   |

## 數據結構

### UsFinancialStatement

<a id="UsFinancialStatement"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| revenue | string | true | 總營收 |
| net_income | string | true | 淨利潤 |
| net_margin | string | true | 淨利潤率 |
| periods | FinancialPeriod[] | true | 包含逐行數據的報告期列表 |
| ∟ date | string | true | 報告期日期 |
| ∟ values | map[string]any | true | 以指標名稱為鍵的財務行項目 |
| currency | string | true | 貨幣代碼，如 `USD` |
