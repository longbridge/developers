---
id: push_depth
title: 实时盘口推送
slug: depth
sidebar_position: 2
---

已订阅标的的实时盘口数据推送。

<QuotePermission command="depth" />

<SDKLinks module="quote" klass="QuoteContext" method="set_on_depth" go="OnDepth" />

:::info

[业务指令](../../socket/protocol/push)：`102`

:::

## 数据格式

### Properties

| Name        | Type     | Description             |
|-------------|----------|-------------------------|
| symbol      | string   | 标的代码，例如：`AAPL.US` |
| sequence    | int64    | 序列号                  |
| ask         | object[] | 卖盘                    |
| ∟ position  | int32    | 档位                    |
| ∟ price     | string   | 价格                    |
| ∟ volume    | int64    | 挂单量                  |
| ∟ order_num | int64    | 订单数量                |
| bid         | object[] | 买盘                    |
| ∟ position  | int32    | 档位                    |
| ∟ price     | string   | 价格                    |
| ∟ volume    | int64    | 挂单量                  |
| ∟ order_num | int64    | 订单数量                |

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
from longbridge.openapi import QuoteContext, Config, SubType, PushDepth, OAuthBuilder

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
