---
id: trade_push
title: Trade Push
slug: trade-push
sidebar_position: 6
---

Client can get real-time trade updates from trade gateway.

## Example

```python
from time import sleep
from decimal import Decimal
from longbridge.openapi import TradeContext, Config, OrderSide, OrderType, TimeInForceType, PushOrderChanged, TopicType, OAuthBuilder

def on_order_changed(event: PushOrderChanged):
    print(event)

oauth = OAuthBuilder("your-client-id").build(lambda url: print("Visit:", url))
config = Config.from_oauth(oauth)
ctx = TradeContext(config)
ctx.set_on_order_changed(on_order_changed)
ctx.subscribe([TopicType.Private])

resp = ctx.submit_order(
    side=OrderSide.Buy,
    symbol="700.HK",
    order_type=OrderType.LO,
    submitted_price=Decimal(50),
    submitted_quantity=Decimal(200),
    time_in_force=TimeInForceType.Day,
    remark="Hello from Python SDK",
)
print(resp)
sleep(5)  # waiting for push event

# Finally, unsubscribe
ctx.unsubscribe([TopicType.Private])
```

## Subscribe

<SDKLinks :title="false" module="trade" klass="TradeContext" method="subscribe" />

:::info
Cmd: `16`
:::

Protobuf definition:

```protobuf
// Sub is Sub command content, command is 16
message Sub {
  repeated string topics = 1;
}

// SubResponse is response of Sub Request
message SubResponse {
  message Fail {
    string topic = 1;
    string reason = 2;
  }
  repeated string success = 1; // success topics
  repeated Fail fail = 2; // failed topics
  repeated string current = 3;  // curent subscriptions after subscribe
}
```

Current support topics:

- private - private notification for trade

## Cancel Subscribe

<SDKLinks :title="false" module="trade" klass="TradeContext" method="unsubscribe" />

:::info
Cmd: `17`
:::

Protobuf defination:

```protobuf
// Unsub is Unsub command content, command is 17
message Unsub {
  repeated string topics = 1;
}

// UnsubResponse is response of Unsub request
message UnsubResponse {
  repeated string current = 3; // current subscriptions after cancel subscribe
}
```

## Push Notification

After we `subscribe` to the trade gateway, we can get real-time trade updates from the trade gateway. The trade gateway will push the corresponding push message to the client. The SDK's `set_on_order_changed` (In Go is: `OnTrade`) can set the callback function of the push message. When the client receives the trade push message, the callback function will be called.

<SDKLinks :title="false" module="trade" klass="TradeContext" method="set_on_order_changed" go="OnTrade" />

:::info
Cmd: `18`
:::

Protobuf defination:

```protobuf
// Dispatch type
enum DispatchType {
  DISPATCH_UNDEFINED = 0;
  DISPATCH_DIRECT = 1;
  DISPATCH_BROADCAST = 2;
}

enum ContentType {
  CONTENT_UNDEFINED = 0;
  CONTENT_JSON = 1;
  CONTENT_PROTO = 2;
}

// Notification is push message, command is 18
message Notification {
  string topic = 1;
  ContentType content_type = 2;
  DispatchType dispatch_type = 3;
  bytes data = 4;
}
```

## Grid Order Changes

Grid trading master-order changes are delivered on the **same `private` topic** as regular order changes. After you `subscribe` to the private topic, the trade gateway pushes a `gridtrading_order` event whenever a grid master order changes (created, suspended, restarted, triggered, or canceled). Set the grid order changed callback to receive them.

<SDKLinks :title="false" module="trade" klass="TradeContext" method="set_on_grid_order_changed" java="setOnGridOrderChange" hideGo />

The event carries the following fields:

| Name | Type | Description |
| ---- | ---- | ---- |
| order_id | string | Grid master order ID |
| status | string | Order status |
| symbol | string | Security symbol (e.g. `700.HK`) |
| suspend_reason | string | Suspend reason, if any |
| submitted_base_price | string | Submitted base price |
| current_base_price | string | Current base price |
| upper_limit_price | string | Upper price bound |
| lower_limit_price | string | Lower price bound |
| trigger_price_type | int32 | `1` = spread, `2` = percent |
| trigger_quantity | string | Quantity per trigger |
| settlement_currency | string | Settlement currency |
| time_in_force | int32 | `0` = Day, `1` = GTC, `6` = GTD |
| rth | int32 | Regular-trading-hours flag |
| grid_order_type_up | string | Sell-side order type when depth is 0 |
| grid_order_type_down | string | Buy-side order type when depth is 0 |
