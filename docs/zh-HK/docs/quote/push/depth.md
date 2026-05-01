---
id: push_depth
title: 實時盤口推送
slug: depth
sidebar_position: 2
---

已訂閱標的的實時盤口數據推送。

<QuotePermission level="lv2" />

<SDKLinks module="quote" klass="QuoteContext" method="set_on_depth" go="OnDepth" />

:::info

[業務指令](../../socket/protocol/push)：`102`

:::

## 數據格式

### Properties

| Name        | Type     | Description             |
|-------------|----------|-------------------------|
| symbol      | string   | 標的代碼，例如：`AAPL.US` |
| sequence    | int64    | 序列號                  |
| ask         | object[] | 賣盤                    |
| ∟ position  | int32    | 檔位                    |
| ∟ price     | string   | 價格                    |
| ∟ volume    | int64    | 掛單量                  |
| ∟ order_num | int64    | 訂單數量                |
| bid         | object[] | 買盤                    |
| ∟ position  | int32    | 檔位                    |
| ∟ price     | string   | 價格                    |
| ∟ volume    | int64    | 掛單量                  |
| ∟ order_num | int64    | 訂單數量                |

### Protobuf

```protobuf
message PushDepth {
  string symbol = 1;
  int64 sequence = 2;
  repeated Depth ask = 3;
  repeated Depth bid = 4;
}

message Depth {
  int32 position = 1;
  string price = 2;
  int64 volume = 3;
  int64 order_num = 4;
}
```

### Example

```python
from time import sleep
from longbridge.openapi import QuoteContext, Config, SubType, PushQuote, OAuthBuilder

def on_depth(symbol: str, event: PushDepth):
    print(symbol, event)

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_depth(on_depth)

ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Depth])
sleep(30)
```

### JSON Example

```json
{
  "symbol": "700.HK",
  "sequence": 160808750000000,
  "ask": [
    {
      "position": 1,
      "price": "335.000",
      "volume": 500,
      "order_num": 1
    },
    {
      "position": 2,
      "price": "335.200",
      "volume": 400,
      "order_num": 1
    },
    {
      "position": 3,
      "price": "335.400",
      "volume": 500,
      "order_num": 2
    },
    {
      "position": 4,
      "price": "335.600",
      "volume": 1200,
      "order_num": 3
    },
    {
      "position": 5,
      "price": "335.800",
      "volume": 14000,
      "order_num": 8
    }
  ],
  "bid": [
    {
      "position": 1,
      "price": "334.800",
      "volume": 69400,
      "order_num": 13
    },
    {
      "position": 2,
      "price": "334.600",
      "volume": 266600,
      "order_num": 27
    },
    {
      "position": 3,
      "price": "334.400",
      "volume": 61300,
      "order_num": 29
    },
    {
      "position": 4,
      "price": "334.200",
      "volume": 125900,
      "order_num": 31
    },
    {
      "position": 5,
      "price": "334.000",
      "volume": 194600,
      "order_num": 94
    }
  ]
}
```
