---
title: 'subscriptions'
sidebar_label: 'subscriptions'
sidebar_position: 14
---

# longbridge subscriptions

列出當前所有有效的即時行情訂閱。

## 基本用法

```bash
longbridge subscriptions
```

## 示例

### 查看有效訂閱

```bash
longbridge subscriptions
```

返回當前已訂閱即時行情推送的所有標的，以及訂閱類型（如 quote、depth、trades）。

### 排查行情推送中斷問題

```bash
# 查看當前會話中已訂閱的標的
longbridge subscriptions
```

若即時行情推送中斷，運行 `subscriptions` 確認該標的是否仍處於有效訂閱狀態。訂閱與會話綁定——每次啟動新會話時會重置。

## 說明

若無有效訂閱，返回空列表。訂閱通過 TUI 創建（或通過 OpenAPI SDK 以程式化方式創建），與會話綁定，退出登錄或會話過期後自動重置。
