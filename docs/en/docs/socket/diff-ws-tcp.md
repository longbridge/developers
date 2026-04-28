---
title: Access differences between WebSocket and TCP
id: diff-ws-tcp
slug: /socket/diff_ws_tcp
sidebar_position: 6
---

Longbridge support `WebSocket` and `TCP` feed, the differences:

- Data of `TCP` is streaming, so coding client is hard than `WebSocket`.
- `WebSocket` using URL Query to [Handshake](./protocol/handshake#websocket-how-to-handshake)
- `WebSocket` using [ping-pong](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#pings_and_pongs_the_heartbeat_of_websockets) to do Heartbeating, instead of sending heartbeat packet.
- `WebSocket` using `TLS` to secure connection, but `TCP` do not.

User can choice `TCP` or `WebSocket` on self demand.

> Advice: Using `WebSocket` first, it is more simple. If want more quick stock quote real-time pushing, using `TCP` to access stock quote gateway.
