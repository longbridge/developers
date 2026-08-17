---
id: push_candlestick
title: K 线
slug: /quote/push/candlestick
sidebar_position: 9
---

已订阅标的的实时 K 线数据推送。回调在当前 K 线更新时触发（Realtime 模式）或在一根 K 线周期结束时触发（Confirmed 模式）。

:::tip

本页介绍的是**推送** API（`subscribe_candlesticks`）。如需按需拉取历史 K 线数据，请参见 [K 线 - 拉取](/quote/stocks/candlestick)。

:::

<QuotePermission command="candlesticks" />

<SDKLinks module="quote" klass="QuoteContext" method="set_on_candlestick" go="OnCandlestick" />

:::info

[业务指令](../../socket/protocol/push)：`105`

:::

## 数据格式

### Properties

| Name                | Type     | Description                                                                              |
|---------------------|----------|------------------------------------------------------------------------------------------|
| symbol              | string   | 标的代码，例如：`AAPL.US`                                                                |
| period              | int32    | K 线周期，详见 [Period](../objects#period---candlestick-period)                          |
| candlestick         | object   | K 线数据                                                                                 |
| ∟ close             | string   | 收盘价                                                                                   |
| ∟ open              | string   | 开盘价                                                                                   |
| ∟ high              | string   | 最高价                                                                                   |
| ∟ low               | string   | 最低价                                                                                   |
| ∟ volume            | int64    | 成交量                                                                                   |
| ∟ turnover          | string   | 成交额                                                                                   |
| ∟ timestamp         | int64    | K 线时间（Unix 时间戳）                                                                  |
| ∟ trade_session     | int32    | 交易时段，详见 [TradeSession](../objects#tradesession---交易时段)                        |

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
