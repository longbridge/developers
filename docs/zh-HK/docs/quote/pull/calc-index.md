---
id: quote_calc_index.md
title: 獲取標的計算指標
slug: calc-index
sidebar_position: 19
---

該接口用於獲取標的計算指標數據，根據請求指定的計算指標返回數據。

<CliCommand>
# PE、PB、EPS 等核心指標
longbridge calc-index TSLA.US NVDA.US
# 指定查詢的指標
longbridge calc-index AAPL.US --index pe,pb,eps,turnover_rate
# 市值相關指標
longbridge calc-index TSLA.US --index pe,total_market_value
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="calc_indexes" go="CalcIndex" />

:::info
[業務指令](../../socket/biz-command)：`26`
:::

## Request

### Parameters

| Name       | Type     | Required | Description                                                                                                                         |
| ---------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| symbols    | string[] | 是       | 標的代碼列表，使用 `ticker.region` 格式，例如：`[700.HK]` <br /><br />**校驗規則：**<br />每次請求支持傳入的標的數量上限是 `500` 個 |
| calc_index | init32[] | 是       | 計算指標，例如：`[1,2,3]`，詳見 [CalcIndex](../objects#calcindex---計算指標)                                                        |

### Protobuf

```protobuf
message SecurityCalcQuoteRequest {
  repeated string symbols = 1;
  repeated CalcIndex calc_index = 2;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, CalcIndex, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

resp = ctx.calc_indexes(["700.HK", "AAPL.US"], [CalcIndex.LastDone, CalcIndex.ChangeRate])
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, CalcIndex, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    resp = await ctx.calc_indexes(["700.HK", "AAPL.US"], [CalcIndex.LastDone, CalcIndex.ChangeRate])
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, CalcIndex } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.calcIndexes(["700.HK", "AAPL.US"], [CalcIndex.LastDone, CalcIndex.ChangeRate])
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.quote.*;

class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            SecurityCalcIndex[] resp = ctx.getCalcIndexes(new String[] { "700.HK", "AAPL.US" }, new CalcIndex[] { CalcIndex.LastDone, CalcIndex.ChangeRate }).get();
            for (SecurityCalcIndex o : resp) System.out.println(o);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config, quote::CalcIndex};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.calc_indexes(vec!["700.HK".to_string(), "AAPL.US".to_string()], vec![CalcIndex::LastDone, CalcIndex::ChangeRate]).await?;
    println!("{:?}", resp);
    Ok(())
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#include <iostream>
#include <longbridge.hpp>

#ifdef WIN32
#include <windows.h>
#endif

using namespace longbridge;
using namespace longbridge::quote;

static void
run(const OAuth& oauth)
{
    Config config = Config::from_oauth(oauth);
    QuoteContext ctx = QuoteContext::create(config);

    ctx.calc_indexes(symbols, indexes, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        for (const auto& o : *res) std::cout << o.symbol << std::endl;
    });
}

int main(int argc, char const* argv[]) {
#ifdef WIN32
    SetConsoleOutputCP(CP_UTF8);
#endif

    const std::string client_id = "your-client-id";
    OAuthBuilder(client_id).build(
    [](const std::string& url) {
        std::cout << "Open this URL to authorize: " << url << std::endl;
    },
    [](auto res) {
        if (!res) {
            std::cout << "authorization failed: " << *res.status().message() << std::endl;
            return;
        }
        run(*res);
    });

    std::cin.get();
    return 0;
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
	"github.com/longbridge/openapi-go/quote"
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
	qctx, err := quote.NewFromCfg(conf)
	if err != nil {
		log.Fatal(err)
	}
	defer qctx.Close()
	indexes, err := qctx.CalcIndex(context.Background(), []string{"700.HK", "AAPL.US"}, []quote.CalcIndex{quote.CalcIndexLastDone, quote.CalcIndexChangeRate})
	if err != nil {
		log.Fatal(err)
	}
	for _, o := range indexes {
		fmt.Println(o.Symbol)
	}
}
```

  </TabItem>
</Tabs>


## Response

### Response Properties

| Name                       | Type     | Description                                  |
| -------------------------- | -------- | -------------------------------------------- |
| security_calc_index        | object[] | 標的指標數據                                 |
| ∟ symbol                   | string   | 標的代碼                                     |
| ∟ last_done                | string   | 最新價                                       |
| ∟ change_val               | string   | 漲跌額                                       |
| ∟ change_rate              | string   | 漲跌幅 (返回百分比數據，不包含`%`符號)       |
| ∟ volume                   | int64    | 成交量                                       |
| ∟ turnover                 | string   | 成交額                                       |
| ∟ ytd_change_rate          | string   | 年初至今漲幅 (返回百分比數據，不包含`%`符號) |
| ∟ turnover_rate            | string   | 換手率 (返回百分比數據，不包含`%`符號)       |
| ∟ total_market_value       | string   | 總市值                                       |
| ∟ capital_flow             | string   | 流入資金                                     |
| ∟ amplitude                | string   | 振幅 (返回百分比數據，不包含`%`符號)         |
| ∟ volume_ratio             | string   | 量比                                         |
| ∟ pe_ttm_ratio             | string   | 市盈率 (TTM）                                |
| ∟ pb_ratio                 | string   | 市淨率                                       |
| ∟ dividend_ratio_ttm       | string   | 股息率 (TTM)                                 |
| ∟ five_day_change_rate     | string   | 五日漲幅 (返回百分比數據，不包含`%`符號)     |
| ∟ ten_day_change_rate      | string   | 十日漲幅 (返回百分比數據，不包含`%`符號)     |
| ∟ half_year_change_rate    | string   | 半年漲幅 (返回百分比數據，不包含`%`符號)     |
| ∟ five_minutes_change_rate | string   | 五分鐘漲幅 (返回百分比數據，不包含`%`符號)   |
| ∟ expiry_date              | string   | 到期日                                       |
| ∟ strike_price             | string   | 行權價                                       |
| ∟ upper_strike_price       | string   | 上限價                                       |
| ∟ lower_strike_price       | string   | 下限價                                       |
| ∟ outstanding_qty          | int64    | 街貨量                                       |
| ∟ outstanding_ratio        | string   | 街貨比 (返回百分比數據，不包含`%`符號)       |
| ∟ premium                  | string   | 溢價率 (返回百分比數據，不包含`%`符號)       |
| ∟ itm_otm                  | string   | 價內/價外 (返回百分比數據，不包含`%`符號)    |
| ∟ implied_volatility       | string   | 隱含波動率 (返回百分比數據，不包含`%`符號)   |
| ∟ warrant_delta            | string   | 對沖值                                       |
| ∟ call_price               | string   | 收回價                                       |
| ∟ to_call_price            | string   | 距收回價 (返回百分比數據，不包含`%`符號)     |
| ∟ effective_leverage       | string   | 有效槓桿                                     |
| ∟ leverage_ratio           | string   | 槓桿比率                                     |
| ∟ conversion_ratio         | string   | 換股比率                                     |
| ∟ balance_point            | string   | 打和點                                       |
| ∟ open_interest            | int64    | 未平倉數                                     |
| ∟ delta                    | string   | Delta                                        |
| ∟ gamma                    | string   | Gamma                                        |
| ∟ theta                    | string   | Theta，原始值需除以 100 得到標準的每股每天值    |
| ∟ vega                     | string   | Vega，原始值需除以 100 得到標準的每股每 1% IV 值 |
| ∟ rho                      | string   | Rho，原始值需除以 100 得到標準的每股每 1% 利率值  |

### Protobuf

```protobuf
message SecurityCalcIndex {
  string symbol = 1;
  string last_done = 2;
  string change_val = 3;
  string change_rate = 4;
  int64 volume = 5;
  string turnover = 6;
  string ytd_change_rate = 7;
  string turnover_rate = 8;
  string total_market_value = 9;
  string capital_flow = 10;
  string amplitude = 11;
  string volume_ratio = 12;
  string pe_ttm_ratio = 13;
  string pb_ratio = 14;
  string dividend_ratio_ttm = 15;
  string five_day_change_rate = 16;
  string ten_day_change_rate = 17;
  string half_year_change_rate = 18;
  string five_minutes_change_rate = 19;
  string expiry_date = 20;
  string strike_price = 21;
  string upper_strike_price = 22;
  string lower_strike_price = 23;
  int64  outstanding_qty = 24;
  string outstanding_ratio = 25;
  string premium = 26;
  string itm_otm = 27;
  string implied_volatility = 28;
  string warrant_delta = 29;
  string call_price = 30;
  string to_call_price = 31;
  string effective_leverage = 32;
  string leverage_ratio = 33;
  string conversion_ratio = 34;
  string balance_point = 35;
  int64 open_interest = 36;
  string delta = 37;
  string gamma = 38;
  string theta = 39;
  string vega = 40;
  string rho = 41;
}

message SecurityCalcQuoteResponse {
  repeated SecurityCalcIndex security_calc_index = 1;
}
```

### Response JSON Example

```json
{
  "securityCalcIndex": [
    {
      "symbol": "AAPL.US",
      "lastDone": "131.880",
      "changeVal": "-5.2500",
      "changeRate": "-3.83",
      "volume": "122207099",
      "turnover": "16269088361.000",
      "ytdChangeRate": "-25.63",
      "turnoverRate": "0.76",
      "totalMarketValue": "2134501670280.00",
      "capitalFlow": "14664053535.556",
      "amplitude": "2.74",
      "volumeRatio": "3.22",
      "peTtmRatio": "21.26",
      "pbRatio": "31.71",
      "dividendRatioTtm": "0.64",
      "fiveDayChangeRate": "-9.76",
      "tenDayChangeRate": "-11.87",
      "halfYearChangeRate": "-7.01",
      "fiveMinutesChangeRate": "0.00"
    },
    {
      "symbol": "69672.HK",
      "lastDone": "0.010",
      "changeRate": "0.00",
      "expiryDate": "20221024",
      "strikePrice": "379.880",
      "outstandingQty": "6090000",
      "outstandingRatio": "7.61",
      "premium": "0.67",
      "itmOtm": "0.65",
      "callPrice": "375.880",
      "toCallPrice": "-100.00",
      "leverageRatio": "75.48",
      "balancePoint": "374.880"
    },
    {
      "symbol": "AAPL220617C137000.US",
      "lastDone": "1.17",
      "changeVal": "-2.04",
      "changeRate": "-63.55",
      "volume": "23499",
      "turnover": "3903660.00",
      "expiryDate": "20220617",
      "strikePrice": "137.00",
      "premium": "11709.40",
      "impliedVolatility": "43.54",
      "openInterest": "5210",
      "delta": "0.263",
      "gamma": "0.043",
      "theta": "-1.266",
      "vega": "5.660",
      "rho": "0.580"
    },
    {
      "symbol": "HSI.HK",
      "lastDone": "21119.650",
      "changeVal": "52.070",
      "changeRate": "0.25",
      "volume": "96449546281",
      "turnover": "96449546281.000",
      "ytdChangeRate": "-9.74",
      "amplitude": "1.86",
      "volumeRatio": "0.59",
      "fiveDayChangeRate": "-1.91",
      "tenDayChangeRate": "-0.02",
      "halfYearChangeRate": "-11.83",
      "fiveMinutesChangeRate": "0.00"
    }
  ]
}
```

## 錯誤碼

| 協議錯誤碼 | 業務錯誤碼 | 描述           | 排查建議                                   |
| ---------- | ---------- | -------------- | ------------------------------------------ |
| 3          | 301600     | 無效的請求     | 請求參數有誤或解包失敗                     |
| 3          | 301606     | 限流           | 降低請求頻次                               |
| 7          | 301602     | 服務端內部錯誤 | 請重試或聯繫技術人員處理                   |
| 7          | 301607     | 接口限制       | 請求的標的數量超限，請減少單次請求標的數量 |
