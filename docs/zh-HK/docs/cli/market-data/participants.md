---
title: 'participants'
sidebar_label: 'participants'
sidebar_position: 13
---

# longbridge participants

取得港股市場的完整券商/參與者目錄——將券商 ID 映射到機構名稱，用於解讀 `brokers` 命令的輸出。

## 基本用法

```bash
longbridge participants
```

```
| Broker ID  | Name EN                          | Name CN        |
|------------|----------------------------------|----------------|
| 6596       | WE                               | 維恩證券        |
| 3014       | DRW (Hong Kong) Limited          | DRW (Hong Kong) Limited |
| 7707, 7708 | Ark Securities (Hong Kong) Ltd   | 同舟證券        |
| 724        | UTR8 Hong Kong Limited           | UTR8 Hong Kong Limited |
| 1142       | Wanhai Securities (HK) Limited   | 萬海證券(香港)   |
| 6409       | Standard Chartered(HK)           | 渣打(香港)      |
...
```

## 示例

### 查詢所有券商 ID

```bash
longbridge participants
longbridge participants --format json
```

返回港交所參與者的完整目錄，每條包含券商 ID 及機構名稱。部分機構在單個 `broker_id` 字串中列出多個 ID。

## 說明

僅支援港股市場。配合 `longbridge brokers` 使用，可識別在各價位掛單的機構。此處的 `broker_id` 值與 `brokers` 命令返回的 ID 直接對應。
