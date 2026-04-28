---
id: quote_history_candlestick
title: 獲取標的曆史 K 線
slug: history-candlestick
sidebar_position: 10
---

該接口用於獲取標的的曆史 K 線數據。

<CliCommand>
# 2025 年 Q1 日 K
longbridge kline history TSLA.US --start 2025-01-01 --end 2025-03-31
# 2024 全年週 K
longbridge kline history AAPL.US --start 2024-01-01 --end 2024-12-31 --period week
# 2025 全年日 K
longbridge kline history NVDA.US --start 2025-01-01 --end 2025-12-31
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="history_candlesticks_by_offset" />

:::info

[業務指令](../../socket/biz-command)：`27`

:::

## Request

### Parameters

| Name           | Type   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol         | string | 是       | 標的代碼，使用 `ticker.region` 格式，例如：`700.HK`                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| period         | int32  | 是       | k 線周期，例如：`1000`，詳見 [Period](../objects#period---k-線周期)                                                                                                                                                                                                                                                                                                                                                                                                                    |
| adjust_type    | int32  | 是       | 複權類型，例如：`0`，詳見 [AdjustType](../objects#adjusttype---k-線復權類型)                                                                                                                                                                                                                                                                                                                                                                                                           |
| query_type     | int32  | 是       | 查詢方式 <br /><br />**可選值：**<br />`1` - 按偏移查詢 <br />`2` - 按日期區間查詢                                                                                                                                                                                                                                                                                                                                                                                                     |
| date_request   | object | 否       | 按日期查詢時必填                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ∟ start_date   | string | 否       | 開始日期，格式為 `YYYYMMDD`，例如：20231016 <br /><br />**參數說明：**<br /> 1. start_date 和 end_date 均不填：返回最新的 1000 根 K 線；<br />2. 僅填 start_date：返回 start_date 與最新交易日區間內的 K 線。若此區間內 K 線超過 1000 根，則優先返回靠近 start_date 的 1000 根 K 線；<br /> 3. 僅填 end_date：返回 end_date 及以前的 1000 根 K 線；<br />4. start_date 和 end_date 均填：返回此區間內的 K 線數據。若此區間內 K 線超過 1000 根，則優先返回靠近 end_date 的 1000 根 K 線 |
| ∟ end_date     | string | 否       | 結束日期，格式為 `YYYYMMDD`，例如：20231016                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| offset_request | object | 否       | 按偏移查詢時必填                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ∟ direction    | int32  | 是       | 查詢方嚮 <br /><br />**可選值：**<br />`0` - 嚮曆史數據方嚮查找 <br />`1` - 嚮最新數據方嚮查找                                                                                                                                                                                                                                                                                                                                                                                         |
| ∟ date         | string | 否       | 查詢日期，格式為 `YYYYMMDD`，例如：20231016，為空時使用標的所在市場的最新交易日                                                                                                                                                                                                                                                                                                                                                                                                        |
| ∟ minute       | string | 否       | 查詢時間，格式為 `HHMM`，例如：09:35，僅在查詢分鍾級別 k 線時有效                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ∟ count        | int32  | 否       | 查詢數量，填寫範圍 `[1,1000]`，為空時默認查詢 `10` 條                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| trade_session  | int32  | 否       | 交易時段，0: 盤中，100: 所有延長時段（盤前，盤中，盤後，夜盤）<br/><br/>注意：夜盤數據需購買「LV1 實時行情 (OpenAPI)」行情卡，且僅支援美股                                                                                                                                                                                                                                                                                                                                                                                                                         |

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
const { Config, QuoteContext, OAuth, Period, AdjustType, TradeSessions, NaiveDatetime, NaiveDate, Time } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const datetime = new NaiveDatetime(new NaiveDate(2023, 1, 1), new Time(0, 0, 0))
  const resp = await ctx.historyCandlesticksByOffset("700.HK", Period.Day, AdjustType.NoAdjust, true, datetime, 10, TradeSessions.Intraday)
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

| Name            | Type     | Description                                                       |
| --------------- | -------- | ----------------------------------------------------------------- |
| symbol          | string   | 標的代碼，例如：`AAPL.US`                                         |
| candlesticks    | object[] | K 線數據                                                          |
| ∟ close         | string   | 當前周期收盤價                                                    |
| ∟ open          | string   | 當前周期開盤價                                                    |
| ∟ low           | string   | 當前周期最低價                                                    |
| ∟ high          | string   | 當前周期最高價                                                    |
| ∟ volume        | int64    | 當前周期成交量                                                    |
| ∟ turnover      | string   | 當前周期成交額                                                    |
| ∟ timestamp     | int64    | 當前周期的時間戳                                                  |
| ∟ trade_session | int32    | 交易時段，詳見 [TradeSession](../objects#tradesession---交易時段) |

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

## 權限說明

依據用戶的資産和交易情況，不同類型的用戶每月可查詢曆史數據的標的數量如下錶：

- 額度按照自然月計算，每月初額度加滿，上月剩餘額度不纍計到本月。一個自然月內重複請求同一隻標的的曆史 K 線，僅統計一次。
- 新入金的賬戶，額度會在下個交易日自動生效；當賬戶的總資産或交易筆數增加、且達到更高等級時，額度會在下一個交易日生效。
- 總資産：用戶的港股、美股、A 股等證券賬戶的總資産，按照匯率換算成港元。取用戶上個自然月最後一個交易日的總資産與最近一個完整交易日的總資産的較大值。
- 月交易筆數：用戶有成交的訂單數量，一個訂單部分成交、或多次全部成交、或一次全部成交均算 1 筆。取用戶上個自然月的成交筆數與當前自然月的成交筆數的較大值。

<table>
  <tr>
    <th>用戶類型</th>
    <th >每月可查詢的標的數量上限（隻）</th>
  </tr>
  <tr>
    <td>用戶開戶</td>
    <td><center>100</center></td>
  </tr>
  <tr>
    <td>總資産達 1 萬 HKD  </td>
    <td><center>400</center></td>
  </tr>
  <tr>
    <td>總資産達 8 萬 HKD</td>
    <td><center>600</center></td>
  </tr>
  <tr>
    <td>總資産達 40 萬 HKD 或 月交易筆數大於 160 筆</td>
    <td><center>1000</center></td>
  </tr>
  <tr>
    <td>總資産達 400 萬 HKD 或 月交易筆數大於 1600 筆</td>
    <td><center>2000</center></td>
  </tr>
  <tr>
    <td>總資産達 600 萬 HKD 或 月交易筆數大於 2500 筆</td>
    <td><center>3000</center></td>
  </tr>
</table>

## 曆史 K 線區間說明

| 市場     | 日/周/月/年 K 線 | 分鍾 K 線       | 說明                                                   |
| -------- | ---------------- | --------------- | ------------------------------------------------------ |
| 港股     | 2004-6-1 至今    | 2022-09-28 至今 |                                                        |
| 美股     | 2010-6-1 至今    | 2023-12-4 至今  |                                                        |
| 美股期權 | -                | -               | 美股期權曆史數據目前暫不支持，待後續開放更長時段的數據 |
| A 股     | 1999-11-1 至今   | 2022-08-25 至今 |                                                        |

## 頻次限製

:::caution

- 每 30 秒內最多請求 60 次曆史 K 線接口。

:::

## 錯誤碼

| 協議錯誤碼 | 業務錯誤碼 | 描述           | 排查建議                                                                 |
| ---------- | ---------- | -------------- | ------------------------------------------------------------------------ |
| 3          | 301600     | 無效的請求     | 請求參數有誤或解包失敗                                                   |
| 3          | 301606     | 限流           | 降低請求頻次                                                             |
| 7          | 301602     | 服務端內部錯誤 | 請重試或聯係技術人員處理                                                 |
| 7          | 301600     | 請求數據非法   | 檢查請求的 `symbol`，`count`，`adjust_type`, `period` 數據是否在正確範圍 |
| 7          | 301603     | 標的無行情     | 標的冇有請求的行情數據                                                   |
| 7          | 301604     | 無權限         | 冇有獲取標的行情的權限                                                   |
| 7          | 301607     | 接口限製       | 超過當月能夠查詢的標的數量上限                                           |
