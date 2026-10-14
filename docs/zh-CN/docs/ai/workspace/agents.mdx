---
slug: agents
title: Workspace 下的 Agent
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

获取指定 Workspace 下的 Agent 列表。返回的 `uid` 即 [发起对话](/zh-CN/docs/ai/chat/conversation) 接口路径中的 Agent 标识；只有 `is_published` 为 `true` 的 Agent 才能发起对话。

<SDKLinks module="agent" klass="AgentContext" method="agents" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/workspaces/:id/agents</td></tr>
</tbody>
</table>

### Path Parameters

| Name | Type   | Required | Description  |
| ---- | ------ | -------- | ------------ |
| id   | string | YES      | Workspace ID |

### Query Parameters

| Name  | Type   | Required | Description                        |
| ----- | ------ | -------- | ---------------------------------- |
| page  | int32  | NO       | 页码，从 1 开始，默认 1            |
| limit | int32  | NO       | 每页数量，默认 20                  |
| name  | string | NO       | 按 Agent 名称模糊搜索              |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/ai/workspaces/1001/agents?page=1&limit=20" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

  </TabItem>
</Tabs>

## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "agents": [
      {
        "uid": "ag_7d3f9b2c",
        "name": "美股分析助手",
        "description": "结合行情与基本面数据，回答美股相关问题",
        "mode": "chat",
        "icon": "https://cdn.longbridge.com/icons/agent.png",
        "is_published": true,
        "published_at": 1742000000,
        "created_at": 1741000000,
        "updated_at": 1742001000
      }
    ],
    "total": 12
  }
}
```

### Response Status

| Status | Description | Schema                                    |
| ------ | ----------- | ----------------------------------------- |
| 200    | 返回成功    | [agents_response](#schemaagents_response) |
| 400    | 参数非法    | Workspace 不存在或无权访问                |
| 500    | 内部错误    | None                                      |

## Schemas

### agents_response

<a id="schemaagents_response"></a>

| Name           | Type     | Required | Description                                          |
| -------------- | -------- | -------- | ---------------------------------------------------- |
| agents         | object[] | true     | Agent 列表                                           |
| ∟ uid          | string   | true     | Agent UID，用于 [发起对话](/zh-CN/docs/ai/chat/conversation) 的路径参数 |
| ∟ name         | string   | true     | Agent 名称                                           |
| ∟ description  | string   | false    | Agent 描述                                           |
| ∟ mode         | string   | true     | Agent 模式，如 `chat`                                |
| ∟ icon         | string   | false    | 图标 URL                                             |
| ∟ is_published | boolean  | true     | 是否已发布，仅已发布的 Agent 可发起对话              |
| ∟ published_at | int64    | false    | 发布时间，Unix 时间戳（秒），未发布为 0              |
| ∟ created_at   | int64    | false    | 创建时间，Unix 时间戳（秒）                          |
| ∟ updated_at   | int64    | false    | 最后更新时间，Unix 时间戳（秒）                      |
| total          | int32    | true     | 符合条件的 Agent 总数                                |
