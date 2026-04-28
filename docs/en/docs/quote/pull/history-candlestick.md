---
id: quote_history_candlestick
title: Security History Candlesticks
slug: history-candlestick
sidebar_position: 10
---

This API is used to obtain the history candlestick data of security.

<CliCommand>
# Q1 2025 daily bars
longbridge kline history TSLA.US --start 2025-01-01 --end 2025-03-31
# full year 2024 weekly bars
longbridge kline history AAPL.US --start 2024-01-01 --end 2024-12-31 --period week
# full year 2025 daily bars
longbridge kline history NVDA.US --start 2025-01-01 --end 2025-12-31
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="history_candlesticks_by_offset" />

:::info

[Business Command](../../socket/biz-command)：`27`

:::

## Request

### Parameters

| Name           | Type   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol         | string | Yes      | Security code, in `ticker.region` format, for example:`700.HK`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| period         | int32  | Yes      | Candlestick period, for example: `1000`, see [Period](../objects#period---candlestick-period)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| adjust_type    | int32  | Yes      | Adjustment type, for example: `0`, see [AdjustType](../objects#adjusttype---candlestick-adjustment-type)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| query_type     | int32  | Yes      | Type of query <br /><br />**Optional value:**<br />`1` - query by offset <br />`2` - query by date                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| date_request   | object | No       | Required when querying by date                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ∟ start_date   | string | No       | Date of query begin, in `YYYYMMDD` format, for example: 20231016 <br /><br />**Parameter description:**<br /> 1. Leave both start_date and end_date blank: return the latest 1000 candlesticks; <br />2. Fill only start_date: return the candlesticks between start_date and the latest trading day. If there are more than 1000 candlesticks in this interval, the candlesticks close to start_date will be returned first; <br /> 3. Fill in only end_date: return end_date and the previous 1000 candlesticks; <br /> 4. Fill in both start_date and end_date: return candlesticks data within this interval. If there are more than 1000 candlesticks in the interval, the candlesticks close to end_date will be returned first. |
| ∟ end_date     | string | No       | Date of query end, in `YYYYMMDD` format, for example: 20231016                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| offset_request | object | No       | Required when querying by offset                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ∟ direction    | int32  | Yes      | Query direction <br /><br />**Optional value:**<br />`0` - query in the direction of historical data <br />`1` - query in the direction of latest data                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ∟ date         | string | No       | Query date, in `YYYYMMDD` format, for example: 20231016. Default value: latest trading day of the underlying market.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ∟ minute       | string | No       | Query time, in `HHMM` format, for example: 09:35, only valid when querying minute-level data                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ∟ count        | int32  | No       | Count of cancdlestick, valid range:`[1,1000]`. Default value: `10`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| trade_session  | int32  | No       | Trading session, 0: intraday, 100: All (pre, intraday, post, overnight)<br/><br/>Note: Overnight data requires purchasing the "LV1 Real-time Quote (OpenAPI)" quote card. US stocks only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### Protobuf

```protobuf
message SecurityHistoryCandlestickRequest {

  message OffsetQuery {
    Direction direction = 1;
    string date = 2;
    string minute = 3;
    int32 count = 4;
  }

  message DateQuery {
    string start_date = 1;
    string end_date = 2;
  }

  string symbol = 1;
  Period period = 2;
  AdjustType adjust_type = 3;
  HistoryCandlestickQueryType query_type = 4;
  OffsetQuery offset_request = 5;
  DateQuery date_request = 6;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from datetime import datetime, date
from longbridge.openapi import QuoteContext, Config, Period, AdjustType, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

# Query after 2023-01-01
resp = ctx.history_candlesticks_by_offset("700.HK", Period.Day, AdjustType.NoAdjust, True, 10, datetime(2023, 1, 1))
print(resp)

# Query before 2023-01-01
resp = ctx.history_candlesticks_by_offset("700.HK", Period.Day, AdjustType.NoAdjust, False, 10, datetime(2023, 1, 1))
print(resp)

# Query 2023-01-01 to 2023-02-01
resp = ctx.history_candlesticks_by_date("700.HK", Period.Day, AdjustType.NoAdjust, date(2023, 1, 1), date(2023, 2, 1))
print(resp)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from datetime import datetime, date
from longbridge.openapi import AsyncQuoteContext, Config, Period, AdjustType, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    # Query after 2023-01-01
    resp = await ctx.history_candlesticks_by_offset("700.HK", Period.Day, AdjustType.NoAdjust, True, 10, datetime(2023, 1, 1))
    print(resp)

    # Query before 2023-01-01
    resp = await ctx.history_candlesticks_by_offset("700.HK", Period.Day, AdjustType.NoAdjust, False, 10, datetime(2023, 1, 1))
    print(resp)

    # Query 2023-01-01 to 2023-02-01
    resp = await ctx.history_candlesticks_by_date("700.HK", Period.Day, AdjustType.NoAdjust, date(2023, 1, 1), date(2023, 2, 1))
    print(resp)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const {
  Config,
  QuoteContext,
  OAuth,
  Period,
  AdjustType,
  TradeSessions,
  NaiveDatetime,
  NaiveDate,
  Time,
} = require('longbridge')

async function main() {
  const oauth = await OAuth.build('your-client-id', (_, url) => {
    console.log('Open this URL to authorize: ' + url)
  })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const datetime = new NaiveDatetime(new NaiveDate(2023, 1, 1), new Time(0, 0, 0))
  const resp = await ctx.historyCandlesticksByOffset(
    '700.HK',
    Period.Day,
    AdjustType.NoAdjust,
    true,
    datetime,
    10,
    TradeSessions.Intraday
  )
  console.log(resp)
}
main().catch(console.error)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.longbridge.*;
import com.longbridge.quote.*;
import java.time.LocalDateTime;
class Main {
    public static void main(String[] args) throws Exception {
        try (OAuth oauth = new OAuthBuilder("your-client-id").build(url -> System.out.println("Open to authorize: " + url)).get();
             Config config = Config.fromOAuth(oauth);
             QuoteContext ctx = QuoteContext.create(config)) {
            Candlestick[] resp = ctx.getHistoryCandlesticksByOffset("700.HK", Period.Day, AdjustType.NoAdjust, true, LocalDateTime.of(2023, 1, 1, 0, 0), 10, TradeSessions.Intraday).get();
            for (Candlestick c : resp) System.out.println(c);
        }
    }
}
```

  </TabItem>
  <TabItem value="rust" label="Rust">

```rust
use std::sync::Arc;
use longbridge::{oauth::OAuthBuilder, quote::QuoteContext, Config, quote::{Period, AdjustType, TradeSessions}};
use time::macros::datetime;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let dt = datetime!(2023-01-01 00:00);
    let resp = ctx.history_candlesticks_by_offset("700.HK", Period::Day, AdjustType::NoAdjust, true, Some(dt), 10, TradeSessions::Intraday).await?;
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

    ctx.history_candlesticks_by_offset("700.HK", Period::Day, AdjustType::NoAdjust, true, std::nullopt, 10, TradeSessions::Intraday, [](auto res) {
        if (!res) { std::cout << "failed: " << *res.status().message() << std::endl; return; }
        std::cout << "candlesticks: " << res->size() << std::endl;
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
	"time"

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
	dt := time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC)
	sticks, err := qctx.HistoryCandlesticksByOffset(context.Background(), "700.HK", quote.PeriodDay, quote.AdjustTypeNo, true, &dt, 10)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("candlesticks:", len(sticks))
}
```

  </TabItem>
</Tabs>

## Response

### Response Properties

| Name            | Type     | Description                                                                  |
| --------------- | -------- | ---------------------------------------------------------------------------- |
| symbol          | string   | Security code, for example: `AAPL.US`                                        |
| candlesticks    | object[] | Candlestick data                                                             |
| ∟ close         | string   | Close price                                                                  |
| ∟ open          | string   | Open price                                                                   |
| ∟ low           | string   | Low price                                                                    |
| ∟ high          | string   | High price                                                                   |
| ∟ volume        | int64    | Volume                                                                       |
| ∟ turnover      | string   | Turnover                                                                     |
| ∟ timestamp     | int64    | Timestamp                                                                    |
| ∟ trade_session | int32    | Trade session, see [TradeSession](../objects#tradesession---trading-session) |

### Protobuf

```protobuf
message SecurityCandlestickResponse {
  string symbol = 1;
  repeated Candlestick candlesticks = 2;
}

message Candlestick {
  string close = 1;
  string open = 2;
  string low = 3;
  string high = 4;
  int64 volume = 5;
  string turnover = 6;
  int64 timestamp = 7;
}
```

### Response JSON Example

```json
{
  "symbol": "700.HK",
  "candlesticks": [
    {
      "close": "362.000",
      "open": "364.600",
      "low": "361.600",
      "high": "368.800",
      "volume": 10853604,
      "turnover": "3954556819.000",
      "timestamp": 1650384000
    },
    {
      "close": "348.000",
      "open": "352.000",
      "low": "343.000",
      "high": "356.200",
      "volume": 25738562,
      "turnover": "8981529950.000",
      "timestamp": 1650470400
    },
    {
      "close": "340.600",
      "open": "334.800",
      "low": "334.200",
      "high": "343.000",
      "volume": 28031299,
      "turnover": "9492674293.000",
      "timestamp": 1650556800
    },
    {
      "close": "327.400",
      "open": "332.200",
      "low": "325.200",
      "high": "338.600",
      "volume": 25788422,
      "turnover": "8541441823.000",
      "timestamp": 1650816000
    },
    {
      "close": "335.800",
      "open": "332.200",
      "low": "330.600",
      "high": "341.600",
      "volume": 27288328,
      "turnover": "9166022626.000",
      "timestamp": 1650902400
    }
  ]
}
```

## Permission description

According to the user’s assets and transactions, the number of targets that different types of users can query historical data on each month is as follows:

- The quota is calculated based on the natural month. The quota is topped up at the beginning of each month. The remaining quota from the previous month will not be accumulated to this month. If you repeatedly request the historical K-line of the same target within a natural month, it will only be counted once.
- For newly deposited accounts, the limit will automatically take effect on the next trading day; when the account's total assets or number of transactions increase and reaches a higher level, the limit will take effect on the next trading day.
- Total assets: The total assets of the user's Hong Kong stocks, U.S. stocks, A-shares and other securities accounts are converted into Hong Kong dollars according to the exchange rate. Take the larger value of the user's total assets on the last trading day of the previous calendar month and the total assets on the most recent complete trading day.
- Number of transactions per month: The number of orders that the user has completed. Partial completion of one order, complete completion of multiple transactions, or all transactions at one time are counted as 1 transaction. Take the larger value of the user's number of transactions in the last natural month and the number of transactions in the current natural month.

<table>
  <tr>
    <th>User Type</th>
    <th >The maximum number of targets that can be queried per month</th>
  </tr>
  <tr>
    <td>User account opening</td>
    <td><center>100</center></td>
  </tr>
  <tr>
    <td>Total assets reach HKD 10,000 </td>
    <td><center>400</center></td>
  </tr>
  <tr>
    <td>Total assets reach HKD 80,000</td>
    <td><center>600</center></td>
  </tr>
  <tr>
    <td>Total assets reach 400,000 HKD or the number of transactions per month is greater than 160</td>
    <td><center>1000</center></td>
  </tr>
  <tr>
    <td>Total assets reach 4 million HKD or the number of transactions per month is greater than 1,600</td>
    <td><center>2000</center></td>
  </tr>
  <tr>
    <td>Total assets reach 6 million HKD or the number of transactions per month is greater than 2,500</td>
    <td><center>3000</center></td>
  </tr>
</table>

## Description of historical candlesticks range

| Market             | Daily/Weekly/Monthly/Year period candlesticks | Minute candlesticks   | Description                                                                                                       |
| ------------------ | --------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Hong Kong stocks   | 2004-6-1 to present                           | 2022-09-28 to present |                                                                                                                   |
| U.S. stocks        | 2010-6-1 to present                           | 2023-12-4 to present  |                                                                                                                   |
| U.S. stock options | -                                             | -                     | U.S. stock options historical data is currently not supported, and data for longer periods will be released later |
| A shares           | 1999-11-1 to present                          | 2022-08-25 to present |                                                                                                                   |

## Rate limite

:::caution

- The api can be requested up to 60 times every 30 seconds.

:::

## Error Code

| Protocol Error Code | Business Error Code | Description                | Troubleshooting Suggestions                                                               |
| ------------------- | ------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| 3                   | 301600              | Invalid request            | Invalid request parameters or unpacking request failed                                    |
| 3                   | 301606              | Request rate limit         | Reduce the frequency of requests                                                          |
| 7                   | 301602              | Server error               | Please try again or contact a technician to resolve the issue                             |
| 7                   | 301600              | Invalue request parameters | Please check the request parameter: `symbol`, `count`, `adjust_type`, `period`            |
| 7                   | 301603              | No quotes                  | Security no quote                                                                         |
| 7                   | 301604              | No access                  | No access to security quote                                                               |
| 7                   | 301607              | Permission limit           | Exceeds the upper limit of the number of targets that can be queried in the current month |
