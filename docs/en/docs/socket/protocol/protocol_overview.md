---
title: Protocol Overview
id: protocol-overview
slug: /socket/protocol/overview
sidebar_position: 0
---

We use binary format data for communication, protocol support both `WebSocket` and `TCP`.

:::info
Endianness is `BigEndian`
:::

If your are familiar with `Python` or `C++`, we provider [SDK](https://open.longbridge.com/en/sdk) for you.

If you want parse protocol by self, you can check our [Go Implemetation](https://github.com/longbridge/openapi-protocol/tree/main/go).

The endponts of `WebSocket` and `TCP` can be found [here](../hosts).

Before start parse protocol, you should know our [Communication Model](./connect), we split to three type of communication:

- Handshake - For establishing connection
- Request and Response - Pairing data packet for handle api request
- Push - One peer send data to another, no need response

Depends on communication model, there are out typs of packet:

- [Handkeshake](./handshake)
- [Request](./request)
- [Response](./response)
- [Push](./push)

Data is in the `body` of the packet, current we only support [`Protobuf`](https://developers.google.com/protocol-buffers) for codec.

`Protobuf` definition can be found in:

- [Control command](../control-command)
- [Data command](../biz-command)
