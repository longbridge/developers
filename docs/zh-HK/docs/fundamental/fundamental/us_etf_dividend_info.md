---
slug: us_etf_dividend_info
title: 美股 ETF 分紅資訊
sidebar_position: 36
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

獲取美股 ETF 分紅資訊——TTM 股息率、派息頻率及財年明細。

<CliCommand>
# ETF 分紅資訊（美股賬戶）
longbridge dividend IVV.US
longbridge dividend SPY.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_etf_dividend_info" />

## 參數

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | ETF 代碼，如 `IVV.US` |

## 請求示例

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_etf_dividend_info("IVV.US")
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
    resp = await ctx.us_etf_dividend_info("IVV.US")
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
  const resp = await ctx.usEtfDividendInfo("IVV.US")
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
            var resp = ctx.getUsEtfDividendInfo("IVV.US").get();
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
    let resp = ctx.us_etf_dividend_info("IVV.US").await?;
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
    resp, err := c.ETFDividendInfo(context.Background(), "IVV.US")
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
  "dividend_ttm": "6.84",
  "dividend_yield_ttm": "0.0134",
  "dividend_freq": "Quarterly",
  "currency": "USD",
  "fiscal_year_info": [
    {
      "year": "2025",
      "total_dividend": "6.52",
      "records": [
        {"ex_date": "2025-12-20", "amount": "1.68"}
      ]
    }
  ]
}
```

### 響應 Status

| 狀態碼 | 描述 | 結構 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsETFDividendInfo](#UsETFDividendInfo) |
| 400    | 請求錯誤 | None   |

## 數據結構

### UsETFDividendInfo

<a id="UsETFDividendInfo"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dividend_ttm | string | true | 過去 12 個月每股股息 |
| dividend_yield_ttm | string | true | TTM 股息率（%） |
| dividend_freq | string | true | 派息頻率（如 `Quarterly`） |
| currency | string | true | 貨幣代碼，如 `USD` |
| fiscal_year_info | FiscalYearDividend[] | false | Annual dividend breakdown |
| ∟ year | string | true | 財年 |
| ∟ total_dividend | string | true | 年度總股息 |
| ∟ records | object[] | false | 逐筆支付記錄 |
