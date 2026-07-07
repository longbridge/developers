---
slug: us_financial_statement_v3
title: 美股财务报表
sidebar_position: 33
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

获取美股指定财务报表（损益表、资产负债表或现金流量表）。

<CliCommand>
# 损益表
longbridge financial-report AAPL.US --kind IS
# 资产负债表
longbridge financial-report AAPL.US --kind BS
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_financial_statement_v3" />

## 参数

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代码，如 `AAPL.US` |
| kind | string | 是 | 报表类型：`IS`（损益表）、`BS`（资产负债表）、`CF`（现金流量表）|
| report | string | 否 | 报告周期 |

## 请求示例

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
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("请访问：", url))
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
    console.log('请访问此 URL 授权：' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问：{url}")).await?;
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



## 响应

### 响应 Example

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

### 响应 Status

| 状态码 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsFinancialStatement](#UsFinancialStatement) |
| 400    | 请求错误 | None   |

## 数据结构

### UsFinancialStatement

<a id="UsFinancialStatement"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| revenue | string | true | 总营收 |
| net_income | string | true | 净利润 |
| net_margin | string | true | 净利润率 |
| periods | FinancialPeriod[] | true | 包含逐行数据的报告期列表 |
| ∟ date | string | true | 报告期日期 |
| ∟ values | map[string]any | true | 以指标名称为键的财务行项目 |
| currency | string | true | 货币代码，如 `USD` |
