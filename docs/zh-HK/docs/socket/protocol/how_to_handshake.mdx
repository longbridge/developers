---
title: 解析握手包
id: how-to-handshake
slug: /socket/protocol/handshake
sidebar_position: 2
---

握手是客戶端和服務端建立連接後做的第一件事情，用於和服務端進行協議的協商，目前支持協商的內容如下：

- 協議版本 - 目前我們僅支持一個版本，即：`1`
- 數據包序列化方式 - 目前我們僅支持 `protobuf`，值：`1`
- 客戶端平臺 - 目前僅爲 `OpenAPI`，目前值爲：`9`

所以客戶端握手包在我們的協議版本升級的情況下永遠是一個固定的內容。

## TCP 鏈接如何握手

客戶端發向服務端發送 2 個字節的握手包。

### 結構

```
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  ver  | codec |
+-+-+-+-+-+-+-+-+
|platfo.|reserve|
+-+-+-+-+-+-+-+-+
```

| 字段     | 長度 (bit) | 說明                          |
| -------- | ---------- | ----------------------------- |
| ver      | 4          | 協議版本，目前僅 `1` 一個版本 |
| codec    | 4          | Body 序列化類型：1 - protobuf |
| platform | 4          | 0b1001 - OpenAPI              |
| reserve  | 4          | 預留，當前爲 0b0000           |

### 例子

- ver - 0b0001
- codec - 0b0001
- platform - 0b1001
- reserve - 0b0000

兩個字節的內容：

```
0b00010001,
0b00001001
```

## WebSocket 鏈接如何握手

WebSocket 在從 HTTP 升級升 WebSocket 的過程中，我們可以讀取 HTTP 請求的相關信息，我們這裏通過 URL query 進行握手

### Query 參數

| 字段     | 類型 | 說明                  |
| -------- | ---- | --------------------- |
| version  | int  | 僅支持：1             |
| codec    | int  | 目前僅支持：1         |
| platform | int  | 默认：9，代表 OpenAPI |

### 例子

```
wss://openapi-quote.longbridge.com?version=1&codec=1&platform=9
```
