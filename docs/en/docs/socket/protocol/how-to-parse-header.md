---
title: Parse Header of Packet
id: how-to-parse-header
slug: /socket/protocol/header
sidebar_position: 3
---

We have three type packet:

- request
- response
- push

The type of packet and some other info can decide the length of packet. Then length of Header is 1 byte.

:::info
The length of Header is 1 byte.
:::

## Structure

```
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  type |v|g|re.|
+-+-+-+-+-+-+-+-+
```

| Field   | Length in bit | description                                                       |
| ------- | ------------- | ----------------------------------------------------------------- |
| type    | 4             | packet type:<br/> `1` - request<br/>`2` - resopnse<br/>`3` - push |
| verify  | 1             | if have signature data<br/><br/>`0` - Yes<br/>`1` - No            |
| gzip    | 1             | if use `gzip` to compress data: <br/><br/>`1` - Yes<br/>`0` - No  |
| reserve | 2             | reversed                                                          |

## Example

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
