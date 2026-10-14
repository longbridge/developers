---
title: 订阅交易推送
id: how-to-subscribe-trade
slug: /socket/subscribe_trade
sidebar_position: 1
---

客户端可以通过 WebSocket 或者 TCP 和交易推送网关建立长连接，当订单状态更新时，客户端可以实时的接收通知。

:::info
WebSocket Endpoint: `wss://openapi-trade.longbridge.com`

TCP Endpoint: `openapi-trade.longbridge.com`
:::

流程如下：

```mermaid
sequenceDiagram
autonumber
Client ->> Server: 握手
Server -->> Client: 链接建立
Client -->> Server: 登录鉴权
Server -->> Client: 返回登录鉴权结果

par 订阅
Client -->> Server: 订阅行情请求，req_id: 10, cmd: 16
Server -->> Client: 返回订阅行情响应，req_id: 10, cmd: 16

Server -->> Client: 实时订单变更推送，cmd: 18
Server -->> Client: 实时订单变更推送，cmd: 18

end

```

## 订阅

订阅的 Protobuf 定义可以[查看](../trade/trade-push)

Example:

```json
{
  "topics": ["private"]
}
```

> 这里方便展示使用 `JSON`，实际上需要通过 protobuf 序列化请求到服务端

## 推送例子

```json
{
  "topic": "private",
  "content_type": 2,
  "dispatch_type": 1,
  "data": "eyJldmVudCI6Im9yZGVyX2NoYW5nZWRfbGIiLCJkYXRhIjp7InNpZGUiOiJCdXkiLCJzdG9ja19uYW1lIjoi6IW+6K6v5o6n6IKhIiwicXVhbnRpdHkiOiIxMDAwIiwic3ltYm9sIjoiNzAwLkhLIiwib3JkZXJfdHlwZSI6IkxPIiwicHJpY2UiOiIyMTMuMiIsImV4ZWN1dGVkX3F1YW50aXR5IjoiMTAwMCIsImV4ZWN1dGVkX3ByaWNlIjoiMjEzLjIiLCJvcmRlcl9pZCI6IjI3IiwiY3VycmVuY3kiOiJIS0QiLCJzdGF0dXMiOiJOZXdTdGF0dXMiLCJzdWJtaXR0ZWRfYXQiOiIxNTYyNzYxODkzIiwidXBkYXRlZF9hdCI6IjE1NjI3NjE4OTMiLCJ0cmlnZ2VyX3ByaWNlIjoiMjEzLjAiLCJtc2ciOiJJbnN1ZmZpY2llbnQgUXR5IC0gMTAwMCIsInRhZyI6IkdUQyIsInRyaWdnZXJfc3RhdHVzIjoiQUNUSVZFIiwidHJpZ2dlcl9hdCI6IjE1NjI3NjE4OTMiLCJ0YWlsaW5nX2Ftb3VudCI6IjUiLCJ0YWlsaW5nX3BlcmNlbnQiOiIxIiwibGltaXRfb2Zmc2V0IjoiMC4wMSIsImFjY291bnRfbm8iOiJISzEyMzQ0NSJ9fQ=="
}
```

:::info
`data` 是 `JSON` 字符串的二进制内容 (Base64)
:::

`data` 的实际 `JSON` 内容如下

```json
{
  "event": "order_changed_lb",
  "data": {
    "side": "Buy",
    "stock_name": "腾讯控股",
    "quantity": "1000",
    "symbol": "700.HK",
    "order_type": "LO",
    "price": "213.2",
    "executed_quantity": "1000",
    "executed_price": "213.2",
    "order_id": "27",
    "currency": "HKD",
    "status": "NewStatus",
    "submitted_at": "1562761893",
    "updated_at": "1562761893",
    "trigger_price": "213.0",
    "msg": "Insufficient Qty - 1000",
    "tag": "GTC",
    "trigger_status": "ACTIVE",
    "trigger_at": "1562761893",
    "trailing_amount": "5",
    "trailing_percent": "1",
    "limit_offset": "0.01",
    "account_no": "HK123445",
    "last_share": "100",
    "last_price": "234",
    "remark": "abc"
  }
}
```

字段解释可以查看[交易命名词典-WebSocket 推送通知](../trade/trade-definition#websocket-推送通知)

## 协议

我们使用的长连接[协议](./protocol/overview)
