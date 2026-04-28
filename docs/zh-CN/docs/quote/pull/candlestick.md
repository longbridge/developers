---
id: quote_candlestick
title: 获取标的 K 线
slug: candlestick
sidebar_position: 20
---

该接口用于获取标的的 K 线数据。

:::info
注意：本接口只能获取到最近 1000 根 K 线，如需获取较长的历史数据，请访问接口：获取标的历史 K 线。
:::

<CliCommand>
# Tesla 日 K 线（最近 100 根）
longbridge kline TSLA.US
# Apple 周 K 线
longbridge kline AAPL.US --period week
# NVDA 最近 20 根日 K
longbridge kline NVDA.US --period day --count 20
</CliCommand>

<SDKLinks module="quote" klass="QuoteContext" method="candlesticks" />

:::info

[业务指令](../../socket/biz-command)：`19`

:::

## Request

### Parameters

| Name          | Type   | Required | Description                                                                  |
| ------------- | ------ | -------- | ---------------------------------------------------------------------------- |
| symbol        | string | 是       | 标的代码，使用 `ticker.region` 格式，例如：`700.HK`                          |
| period        | int32  | 是       | k 线周期，例如：`1000`，详见 [Period](../objects#period---k-线周期)          |
| count         | int32  | 是       | 数据数量，例如：`100`<br /><br />**校验规则：** <br />请求数量最大为 `1000`  |
| adjust_type   | int32  | 是       | 复权类型，例如：`0`，详见 [AdjustType](../objects#adjusttype---k-线复权类型) |
| trade_session | int32  | 否       | 交易时段，0: 盘中，100: 所有（盘前，盘中，盘后，夜盘）<br/><br/>注意：夜盘数据需购买「LV1 实时行情 (OpenAPI)」行情卡，且仅支持美股 |

### Protobuf

```protobuf
message SecurityCandlestickRequest {
  string symbol = 1;
  Period period = 2;
  int32 count = 3;
  AdjustType adjust_type = 4;
  int32 trade_session = 5;
}
```

### Request Example

<Tabs groupId="request-example">
  <TabItem value="python" label="Python" default>

```python
from longbridge.openapi import QuoteContext, Config, Period, AdjustType, TradeSessions, OAuthBuilder

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)

# 获取 700.HK 的盘中 K 线
resp = ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust)
print(resp)

# 获取 700.HK 的所有 K 线
resp = ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust, trade_session=TradeSessions.All)
```

  </TabItem>
  <TabItem value="python-async" label="Python (async)">

```python
import asyncio
from longbridge.openapi import AsyncQuoteContext, Config, Period, AdjustType, TradeSessions, OAuthBuilder

async def main() -> None:
    oauth = await OAuthBuilder("your-client-id").build_async(lambda url: print("Visit:", url))
    config = Config.from_oauth(oauth)
    ctx = AsyncQuoteContext.create(config)

    # 获取 700.HK 的盘中 K 线
    resp = await ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust)
    print(resp)

    # 获取 700.HK 的所有 K 线
    resp = await ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust, trade_session=TradeSessions.All)

if __name__ == "__main__":
    asyncio.run(main())
```

  </TabItem>
  <TabItem value="nodejs" label="Node.js">

```javascript
const { Config, QuoteContext, OAuth, Period, AdjustType, TradeSessions } = require('longbridge')

async function main() {
  const oauth = await OAuth.build("your-client-id", (_, url) => { console.log("Open this URL to authorize: " + url) })
  const config = Config.fromOAuth(oauth)
  const ctx = QuoteContext.new(config)
  const resp = await ctx.candlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust, TradeSessions.Intraday)
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
            Candlestick[] resp = ctx.getCandlesticks("700.HK", Period.Day, 10, AdjustType.NoAdjust, TradeSessions.Intraday).get();
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

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let oauth = OAuthBuilder::new("your-client-id").build(|url| println!("Open this URL to authorize: {url}")).await?;
    let config = Arc::new(Config::from_oauth(oauth));
    let (ctx, _) = QuoteContext::new(config);
    let resp = ctx.candlesticks("700.HK", Period::Day, 10, AdjustType::NoAdjust, TradeSessions::Intraday).await?;
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

    ctx.candlesticks("700.HK", Period::Day, 10, AdjustType::NoAdjust, TradeSessions::Intraday, [](auto res) {
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
	sticks, err := qctx.Candlesticks(context.Background(), "700.HK", quote.PeriodDay, 10, quote.AdjustTypeNo)
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
| symbol          | string   | 标的代码，例如：`AAPL.US`                                         |
| candlesticks    | object[] | K 线数据                                                          |
| ∟ close         | string   | 当前周期收盘价                                                    |
| ∟ open          | string   | 当前周期开盘价                                                    |
| ∟ low           | string   | 当前周期最低价                                                    |
| ∟ high          | string   | 当前周期最高价                                                    |
| ∟ volume        | int64    | 当前周期成交量                                                    |
| ∟ turnover      | string   | 当前周期成交额                                                    |
| ∟ timestamp     | int64    | 当前周期的时间戳                                                  |
| ∟ trade_session | int32    | 交易時段，详见 [TradeSession](../objects#tradesession---交易时段) |

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

## 错误码

| 协议错误码 | 业务错误码 | 描述           | 排查建议                                                                 |
| ---------- | ---------- | -------------- | ------------------------------------------------------------------------ |
| 3          | 301600     | 无效的请求     | 请求参数有误或解包失败                                                   |
| 3          | 301606     | 限流           | 降低请求频次                                                             |
| 7          | 301602     | 服务端内部错误 | 请重试或联系技术人员处理                                                 |
| 7          | 301600     | 请求数据非法   | 检查请求的 `symbol`，`count`，`adjust_type`, `period` 数据是否在正确范围 |
| 7          | 301603     | 标的无行情     | 标的没有请求的行情数据                                                   |
| 7          | 301604     | 无权限         | 没有获取标的行情的权限                                                   |
| 7          | 301607     | 接口限制       | 请求的数据数量超限，减少数据数量                                         |
