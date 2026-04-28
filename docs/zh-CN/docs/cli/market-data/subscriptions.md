---
title: 'subscriptions'
sidebar_label: 'subscriptions'
sidebar_position: 14
---

# longbridge subscriptions

列出当前所有有效的实时行情订阅。

## 基本用法

```bash
longbridge subscriptions
```

## 示例

### 查看有效订阅

```bash
longbridge subscriptions
```

返回当前已订阅实时行情推送的所有标的，以及订阅类型（如 quote、depth、trades）。

### 排查行情推送中断问题

```bash
# 查看当前会话中已订阅的标的
longbridge subscriptions
```

若实时行情推送中断，运行 `subscriptions` 确认该标的是否仍处于有效订阅状态。订阅与会话绑定——每次启动新会话时会重置。

## 说明

若无有效订阅，返回空列表。订阅通过 TUI 创建（或通过 OpenAPI SDK 以编程方式创建），与会话绑定，退出登录或会话过期后自动重置。
