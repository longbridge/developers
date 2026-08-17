---
title: 通信过程
id: socket-protocol-connect
slug: /socket/protocol/connect
sidebar_position: 1
---

客户端在和服务端交互时，会有三种数据包类型：

- 握手 - 建立连接
- 请求 - 客户端向服务端发起请求
- 响应 - 服务端向客户端响应请求
- 推送 - 服务端向客户端推送数据

## 握手

```mermaid
sequenceDiagram
client ->> server: 1. handshake
server ->> server: 1.1 check handshake

alt handshake invalid
server --x client: 2. disconnect
else is valid
server -->> client: 2. build connection
end

```

客户端向服务端发送握手包后，链接就建立了，服务端会判断握手包是否合法，不合法则发送一个错误包，并且断开底层连接。如果链接的是 TCP 服务端可以同时发送握手包和第一个数据包。

## 请求与响应

协议支持，`请求 <--> 响应` 的通信方式，即客户端发送一个请求，服务端返回一个响应。

```mermaid
sequenceDiagram
autonumber
par request 1
client -->> server: request, req_id: 1
server -->> client: response, req_id: 1
end

par request 100
client -->> server: request, req_id: 100
server -->> client: response: req_id: 100
end

par request n
client -->> server: request, req_id: n
server -->> client: response, req_id: n
end

```

客户端和服务端握手成功后，双方就可以进行 `请求 <--> 响应` 的通信，请求和响应通过请求 `id` 进行关联。

## 推送

推送是一端向另一端直接推送数据而不需要另一端响应。

> 目前仅存在服务端向客户端推送数据的场景。

```mermaid
sequenceDiagram
server -->> client: push, data 1

server -->> client: push, data 2
```
