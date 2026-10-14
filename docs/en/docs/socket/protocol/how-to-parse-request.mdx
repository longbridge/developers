---
title: Parse Request Packet
id: how-to-parse-request
slug: /socket/protocol/request
sidebar_position: 4
---

Request packet is used for invoke apis: send api request and get api response.

:::info
Packet type is `1`
:::

Structure：

```
  0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| type=1|v|g|re.|    cmd_code   |           request_id          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                               |            timeout            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    body_len                   |               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+               +
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

| Field      | Length in bit                         | Length in byte  | description                                                                                                |
| ---------- | ------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------- |
| cmd_code   | 8                                     | 1               | Command                                                                                                    |
| request_id | 32(uint32)                            | 4               | Request id, it should be unique for one connection.<br/>Can start from 1, when reach 4294967295 start over |
| timeout    | 16(uint16)                            | 2               | `timeout` in millisecond <br/>max: 60000(60s)                                                              |
| body_len   | 24(uint32)                            | 3               | Then length of `body` in bytes. <br/> Max: 16 MB<br/> If gzip is enabled, the value is after compress      |
| body       | Variable length, decide by `body_len` | variable length | `body`，max size: 16 MB                                                                                    |
| nonce      | 64                                    | 8               | exists when `verify` is `1`                                                                                |
| signature  | 128                                   | 16              | exists when `verify` is `1`                                                                                |

:::info
Using specific protobuf defination to encode/decode body data
:::
