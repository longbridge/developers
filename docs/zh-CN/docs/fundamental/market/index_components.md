---
slug: index-components
title: 指数成分股
sidebar_position: 6
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取指数或 ETF 的成分股列表，支持排序并显示涨跌统计。

<CliCommand>
longbridge constituent HSI.HK
longbridge constituent SPY.US
</CliCommand>

<SDKLinks module="market" klass="MarketContext" method="index_components" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/market/index_components</td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 指数或 ETF 代码，例如 `HSI.HK`、`SPY.US` |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import MarketContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = MarketContext(config)

resp = ctx.index_components("AAPL.US")
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncMarketContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncMarketContext.create(config)

    resp = await ctx.index_components("AAPL.US")
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, MarketContext, OAuth } = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = MarketContext.new(config)
  const resp = await ctx.index_components('AAPL.US')
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.market.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             MarketContext ctx = MarketContext.create(config)) {
            var resp = ctx.getIndexComponents("AAPL.US").get();
            System.out.println(resp);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, market::MarketContext, Config};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = MarketContext::new(config);
    let resp = ctx.index_components("AAPL.US").await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

using namespace longbridge;
using namespace longbridge::market;

int main() {
    OAuthBuilder("your-client-id").build(
        [](const std::string& url) { std::cout << "Open: " << url << std::endl; },
        [](auto res) {
            if (!res) return;
            Config config = Config::from_oauth(*res);
            MarketContext ctx = MarketContext::create(config);
            ctx.index_components("AAPL.US", [](auto resp) {
                if (resp) std::cout << "OK" << std::endl;
            });
        });
    std::cin.get();
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
	"github.com/longbridge/openapi-go/market"
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
	c, err := market.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.IndexComponents(context.Background(), "AAPL.US")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", resp)
}
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 80,
    "rise_num": 53,
    "fall_num": 24,
    "flat_num": 3,
    "stocks": [
      {
        "counter_id": "ST/HK/00005",
        "name": "汇丰控股",
        "market": "HK",
        "last_done": "68.40",
        "prev_close": "67.80",
        "chg": "0.88",
        "amount": "1234567890",
        "inflow": "23456789",
        "circulating_shares": "20000000000",
        "total_shares": "21000000000",
        "balance": "1360000000000",
        "trade_status": "Normal",
        "intro": "汇丰控股有限公司",
        "delay": false,
        "tags": ["金融", "银行"]
      }
    ]
  }
}
```

### Response Status

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | 成功     | [IndexConstituentsResponse](#IndexConstituentsResponse) |
| 400    | 请求错误 | None   |

## Schemas

### IndexConstituentsResponse

<a id="IndexConstituentsResponse"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| rise_num | integer | 否 | 上涨数量 |
| fall_num | integer | 否 | 下跌数量 |
| flat_num | integer | 否 | 平盘数量 |
| stocks | object[] | 是 | 成分股列表 |

### ConstituentStock

<a id="ConstituentStock"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | 是 | 证券代码 |
| name | string | 是 | 证券名称 |
| market | string | 否 | 市场 |
| last_done | string | 否 | 最新价 |
| prev_close | string | 否 | 前收盘价 |
| chg | string | 否 | 涨跌幅 |
| amount | string | 否 | 成交额 |
| inflow | string | 否 | 资金净流入 |
| circulating_shares | string | 否 | 流通股数 |
| total_shares | string | 否 | 总股数 |
| balance | string | 否 | 市值 |
| trade_status | integer | 否 | 交易状态码 |
| intro | string | 否 | 简介 |
| delay | boolean | 否 | 是否为延迟数据 |
| tags | string[] | 否 | 标签 |
