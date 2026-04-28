---
title: 协议概览
id: protocol-overview
slug: /socket/protocol/overview
sidebar_position: 0
---

我们使用二进制的私有协议进行数据交互，协议同时支持 `WebSocket` 和 `TCP` 连接。

:::info
使用的字节序是 `BigEndian`
:::

如果是 `Python` 和 `C++` 用户可以直接使用我们的 [SDK](https://open.longbridge.com/sdk)，不用关心具体的实现细节。

如果想要自己实现协议解析，可以参考我们的 [Go 实现](https://github.com/longbridge/openapi-protocol/tree/main/go)。

业务的 `WebSocket` 和 `TCP` 接入地址可以查看[业务地址](../hosts)

在开始协议解析前我们需要先了解[通信过程](./connect)，这里我们将通信分为三类：

- 握手 - 建立连接
- 请求响应 - 请求和响应一对一
- 推送 - 一端向另一端发送数据，无需响应

根据上面的通信模型，我们可以将我们传递的数据包分为四类：

- [握手包](./handshake)
- [请求包](./request)
- [响应包](./response)
- [推送包](./push)

我们的业务数据都存放在数据包内的 `body` 部分，目前使用 [`Protobuf`](https://developers.google.com/protocol-buffers) 作为 `body` 的序列化方法。

> `Protobuf` 同时满足了可表达性、快速、数据紧凑的特点。

具体的业务数据的 `Protobuf` 定义可以在了解协议解析后查看：

- [控制指令](../control-command)
- [业务指令](../biz-command)
