---
id: trade_push
title: 交易推送
slug: trade-push
sidebar_position: 6
---

客户端可以通过交易长连接网关获取到交易和资产的变更通知。

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

## 订阅

<SDKLinks :title="false" module="trade" klass="TradeContext" method="subscribe" />

:::info
指令：`16`
:::

我们可以通过 `subscribe` 方法订阅交易推送，订阅成功后，服务端会将相应的推送消息推送给客户端，SDK 的 `set_on_order_changed` 可以设置推送消息的回调函数，当收到交易推送消息时，会调用该回调函数。

Protobuf 定义如下：

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
  repeated string success = 1; // 订阅成功
  repeated Fail fail = 2; // 订阅失败
  repeated string current = 3;  // 当前订阅
}
```

目前支持的 topic：

- private - 交易和资产类的私有通知

## 取消订阅

取消订阅用于取消订阅信息，如前面 `subscribe` 订阅成功后，可以通过 `unsubscribe` 函数来取消订阅。

<SDKLinks :title="false" module="trade" klass="TradeContext" method="unsubscribe" />

:::info
指令：`17`
:::

Protobuf 定义如下：

```protobuf
// Unsub is Unsub command content, command is 17
message Unsub {
  repeated string topics = 1;
}

// UnsubResponse is response of Unsub request
message UnsubResponse {
  repeated string current = 3; // 当前订阅
}
```

## 注册通知推送

我们可以通过 `set_on_order_changed` 方法（Go 里面为 `OnTrade`）设置推送消息的回调函数，当收到交易推送消息时，会调用该回调函数。

<SDKLinks :title="false" module="trade" klass="TradeContext" method="set_on_order_changed" go="OnTrade" />

:::info
指令：`18`
:::

Protobuf 定义如下：

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

## 网格订单推送

网格主订单的变更与普通订单变更走**同一个 `private` 主题**。订阅 private 主题后，当网格主订单发生变更（创建、挂起、重启、触发、撤销等）时，交易网关会推送 `gridtrading_order` 事件。设置网格订单变更回调即可接收。

<SDKLinks :title="false" module="trade" klass="TradeContext" method="set_on_grid_order_changed" java="setOnGridOrderChange" hideGo />

事件包含以下字段：

| 名称 | 类型 | 说明 |
| ---- | ---- | ---- |
| order_id | string | 网格主订单 ID |
| status | string | 订单状态 |
| symbol | string | 标的代码（如 `700.HK`） |
| suspend_reason | string | 挂起原因（如有） |
| submitted_base_price | string | 提交时的基准价 |
| current_base_price | string | 当前基准价 |
| upper_limit_price | string | 价格上限 |
| lower_limit_price | string | 价格下限 |
| trigger_price_type | int32 | `1` = 价差，`2` = 百分比 |
| trigger_quantity | string | 每次触发数量 |
| settlement_currency | string | 结算币种 |
| time_in_force | int32 | `0` = 当日，`1` = GTC，`6` = GTD |
| rth | int32 | 盘中交易时段标记 |
| grid_order_type_up | string | 深度为 0 时的卖出订单类型 |
| grid_order_type_down | string | 深度为 0 时的买入订单类型 |
