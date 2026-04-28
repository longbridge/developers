---
title: Parse Handshake
id: how-to-handshake
slug: /socket/protocol/handshake
sidebar_position: 2
---

Handshake is first thing before client and server establish connection. Handshake negotiate thress things:

- protocol version - right now only version `1`
- data codec type - right now only support `protobuf`, value is `1`
- client platform - value is `9` as `OpenAPI`

So handshake is always fixed contents.

## How `TCP` do handshaking

Client need send two bytes handshake to server.

### Data structure

```
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  ver  | codec |
+-+-+-+-+-+-+-+-+
|platfo.|reserve|
+-+-+-+-+-+-+-+-+
```

Fields Explain:

| field    | length in bit | description                               |
| -------- | ------------- | ----------------------------------------- |
| ver      | 4             | protocol version: only value `1`          |
| codec    | 4             | data codec: only value `1` for `protobuf` |
| platform | 4             | client platform: 0b1001 - OpenAPI         |
| reserve  | 4             | reserved                                  |

### Example

- ver - 0b0001
- codec - 0b0001
- platform - 0b1001
- reserve - 0b0000

Two bytes contents:

```
0b00010001,
0b00001001
```

## How `WebSocket` do handshaking

`WebSocket` send handshake info by `URL Query`

### Query Parameters

| Field    | Type | Description                               |
| -------- | ---- | ----------------------------------------- |
| version  | 4    | protocol version: only value `1`          |
| codec    | 4    | data codec: only value `1` for `protobuf` |
| platform | 4    | client platform: `9` - OpenAPI            |

### Example

```
wss://openapi-quote.longbridge.com?version=1&codec=1&platform=9
```
