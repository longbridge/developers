---
title: Parse Response Packet
id: how-to-parse-response
slug: /socket/protocol/response
sidebar_position: 5
---

One peer need send back a response packet after receiving and handlding request packet.

:::info
Packet type is `2`
:::

## Structure

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| type=2|v|g|re.|    cmd_code   |           request_id          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                               |  status_code  |    body_len   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            body_len           |                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+                               +
|                       body(by body_len)                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                        nonce(optional)                        +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                      signature(optional)                      +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

Fields Descriptions:

| Field      | Length in bit                         | Length in byte  | description                                                                                           |
| ---------- | ------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| cmd_code   | 8                                     | 1               | Command                                                                                               |
| request_id | 32(uint32)                            | 4               | Request id, need to be same as request packet for pairing                                             |
| status     | 8(uint8)                              | 1               | status code: `0` - success; others show in [status code table](#status-code-table)                    |
| body_len   | 24(uint32)                            | 3               | Then length of `body` in bytes. <br/> Max: 16 MB<br/> If gzip is enabled, the value is after compress |
| body       | Variable length, decide by `body_len` | variable length | `body`，max size: 16 MB                                                                               |
| nonce      | 64                                    | 8               | exists when `verify` is `1`                                                                           |
| signature  | 128                                   | 16              | exists when `verify` is `1`                                                                           |

## Status Code Table

| value | flag                  | description                   |
| ----- | --------------------- | ----------------------------- |
| 0     | SUCCESS               | Success like HTTP status 200  |
| 1     | SERVER_TIMEOUT        | Timeout like HTTP status 408  |
| 3     | BAD_REQUEST           | Bad Request like HTTP 400     |
| 5     | UNAUTHENTICATED       | Unauthorized like HTTP 401    |
| 7     | SERVER_INTERNAL_ERROR | Internal server like HTTP 500 |
