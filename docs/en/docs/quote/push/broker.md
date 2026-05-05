---
id: push_broker
title: Push Real-time Brokers
slug: broker
sidebar_position: 3
---

Real-time brokers data push of the subscribed security.

<QuotePermission command="brokers" />

<SDKLinks module="quote" klass="QuoteContext" method="set_on_brokers" go="OnBrokers" />

:::info

[Business Command](../../socket/protocol/push): `103`

:::

## Data Format

### Properties

| Name         | Type     | Description                           |
|--------------|----------|---------------------------------------|
| symbol       | string   | Security code, for example: `AAPL.US` |
| sequence     | int64    | Sequence number                       |
| ask_brokers  | object[] | Ask brokers                           |
| ∟ position   | int32    | Position                              |
| ∟ broker_ids | int32[]  | [Broker ID](../pull/broker-ids)       |
| bid_brokers  | object[] | Bid brokers                           |
| ∟ position   | int32    | Position                              |
| ∟ broker_ids | int32[]  | [Broker ID](../pull/broker-ids)       |

### Protobuf

```protobuf
message PushBrokers {
  string symbol = 1;
  int64 sequence = 2;
  repeated Brokers ask_brokers = 3;
  repeated Brokers bid_brokers = 4;
}

message Brokers {
  int32 position = 1;
  repeated int32 broker_ids = 2;
}
```

### Example

```python
from time import sleep
from longbridge.openapi import QuoteContext, Config, SubType, PushBrokers, OAuthBuilder

def on_brokers(symbol: str, event: PushBrokers):
    print(symbol, event)

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = QuoteContext(config)
ctx.set_on_brokers(on_brokers)

ctx.subscribe(["700.HK", "AAPL.US"], [SubType.Brokers])
sleep(30)
```

### JSON Example

```json
{
  "symbol": "700.HK",
  "sequence": 160808750000000,
  "ask_brokers": [
    {
      "position": 1,
      "broker_ids": [7358, 9057, 9028, 7364]
    },
    {
      "position": 2,
      "broker_ids": [6968, 3448, 3348, 1049, 4973, 6997, 3448, 5465, 6997]
    }
  ],
  "bid_brokers": [
    {
      "position": 1,
      "broker_ids": [6996, 5465, 8026, 8304, 4978]
    },
    {
      "position": 2,
      "broker_ids": [7358, 9057, 9028, 7364]
    }
  ]
}
```
