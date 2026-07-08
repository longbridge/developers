---
slug: us_asset_overview
title: 美股资产概览
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

获取美股账户资产概览——买入力、现金、股票、期权和加密货币。

<CliCommand>
# 美股账户资产概览
longbridge positions
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_asset_overview" />

## Parameters

> **SDK 方法参数。**

无需参数。

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("请访问：", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
resp = ctx.us_asset_overview()
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncTradeContext, Config, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("请访问：", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncTradeContext.create(config)
    resp = await ctx.us_asset_overview()
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
    console.log('请访问此 URL 授权：' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = TradeContext.new(config)
  const resp = await ctx.usAssetOverview()
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
            var resp = ctx.getUsAssetOverview().get();
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("请访问：{url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let ctx = TradeContext::new(config);
    let resp = ctx.us_asset_overview().await?;
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
	"github.com/longbridge/openapi-go/trade"
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
	c, err := trade.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()
	resp, err := c.USAssetOverview(context.Background())
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
  "account_type": "US",
  "asset_timestamp": 1751866334,
  "cash_buy_power": "12500.00",
  "cash_list": [
    {"currency": "USD", "amount": "12500.00"}
  ],
  "stock_list": [],
  "crypto_list": [
    {"symbol": "BTCUSD.BKKT", "quantity": "0.5"}
  ]
}
```

### Response Status

| 状态码 | 描述 | 结构 |
| ------ | ---- | ---- |
| 200    | 成功 | [USAssetOverview](#USAssetOverview) |
| 400    | 请求错误 | None   |

## Schemas

### USAssetOverview

<a id="USAssetOverview"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| account_type | string | 是 | 账户类型标识 |
| asset_timestamp | int64 | 是 | 资产数据快照时间（Unix 秒） |
| cash_buy_power | string | 是 | 可用买入力 |
| cash_list | USCashEntry[] | 否 | 按货币分列的现金余额 |
| stock_list | USStockEntry[] | 否 | 股票持仓 |
| crypto_list | USCryptoEntry[] | 否 | 加密货币持仓 |

### USCashEntry

<a id="USCashEntry"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| currency | string | 是 | 货币代码，如 `USD` |
| amount | string | 是 | 现金金额 |

### USStockEntry

<a id="USStockEntry"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 股票代码，如 `AAPL.US` |
| quantity | string | 是 | 持有数量 |
| cost_price | string | 否 | 平均持仓成本价 |
| current_price | string | 否 | 当前市场价格 |
| market_value | string | 否 | 当前市值 |

### USCryptoEntry

<a id="USCryptoEntry"></a>

| 名称 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| symbol | string | 是 | 加密货币交易对代码 |
| quantity | string | 是 | 持有数量 |
