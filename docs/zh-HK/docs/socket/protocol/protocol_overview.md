---
title: 協議概覽
id: protocol-overview
slug: /socket/protocol/overview
sidebar_position: 0
---

我們使用二進制的私有協議進行數據交互，協議同時支持 `WebSocket` 和 `TCP` 連接。

:::info
使用的字節序是 `BigEndian`
:::

如果是 `Python` 和 `C++` 用戶可以直接使用我們的 [SDK](https://open.longbridge.com/zh-HK/sdk)，不用關具體的實現細節。

如果想要自己實現協議解析，可以參考我們的 [Go 實現](https://github.com/longbridge/openapi-protocol/tree/main/go)。

業務的 `WebSocket` 和 `TCP` 接入地址可以查看[業務地址](../hosts)

在開始協議解析前我們需要先了解[通信過程](./connect)，這裏我們將通信分爲三類：

- 握手 - 建立連接
- 請求響應 - 請求和響應一對一
- 推送 - 一端向另一端發送數據，無需響應

根據上面的通信模型，我們可以將我們傳遞的數據包分爲四類：

- [握手包](./handshake)
- [請求包](./request)
- [響應包](./response)
- [推送包](./push)

我們的業務數據都存放在數據包內的 `body` 部分，目前使用 [`Protobuf`](https://developers.google.com/protocol-buffers) 作爲 `body` 的序列化方法。

> `Protobuf` 同時滿足了可表達性、快速、數據緊湊的特點。

具體的業務數據的 `Protobuf` 定義可以在瞭解協議解析後查看：

- [控制指令](../control-command)
- [業務指令](../biz-command)
