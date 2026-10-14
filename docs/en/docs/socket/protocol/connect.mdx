---
title: Communication Model
id: socket-protocol-connect
slug: /socket/protocol/connect
sidebar_position: 1
---

There are three type packet will client and server send to each other:

- handshake - start establish connection
- request - client send request to server
- response - server send response to client
- push - server push real-time data to client

## Handshake

Flow:

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

After client sending handshake packet server, the connection has been established. If handshake packet is invalid, server will push a close data to client. If access by `TCP`, client can send handshake packet and first data packet(auth) for accelerating communication.

## Request and Response

`Request <--> Response`: Client send a request packet, server will send back a response packet.

Flow:

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

After client and server sucess handshaking, peers can use `Request <--> Response` to communicate. `Request` and `Response` are paired by `request_id`.

> Client and Server can send heartbeat request to each other.

## Push

Push is one peer send data to another peer, and no need response.

```mermaid
sequenceDiagram
server -->> client: push, data 1

server -->> client: push, data 2
```

> Right now, we only support server push data to client.
