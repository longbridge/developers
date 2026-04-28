---
title: 'participants'
sidebar_label: 'participants'
sidebar_position: 13
---

# longbridge participants

获取港股市场的完整券商/参与者目录——将券商 ID 映射到机构名称，用于解读 `brokers` 命令的输出。

## 基本用法

```bash
longbridge participants
```

```
| Broker ID  | Name EN                          | Name CN        |
|------------|----------------------------------|----------------|
| 6596       | WE                               | 维恩证券        |
| 3014       | DRW (Hong Kong) Limited          | DRW (Hong Kong) Limited |
| 7707, 7708 | Ark Securities (Hong Kong) Ltd   | 同舟证券        |
| 724        | UTR8 Hong Kong Limited           | UTR8 Hong Kong Limited |
| 1142       | Wanhai Securities (HK) Limited   | 万海证券(香港)   |
| 6409       | Standard Chartered(HK)           | 渣打(香港)      |
...
```

## 示例

### 查询所有券商 ID

```bash
longbridge participants
longbridge participants --format json
```

返回港交所参与者的完整目录，每条包含券商 ID 及机构名称。部分机构在单个 `broker_id` 字符串中列出多个 ID。

## 说明

仅支持港股市场。配合 `longbridge brokers` 使用，可识别在各价位挂单的机构。此处的 `broker_id` 值与 `brokers` 命令返回的 ID 直接对应。
