---
title: 解析数据包头
id: how-to-parse-header
slug: /socket/protocol/header
sidebar_position: 3
---

我们的协议包的大小时可变长的，这里会用一个数据包头来描述数据包携带的数据类型和数据大小。

:::info
数据包头的大小是固定的 `1` 个字节
:::

## 结构

```
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  type |v|g|re.|
+-+-+-+-+-+-+-+-+
```

| 字段    | 长度 (bit) | 说明                                                            |
| ------- | ---------- | --------------------------------------------------------------- |
| type    | 4          | `1` - request<br/>`2` - resopnse<br/>`3` - push                 |
| verify  | 1          | 数据是否加签标志<br/><br/>`0` - 不加签<br/>`1` - 加签           |
| gzip    | 1          | 数据是否使用 `gzip` 压缩：<br/><br/>`1` - 压缩<br/>`0` - 不压缩 |
| reserve | 2          | 预留                                                            |

## 例子

```
// reserve - 0, gzip - 0, verify - 0,  type - 1
0b 0000 0001

// reserve - 0, gzip - 1, verify - 0, type - 2
0b 0011 0010

// reserve - 0, gzip - 1, verify - 1, type - 3
0b 0001 0011


//  reserve - 3, gzip - 1, verify - 0, type - 3
0b 1110 0011
```
