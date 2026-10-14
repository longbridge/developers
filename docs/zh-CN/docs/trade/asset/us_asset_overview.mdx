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
  "overnight_buy_power": "10000.00",
  "currency": "USD",
  "cash_list": [
    {
      "currency": "USD",
      "total_cash": "12500.00",
      "settled_cash": "12000.00",
      "total_amount": "12500.00",
      "outstanding": "500.00",
      "frozen_buy_cash": "0.00"
    }
  ],
  "stock_list": [
    {
      "symbol": "AAPL.US",
      "quantity": "10",
      "currency": "USD",
      "average_cost": "180.00",
      "last_done": "185.00",
      "prev_close": "183.00",
      "asset_type": "stock",
      "trade_status": "Normal"
    }
  ],
  "crypto_list": [
    {
      "symbol": "BTCUSD.BKKT",
      "average_cost": "50000.00",
      "currency": "USD",
      "asset_type": "crypto",
      "industry_name": "Cryptocurrency"
    }
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
| cash_buy_power | string | 是 | 可用买入力（现金） |
| overnight_buy_power | string | 是 | 隔夜买入力 |
| currency | string | 是 | 基础货币 |
| cash_list | USCashEntry[] | 否 | 按货币分列的现金余额 |
| stock_list | USStockEntry[] | 否 | 股票持仓 |
| option_list | object[] | 否 | 期权持仓 |
| crypto_list | USCryptoEntry[] | 否 | 加密货币持仓 |

### USCashEntry

<a id="USCashEntry"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| currency | string | 货币代码 |
| total_cash | string | 总现金 |
| settled_cash | string | 已结算现金 |
| total_amount | string | 含未结算的总金额 |
| outstanding | string | 未结算金额 |
| frozen_buy_cash | string | 待成交买单冻结金额 |

### USStockEntry

<a id="USStockEntry"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| symbol | string | 股票代码（如 `AAPL`） |
| full_symbol | string | 完整代码（如 `AAPL.US`） |
| asset_type | string | 资产类型 |
| quantity | string | 持有数量 |
| currency | string | 货币代码 |
| average_cost | string | 平均持仓成本价 |
| market | string | 市场标识 |
| trade_status | string | 交易状态 |
| prev_close | string | 上一收盘价 |
| last_done | string | 最新成交价 |
| market_price | string | 当前市场价格 |
| today_pl | string | 当日盈亏 |
| name | string | 证券名称 |
| position_side | string | 持仓方向（多/空） |
| industry_name | string | 行业/板块名称 |

### USCryptoEntry

<a id="USCryptoEntry"></a>

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| symbol | string | 加密货币交易对代码，如 `BTCUSD.BKKT` |
| average_cost | string | 平均持仓成本价 |
| currency | string | 计价货币 |
| asset_type | string | 资产类型 |
| industry_name | string | 行业/分类名称 |
