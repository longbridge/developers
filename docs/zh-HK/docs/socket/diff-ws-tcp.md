---
title: WebSocket 和 TCP 接入的不同點
id: diff-ws-tcp
slug: /socket/diff_ws_tcp
sidebar_position: 6
---

我們同時支持 `WebSocket` 和 `TCP` 的接入，不同點主要如下：

- TCP 數據是流式的，客戶端編寫難度比 WebSocket 要大
- `WebSocket` 握手包通過 [URL Query 發送](./protocol/handshake#websocket-鏈接如何握手)
- `WebSocket` 的 [心跳](./control-command#心跳) 通過 `WebSocket` 協議本身的心跳 `Ping-Pong` 進行
- `WebSocket` 通信使用 `TLS` 進行加密，而 `TCP` 暫時沒有

可以根據自己的需求選擇，我們的私有協議時適用於兩者的。

> 可以都先使用 `WebSocket` 接入，較方便。如果對速度有更高的要求，行情可以接入 `TCP`。
