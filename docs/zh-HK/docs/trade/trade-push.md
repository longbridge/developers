---
id: trade_push
title: 交易推播
slug: trade-push
sidebar_position: 5
---

客戶端可以透過交易長連接網關取得到交易和資產的變更通知。

## 範例

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
sleep(5) # waiting for push event

# Finally, unsubscribe

ctx.unsubscribe([TopicType.Private])
```

## 訂閱

<SDKLinks :title="false" module="trade" klass="TradeContext" method="subscribe" />

:::info
指令：`16`
:::

我們可以透過`subscribe` 方法訂閱交易推送，訂閱成功後，服務端會將對應的推播訊息推播給客戶端，SDK 的`set_on_order_changed` 可以設定推播訊息的回呼函數，當收到交易推播訊息時，會 呼叫該回調函數。

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

目前支援的 topic：

- private - 交易和資產類的私有通知

## 取消訂閱

取消訂閱用於取消訂閱訊息，如前面 `subscribe` 訂閱成功後，可以透過 `unsubscribe` 函數來取消訂閱。

<SDKLinks :title="false" module="trade" klass="TradeContext" method="unsubscribe" />

:::info
指令：`17`
:::

Protobuf 定義如下：

```protobuf
// Unsub is Unsub command content, command is 17
message Unsub {
   repeated string topics = 1;
}

// UnsubResponse is response of Unsub request
message UnsubResponse {
   repeated string current = 3; // 目前訂閱
}
```

## 註冊通知推播

我們可以透過 `set_on_order_changed` 方法（Go 裡面為 `OnTrade`）設定推播訊息的回呼函數，當收到交易推播訊息時，會呼叫該回呼函數。

<SDKLinks :title="false" module="trade" klass="TradeContext" method="set_on_order_changed" go="OnTrade" />

:::info
指令：`18`
:::

Protobuf 定義如下：

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
