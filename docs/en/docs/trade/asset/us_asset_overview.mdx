---
slug: us_asset_overview
title: US Asset Overview
sidebar_position: 10
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

:::warning Longbridge US Accounts
This method is only available for US data-center accounts.
:::

Get an overview of US account assets — buying power, cash, stocks, options, and crypto.

<CliCommand>
# US account asset overview
longbridge positions
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_asset_overview" />

## Parameters

> **SDK method parameters.**

No parameters required.

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
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
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
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
    console.log('Open this URL to authorize: ' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open: {url}")).await?;
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

| Status | Description | Schema |
| ------ | ----------- | ------ |
| 200    | Success     | [USAssetOverview](#USAssetOverview) |
| 400    | Bad request | None   |


## Schemas

### USAssetOverview

<a id="USAssetOverview"></a>

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| account_type | string | true | Account type identifier |
| asset_timestamp | string | true | Snapshot time (Unix seconds) |
| cash_buy_power | string | true | Available buying power (cash) |
| overnight_buy_power | string | true | Overnight buying power |
| currency | string | true | Base currency |
| cash_list | USCashEntry[] | false | Cash balances by currency |
| stock_list | USStockEntry[] | false | Stock positions |
| option_list | object[] | false | Option positions |
| crypto_list | USCryptoEntry[] | false | Crypto positions |

### USCashEntry

<a id="USCashEntry"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| currency | string | Currency code |
| total_cash | string | Total cash |
| settled_cash | string | Settled cash |
| total_amount | string | Total amount including unsettled |
| outstanding | string | Outstanding (unsettled) amount |
| frozen_buy_cash | string | Frozen amount for pending buys |

### USStockEntry

<a id="USStockEntry"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | Ticker symbol (e.g. `AAPL`) |
| full_symbol | string | Qualified symbol (e.g. `AAPL.US`) |
| asset_type | string | Asset type |
| quantity | string | Quantity held |
| currency | string | Currency code |
| average_cost | string | Average cost price |
| market | string | Market identifier |
| trade_status | string | Trading status |
| prev_close | string | Previous close price |
| last_done | string | Last traded price |
| market_price | string | Current market price |
| today_pl | string | Today's P&L |
| name | string | Security name |
| position_side | string | Position side (long/short) |
| industry_name | string | Industry/sector name |

### USCryptoEntry

<a id="USCryptoEntry"></a>

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | Crypto trading-pair symbol (e.g. `BTCUSD.BKKT`) |
| average_cost | string | Average cost price |
| currency | string | Quote currency |
| asset_type | string | Asset type |
| industry_name | string | Industry/category name |
