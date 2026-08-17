---
title: Parse Push Packet
id: how-to-parse-push
slug: /socket/protocol/push
sidebar_position: 6
---

Push is one side send data to another side, no need response.

:::info
Packet `type` value is `3`
:::

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| type=3|v|g|re.|    cmd_code   |            body_len           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  body_len     |               body(by body_len)               |
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

| Field     | length in bit                         | Length in byte  | description                                                                                           |
| --------- | ------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| cmd_code  | 8                                     | 1               | Comand                                                                                                |
| body_len  | 24(uint32)                            | 3               | Then length of `body` in bytes. <br/> Max: 16 MB<br/> If gzip is enabled, the value is after compress |
| body      | Variable length, decide by `body_len` | variable length | `body`，max size: 16 MB                                                                               |
| nonce     | 64                                    | 8               | exists when `verify` is `1`                                                                           |
| signature | 128                                   | 16              | exists when `verify` is `1`                                                                           |
