---
slug: us_company_overview
title: 美股公司概览
sidebar_position: 30
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

获取美股公司概览信息——简介、市值、排名标签和详情链接。

<CliCommand>
# 美股公司概览
longbridge company AAPL.US
longbridge company TSLA.US
</CliCommand>

<SDKLinks module="fundamental" klass="FundamentalContext" method="us_company_overview" />

## Parameters

> **SDK 方法参数。**

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代码，如 `AAPL.US` |

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import FundamentalContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
config = Config.from_oauth(oauth)
ctx = FundamentalContext(config)
resp = ctx.us_company_overview("AAPL.US")
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
    resp = await ctx.us_company_overview("AAPL.US")
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
  const resp = await ctx.usCompanyOverview("AAPL.US")
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
            var resp = ctx.getUsCompanyOverview("AAPL.US").get();
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
    let resp = ctx.us_company_overview("AAPL.US").await?;
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
    resp, err := c.CompanyOverview(context.Background(), "AAPL.US")
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
  "intro": "Apple Inc. designs, manufactures, and markets smartphones, personal computers...",
  "market_cap": "3150000000000",
  "ccy_symbol": "USD",
  "top_rank_tags": [
    {
      "key": "sp500",
      "title": "S&P 500",
      "text": "S&P 500",
      "rank_type": 1
    }
  ],
  "detail_url": "https://longbridge.com/stocks/AAPL.US",
  "sharelist": []
}
```

### Response Status

| 状态码 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [UsCompanyOverview](#UsCompanyOverview) |
| 400    | 请求错误 | None   |


## Schemas

### UsCompanyOverview

<a id="UsCompanyOverview"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| intro | string | 是 | 公司简介 |
| market_cap | string | 是 | 市值 |
| ccy_symbol | string | 是 | 货币符号 |
| top_rank_tags | USRankTag[] | 否 | 排名标签列表 |
| detail_url | string | 否 | 公司详情页链接 |
| sharelist | USSharelistItem[] | 否 | 相关自选列表 |

### USRankTag

<a id="USRankTag"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| key | string | 标签标识 |
| title | string | 标签标题 |
| text | string | 标签显示文本 |
| rank_type | int | 排名类型 |
| highlight_text | string | 高亮显示文本 |


### USSharelistItem

<a id="USSharelistItem"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| id | string | 自选列表 ID |
| name | string | 自选列表名称 |
| chg | string | 变动值 |
