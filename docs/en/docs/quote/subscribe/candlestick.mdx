---
id: push_candlestick
title: Candlesticks
slug: /quote/push/candlestick
sidebar_position: 9
---

Real-time candlestick (K-line) data push for subscribed securities. The callback fires whenever the current candlestick updates (Realtime mode) or when a candlestick period closes (Confirmed mode).

:::tip

This page covers the **push** API (`subscribe_candlesticks`). To pull historical candlestick data on demand, see [Candlestick - Pull](/quote/stocks/candlestick).

:::

<QuotePermission command="candlesticks" />

<SDKLinks module="quote" klass="QuoteContext" method="set_on_candlestick" go="OnCandlestick" />

:::info

[Business Command](../../socket/protocol/push): `105`

:::

## Data Format

### Properties

| Name                | Type     | Description                                                                              |
|---------------------|----------|------------------------------------------------------------------------------------------|
| symbol              | string   | Security code, for example: `AAPL.US`                                                   |
| period              | int32    | Candlestick period, see [Period](../objects#period---candlestick-period)                 |
| candlestick         | object   | Candlestick data                                                                         |
| ∟ close             | string   | Close price                                                                              |
| ∟ open              | string   | Open price                                                                               |
| ∟ high              | string   | High price                                                                               |
| ∟ low               | string   | Low price                                                                                |
| ∟ volume            | int64    | Volume                                                                                   |
| ∟ turnover          | string   | Turnover                                                                                 |
| ∟ timestamp         | int64    | Candlestick time (Unix timestamp)                                                        |
| ∟ trade_session     | int32    | Trade session, see [TradeSession](../objects#tradesession---trading-session)             |

### Protobuf

```protobuf
message PushCandlestick {
  string symbol = 1;
  Period period = 2;
  Candlestick candlestick = 3;
}

message Candlestick {
  string close = 1;
  string open = 2;
  string high = 3;
  string low = 4;
  int64 volume = 5;
  string turnover = 6;
  int64 timestamp = 7;
  TradeSession trade_session = 8;
}
```

### Example

```python
from time import sleep
from longbridge.openapi import QuoteContext, Config, Period, PushCandlestick, OAuthBuilder

def on_candlestick(symbol: str, event: PushCandlestick):
    print(symbol, event)

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_candlestick(on_candlestick)

ctx.subscribe_candlesticks("700.HK", Period.Min_1)
sleep(30)
```

### JSON Example

```json
{
  "symbol": "700.HK",
  "period": 1,
  "candlestick": {
    "close": "162.500",
    "open": "160.000",
    "high": "163.000",
    "low": "159.800",
    "volume": 123456,
    "turnover": "19987654.000",
    "timestamp": 1651103700,
    "trade_session": 0
  }
}
```
