---
id: push_quote
title: 實時價格推送
slug: quote
sidebar_position: 1
---

已訂閱標的的實時價格推送，推送的數據結構中，只有有變化的字段才會填充數據。

<QuotePermission level="basic" />

<SDKLinks module="quote" klass="QuoteContext" method="set_on_quote" go="OnQuote" />

:::info

[業務指令](../../socket/protocol/push)：`101`

:::

## 數據格式

### Properties

| Name             | Type   | Description                                                                          |
|------------------|--------|--------------------------------------------------------------------------------------|
| symbol           | string | 標的代碼，例如：`AAPL.US`                                                              |
| sequence         | int64  | 序列號                                                                               |
| last_done        | string | 最新價                                                                               |
| open             | string | 開盤價                                                                               |
| high             | string | 最高價                                                                               |
| low              | string | 最低價                                                                               |
| timestamp        | int64  | 最新成交的時間戳                                                                     |
| volume           | int64  | 成交量                                                                               |
| turnover         | string | 成交額                                                                               |
| trade_status     | int32  | 交易狀態，詳見 [TradeStatus](../objects#tradestatus---交易狀態)                       |
| trade_session    | int32  | 交易時段，詳見 [TradeSession](../objects#tradesession---交易時段)                     |
| current_volume   | int32  | 兩次推送之間增加的成交量                                                             |
| current_turnover | string | 兩次推送之間增加的成交額                                                             |
| tag              | int32  | 價格數據標籤 <br /><br />**可选值：**<br />`0` - 實時行情<br />`1` - 收盤後的修正數據 |

### Protobuf

```protobuf
message PushQuote {
  string symbol = 1;
  int64 sequence = 2;
  string last_done = 3;
  string open = 4;
  string high = 5;
  string low = 6;
  int64 timestamp = 7;
  int64 volume = 8;
  string turnover = 9;
  TradeStatus trade_status = 10;
  TradeSession trade_session = 11;
}
```

### Example

```python
from time import sleep
from longbridge.openapi import QuoteContext, Config, SubType, PushQuote, OAuthBuilder

def on_quote(symbol: str, event: PushQuote):
    print(symbol, event)

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_quote(on_quote)

ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Quote])
sleep(30)
```

### JSON Example

```json
{
  "symbol": "AAPL.US",
  "sequence": 160808750000000,
  "last_done": "156.570",
  "open": "155.910",
  "high": "159.790",
  "low": "155.380",
  "timestamp": 1651089600,
  "volume": 88063191,
  "turnover": "13865092584.000",
  "trade_status": 0,
  "trade_session": 0,
  "current_volume": 111234,
  "current_turnover": "23234343454.000",
  "tag": 0
}
```
