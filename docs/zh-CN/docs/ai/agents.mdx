---
slug: agents
title: 公开 Agent
sidebar_position: 0.5
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

列出平台上所有公开可用的 Agent——与探索页展示的是同一份目录。返回的 `uid` 即[发起对话](/zh-CN/docs/ai/chat/conversation)接口路径中使用的 Agent 标识。

与 [Workspace 下的 Agent](/zh-CN/docs/ai/workspace/agents) 不同，本接口不限定 Workspace：返回所有已发布且公开分享的 Agent。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/ai/agents</td></tr>
</tbody>
</table>

### Query Parameters

| Name  | Type   | Required | Description                    |
| ----- | ------ | -------- | ------------------------------ |
| page  | int32  | NO       | 页码，从 1 开始，默认 1        |
| limit | int32  | NO       | 每页条数，默认 20，最大 50     |
| name  | string | NO       | 按 Agent 名称模糊搜索          |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/ai/agents?page=1&limit=20" \
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
        "name": "美股分析师",
        "description": "结合行情与基本面数据回答美股问题",
        "mode": "chat",
        "icon": "https://cdn.longbridge.com/icons/agent.png",
        "is_published": true,
        "published_at": 1742000000,
        "created_at": 1741000000,
        "updated_at": 1742001000
      }
    ],
    "total": 35
  }
}
```

### Response Status

| Status | Description | Schema                                                  |
| ------ | ----------- | -------------------------------------------------------- |
| 200    | 返回成功    | [public_agents_response](#schemapublic_agents_response)  |
| 500    | 内部错误    | None                                                     |

## Schemas

### public_agents_response

<a id="schemapublic_agents_response"></a>

| Name           | Type     | Required | Description                                                    |
| -------------- | -------- | -------- | -------------------------------------------------------------- |
| agents         | object[] | true     | Agent 列表，按最后更新时间倒序                                 |
| ∟ uid          | string   | true     | Agent UID，用作[发起对话](/zh-CN/docs/ai/chat/conversation)的路径参数 |
| ∟ name         | string   | true     | Agent 名称，按 `Accept-Language` 请求头本地化                  |
| ∟ description  | string   | false    | Agent 描述，按 `Accept-Language` 请求头本地化                  |
| ∟ mode         | string   | true     | Agent 模式，如 `chat`                                          |
| ∟ icon         | string   | false    | 图标 URL                                                       |
| ∟ is_published | boolean  | true     | 本接口下恒为 `true`                                            |
| ∟ published_at | int64    | false    | 发布时间，Unix 秒级时间戳                                      |
| ∟ created_at   | int64    | false    | 创建时间，Unix 秒级时间戳                                      |
| ∟ updated_at   | int64    | false    | 最后更新时间，Unix 秒级时间戳                                  |
| total          | int32    | true     | 符合条件的公开 Agent 总数                                      |
