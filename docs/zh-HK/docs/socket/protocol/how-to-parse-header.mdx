---
title: 解析數據包頭
id: how-to-parse-header
slug: /socket/protocol/header
sidebar_position: 3
---

我們的協議包的大小時可變長的，這裏會用一個數據包頭來描述數據包攜帶的數據類型和數據大小。

:::info
數據包頭的大小是固定的 `1` 個字節
:::

## 結構

```
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  type |v|g|re.|
+-+-+-+-+-+-+-+-+
```

| 字段    | 長度 (bit) | 說明                                                            |
| ------- | ---------- | --------------------------------------------------------------- |
| type    | 4          | `1` - request<br/>`2` - resopnse<br/>`3` - push                 |
| verify  | 1          | 數據是否加簽標誌<br/><br/>`0` - 不加簽<br/>`1` - 加簽           |
| gzip    | 1          | 數據是否使用 `gzip` 壓縮：<br/><br/>`1` - 壓縮<br/>`0` - 不壓縮 |
| reserve | 2          | 預留                                                            |

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
