---
slug: us_asset_overview
title: 美股資產概覽
sidebar_position: 10
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

獲取美股賬戶資產概覽——買入力、現金、股票、期權和加密貨幣。

<CliCommand>
# 美股賬戶資產概覽
longbridge positions
</CliCommand>

<SDKLinks module="trade" klass="TradeContext" method="us_asset_overview" />

## Parameters

> **SDK 方法參數。**

無需參數。

## Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python">

```python
from longbridge.openapi import TradeContext, Config, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("請訪問：", url))
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
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("請訪問：", url))
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
    console.log('請訪問此 URL 授權：' + url)
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
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("請訪問：{url}")).await?;
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

| 狀態碼 | 描述 | 結構 |
| ------ | ---- | ---- |
| 200    | 成功 | [USAssetOverview](#USAssetOverview) |
| 400    | 請求錯誤 | None   |


## Schemas

### USAssetOverview

<a id="USAssetOverview"></a>

| 名稱 | 類型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| account_type | string | 是 | 賬戶類型標識 |
| asset_timestamp | int64 | 是 | 資產數據快照時間（Unix 秒） |
| cash_buy_power | string | 是 | 可用買入力（现金） |
| overnight_buy_power | string | 是 | 隔夜買入力 |
| currency | string | 是 | 基礎貨幣 |
| cash_list | USCashEntry[] | 否 | 按貨幣分列的現金餘額 |
| stock_list | USStockEntry[] | 否 | 股票持倉 |
| option_list | object[] | 否 | 期權持倉 |
| crypto_list | USCryptoEntry[] | 否 | 加密貨幣持倉 |

### USCashEntry

<a id="USCashEntry"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| currency | string | 貨幣代碼 |
| total_cash | string | 總現金 |
| settled_cash | string | 已結算現金 |
| total_amount | string | 含未結算的總金額 |
| outstanding | string | 未結算金額 |
| frozen_buy_cash | string | 待成交買單凍結金額 |

### USStockEntry

<a id="USStockEntry"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| symbol | string | 股票代碼（如 `AAPL`） |
| full_symbol | string | 完整代碼（如 `AAPL.US`） |
| asset_type | string | 資產類型 |
| quantity | string | 持有數量 |
| currency | string | 貨幣代碼 |
| average_cost | string | 平均持倉成本價 |
| market | string | 市場標識 |
| trade_status | string | 交易狀態 |
| prev_close | string | 上一收盤價 |
| last_done | string | 最新成交價 |
| market_price | string | 當前市場價格 |
| today_pl | string | 當日盈虧 |
| name | string | 證券名稱 |
| position_side | string | 持倉方向（多/空） |
| industry_name | string | 行業/板塊名稱 |

### USCryptoEntry

<a id="USCryptoEntry"></a>

| 名稱 | 類型 | 描述 |
| ---- | ---- | ---- |
| symbol | string | 加密貨幣交易對代碼，如 `BTCUSD.BKKT` |
| average_cost | string | 平均持倉成本價 |
| currency | string | 計價貨幣 |
| asset_type | string | 資產類型 |
| industry_name | string | 行業/分類名稱 |
