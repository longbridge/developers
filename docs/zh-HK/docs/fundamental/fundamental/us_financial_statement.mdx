---
slug: us_financial_statement
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
longbridge financial-statement AAPL.US --kind IS
# 資產負債表
longbridge financial-statement AAPL.US --kind BS
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_financial_statement" />

## Parameters

> **SDK 方法參數。**

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代碼，如 `AAPL.US` |
| kind | string | 是 | 報表類型：`IS`（損益表）、`BS`（資產負債表）、`CF`（現金流量表）|
| report | string | 否 | 報告週期 |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_financial_statement("AAPL.US", "IS", "af")
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
    resp = await ctx.us_financial_statement("AAPL.US", "IS", "af")
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
  const resp = await ctx.usFinancialStatement("AAPL.US", "IS", "af")
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
            var resp = ctx.getUsFinancialStatementV3("AAPL.US", "IS", "af").get();
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
    let resp = ctx.us_financial_statement("AAPL.US", "IS", "af").await?;
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
        OnOpenURL(func(url string) { fmt.Println("Open this URL to authorize:", url) })
    if err := o.Build(context.Background()); err != nil {
        log.Fatal(err)
    }
    conf, err := config.New(config.WithOAuthClient(o))
    if err != nil {
        log.Fatal(err)
    }
    c, err := fundamental.NewFromCfg(conf)
    if err != nil {
        log.Fatal(err)
    }
    defer c.Close()
    resp, err := c.FinancialStatement(context.Background(), "AAPL.US", "IS", "af")
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
  "currency": "USD",
  "report": "af",
  "empty_fields": [],
  "list": [
    {
      "ff_period": "A",
      "ff_year": 2024,
      "fp_end": "2024-09-28",
      "report_txt": "FY2024",
      "rpt_date": "2024-11-01",
      "fields": [
        {
          "id": "revenue",
          "name": "总营收",
          "value": "391035000000",
          "yoy": "0.0198",
          "level": 1,
          "display_order": 1,
          "field": "revenue",
          "value_type": "amount"
        }
      ]
    }
  ]
}
```

### Response Status

| 狀態碼 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsFinancialStatement](#UsFinancialStatement) |
| 400    | 請求錯誤 | None   |

## Schemas

### UsFinancialStatement

<a id="UsFinancialStatement"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| currency | string | 是 | 貨幣代碼，如 `USD` |
| report | string | 是 | 報告週期類型（如 `annual`、`quarterly`） |
| empty_fields | string[] | 否 | 本期無數據的字段列表 |
| list | USFinancialStatementPeriod[] | 是 | 按報告期排列的報表數據 |

### USFinancialStatementPeriod

<a id="USFinancialStatementPeriod"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| ff_period | string | 是 | 報告週期代碼（如 `A`=年报、`Q`=季报） |
| ff_year | int | 是 | 財年 |
| fp_end | string | 是 | 報告期結束日期 |
| report_txt | string | 是 | 報告期標籤（如 `FY2024`） |
| rpt_date | string | 是 | 財報發布日期 |
| fields | USFinancialStatementField[] | 是 | 財務行項目列表 |

### USFinancialStatementField

<a id="USFinancialStatementField"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| id | string | 是 | 字段標識 |
| name | string | 是 | 字段顯示名稱 |
| value | string | 是 | 字段值 |
| yoy | string | 否 | 同比變動率 |
| level | int | 是 | 層級（1=顶层） |
| display_order | int | 是 | 顯示順序 |
| field | string | 是 | 字段鍵名 |
| value_type | string | 是 | 值類型（如 `amount`、`ratio`） |
