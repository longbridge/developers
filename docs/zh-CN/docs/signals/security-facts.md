---
slug: security-facts
title: 查询证券 Facts
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

查询指定证券的事实事件列表——包含异动检测、因子信息、数据来源及自然语言摘要，支持按时间范围和数量上限筛选。

事实是策略的触发源：信号的 `key_fact_id` 即指向触发它的那条事实。

每条事实都是一个 JSON 对象，字段随类型（news、fundamental、technical）而不同。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/facts/security_facts</td></tr>
</tbody>
</table>

### Query Parameters

| 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| symbol | string | YES | 要查询的证券代码，格式为 `ticker.region`，例如 `AAPL.US` 或 `700.HK` |
| begin_time | string | NO | 查询起始时间，UTC 时区，格式为 `2006-01-02T15:04:05Z`；留空则从最早可用数据开始 |
| end_time | string | NO | 查询结束时间，UTC 时区，格式为 `2006-01-02T15:04:05Z`；留空则返回最新数据 |
| limit | int32 | NO | 返回事实数量上限；时间范围内的事实超出该上限时，仅返回最新的 `limit` 条，默认 100 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/facts/security_facts?symbol=AAPL.US&limit=20" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

  </TabItem>
</Tabs>

## Response

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "facts": []
  }
}
```

> **说明：** 事实的结构随类型而变化且仍在演进，因此 SDK 将每一项原样透传为 JSON 对象，不做固定 schema 约束。

### Response Status

| 状态码 | 说明 |
| ------ | ---- |
| 200 | 成功 |
| 500 | 服务内部错误 |

## Schemas

### security_facts_response

| 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| facts | object[] | true | 事实事件列表，每一项都是 JSON 对象，字段随事实类型而不同 |
