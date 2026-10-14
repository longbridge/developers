---
id: push_candlestick
title: K 線
slug: /quote/push/candlestick
sidebar_position: 9
---

訂閱的標的的實時 K 線數據推送。回調在當前 K 線更新時觸發（Realtime 模式）或在一根 K 線週期結束時觸發（Confirmed 模式）。

:::tip

本頁介紹的是**推送** API（`subscribe_candlesticks`）。如需按需拉取歷史 K 線數據，請參見 [K 線 - 拉取](/quote/stocks/candlestick)。

:::

<QuotePermission command="candlesticks" />

<SDKLinks module="quote" klass="QuoteContext" method="set_on_candlestick" go="OnCandlestick" />

:::info

[業務指令](../../socket/protocol/push)：`105`

:::

## 數據格式

### Properties

| Name                | Type     | Description                                                                              |
|---------------------|----------|------------------------------------------------------------------------------------------|
| symbol              | string   | 標的代碼，例如：`AAPL.US`                                                                |
| period              | int32    | K 線週期，詳見 [Period](../objects#period---candlestick-period)                          |
| candlestick         | object   | K 線數據                                                                                 |
| ∟ close             | string   | 收盤價                                                                                   |
| ∟ open              | string   | 開盤價                                                                                   |
| ∟ high              | string   | 最高價                                                                                   |
| ∟ low               | string   | 最低價                                                                                   |
| ∟ volume            | int64    | 成交量                                                                                   |
| ∟ turnover          | string   | 成交額                                                                                   |
| ∟ timestamp         | int64    | K 線時間（Unix 時間戳）                                                                  |
| ∟ trade_session     | int32    | 交易時段，詳見 [TradeSession](../objects#tradesession---交易時段)                        |

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
