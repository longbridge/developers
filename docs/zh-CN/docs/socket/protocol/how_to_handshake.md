---
title: 解析握手包
id: how-to-handshake
slug: /socket/protocol/handshake
sidebar_position: 2
---

握手是客户端和服务端建立连接后做的第一件事情，用于和服务端进行协议的协商，目前支持协商的内容如下：

- 协议版本 - 目前我们仅支持一个版本，即：`1`
- 数据包序列化方式 - 目前我们仅支持 `protobuf`，值：`1`
- 客户端平台 - 目前仅为 `OpenAPI`，目前值为：`9`

所以客户端握手包在我们的协议版本升级的情况下永远是一个固定的内容。

## TCP 链接如何握手

客户端发向服务端发送 2 个字节的握手包。

### 结构

```
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  ver  | codec |
+-+-+-+-+-+-+-+-+
|platfo.|reserve|
+-+-+-+-+-+-+-+-+
```

| 字段     | 长度 (bit) | 说明                          |
| -------- | ---------- | ----------------------------- |
| ver      | 4          | 协议版本，目前仅 `1` 一个版本 |
| codec    | 4          | Body 序列化类型：1 - protobuf |
| platform | 4          | 0b1001 - OpenAPI              |
| reserve  | 4          | 预留，当前为 0b0000           |

### 例子

- ver - 0b0001
- codec - 0b0001
- platform - 0b1001
- reserve - 0b0000

两个字节的内容：

```
0b00010001,
0b00001001
```

## WebSocket 链接如何握手

WebSocket 在从 HTTP 升级升 WebSocket 的过程中，我们可以读取 HTTP 请求的相关信息，我们这里通过 URL query 进行握手

### Query 参数

| 字段     | 类型 | 说明      |
| -------- | ---- | --------- |
| version  | int  | 仅支持：1 |
| codec    | int  | 仅支持：1 |
| platform | int  | 默认：9   |

### 例子

```
wss://openapi-quote.longbridge.com?version=1&codec=1&platform=9
```
